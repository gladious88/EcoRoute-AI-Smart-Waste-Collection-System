import React, { useState } from 'react';
import { Search, Bell, MapPin, CheckCircle2, AlertCircle, Info, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/monitoring?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 md:px-6 backdrop-blur-md">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative flex max-w-md flex-1 items-center">
        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search bins (e.g. TN-AN-101), areas, routes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Tamil Nadu Region Tag */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          <MapPin className="h-3.5 w-3.5 text-emerald-600" />
          <span>Greater Chennai Corp (GCC)</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition shadow-sm"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                    {unreadCount} new
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-emerald-600 hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="mt-3 max-h-80 overflow-y-auto space-y-2.5">
                {notifications.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">No new notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id);
                        if (n.action_url) navigate(n.action_url);
                        setShowNotifications(false);
                      }}
                      className={`flex gap-3 rounded-xl p-3 text-xs transition cursor-pointer ${
                        n.is_read ? 'bg-slate-50/50 hover:bg-slate-100/60' : 'bg-emerald-50/50 border border-emerald-500/20 hover:bg-emerald-50'
                      }`}
                    >
                      {n.type === 'critical' ? (
                        <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                      ) : n.type === 'warning' ? (
                        <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">{n.title}</p>
                        <p className="mt-0.5 text-slate-600 leading-relaxed line-clamp-2">{n.message}</p>
                        <span className="mt-1 block text-[10px] text-slate-400">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Persona Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 hover:bg-slate-50 transition shadow-sm"
          >
            <img src={user.avatar} alt={user.full_name} className="h-8 w-8 rounded-lg object-cover border border-emerald-500/30" />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">{user.full_name}</p>
              <span className="text-[10px] font-semibold text-emerald-600 block">{user.role}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {/* User Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user.full_name}</p>
                <p className="text-[11px] text-slate-500">{user.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    switchRole(user.role === 'Municipal Admin' ? 'Collection Driver' : 'Municipal Admin');
                    setShowUserMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  <User className="h-4 w-4 text-emerald-600" />
                  <span>Switch to {user.role === 'Municipal Admin' ? 'Collection Driver' : 'Municipal Admin'}</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
