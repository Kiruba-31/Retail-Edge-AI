Table of Contents
1.  Introduction & Objective
2.  High-Level End-to-End Workflow
3.  System Architecture
4.  Store Data Model
5.  Module 1 — Shopper Analytics Workflow
6.  Module 2 — Inventory Monitoring Workflow
7.  Module 3 — Queue Intelligence Workflow
8.  Edge AI Processing & Privacy-Aware Analytics
9.  Offline Mode & Cloud Synchronization Workflow
10. Backend & API Workflow
11. Store Operations Dashboard Workflow
12. Development Roadmap
13. Technology Stack
14. Final Demonstration Script
15. Scalable Deployment Workflow
16. Summary
 
1. Introduction & Objective
RetailEdge AI is an end-to-end, privacy-preserving edge intelligence platform for physical retail stores. It addresses SIH26179 by turning ordinary store cameras into a real-time sensing layer that understands shopper behaviour, shelf inventory, and checkout queues — without sending raw video off-site and without depending on a constant internet connection.
This document describes the complete workflow of the system: how data moves from a camera, through on-device AI inference, into local and cloud storage, through analytics and prediction, and finally onto a live operations dashboard. It is organised so that each functional module (Shopper Analytics, Inventory Monitoring, Queue Intelligence) can be read as a self-contained pipeline, while the later sections describe the shared edge, backend, privacy, and deployment layers that tie every module together.
1.1 Design Principles
●	Edge-first: all computer vision inference runs on-site; only anonymized metadata is transmitted to the cloud.
●	Offline-resilient: the store must keep detecting, deciding, and alerting even when the internet connection is down.
●	Privacy by construction: no faces, names, or biometric identifiers are ever generated or stored.
●	Incremental scope: a small, believable prototype (one store, a few cameras, 5–10 SKUs) that is architecturally ready to scale, rather than a large system that works nowhere.
●	Everything is an event: shopper, inventory, queue, device, and sync activity all normalise into a common event schema so the backend stays simple as modules are added.
2. High-Level End-to-End Workflow
At the highest level, data flows through eight stages, from physical capture to operational decision-making:
Camera / Video Feed
        ↓
Edge AI Inference  (detection + tracking, on-device)
        ↓
Anonymized Event Generation  (no PII, no raw video)
        ↓
Local Database  (SQLite — always writes, online or offline)
        ↓
Sync Agent  (pushes queued events to the cloud when connectivity exists)
        ↓
Backend  (FastAPI + PostgreSQL — aggregation, analytics, prediction)
        ↓
Real-Time Channel  (WebSocket push to connected dashboards)
        ↓
Store Operations Dashboard  (KPIs, alerts, recommendations)
The critical property of this workflow is that everything up to and including the local database keeps functioning with zero internet connectivity. Only the sync and cloud-aggregation stages require a network connection, and they are designed to resume automatically and catch up once connectivity returns (see Section 9).
3. System Architecture
The system is organised into four layers: capture, edge, backend/cloud, and presentation.
┌─────────────────────┐
│    SMART CAMERAS    │  (webcam / video file / RTSP)
└──────────┬──────────┘
           │  video frames
           ▼
┌───────────────────────────┐
│        EDGE DEVICE        │
│  OpenCV · YOLO · Tracker  │
│  Zone / Shelf / Queue     │
│  Engines · Privacy Filter │
└─────────────┬─────────────┘
              │  JSON events
              ▼
┌───────────────────────────┐
│    EDGE EVENT BUS (MQTT/HTTP)   │
└─────────────┬─────────────┘
     ┌─────────┴─────────┐
     ▼                   ▼
LOCAL SQLite       CLOUD SYNC → FastAPI → PostgreSQL
                                     │
                          Analytics & Prediction
                                     │
                                     ▼
                         LIVE DASHBOARD (WebSocket)
3.1 Edge Hardware Strategy
The prototype targets a laptop or PC as the edge device (webcam + OpenCV + YOLO + tracker + SQLite), because it removes hardware procurement as a project risk. The video-input and inference code is written behind a common interface so the same software can later run unmodified on a Raspberry Pi, NVIDIA Jetson, or Qualcomm-based edge accelerator — the backend never needs to know which hardware produced an event.
3.2 Project Module Layout
retail-edge-ai/
├── edge/        camera, detection, tracking, shopper, inventory, queue, privacy, events, local_db
├── backend/     api, services, analytics, prediction, alerts, sync, database
├── frontend/    dashboard, store, shopper, inventory, queue, alerts
├── ai/          models, training, inference, evaluation
├── simulator/   synthetic multi-store edge agents
├── docker/      docker-compose for backend + frontend + postgres + redis
└── docs/
4. Store Data Model
Before any AI is built, the store itself is modelled as data. A store is decomposed into an entrance, named zones, a checkout area with multiple counters, and shelves that hold specific SKUs.
STORE-001
├── Entrance
├── Zone A — Beverages
├── Zone B — Snacks
├── Zone C — Personal Care
├── Zone D — Grocery
└── Checkout
    ├── Counter 1
    ├── Counter 2
    └── Counter 3
Core Reference Tables
Table	Key Columns
stores	id, name, location, status
zones	id, store_id, name, x1, y1, x2, y2
cameras	id, store_id, zone_id, camera_type, stream_url, status
shelves	id, store_id, zone_id, shelf_code
products	id, sku, name, category, expected_quantity
 
5. Module 1 — Shopper Analytics Workflow
Goal: count customers, understand where they go, how long they linger, and visualise movement — without ever identifying who they are.
5.1 Pipeline
Frame → Object Detection (YOLO) → Person Detected
      → Tracking (assigns a persistent Track ID)
      → Anonymous Event: { track_id, class:'person', zone, timestamp }
5.2 Step-by-Step Workflow
1.	Camera captures frames via a VideoSource abstraction (Webcam, Video File, or RTSP — interchangeable without touching downstream code).
2.	YOLO-based detector identifies every person in the frame.
3.	A tracker (ByteTrack / BoT-SORT style) assigns a stable numeric Track ID to each detected person across frames — never a name or face.
4.	Entry/exit counting: an invisible line is drawn near the entrance. A track crossing outside→inside increments entry_count; inside→outside increments exit_count. Customers Inside = Total Entries − Total Exits, updated live on the dashboard.
5.	Zone detection: each zone is a polygon on the camera frame. Each tracked person's centre point is tested against every polygon to determine their current zone.
6.	Dwell time: the system timestamps when a track enters and exits a zone; the difference is the dwell time for that visit. These are aggregated per zone (e.g. Average Dwell: 2m 34s, Visitors: 183).
7.	Heatmap generation: every few frames, each person's centre coordinate is recorded and accumulated into a 2D density grid, rendered as a low→medium→high intensity heatmap overlay on the store layout.
8.	All of the above are emitted as anonymized JSON events and written to the local event store, then queued for cloud sync.
5.3 Dashboard Outputs
●	Customers Inside (live counter)
●	Footfall Today (cumulative entries)
●	Per-zone average dwell time and visitor count
●	Live shopper movement heatmap
6. Module 2 — Inventory Monitoring Workflow
Goal: detect low/out-of-stock shelves and planogram violations for a small, controlled set of SKUs (5–10 products), using a shelf-facing camera.
6.1 Step-by-Step Workflow
9.	A shelf-facing camera streams frames of a defined shelf region (e.g. Shelf A1, A2, A3).
10.	A custom-trained detector (fine-tuned on a small dataset of the chosen SKUs — e.g. Coca-Cola, Pepsi, Biscuits, Chips, Shampoo) counts visible product facings per SKU.
11.	The system compares Expected Facings (configured per shelf) against Detected Facings from the camera.
12.	Availability difference determines status: full stock, LOW STOCK (detected well below expected), or OUT OF STOCK (detected = 0).
13.	Planogram compliance: the expected sequence/position of SKUs on a shelf is compared against what is actually detected in each slot; a mismatch raises a PLANOGRAM VIOLATION alert naming the expected vs. detected product.
14.	Low-confidence detections (e.g. confidence below a set threshold) are not auto-escalated to an alert — they are flagged as LOW CONFIDENCE DETECTION, requiring manual verification, to avoid false alerts.
15.	Every state change (stock level, planogram status) is emitted as an event (LOW_STOCK, OUT_OF_STOCK, PLANOGRAM_VIOLATION) and routed to the Alert Engine (Section 10).
6.2 Scope Note
The system intentionally supports only 5–10 SKUs in the prototype. The evaluation criterion is architectural scalability (can more SKUs and shelves be added without redesign), not exhaustive product recognition.
7. Module 3 — Queue Intelligence Workflow
Goal: measure checkout queues in real time, forecast congestion before it happens, and recommend opening additional counters.
7.1 Step-by-Step Workflow
16.	A camera covers the checkout area; a Region of Interest (ROI) is defined per counter/queue lane.
17.	Person detection + tracking (reusing the same pretrained detector as Shopper Analytics) counts how many tracked people are currently inside each queue ROI → Queue Length.
18.	When a track enters the queue ROI, queue_enter_time is recorded; when it leaves, queue_exit_time is recorded. waiting_time = queue_exit_time − queue_enter_time, aggregated into an Average Waiting Time metric.
19.	Historical samples (timestamp, queue_length, arrival_rate, service_rate, active_counters, avg_wait_time) are logged at regular intervals to build a time-series.
20.	A lightweight statistical/ML model (e.g. scikit-learn / XGBoost regression on the time-series features) forecasts queue length 5–10 minutes ahead and produces a Queue Risk Score (e.g. 0.87 → HIGH).
21.	A rule engine evaluates: IF predicted_queue > threshold AND an available counter exists → recommend opening that specific counter (e.g. 'OPEN CHECKOUT COUNTER #4').
22.	Congestion prediction and counter recommendations are pushed to the dashboard and, where configured, to the Alert Engine as MEDIUM/HIGH severity notifications.
 
8. Edge AI Processing & Privacy-Aware Analytics
8.1 Why Processing Happens at the Edge
●	Low latency: decisions (alerts, recommendations) don't wait on a round trip to the cloud.
●	Bandwidth: raw video never has to be uploaded — only small JSON events.
●	Resilience: the store keeps sensing and deciding even without internet.
●	Privacy: identity-bearing data (video, faces) never has to leave the building.
8.2 Privacy Workflow
Camera → Person Detection → Tracking
       → Discard raw identity information
       → Generate anonymous event only

Never stored: faces · names · biometric identifiers
Stored instead: { track_id, zone, timestamp, dwell_seconds }
The dashboard exposes this as a visible, evaluable status panel:
Privacy Mode:            ACTIVE 🔒
Raw video:               LOCAL ONLY
Face identification:     DISABLED
PII storage:             NONE
Cloud video upload:      DISABLED
AI inference:            EDGE
9. Offline Mode & Cloud Synchronization Workflow
This is the workflow that most directly answers the connectivity requirement in the problem statement, and is recommended as a live demo feature.
9.1 Normal (Online) Operation
Camera → Edge AI → SQLite (write) → Sync Agent → Cloud API → PostgreSQL
9.2 Connectivity Loss
23.	Internet drops. The sync agent detects failed connectivity and pauses cloud pushes; it does not block or slow the edge pipeline.
24.	Camera capture, AI inference, tracking, and all analytics continue uninterrupted, writing every event to the local SQLite database.
25.	The dashboard (if still reachable, e.g. on the local network) flips its status indicator from ● ONLINE to ● OFFLINE and shows Edge AI: RUNNING, Local Database: RUNNING, Cloud Sync: PAUSED, plus a live Pending Sync count.
9.3 Reconnection
26.	The sync agent detects restored connectivity.
27.	It replays all queued local events to the backend in order, showing live progress (e.g. Synchronizing… 137 / 137).
28.	On completion, the dashboard confirms ✓ Cloud Synchronized and status returns to ● ONLINE.
9.4 Recommended Connectivity Test Sequence
Test	Condition	Expected Result
Test 1	Internet ON	Edge → Cloud sync succeeds continuously
Test 2	Internet OFF	Edge AI, local DB, and dashboard keep running; cloud shows OFFLINE
Test 3	Internet restored	Queued events drain to cloud; dashboard confirms full sync
10. Backend & API Workflow
10.1 Backend Structure (FastAPI)
backend/ → api/ (stores, cameras, shoppers, inventory, queues, analytics, alerts)
        → services/ (event, inventory, queue, analytics, sync)
        → models/, schemas/, database/
10.2 Core API Endpoints
Domain	Endpoints
Store	GET /api/stores  ·  GET /api/stores/{id}
Shopper	GET /api/shopper/live  ·  /footfall  ·  /dwell-time  ·  /heatmap
Inventory	GET /api/inventory/status  ·  /alerts  ·  /out-of-stock
Queue	GET /api/queue/live  ·  /history  ·  /prediction  ·  /recommendation
Events	POST /api/events  ·  POST /api/events/batch
Sync	POST /api/sync  ·  GET /api/sync/status
10.3 Real-Time Communication
Rather than polling, the dashboard subscribes to a WebSocket channel. As soon as the backend processes a new event, it pushes a typed message (e.g. QUEUE_UPDATE with the current and predicted queue length), and the dashboard updates immediately.
10.4 Alert Engine Workflow
Event → Rules / AI evaluation → Alert Engine → Severity classification → Notification

OUT_OF_STOCK          → HIGH    → Inventory Manager
QUEUE_CONGESTION      → MEDIUM  → Store Manager
PLANOGRAM_VIOLATION   → LOW/MED → Store Manager
10.5 Complete Event Vocabulary
All modules normalise into a shared set of typed events, keeping the backend and alerting logic uniform as new modules are added:
●	Shopper: SHOPPER_ENTERED, SHOPPER_EXITED, ZONE_ENTERED, DWELL_THRESHOLD_EXCEEDED
●	Inventory: LOW_STOCK, OUT_OF_STOCK, PLANOGRAM_VIOLATION
●	Queue: QUEUE_STARTED, QUEUE_UPDATED, QUEUE_CONGESTION_PREDICTED
●	Device: DEVICE_ONLINE, DEVICE_OFFLINE
●	Sync: SYNC_STARTED, SYNC_COMPLETED
 
11. Store Operations Dashboard Workflow
The dashboard is framed as a Retail Operations Control Center rather than a generic admin panel, laid out in four rows:
29.	KPI row — Customers Inside, Footfall Today, Average Dwell, Current Queue.
30.	Live camera feed with AI bounding boxes, alongside the live store heatmap.
31.	Inventory alert feed — colour-coded by severity (e.g. 🔴 out of stock, 🟠 low stock).
32.	Queue intelligence panel — per-counter headcount, congestion prediction, and the counter-opening recommendation.
A header bar shows store identity, edge connectivity status (● EDGE ONLINE / OFFLINE), and the Privacy: ACTIVE indicator at all times.
11.1 Device Health Workflow
Each camera and edge unit sends a periodic heartbeat to the backend. If a heartbeat is missed for longer than a configured window, the device is marked DEVICE OFFLINE and dependent features (e.g. inventory monitoring for that shelf) are flagged as temporarily unavailable rather than silently failing.
12. Development Roadmap
Phase	Focus
1	Store model, database schema, backend skeleton
2	Camera input abstraction, YOLO person detection
3	Tracking, entry/exit counting, zone detection, dwell time
4	Heatmap generation
5	Shelf detection and inventory status logic
6	Queue detection and tracking
7	Queue prediction model and recommendation engine
8	Edge SQLite, offline mode, sync agent
9	WebSocket real-time backend
10	Dashboard UI
11	Mock POS / ERP integration
12	Docker packaging, security hardening, testing, demo rehearsal
12.1 Priority Matrix
P0 — Must work
●	Camera capture, person detection, tracking, entry/exit, zone, dwell, queue length, inventory demo, edge inference, local storage, backend, dashboard.
P1 — Strong differentiators
●	Offline mode, cloud synchronization, queue prediction, counter recommendation, privacy architecture panel, real-time WebSocket updates.
P2 — Bonus, time permitting
●	Mock POS integration, multi-store simulation, planogram compliance, device health management, advanced historical analytics.
12.2 Explicitly Out of Scope
To protect the prototype timeline, the following are deliberately not built: facial recognition or customer identification, large-scale (1000+) product detection, a full ERP or POS system, a mobile app, Kubernetes/complex microservices, a custom LLM, a large-scale training pipeline, a full digital twin, or a real supermarket deployment.
13. Technology Stack
Layer	Technology
Camera input	Webcam / video file / RTSP
Video processing	OpenCV
Detection	YOLO
Tracking	ByteTrack / BoT-SORT-style tracker
Edge runtime	Python
Edge database	SQLite
Edge messaging	MQTT / HTTP
Backend	FastAPI
Cloud database	PostgreSQL
Cache / streaming	Redis
Real-time layer	WebSocket
Prediction	scikit-learn / XGBoost (initial)
Frontend	Next.js + React
Charts	ECharts / Recharts
Heatmap / maps	Canvas / SVG
Deployment	Docker + Docker Compose
Authentication	JWT, role-based access
 
14. Final Demonstration Script
Rather than describing the tech stack, the live demo is told as a story that walks through every module in sequence:
Scene 1 — Store Opens
Dashboard shows a clean baseline: Customers: 0, Queue: 0, Inventory Alerts: 0.
Scene 2 — Customers Enter
People walk past the entrance camera; Customers Inside and Footfall counters increase live.
Scene 3 — Customers Move Around
Per-zone visitor counts and average dwell time update (e.g. Beverages — Visitors: 4, Avg Dwell: 1m 48s), and the heatmap visibly brightens where people cluster.
Scene 4 — Shelf Stock Is Removed
Products are removed from the demo shelf on camera; the dashboard raises 🔴 LOW STOCK and then 🔴 OUT OF STOCK for that SKU as facings drop toward zero.
Scene 5 — A Queue Forms
Several people stand in the checkout ROI; Queue Length and Average Wait update live.
Scene 6 — Prediction & Recommendation
With Current Queue at 8, the system forecasts 13 customers in 5 minutes, assigns a HIGH risk level, and recommends: Open Checkout Counter #3.
Scene 7 — Internet Outage
The internet connection is deliberately disconnected. The dashboard shows ☁ CLOUD: OFFLINE while Edge AI, Local DB, and Cameras all remain 🟢 RUNNING. People continue walking through the store and the Pending Sync counter climbs (e.g. to 47) — the system keeps working.
Scene 8 — Connectivity Restored
The connection is restored. The dashboard shows Synchronizing… 47 / 47, followed by ✓ ALL EVENTS SYNCHRONIZED, proving the offline-first architecture end-to-end.
15. Scalable Deployment Workflow
15.1 Multi-Store Pattern
Each store runs its own independent edge device(s) and posts anonymized events to a shared cloud backend. A central dashboard aggregates across stores without any single store depending on another being online.
                CENTRAL DASHBOARD
                        │
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
      STORE 01       STORE 02       STORE 03
      EDGE AI        EDGE AI        EDGE AI

STORE NETWORK STATUS
Chennai #01        🟢
Chennai #02        🟢
Coimbatore #01     🟢
Madurai #01        🔴 Offline
For the prototype, additional stores are simulated as software edge agents rather than requiring physical multi-site hardware.
15.2 POS / ERP / Inventory System Integration
Rather than building a full POS or ERP, the system exposes a REST integration layer and a mock POS API (transaction_id, store_id, items, amount, timestamp). Combining mock POS transactions with footfall data produces an illustrative Conversion Indicator (e.g. Footfall: 382, Transactions: 94 → 24.6%), explicitly labelled as an indicator rather than exact purchase attribution unless individual shoppers are actually linked to transactions.
15.3 Security
●	JWT-based authentication and HTTPS for all API traffic.
●	Per-device API keys / device IDs for edge-to-cloud authentication.
●	Role-based access control: Admin, Store Manager, Inventory Staff, Operations Manager.
15.4 Deployment
The backend, frontend, PostgreSQL, and Redis are packaged with Docker Compose for straightforward deployment; the edge device runs its own lightweight container (AI + SQLite + MQTT client + sync agent). This avoids the operational overhead of Kubernetes while remaining a clean path to a larger orchestrated deployment later.
16. Summary
The single architectural decision underpinning every workflow in this document is that raw video and intelligence stay at the edge, and only anonymized metadata travels to the cloud. This one decision simultaneously satisfies the edge-AI requirement, the privacy requirement, low-latency decision-making, low bandwidth cost, offline operation, and multi-store scalability — which is why it is treated as the organising principle for every module described above.
