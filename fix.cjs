const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `
  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-slate-900 selection:text-white">`;

const replacement = `        <Route path="/dashboard" element={<ProtectedRoute><ClerkAuthWrapper /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();
  
  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">Loading...</div>;
  }
  
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function ClerkAuthWrapper() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [searchParams] = useSearchParams();

  const urlRole = searchParams.get('role');
  const savedRole = urlRole || localStorage.getItem('user_role') || 'admin';

  if (urlRole) {
    localStorage.setItem('user_role', urlRole);
  }

  const mappedUser = {
    name: user?.fullName || user?.firstName || 'User',
    email: user?.primaryEmailAddress?.emailAddress || '',
    role: savedRole,
    store: 'Store Chennai-01'
  };

  return <MainApp user={mappedUser} onLogout={() => signOut()} />;
}

export function MainApp({ user, onLogout }: { user: any, onLogout: () => void }) {
  const currentRoleConfig = ROLES_CONFIG[user.role as keyof typeof ROLES_CONFIG] || ROLES_CONFIG['admin'];
  const initialActiveTab = currentRoleConfig.navItems[0]?.subItems ? currentRoleConfig.navItems[0].subItems[0].id : currentRoleConfig.navItems[0].id;
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [openNavGroupId, setOpenNavGroupId] = useState<string | null>(currentRoleConfig.navItems[0]?.subItems ? currentRoleConfig.navItems[0].id : null);
  const [selectedStore, setSelectedStore] = useState('Store Chennai-01');
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = currentRoleConfig.navItems;

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      alert(\`Search action triggered for: \${searchQuery}\`);
      setSearchQuery('');
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-slate-900 selection:text-white">`;

const updatedContent = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', updatedContent);
console.log('Done!');
