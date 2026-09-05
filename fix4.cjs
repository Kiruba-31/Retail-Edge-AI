const fs = require('fs');

const content = fs.readFileSync('src/App.tsx', 'utf8');

// StoresView fix
const storesRegex = /function StoresView\(\{\s*onSelect\s*\}\s*:\s*\{\s*onSelect\s*:\s*\(\)\s*=>\s*void\s*\}\)\s*\{\s*return\s*\(\s*<div className="p-6">/g;
const storesReplacement = `function StoresView({ onSelect }: { onSelect: () => void }) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Store Locations</h2>
        <button className="px-4 py-2 bg-[#0f172a] text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors">
          + Add Store
        </button>
      </div>`;

// EmployeesListView fix
const empRegex = /function EmployeesListView\(\)\s*\{\s*const\s*\[activeTab,\s*setActiveTab\]\s*=\s*useState\('directory'\);\s*return\s*\(\s*<div className="p-6">/g;
const empReplacement = `function EmployeesListView() {
  const [activeTab, setActiveTab] = useState('directory');
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Employees Directory</h2>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-[#0284c7] text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors">
            Export to Excel
          </button>
          <button className="px-4 py-2 bg-[#0f172a] text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors">
            + Add Employee
          </button>
        </div>
      </div>`;

let newContent = content.replace(storesRegex, storesReplacement);
newContent = newContent.replace(empRegex, empReplacement);

fs.writeFileSync('src/App.tsx', newContent);
console.log('App.tsx Views repaired!');
