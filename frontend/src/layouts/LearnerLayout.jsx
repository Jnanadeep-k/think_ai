import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../features/auth/authSlice';
import { useTheme } from '../components/ThemeContext';
import NotificationCenter from '../components/notifications/NotificationCenter';

export default function LearnerLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { isDarkMode, toggleTheme } = useTheme();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === 'Admin' || user?.role === 'ADMIN' || user?.isAdmin;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen h-screen flex flex-col overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0b0e14] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

      {/* Top Navigation Bar */}
      <header className="shrink-0 z-50 border-b backdrop-blur-md bg-[#0b0e14] border-white/10 text-slate-100 transition-colors duration-300">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo, Desktop Nav Links & Admin Return Button */}
            <div className="flex items-center gap-6 sm:gap-8">
              <Link to="/learner" className="flex items-center gap-2.5 font-bold tracking-tight text-lg">
                <span className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-mono text-xs font-bold shadow-[0_0_12px_rgba(147,51,235,0.4)]">tz</span>
                <span className="text-white tracking-normal font-bold text-xl">Thinkz<span className="text-purple-500 font-bold">.ai</span></span>
              </Link>

              <nav className="hidden md:flex items-center space-x-6">
                <Link to="/learner" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">My Dashboard</Link>
                <Link to="/learner/courses" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Courses</Link>
                <Link to="/learner/assignments" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Assignments</Link>
                <Link to="/learner/playground" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Playground</Link>
                <Link to="/learner/certificates" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Certificates</Link>
                <Link to="/learner/live" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Live Classes</Link>
              </nav>
            </div>

            {/* Right Side Tools */}
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 transition-colors text-xs font-semibold cursor-pointer"
                  title="Switch back to Admin Console"
                >
                  <span>&larr; Admin Console</span>
                </button>
              )}

              <NotificationCenter />

              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-full transition-colors bg-white/5 hover:bg-white/10 text-amber-400 cursor-pointer text-xs"
                title="Toggle Theme"
              >
                {isDarkMode ? '☀️ Light' : '🌙 Dark'}
              </button>

              <div className="flex items-center gap-3 pl-2 sm:pl-4 sm:border-l sm:border-white/10">
                <span className="text-sm font-medium hidden sm:block text-slate-200">
                  {user?.name || 'Alex Rivera'}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs uppercase tracking-wider font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer hidden sm:block"
                >
                  Logout
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white focus:outline-none cursor-pointer"
                aria-label="Toggle Menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0b0e14] text-slate-100 border-b border-white/10 px-4 py-4 space-y-3 shadow-xl">
            {isAdmin && (
              <button
                onClick={() => { handleLinkClick(); navigate('/admin/dashboard'); }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-purple-600/20 text-purple-300 border border-purple-500/30"
              >
                &larr; Back to Admin Console
              </button>
            )}
            <Link to="/learner" onClick={handleLinkClick} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white">My Dashboard</Link>
            <Link to="/learner/courses" onClick={handleLinkClick} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white">Courses</Link>
            <Link to="/learner/assignments" onClick={handleLinkClick} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white">Assignments</Link>
            <Link to="/learner/playground" onClick={handleLinkClick} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white">Playground</Link>
            <Link to="/learner/certificates" onClick={handleLinkClick} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white">Certificates</Link>

          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>

    </div>
  );
}