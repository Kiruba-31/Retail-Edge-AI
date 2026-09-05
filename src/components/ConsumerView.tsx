import { useState } from "react";

interface Props {
  onSwitchToPortal: () => void;
}

const stores = [
  { id: 1, name: "Chennai-01 Flagship", area: "Anna Nagar", status: "open", hours: "10:00 PM", shoppers: 74, wait: "3.8 min" },
  { id: 2, name: "Chennai-02 North", area: "Perambur", status: "open", hours: "9:30 PM", shoppers: 52, wait: "2.1 min" },
  { id: 3, name: "Bangalore Central", area: "Koramangala", status: "open", hours: "10:00 PM", shoppers: 89, wait: "5.2 min" },
  { id: 4, name: "Coimbatore Main", area: "RS Puram", status: "open", hours: "9:00 PM", shoppers: 33, wait: "1.4 min" },
  { id: 5, name: "Madurai East", area: "Bypass Road", status: "closed", hours: "Closed", shoppers: 0, wait: "—" },
  { id: 6, name: "Hyderabad West", area: "Banjara Hills", status: "open", hours: "10:30 PM", shoppers: 61, wait: "4.0 min" },
  { id: 7, name: "Mumbai Andheri", area: "Andheri West", status: "open", hours: "11:00 PM", shoppers: 108, wait: "6.7 min" },
  { id: 8, name: "Delhi Connaught", area: "CP, New Delhi", status: "open", hours: "10:00 PM", shoppers: 95, wait: "5.5 min" },
];

const products = [
  {
    id: 1, name: "Aashirvaad Whole Wheat Atta 5kg", price: 249, mrp: 285, unit: "5 kg bag", rating: 4.6, reviews: 1284,
    bay: "Bay 02", shelf: "Shelf 3", facings: 8, status: "instock",
    img: "photo-1574323347407-f5e1ad6d020b",
    badge: "In Stock · Bay 02, Shelf 3 (8 facings ready)",
  },
  {
    id: 2, name: "Amul Full Cream Milk 1L Tetra", price: 68, mrp: 72, unit: "1 L pack", rating: 4.8, reviews: 3041,
    bay: "Bay 04", shelf: "Shelf 1", facings: 2, status: "lowstock",
    img: "photo-1550583724-b2692b85b150",
    badge: "Low In-Store Stock · 2 units left on shelf",
  },
  {
    id: 3, name: "Tropicana Orange Juice 1L", price: 115, mrp: 130, unit: "1 L carton", rating: 4.3, reviews: 876,
    bay: "Bay 07", shelf: "Shelf 2", facings: 12, status: "instock",
    img: "photo-1621506289937-a8e4df240d0b",
    badge: "In Stock · Bay 07, Shelf 2 (12 facings ready)",
  },
  {
    id: 4, name: "Britannia Good Day Cookies 200g", price: 45, mrp: 50, unit: "200 g pack", rating: 4.5, reviews: 2108,
    bay: "Bay 05", shelf: "Shelf 4", facings: 0, status: "outofstock",
    img: "photo-1558961363-fa8fdf82db35",
    badge: "Aisle Reorganizing · Restock in Progress",
  },
  {
    id: 5, name: "Dove Moisturising Body Wash 500ml", price: 299, mrp: 349, unit: "500 ml bottle", rating: 4.7, reviews: 645,
    bay: "Bay 11", shelf: "Shelf 2", facings: 6, status: "instock",
    img: "photo-1607006344380-b6775a0824a7",
    badge: "In Stock · Bay 11, Shelf 2 (6 facings ready)",
  },
  {
    id: 6, name: "Lay's Classic Salted Chips 90g", price: 30, mrp: 30, unit: "90 g bag", rating: 4.4, reviews: 1876,
    bay: "Bay 06", shelf: "Shelf 3", facings: 4, status: "lowstock",
    img: "photo-1566478989037-eec170784d0b",
    badge: "Low In-Store Stock · 4 units left on shelf",
  },
];

const zones = [
  { id: "grocery", name: "Grocery & Staples", x: 4, y: 4, w: 36, h: 28, traffic: "high", people: 42, dwell: "8.2 min", color: "bg-red-100 border-red-300 text-red-800" },
  { id: "beverages", name: "Beverages", x: 44, y: 4, w: 28, h: 28, traffic: "medium", people: 21, dwell: "5.4 min", color: "bg-amber-100 border-amber-300 text-amber-800" },
  { id: "fresh", name: "Fresh Produce", x: 76, y: 4, w: 20, h: 28, traffic: "high", people: 31, dwell: "6.8 min", color: "bg-red-100 border-red-300 text-red-800" },
  { id: "cosmetics", name: "Cosmetics & Care", x: 4, y: 36, w: 28, h: 26, traffic: "low", people: 8, dwell: "9.1 min", color: "bg-green-100 border-green-300 text-green-800" },
  { id: "promo", name: "Promotional Endcap", x: 36, y: 36, w: 28, h: 26, traffic: "high", people: 18, dwell: "3.2 min", color: "bg-red-100 border-red-300 text-red-800" },
  { id: "electronics", name: "Electronics", x: 68, y: 36, w: 28, h: 26, traffic: "low", people: 12, dwell: "11.5 min", color: "bg-green-100 border-green-300 text-green-800" },
  { id: "billing", name: "Checkout / Billing", x: 4, y: 66, w: 92, h: 16, traffic: "medium", people: 13, dwell: "4.8 min", color: "bg-amber-100 border-amber-300 text-amber-800" },
];

const promos = [
  { title: "Weekend Fresh Basket", desc: "30% off on all fresh produce this weekend", tag: "Fresh", color: "from-emerald-700 to-emerald-900", img: "photo-1542838132-92c53300491e" },
  { title: "Family Pack Deals", desc: "Buy 2 get 1 free on select household staples", tag: "Staples", color: "from-amber-600 to-orange-700", img: "photo-1584568694244-14fbdf83bd30" },
  { title: "Personal Care Sale", desc: "Flat ₹100 off on orders above ₹500 in cosmetics", tag: "Cosmetics", color: "from-pink-600 to-rose-700", img: "photo-1556228578-8c89e6adf883" },
];

export default function ConsumerView({ onSwitchToPortal }: Props) {
  const [selectedStore, setSelectedStore] = useState(stores[0]);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [cartCount] = useState(3);
  const [searchVal, setSearchVal] = useState("");
  const [activePage, setActivePage] = useState<"home" | "map" | "checkout">("home");

  return (
    <div className="min-h-screen bg-gray-50 font-body">
      {/* Top utility bar */}
      <div className="bg-[#0F4C3A] text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <button
            onClick={() => setShowStoreModal(true)}
            className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors"
          >
            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>Shopping at: <strong>{selectedStore.name}</strong> (Open until {selectedStore.hours})</span>
          </button>
          <div className="hidden md:flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Store Status: <strong>Normal Flow</strong> ({selectedStore.shoppers} shoppers in-store · {selectedStore.wait} avg checkout)</span>
          </div>
          <button
            onClick={onSwitchToPortal}
            className="ml-auto text-emerald-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Staff Portal
          </button>
        </div>
      </div>

      {/* Main nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <button onClick={() => setActivePage("home")} className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-[#0F4C3A] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <div className="text-base font-display font-800 text-[#0F4C3A] leading-tight">Aura</div>
                <div className="text-[10px] text-gray-500 leading-tight -mt-0.5">Supermarket & Groceries</div>
              </div>
            </button>

            {/* Search */}
            <div className="flex-1 relative max-w-xl">
              <input
                type="text"
                placeholder='Search items, brands, aisles… e.g. "Atta 5kg"'
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchVal && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="p-3 text-xs text-gray-500 font-medium uppercase tracking-wide border-b">Quick Results</div>
                  {products.filter(p => p.name.toLowerCase().includes(searchVal.toLowerCase())).slice(0,3).map(p => (
                    <div key={p.id} className="px-4 py-3 hover:bg-emerald-50 cursor-pointer flex justify-between items-center gap-3">
                      <span className="text-sm text-gray-800">{p.name}</span>
                      <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">Found in {p.bay}</span>
                    </div>
                  ))}
                  {products.filter(p => p.name.toLowerCase().includes(searchVal.toLowerCase())).length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500">No items found for "{searchVal}"</div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button onClick={() => setActivePage("map")} className={`p-2.5 rounded-xl transition-colors ${activePage === "map" ? "bg-emerald-50 text-emerald-700" : "hover:bg-gray-100 text-gray-600"}`} title="Store Map">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </button>
              <button onClick={() => setActivePage("checkout")} className={`p-2.5 rounded-xl transition-colors ${activePage === "checkout" ? "bg-emerald-50 text-emerald-700" : "hover:bg-gray-100 text-gray-600"}`} title="Checkout Lanes">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
              <button className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors" title="Cart">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
              </button>
              <button className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Sub nav */}
          <nav className="flex gap-6 mt-3 text-sm overflow-x-auto hide-scrollbar">
            {["Grocery & Staples","Fresh Produce","Beverages","Dairy & Eggs","Snacks","Personal Care","Household","Electronics"].map(cat => (
              <button key={cat} className="text-gray-600 hover:text-[#0F4C3A] font-medium whitespace-nowrap transition-colors pb-1 hover:border-b-2 hover:border-emerald-600">{cat}</button>
            ))}
          </nav>
        </div>
      </header>

      {/* Page content */}
      {activePage === "home" && <HomePage selectedStore={selectedStore} hoveredZone={hoveredZone} setHoveredZone={setHoveredZone} promos={promos} products={products} zones={zones} setActivePage={setActivePage} />}
      {activePage === "map" && <MapPage zones={zones} hoveredZone={hoveredZone} setHoveredZone={setHoveredZone} />}
      {activePage === "checkout" && <CheckoutPage />}

      {/* Store selector modal */}
      {showStoreModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="p-5 border-b">
              <div className="flex justify-between items-center">
                <h2 className="font-display font-700 text-lg text-gray-900">Select Your Store</h2>
                <button onClick={() => setShowStoreModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-3 space-y-2">
              {stores.map(store => (
                <button
                  key={store.id}
                  onClick={() => { setSelectedStore(store); setShowStoreModal(false); }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${selectedStore.id === store.id ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50"}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-display font-600 text-gray-900 text-sm">{store.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{store.area}</div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${store.status === "open" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${store.status === "open" ? "bg-emerald-500" : "bg-gray-400"}`}></span>
                        {store.status === "open" ? `Open · ${store.hours}` : "Closed"}
                      </span>
                      {store.status === "open" && <div className="text-xs text-gray-500 mt-1">{store.shoppers} in-store · {store.wait} wait</div>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HomePage({ selectedStore, hoveredZone, setHoveredZone, promos, products, zones, setActivePage }: any) {
  return (
    <main>
      {/* Hero with live store status */}
      <section className="bg-gradient-to-br from-[#0F4C3A] via-[#135D43] to-[#0a3d2e] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-emerald-300 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                Live Store Intelligence Active
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-800 text-white leading-tight mb-4">
                Fresh. Local.<br />Always in Stock.
              </h1>
              <p className="text-emerald-200 text-lg mb-8 max-w-md">
                Real-time shelf availability at your fingertips. Shop smarter with live aisle updates and skip the queue.
              </p>
              <div className="flex gap-3">
                <button className="bg-white text-[#0F4C3A] font-display font-700 px-6 py-3 rounded-xl hover:bg-emerald-50 transition-colors">
                  Shop Now
                </button>
                <button onClick={() => setActivePage("map")} className="border border-white/30 text-white font-display font-600 px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">
                  View Store Map
                </button>
              </div>
            </div>

            {/* Live status card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-700 text-white">Planning a Visit?</h3>
                <span className="flex items-center gap-1.5 text-xs text-emerald-300">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  Live
                </span>
              </div>
              <div className="text-emerald-200 text-sm mb-5">
                <strong className="text-white">{selectedStore.name}</strong> is currently at{" "}
                <strong className="text-emerald-300">{Math.round((selectedStore.shoppers / 110) * 100)}% capacity</strong>.
                Average checkout wait time is <strong className="text-emerald-300">{selectedStore.wait}</strong> across 4 active lanes.
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Shoppers Inside", value: `${selectedStore.shoppers}/110`, icon: "👥" },
                  { label: "Avg Checkout Wait", value: selectedStore.wait, icon: "⏱" },
                  { label: "Active Lanes", value: "4 of 6", icon: "🛒" },
                  { label: "Stock Availability", value: "94%", icon: "📦" },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3">
                    <div className="text-base mb-1">{s.icon}</div>
                    <div className="text-white font-display font-700 text-lg">{s.value}</div>
                    <div className="text-emerald-300 text-xs">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display font-700 text-xl text-gray-900 mb-5">Today's Deals & Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promos.map((p: any) => (
              <div key={p.title} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${p.color} text-white p-6 min-h-[160px]`}>
                <img
                  src={`https://images.unsplash.com/${p.img}?w=400&h=200&fit=crop&auto=format`}
                  alt={p.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
                />
                <div className="relative">
                  <span className="text-xs font-medium bg-white/20 px-2.5 py-1 rounded-full">{p.tag}</span>
                  <h3 className="font-display font-700 text-lg mt-3 mb-1">{p.title}</h3>
                  <p className="text-white/80 text-sm">{p.desc}</p>
                  <button className="mt-4 bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors">Shop Offer →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Store map preview */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-700 text-xl text-gray-900">Interactive Store Map</h2>
              <p className="text-sm text-gray-500 mt-1">Hover over a zone to see live traffic and popular items</p>
            </div>
            <button onClick={() => setActivePage("map")} className="text-sm text-emerald-700 font-medium hover:underline">View Full Map →</button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Store layout */}
            <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 p-4 relative" style={{ minHeight: 300 }}>
              <svg viewBox="0 0 100 90" className="w-full h-full" style={{ minHeight: 260 }}>
                <rect x="0" y="0" width="100" height="90" rx="2" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="0.5" />
                {/* Entrance */}
                <rect x="42" y="83" width="16" height="7" rx="1" fill="#0F4C3A" />
                <text x="50" y="88" textAnchor="middle" fill="white" fontSize="2.5" fontFamily="Inter, sans-serif">ENTRANCE</text>

                {zones.map((z: any) => {
                  const isHovered = hoveredZone === z.id;
                  const fillMap: Record<string, string> = {
                    high: isHovered ? "#fca5a5" : "#fee2e2",
                    medium: isHovered ? "#fcd34d" : "#fef3c7",
                    low: isHovered ? "#6ee7b7" : "#d1fae5",
                  };
                  const strokeMap: Record<string, string> = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };
                  return (
                    <g key={z.id} onMouseEnter={() => setHoveredZone(z.id)} onMouseLeave={() => setHoveredZone(null)} style={{ cursor: "pointer" }}>
                      <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="1.5" fill={fillMap[z.traffic]} stroke={strokeMap[z.traffic]} strokeWidth="0.5" />
                      <text x={z.x + z.w / 2} y={z.y + z.h / 2 - 1.5} textAnchor="middle" fill="#374151" fontSize="2.8" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600">{z.name.split(" ")[0]}</text>
                      <text x={z.x + z.w / 2} y={z.y + z.h / 2 + 2} textAnchor="middle" fill="#6b7280" fontSize="2.2" fontFamily="Inter, sans-serif">{z.people} people</text>
                      {z.traffic === "high" && <text x={z.x + z.w - 3} y={z.y + 4} textAnchor="middle" fontSize="4">🔥</text>}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Zone detail panel */}
            <div className="w-full lg:w-72 space-y-3">
              {hoveredZone ? (
                (() => {
                  const zone = zones.find((z: any) => z.id === hoveredZone)!;
                  return (
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                      <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-3 ${zone.color}`}>
                        {zone.traffic === "high" ? "🔥 High Traffic" : zone.traffic === "medium" ? "🟡 Moderate Traffic" : "🟢 Low Traffic"}
                      </div>
                      <h3 className="font-display font-700 text-gray-900 text-lg">{zone.name}</h3>
                      <div className="mt-4 space-y-3">
                        <div className="flex justify-between text-sm"><span className="text-gray-500">Current Visitors</span><span className="font-medium text-gray-900">{zone.people}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-500">Avg Dwell Time</span><span className="font-medium text-gray-900">{zone.dwell}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-500">Traffic Level</span><span className="font-medium capitalize text-gray-900">{zone.traffic}</span></div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-300 p-5 flex flex-col items-center justify-center text-center h-40">
                  <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                  </svg>
                  <p className="text-sm text-gray-500">Hover over a zone<br />to see live details</p>
                </div>
              )}
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Zone Traffic Legend</div>
                <div className="space-y-2">
                  {[["🔥", "High Traffic", "text-red-700 bg-red-50"], ["🟡", "Moderate", "text-amber-700 bg-amber-50"], ["🟢", "Low Traffic", "text-green-700 bg-green-50"]].map(([icon, label, cls]) => (
                    <div key={label} className={`flex items-center gap-2 text-xs font-medium px-2.5 py-1.5 rounded-lg ${cls}`}>{icon} {label}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-700 text-xl text-gray-900">Popular In-Store Right Now</h2>
              <p className="text-sm text-gray-500 mt-1">Live shelf availability updated by AI cameras</p>
            </div>
            <button className="text-sm text-emerald-700 font-medium hover:underline">View All →</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {products.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F4C3A] text-white py-12 px-4 mt-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-300" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" /></svg>
              </div>
              <span className="font-display font-700 text-lg">Aura Supermarket</span>
            </div>
            <p className="text-emerald-300 text-sm">Powered by RetailEdge AI — Privacy-preserving smart retail intelligence.</p>
          </div>
          {[
            { title: "Shop", links: ["Grocery", "Fresh Produce", "Beverages", "Personal Care"] },
            { title: "Services", links: ["Scan & Go", "Home Delivery", "Loyalty Program", "Gift Cards"] },
            { title: "Help", links: ["Find a Store", "Track Order", "Returns", "Contact Us"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-display font-600 text-sm mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => <li key={l}><a href="#" className="text-emerald-300 text-sm hover:text-white transition-colors">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-emerald-400">
          <span>© 2026 Aura Supermarket & Groceries. All rights reserved.</span>
          <span>Privacy Policy · Terms of Service · Cookie Settings</span>
        </div>
      </footer>
    </main>
  );
}

function ProductCard({ product }: { product: any }) {
  const [inList, setInList] = useState(false);
  const disc = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const badgeStyle: Record<string, string> = {
    instock: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    lowstock: "bg-amber-50 text-amber-700 border border-amber-200",
    outofstock: "bg-gray-100 text-gray-500 border border-gray-200",
  };

  const badgeIcon: Record<string, string> = {
    instock: "●",
    lowstock: "⚠",
    outofstock: "○",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        <img
          src={`https://images.unsplash.com/${product.img}?w=400&h=200&fit=crop&auto=format`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {disc > 0 && (
          <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-lg">{disc}% OFF</span>
        )}
      </div>
      <div className="p-4">
        <div className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full mb-2 ${badgeStyle[product.status]}`}>
          <span>{badgeIcon[product.status]}</span>
          {product.badge}
        </div>
        <h3 className="font-display font-600 text-gray-900 text-sm leading-snug mb-2">{product.name}</h3>
        <div className="text-xs text-gray-400 mb-3">{product.unit}</div>
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[1,2,3,4,5].map(s => (
              <svg key={s} className={`w-3 h-3 ${s <= Math.round(product.rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-400">{product.rating} ({product.reviews.toLocaleString()})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display font-700 text-gray-900">₹{product.price}</span>
            {product.mrp > product.price && <span className="text-xs text-gray-400 line-through ml-1.5">₹{product.mrp}</span>}
          </div>
          <button
            onClick={() => setInList(!inList)}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${inList ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
          >
            {inList ? "✓ Added" : "+ Add to List"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MapPage({ zones, hoveredZone, setHoveredZone }: any) {
  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="font-display font-700 text-2xl text-gray-900 mb-2">Store Map & Aisle Navigator</h2>
      <p className="text-gray-500 text-sm mb-8">Chennai-01 Flagship — Live occupancy updated every 30 seconds</p>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6">
          <svg viewBox="0 0 100 90" className="w-full" style={{ maxHeight: 480 }}>
            <rect x="0" y="0" width="100" height="90" rx="2" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="0.5" />
            <rect x="42" y="83" width="16" height="7" rx="1" fill="#0F4C3A" />
            <text x="50" y="88" textAnchor="middle" fill="white" fontSize="2.5" fontFamily="Inter, sans-serif">ENTRANCE</text>
            {zones.map((z: any) => {
              const isHovered = hoveredZone === z.id;
              const fillMap: Record<string, string> = { high: isHovered ? "#fca5a5" : "#fee2e2", medium: isHovered ? "#fcd34d" : "#fef3c7", low: isHovered ? "#6ee7b7" : "#d1fae5" };
              const strokeMap: Record<string, string> = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };
              return (
                <g key={z.id} onMouseEnter={() => setHoveredZone(z.id)} onMouseLeave={() => setHoveredZone(null)} style={{ cursor: "pointer" }}>
                  <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="1.5" fill={fillMap[z.traffic]} stroke={strokeMap[z.traffic]} strokeWidth={isHovered ? "1" : "0.5"} />
                  <text x={z.x + z.w / 2} y={z.y + z.h / 2 - 2} textAnchor="middle" fill="#374151" fontSize="3" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700">{z.name}</text>
                  <text x={z.x + z.w / 2} y={z.y + z.h / 2 + 2.5} textAnchor="middle" fill="#6b7280" fontSize="2.2" fontFamily="Inter, sans-serif">{z.people} shoppers · {z.dwell} avg</text>
                  {z.traffic === "high" && <text x={z.x + z.w - 3} y={z.y + 4} fontSize="4">🔥</text>}
                </g>
              );
            })}
          </svg>
        </div>
        <div className="w-full lg:w-80 space-y-3">
          <h3 className="font-display font-600 text-gray-900">Zone Status</h3>
          {zones.map((z: any) => (
            <div key={z.id} onMouseEnter={() => setHoveredZone(z.id)} onMouseLeave={() => setHoveredZone(null)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${hoveredZone === z.id ? "border-emerald-400 bg-emerald-50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-display font-600 text-sm text-gray-900">{z.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{z.people} shoppers · {z.dwell} avg dwell</div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${z.traffic === "high" ? "bg-red-100 text-red-700" : z.traffic === "medium" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                  {z.traffic}
                </span>
              </div>
              <div className="mt-3 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div className={`h-full rounded-full ${z.traffic === "high" ? "bg-red-500" : z.traffic === "medium" ? "bg-amber-500" : "bg-emerald-500"}`}
                  style={{ width: `${Math.min(100, (z.people / 50) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function CheckoutPage() {
  const counters = [
    { id: 1, queue: 3, cashier: "Priya R.", open: true, wait: "1.8 min" },
    { id: 2, queue: 8, cashier: "Arjun K.", open: true, wait: "5.1 min" },
    { id: 3, queue: 2, cashier: "Meena S.", open: true, wait: "1.2 min" },
    { id: 4, queue: 0, cashier: "—", open: false, wait: "—" },
    { id: 5, queue: 5, cashier: "Ravi M.", open: true, wait: "3.4 min" },
    { id: 6, queue: 0, cashier: "—", open: false, wait: "—" },
  ];
  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="font-display font-700 text-2xl text-gray-900 mb-2">Live Checkout Lane Tracker</h2>
      <p className="text-gray-500 text-sm mb-8">AI-monitored queue lengths updated in real time</p>
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
        <span className="text-amber-500 text-lg mt-0.5">⚠️</span>
        <div>
          <div className="font-display font-600 text-amber-800 text-sm">AI Queue Prediction</div>
          <div className="text-amber-700 text-sm mt-0.5">Counter 2 queue predicted to reach <strong>15 customers</strong> in 8 minutes. Consider opening Counter 4.</div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {counters.map(c => (
          <div key={c.id} className={`rounded-2xl border p-5 ${c.open ? "bg-white border-gray-200" : "bg-gray-50 border-dashed border-gray-200"}`}>
            <div className="flex justify-between items-center mb-4">
              <span className="font-display font-700 text-gray-900">Counter {c.id}</span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${c.open ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                {c.open ? "🟢 Open" : "● Closed"}
              </span>
            </div>
            {c.open ? (
              <>
                <div className="flex gap-1 mb-3 flex-wrap">
                  {Array.from({ length: c.queue }).map((_, i) => (
                    <span key={i} className={`text-lg ${c.queue >= 7 ? "opacity-90" : ""}`}>🧍</span>
                  ))}
                  {c.queue === 0 && <span className="text-gray-400 text-sm">No queue</span>}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Queue</span><span className="font-medium text-gray-900">{c.queue} customers</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Est. Wait</span><span className={`font-medium ${c.queue >= 6 ? "text-red-600" : "text-gray-900"}`}>{c.wait}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Cashier</span><span className="font-medium text-gray-900">{c.cashier}</span></div>
                </div>
                <div className="mt-3">
                  <div className={`h-1.5 rounded-full overflow-hidden bg-gray-100`}>
                    <div className={`h-full rounded-full transition-all ${c.queue >= 7 ? "bg-red-500" : c.queue >= 4 ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: `${Math.min(100, (c.queue / 10) * 100)}%` }} />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-gray-400 text-sm">Counter not in service</div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
