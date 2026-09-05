Create a modern, responsive, production-ready frontend web application for an omnichannel supermarket chain named "Aura Supermarket" (Store: Chennai-01 Flagship). 

The application must look and feel like a high-end, realistic consumer e-commerce and in-store companion website (similar to Target, Whole Foods, or Tesco), NOT a generic dark-mode AI telemetry dashboard. All smart computer vision and Edge AI capabilities (shopper dwell analytics, queue intelligence, planogram compliance, real-time on-shelf stock, and privacy-first local processing) must be seamlessly integrated into natural retail UI elements.

---

### 1. Visual Design & Theme System
* **Aesthetic**: Premium retail e-commerce design. Crisp, modern, trustworthy, and clean.
* **Palette**: 
  * Primary: Deep Emerald Forest Green (`#0F4C3A` or `#135D43`) with Crisp Mint accents (`#E8F5E9` / `#22C55E`).
  * Neutrals: Clean Off-White background (`#F9FAFB`), Slate Dark text (`#111827`), Subtle Borders (`#E5E7EB`).
  * Status Badges: Soft Amber (`#FEF3C7` / `#D97706`), Coral Red (`#FEE2E2` / `#DC2626`), and Soft Blue (`#EFF6FF` / `#2563EB`).
* **Typography**: Clean modern sans-serif (Inter, Plus Jakarta Sans, or SF Pro).

---

### 2. Header & Store Selector Navigation
* **Top Utility Bar**:
  * Active Physical Store selector: "📍 Shopping at: Chennai-01 Flagship (Open until 10:00 PM)" with a modal to switch across 8 chain locations.
  * Live In-Store Status Badge: "🟢 Store Status: Normal Flow (74 shoppers in-store | 3.8 min avg checkout)".
  * Staff / Admin Portal Quick-Toggle (Discreet link in the upper-right corner).
* **Main Navigation Bar**:
  * Brand Logo: "Aura Supermarket & Groceries".
  * Search Bar: Search for items (e.g., "Atta 5kg", "Cold Cola 2L") with instant auto-complete showing real-time aisle locations (e.g., "Found in Bay 02 - Grocery").
  * Action Icons: In-Store Store Map & Aisle Navigator, Live Checkout Lane Tracker, Shopping Cart (`Cart (3)`), and Customer Profile.

---

### 3. Homepage & Customer Experience Modules
* **Dynamic In-Store Live Shopper Banner**:
  * A discreet, customer-friendly widget: "Planning a visit? Chennai-01 is currently at 67% capacity. Average checkout wait time is 3m 45s across 4 active lanes."
* **Smart Interactive Store Map & Aisle Explorer**:
  * An interactive store blueprint showing departments (Groceries, Fresh Produce, Beverages, Cosmetics, Checkout Rows).
  * Hovering/clicking a zone reveals: "Popular Right Now 🔥", "Current Traffic: Moderate", and real-time highlighted items on shelf.
* **Featured Deals & Promotional Endcap Showcase**:
  * Grid of high-engagement products currently highlighted on store endcaps with instant "Add to In-Store List" or "Add to Cart" actions.
* **Product Cards with Real-Time On-Shelf Availability (OSA)**:
  * Display authentic retail cards featuring high-res imagery, price, unit weight, ratings, and real-time inventory tags:
    * `In Stock - Bay 02, Shelf 3 (8 facings ready)` (Green badge)
    * `Low In-Store Stock - 2 units left on shelf` (Amber badge)
    * `Aisle Reorganizing / Restock in Progress` (Subtle grey badge for planogram sync)
* **Express 'Scan & Go' / In-Store Checkout Assistant**:
  * A mobile-optimized slide-over drawer allowing shoppers to scan barcodes on their phone, check live billing lane queues, or pay instantly with one-tap digital billing.

---

### 4. Discreet "Store Operations & Manager View" (Accessible via `/portal` or Role Switcher)
This view must maintain standard retail ERP/store manager aesthetics (light theme, clean tables, operational task lists) rather than hacker-style terminal screens.
* **Manager's Live Floor Overview**:
  * Live Store KPIs: Footfall counter (2,184 visits today), Active In-Store Count (74/110), Average Dwell Time (14m 32s), and Real-Time Lane Wait Times.
  * Aisle Health & Planogram Tracker: Table displaying Bay ID, Category, Target Facings vs. Detected Shelf Stock, and one-click "Dispatch Restock Ticket" buttons.
  * Smart Queue Management: Visual lane indicators (Lanes 1–3 Active, Lane 4 AI Recommendation: "Open within 3 minutes to prevent rush").
* **Floor Associate Task Board**:
  * Clean, touch-friendly ticket cards:
    * `Ticket #1042`: Replenish 6x Whole Wheat Atta 5kg at Bay 02 Shelf 3 [Complete Task].
    * `Ticket #1043`: Correct misplaced Cold Cola on Bay 07 Shelf 2 [Verify Placement].
* **Enterprise Multi-Store Rollup (Admin Tab)**:
  * High-level summary of the 8 chain stores (Chennai, Bengaluru, Mumbai, Delhi, Hyderabad) with operational health ratings, footfall metrics, and hardware edge node sync indicators (100% Zero-PII compliance).

---

### 5. Technical & Interaction Details
* Build with modular React/Next.js and Tailwind CSS (or clean semantic HTML5, CSS3, and JavaScript).
* Ensure full mobile responsiveness for all screens (both consumer shopping and employee task views).
* Use realistic placeholder data matching the 8-store ecosystem and standard grocery SKUs.
* Include smooth tab transitions between Consumer Storefront, Store Floor Map, Staff Action Board, and Multi-Store Management.