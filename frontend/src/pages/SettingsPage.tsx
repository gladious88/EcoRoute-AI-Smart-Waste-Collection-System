import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, User, Bell, Sliders, Globe, Shield, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'prediction' | 'regional'>('profile');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="h-7 w-7 text-emerald-600" />
          <span>System & Account Settings</span>
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-0.5">
          Configure profile details, notification triggers, prediction parameters & regional defaults
        </p>
      </div>

      {savedMessage && (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 border border-emerald-500/30 text-emerald-900 text-xs font-semibold shadow-sm animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-1">
          {[
            { id: 'profile', label: 'User Profile', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'prediction', label: 'AI Prediction Model', icon: Sliders },
            { id: 'regional', label: 'Tamil Nadu Regional', icon: Globe }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Box */}
        <div className="lg:col-span-9 rounded-2xl bg-white p-6 border border-slate-200 shadow-sm">
          <form onSubmit={handleSave} className="space-y-6">
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">User Profile Settings</h3>
                <div className="flex items-center gap-4">
                  <img src={user.avatar} alt="Avatar" className="h-16 w-16 rounded-2xl object-cover border-2 border-emerald-500" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{user.full_name}</h4>
                    <p className="text-xs text-slate-500">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user.full_name}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">Notification Preferences</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Critical Bin Overflow Alert (< 2 Hours)', defaultChecked: true },
                    { label: 'High Priority Bin Alert (Fill >= 75%)', defaultChecked: true },
                    { label: 'Citizen Issue Report Submitted', defaultChecked: true },
                    { label: 'Route Optimization Completed Notification', defaultChecked: false }
                  ].map((item, idx) => (
                    <label key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
                      <span className="text-xs font-bold text-slate-800">{item.label}</span>
                      <input type="checkbox" defaultChecked={item.defaultChecked} className="h-4 w-4 accent-emerald-600 rounded" />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'prediction' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">AI Prediction Model Parameters</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Critical Overflow Threshold (% Fill)</label>
                    <input type="number" defaultValue={90} className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-900" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">High Priority Threshold (% Fill)</label>
                    <input type="number" defaultValue={75} className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-900" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'regional' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">Tamil Nadu Regional Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Municipality Jurisdiction</label>
                    <input type="text" defaultValue="Greater Chennai Corporation (GCC)" disabled className="w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-xs font-bold text-slate-700" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Distance & Fuel Unit</label>
                    <input type="text" defaultValue="Metric (Kilometers / Liters)" disabled className="w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-xs font-bold text-slate-700" />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-700 transition shadow-sm"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
