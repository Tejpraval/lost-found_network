import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, LogOut, User } from 'lucide-react';
import api from '../utils/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data.notifications);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
      return () => clearInterval(interval);
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          Retracer
        </Link>

        <div className="flex items-center space-x-6">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-5 w-5 bg-red-600 rounded-full text-xs font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl z-50">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                  <h4 className="text-sm font-bold text-white">Notifications</h4>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs text-indigo-400 hover:underline">
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-slate-500 text-xs py-4 text-center">No notifications yet</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => markAsRead(n._id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                          n.isRead ? 'bg-slate-900 border-slate-800' : 'bg-indigo-950/20 border-indigo-900 text-indigo-100'
                        }`}
                      >
                        <Link to={`/items/${n.item?._id}`} className="block">
                          <p className="text-xs font-semibold text-white">
                            {n.sender?.name} {n.type === 'comment_created' ? 'commented on' : n.type === 'claim_created' ? 'claimed' : n.type === 'claim_approved' ? 'approved' : 'rejected'} "{n.item?.title}"
                          </p>
                          <span className="text-[10px] text-slate-500 block mt-1">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account Info */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white leading-none">{user?.name}</p>
              <span className="text-[10px] text-slate-500 block mt-1 capitalize">{user?.role}</span>
            </div>
            <button onClick={logout} className="p-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-slate-800/40 transition">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
