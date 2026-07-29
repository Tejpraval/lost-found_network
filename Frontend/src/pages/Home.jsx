import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Shield, Bell, MessageSquare } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header / Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Retracer
            </span>
          </Link>
          <nav className="flex space-x-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-medium transition duration-200 text-sm">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-slate-300 hover:text-white font-medium transition duration-200 text-sm">
                  Log In
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-medium transition duration-200 text-sm">
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-grow flex flex-col justify-center items-center text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
          Reconnecting You with Your{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Lost Belongings
          </span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          The centralized, secure platform to report, search, claim, and return lost and found items in your community.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/login"
            className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold transition duration-200 shadow-lg shadow-indigo-950/50 flex items-center justify-center space-x-2"
          >
            <Search size={20} />
            <span>Report / Find Items</span>
          </Link>
          <Link
            to="/register"
            className="px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800/80 font-semibold transition duration-200"
          >
            Create an Account
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 transition duration-300">
            <div className="h-12 w-12 rounded-xl bg-indigo-950 flex items-center justify-center text-indigo-400 mb-4">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Claim Verification</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Finders add custom questions that claimers must answer correctly, protecting items from fraudulent claims.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 transition duration-300">
            <div className="h-12 w-12 rounded-xl bg-purple-950 flex items-center justify-center text-purple-400 mb-4">
              <Bell size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Notifications</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Receive live updates when someone comments on your item, submits an ownership claim, or verifies your return.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 transition duration-300">
            <div className="h-12 w-12 rounded-xl bg-pink-950 flex items-center justify-center text-pink-400 mb-4">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Discussion Boards</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Coordinate handovers and clarify details with chronological chat boards built directly into each listing.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-sm text-slate-500 bg-slate-950">
        <p>&copy; {new Date().getFullYear()} Retracer Network. Designed for community and trust.</p>
      </footer>
    </div>
  );
};

export default Home;
