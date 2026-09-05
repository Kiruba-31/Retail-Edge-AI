-- 1. STORES TABLE
CREATE TABLE stores (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    region VARCHAR(50) NOT NULL,
    max_capacity INT DEFAULT 100
);

-- 2. EMPLOYEES & ATTENDANCE TABLE
CREATE TABLE employees (
    id VARCHAR(50) PRIMARY KEY,
    store_id VARCHAR(50) REFERENCES stores(id),
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    certificate_url VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    shift_window VARCHAR(50) NOT NULL,
    assigned_zone VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'On Shift',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) REFERENCES employees(id),
    date DATE NOT NULL,
    status VARCHAR(10) NOT NULL -- 'P' (Present), 'L' (Late), 'A' (Absent), 'O' (Off)
);

-- 3. INVENTORY (500 SKUs)
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(20) UNIQUE NOT NULL, -- e.g., 'SKU-001'
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    shelf VARCHAR(10) NOT NULL,       -- e.g., 'A01'
    expected_facings INT NOT NULL,
    detected_facings INT NOT NULL,
    status VARCHAR(20) NOT NULL,      -- 'OK', 'Low', 'Out'
    is_planogram_issue BOOLEAN DEFAULT FALSE,
    last_detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. LIVE QUEUES & COUNTERS
CREATE TABLE checkout_counters (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Closed', -- 'Open', 'Closed'
    cashier_name VARCHAR(100),
    queue_count INT DEFAULT 0,
    avg_wait_time VARCHAR(20),
    avg_service_time VARCHAR(20),
    utilization VARCHAR(10)
);

-- 5. SHOPPER ANALYTICS (Hourly Aggregates)
CREATE TABLE zone_analytics (
    id SERIAL PRIMARY KEY,
    zone_name VARCHAR(50) NOT NULL,
    occupancy INT DEFAULT 0,
    entry_count INT DEFAULT 0,
    exit_count INT DEFAULT 0,
    avg_dwell_minutes FLOAT DEFAULT 0.0,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
