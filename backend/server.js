const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Middleware to verify API key
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== 'retail_edge_sec_9948201a8f93e2b109c4d87') {
    return res.status(403).json({ message: 'Invalid or missing API key' });
  }
  next();
});

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/retailedge_db'
});

// -------------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------------

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// 1. Get Inventory (with Pagination, Category Filter, and Search)
app.get('/api/inventory', async (req, res) => {
  const { category, search, page = 1, limit = 15 } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM inventory WHERE 1=1';
  const params = [];

  if (category && category !== 'ALL') {
    params.push(category);
    query += ` AND category = $${params.length}`;
  }
  if (search) {
    params.push(`%${search}%`);
    query += ` AND (name ILIKE $${params.length} OR sku ILIKE $${params.length} OR shelf ILIKE $${params.length})`;
  }

  query += ` ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  try {
    const { rows } = await pool.query(query, params);
    const countRes = await pool.query('SELECT COUNT(*) FROM inventory');
    res.json({ items: rows, total: parseInt(countRes.rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Employees (CRUD)
app.get('/api/employees', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM employees ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/employees', async (req, res) => {
  const { id, name, age, phone, certificate_url, role, shift_window, assigned_zone } = req.body;
  const query = `
    INSERT INTO employees (id, name, age, phone, certificate_url, role, shift_window, assigned_zone)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
  `;
  try {
    const { rows } = await pool.query(query, [id, name, age, phone, certificate_url, role, shift_window, assigned_zone]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM employees WHERE id = $1', [req.params.id]);
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Queues (Counters)
app.get('/api/counters', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM checkout_counters ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------------
// EDGE CAMERA EVENT INGESTION WEBHOOK (From NVIDIA Jetson / Edge Box)
// -------------------------------------------------------------------
app.post('/api/edge/events', async (req, res) => {
  const { type, payload } = req.body;

  try {
    if (type === 'QUEUE_UPDATE') {
      // payload: { counterId: 2, queueCount: 7, avgWait: "5.1 min" }
      await pool.query(
        'UPDATE checkout_counters SET queue_count = $1, avg_wait_time = $2 WHERE id = $3',
        [payload.queueCount, payload.avgWait, payload.counterId]
      );
      // Broadcast live update to React frontend
      io.emit('queue_updated', payload);
    }

    if (type === 'SHELF_LOW_STOCK') {
      // payload: { sku: 'SKU-001', detected: 3, status: 'Low' }
      await pool.query(
        'UPDATE inventory SET detected_facings = $1, status = $2 WHERE sku = $3',
        [payload.detected, payload.status, payload.sku]
      );
      io.emit('inventory_updated', payload);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// WebSocket Connection
io.on('connection', (socket) => {
  console.log('Client connected to live dashboard stream:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
