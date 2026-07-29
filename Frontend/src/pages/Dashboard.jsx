import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Folder, HelpCircle, ShieldAlert } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Panel */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between">
        <div className="p-6">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Retracer
          </span>
          
          <nav className="mt-8 space-y-2">
            <a href="#profile" className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-indigo-600/10 text-indigo-400 font-medium">
              <User size={18} />
              <span>My Profile</span>
            </a>
            <a href="#listings" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 transition">
              <Folder size={18} />
              <span>Reported Items</span>
            </a>
            <a href="#claims" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 transition">
              <HelpCircle size={18} />
              <span>Claims History</span>
            </a>
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-red-950/20 text-red-400 border border-red-950 hover:bg-red-950/40 hover:text-red-300 transition duration-200 text-sm font-semibold"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              Welcome back, <span className="text-indigo-400 font-medium">{user?.name}</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 rounded-2xl py-2 px-4">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white leading-none">{user?.name}</p>
              <p className="text-xs text-slate-500 mt-1 capitalize">{user?.role}</p>
            </div>
          </div>
        </header>

        {/* Info Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-sm text-slate-400 font-semibold">User Role</p>
            <h3 className="text-2xl font-bold mt-2 capitalize text-white">{user?.role}</h3>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-sm text-slate-400 font-semibold">Account Status</p>
            <h3 className="text-2xl font-bold mt-2 capitalize text-emerald-400">{user?.status}</h3>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-sm text-slate-400 font-semibold">Saved Bookmarks</p>
            <h3 className="text-2xl font-bold mt-2 text-white">{user?.bookmarks?.length || 0}</h3>
          </div>
        </section>

        {/* Dashboard Placeholder Board */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center flex flex-col justify-center items-center h-64">
          <ShieldAlert className="text-indigo-400 mb-4" size={40} />
          <h3 className="text-lg font-bold text-white mb-2">Live Feeds and Forms Setup</h3>
          <p className="text-slate-400 text-sm max-w-md">
            The foundation is complete. In Phase 8 we will hook this view to display reported lost & found items and enable claims submissions.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
