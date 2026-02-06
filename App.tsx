
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Factory, 
  Cpu, 
  ClipboardList, 
  ShieldAlert, 
  Wrench, 
  BookOpen, 
  Users, 
  LogOut, 
  Menu, 
  X,
  Bell,
  ChevronRight,
  Sun,
  Moon,
  Lock,
  History
} from 'lucide-react';

import { User, UserRole } from './types';
import { api } from './services/api';
import Dashboard from './pages/Dashboard';
import Facilities from './pages/Facilities';
import Assets from './pages/Assets';
import MOCRequests from './pages/MOCRequests';
import MOCDetails from './pages/MOCDetails';
import RiskAnalysis from './pages/RiskAnalysis';
import WorkOrders from './pages/WorkOrders';
import Standards from './pages/Standards';
import UserAdmin from './pages/UserAdmin';
import AuditTrail from './pages/AuditTrail';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  sessionExpired: boolean;
}
const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => useContext(AuthContext)!;

// --- Theme Context ---
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | null>(null);
export const useTheme = () => useContext(ThemeContext)!;

const ProtectedRoute = ({ children, roles }: { children?: React.ReactNode, roles?: UserRole[] }) => {
  const { user, token, isLoading, sessionExpired } = useAuth();
  
  if (isLoading) return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-medium">Validando token de segurança...</p>
    </div>
  );

  if (sessionExpired) return <Navigate to="/login?expired=true" replace />;
  if (!user || !token) return <Navigate to="/login" replace />;
  
  if (roles && !roles.includes(user.role) && user.role !== UserRole.ADMIN) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-slate-900">
        <div className="p-6 bg-red-50 dark:bg-red-900/10 rounded-full mb-6">
          <Lock size={64} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-black dark:text-white mb-2">Acesso Restrito</h1>
        <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-md">
          Sua conta possui o perfil <strong>{user.role}</strong>, que não tem autorização para gerenciar este módulo. Entre em contato com o administrador para solicitar permissão.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none">
          Voltar para o Painel
        </Link>
      </div>
    );
  }
  
  return <>{children}</>;
};

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Unidades', path: '/facilities', icon: Factory },
    { name: 'Equipamentos', path: '/assets', icon: Cpu },
    { name: 'MOC Requests', path: '/mocs', icon: ClipboardList },
    { name: 'Risco', path: '/risk', icon: ShieldAlert },
    { name: 'Ordens de Serviço', path: '/work-orders', icon: Wrench },
    { name: 'Normas & Links', path: '/standards', icon: BookOpen },
    { name: 'Administração', path: '/users', icon: Users, role: UserRole.ADMIN },
    { name: 'Audit Trail', path: '/audit', icon: History, role: UserRole.ADMIN },
  ];

  return (
    <div className={`flex h-screen ${isDark ? 'dark bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col border-r ${isDark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-white shadow-sm'} z-20`}>
        <div className="p-4 flex items-center justify-between overflow-hidden">
          {isSidebarOpen && <span className="text-xl font-black text-blue-600 dark:text-blue-400">MOC Studio</span>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.filter(item => !item.role || user?.role === item.role || user?.role === UserRole.ADMIN).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-xl transition-colors ${
                location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'hover:bg-blue-50 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300'
              }`}
            >
              <item.icon size={22} className={location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? '' : 'text-blue-600 dark:text-blue-400'} />
              {isSidebarOpen && <span className="ml-3 font-semibold">{item.name}</span>}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100 dark:border-slate-800">
          <button onClick={logout} className="flex items-center w-full p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors">
            <LogOut size={22} />
            {isSidebarOpen && <span className="ml-3 font-semibold">Encerrar Sessão</span>}
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className={`h-16 flex items-center justify-between px-8 border-b ${isDark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
            <span className="font-medium">MOC Studio</span>
            <ChevronRight size={14} />
            <span className="font-bold text-gray-900 dark:text-slate-100 capitalize">
              {location.pathname === '/' ? 'Dashboard' : location.pathname.split('/')[1].replace('-', ' ')}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
              {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold dark:text-slate-100 leading-none mb-1">{user?.name}</p>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">{user?.role.replace('_', ' ')}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-slate-700 border border-blue-200 dark:border-slate-600 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black shadow-sm">
                {user?.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>
        {/* Adicionado id="main-scroll-container" para isolamento na impressão */}
        <div id="main-scroll-container" className="flex-1 overflow-auto p-8">{children}</div>
      </main>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('moc_theme') === 'dark');

  const checkSession = useCallback(async () => {
    const savedToken = localStorage.getItem('moc_token');
    const savedRefreshToken = localStorage.getItem('moc_refresh_token');
    const savedUser = localStorage.getItem('moc_current_user');
    
    if (savedToken && savedUser) {
      const activeUser = api.validateToken(savedToken);
      if (activeUser) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
        setSessionExpired(false);
      } else if (savedRefreshToken) {
        try {
          const res = await api.refreshToken(savedRefreshToken);
          setUser(res.user);
          setToken(res.token);
          setSessionExpired(false);
        } catch (e) {
          handleLogout();
          setSessionExpired(true);
        }
      } else {
        handleLogout();
        setSessionExpired(true);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkSession();
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('moc_token');
      if (currentToken && !api.validateToken(currentToken)) {
        checkSession();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [checkSession]);

  const handleLogin = async (email: string) => {
    const res = await api.login(email);
    setUser(res.user);
    setToken(res.token);
    setSessionExpired(false);
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setToken(null);
    setSessionExpired(false);
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('moc_theme', next ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <AuthContext.Provider value={{ user, token, login: handleLogin, logout: handleLogout, isLoading, sessionExpired }}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
            <Route path="/facilities" element={<ProtectedRoute roles={[UserRole.ADMIN, UserRole.GERENTE_INSTALACAO, UserRole.ENG_PROCESSO]}><Layout><Facilities /></Layout></ProtectedRoute>} />
            <Route path="/assets" element={<ProtectedRoute roles={[UserRole.ADMIN, UserRole.GERENTE_INSTALACAO, UserRole.TECNICO_MANUTENCAO]}><Layout><Assets /></Layout></ProtectedRoute>} />
            <Route path="/mocs" element={<ProtectedRoute roles={[UserRole.ADMIN, UserRole.GERENTE_INSTALACAO, UserRole.ENG_PROCESSO, UserRole.COORD_HSE, UserRole.COMITE_APROVACAO]}><Layout><MOCRequests /></Layout></ProtectedRoute>} />
            <Route path="/mocs/:id" element={<ProtectedRoute roles={[UserRole.ADMIN, UserRole.GERENTE_INSTALACAO, UserRole.ENG_PROCESSO, UserRole.COORD_HSE, UserRole.COMITE_APROVACAO]}><Layout><MOCDetails /></Layout></ProtectedRoute>} />
            <Route path="/risk" element={<ProtectedRoute roles={[UserRole.ADMIN, UserRole.ENG_PROCESSO, UserRole.COORD_HSE]}><Layout><RiskAnalysis /></Layout></ProtectedRoute>} />
            <Route path="/work-orders" element={<ProtectedRoute roles={[UserRole.ADMIN, UserRole.TECNICO_MANUTENCAO, UserRole.GERENTE_INSTALACAO]}><Layout><WorkOrders /></Layout></ProtectedRoute>} />
            <Route path="/standards" element={<ProtectedRoute><Layout><Standards /></Layout></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute roles={[UserRole.ADMIN]}><Layout><UserAdmin /></Layout></ProtectedRoute>} />
            <Route path="/audit" element={<ProtectedRoute roles={[UserRole.ADMIN]}><Layout><AuditTrail /></Layout></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
