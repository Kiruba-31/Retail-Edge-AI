const fs = require('fs');

const content = fs.readFileSync('src/App.tsx', 'utf8');

const targetRegex = /<aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0">([\s\S]*?)<div className="p-4 border-t border-slate-100">([\s\S]*?)<\/aside>/;

const replacement = `<aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0">
        <div className="p-4">
          <div className="flex items-center gap-3 px-3 py-3 mb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-[#0c1322] flex items-center justify-center font-bold text-white shadow-sm">
              ⚡
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-slate-900 capitalize">Retail Shop</h1>
              <p className="text-[10px] text-slate-400 font-medium">● Manager Portal</p>
            </div>
          </div>

          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-190px)] pr-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <div key={item.id} className="mb-1">
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={\`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all \${
                      isActive
                        ? 'bg-[#0c1322] text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }\`}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className={\`w-4 h-4 \${isActive ? 'text-white' : 'text-slate-500'}\`} />}
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className={\`px-1.5 py-0.5 text-[10px] rounded-full font-bold \${
                          isActive ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-700'
                        }\`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3 px-2">
            <div>
              <p className="text-xs font-bold text-slate-900 capitalize">{user.name}</p>
              <p className="text-[10px] text-slate-400">{user.store}</p>
            </div>
            <span className={\`text-[9px] font-bold px-2 py-0.5 text-white rounded \${currentRoleConfig.badgeColor}\`}>
              {currentRoleConfig.title}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>`;

const newContent = content.replace(targetRegex, replacement);
fs.writeFileSync('src/App.tsx', newContent);
console.log('App.tsx sidebar repaired!');
