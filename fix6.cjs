const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<main className="flex-1 overflow-y-auto p-8 bg-\[#F8FAFC\]">([\s\S]*?)<\/main>/;

const replacement = `<main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
          {activeTab.includes('dash') && <DashboardView />}
          {activeTab.includes('store') && !activeTab.includes('manager') && <StoresView onSelect={() => setActiveTab('admin_dash_footfall')} />}
          {activeTab.includes('task') && <TasksView />}
          {activeTab.includes('emp_add') && <AddEmployeeFormView onSave={() => {}} onCancel={() => {}} />}
          {activeTab.includes('emp_tasks') && <AssignTasksView />}
          {activeTab.includes('emp_perf') && <EmployeesPerformanceView employees={[]} />}
          {(activeTab.includes('emp_list') || activeTab.includes('employees') || activeTab.includes('manager_staff') || activeTab.includes('emp_profile')) && <EmployeesListView />}
          {activeTab.includes('cam') && <CamerasView />}
          {activeTab.includes('inv') && <InventoryView />}
          {activeTab.includes('queue') && <QueueView />}
          {(activeTab.includes('shopper') || activeTab.includes('analytics')) && <AnalyticsView />}
          {(activeTab.includes('ai') || activeTab.includes('insights')) && <AIInsightsView />}
          {(activeTab.includes('alert') || activeTab.includes('notification')) && <AlertsView />}
          {activeTab.includes('report') && <ReportsView />}
          {(activeTab.includes('int_') || activeTab.includes('integrations')) && <IntegrationsView />}
          {activeTab.includes('priv') && <PrivacyView />}
          {activeTab.includes('setting') && <SettingsView />}
          
          {/* Fallback if nothing matches just show Dashboard */}
          {![
            'dash', 'store', 'task', 'emp_list', 'employees', 'emp_add', 'emp_tasks', 'emp_perf', 'manager_staff', 'emp_profile', 'cam', 'inv', 'queue', 'shopper', 'analytics', 'ai', 'insights', 'alert', 'notification', 'report', 'int_', 'integrations', 'priv', 'setting'
          ].some(v => activeTab.includes(v)) && <DashboardView />}
        </main>`;

const newContent = content.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', newContent);
console.log('Routing conditions repaired!');
