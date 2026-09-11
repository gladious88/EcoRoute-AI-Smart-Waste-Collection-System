import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Trash2, 
  BrainCircuit, 
  ScanSearch, 
  Map, 
  Truck, 
  AlertTriangle, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { user, switchRole } = useAuth();

  const adminNavItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Bin Monitoring', path: '/monitoring', icon: Trash2 },
    { name: 'AI Predictions', path: '/predictions', icon: BrainCircuit },
    { name: 'Waste Detection', path: '/waste-detection', icon: ScanSearch },
    { name: 'Route Planner', path: '/routes', icon: Map },
    { name: 'Vehicles', path: '/vehicles', icon: Truck },
    { name: 'Citizen Reports', path: '/reports', icon: AlertTriangle },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const driverNavItems = [
    { name: 'Driver Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Assigned Route', path: '/routes', icon: Map },
    { name: 'Bins Collection', path: '/monitoring', icon: Trash2 },
    { name: 'Report Bin Issue', path: '/reports', icon: AlertTriangle },
    { name: 'Vehicle Status', path: '/vehicles', icon: Truck },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const navItems = user.role === 'Municipal Admin' ? adminNavItems : driverNavItems;

  return (
    <aside className={`relative flex flex-col border-r border-slate-200 bg-white transition-all duration-300 z-30 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Header Branding */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100">
        <Logo collapsed={collapsed} />
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <item.icon className={`h-5 w-5 shrink-0`} />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </div>

      {/* Role Switcher & Persona Card */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        {!collapsed ? (
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <img src={user.avatar} alt={user.full_name} className="h-9 w-9 rounded-full object-cover border border-emerald-500/30" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{user.full_name}</p>
                <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  user.role === 'Municipal Admin' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
            
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">Switch Role:</span>
              <button
                onClick={() => switchRole(user.role === 'Municipal Admin' ? 'Collection Driver' : 'Municipal Admin')}
                className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                <UserCheck className="h-3 w-3" />
                {user.role === 'Municipal Admin' ? 'Driver' : 'Admin'}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => switchRole(user.role === 'Municipal Admin' ? 'Collection Driver' : 'Municipal Admin')}
            className="flex h-10 w-full items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition shadow-sm"
            title={`Switch to ${user.role === 'Municipal Admin' ? 'Collection Driver' : 'Municipal Admin'}`}
          >
            <UserCheck className="h-5 w-5 text-emerald-600" />
          </button>
        )}
      </div>
    </aside>
  );
};
