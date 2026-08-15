import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import Branding from '../components/auth/Branding';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/courses', label: 'Courses' },
  { to: '/admin/batches', label: 'Batches' },
  { to: '/admin/enrollments', label: 'Enrollments' },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    dispatch(logout());
    navigate('/home');
  };

  const handleLinkClick = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#161A24] text-white relative">
      
      {/* Desktop Sidebar (Sticky/Fixed to view on scroll) */}
      <aside className="hidden md:flex w-64 flex-col border-r border-gray-700 bg-[#1A1E2A] p-6 sticky top-0 h-screen shrink-0">
        <Branding size="small" />
        <nav className="mt-10 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Sticky Header */}
        <header className="sticky top-0 flex items-center justify-between border-b border-gray-800 px-4 sm:px-8 py-4 z-30 bg-[#161A24]/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/5 border border-gray-800 text-gray-300 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Mobile-only brand mark */}
            <Link to="/admin/dashboard" className="md:hidden flex items-center gap-2 font-bold tracking-tight">
              <span className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-mono text-[10px] font-bold shadow-[0_0_10px_rgba(147,51,235,0.4)]">tz</span>
              <span className="text-white text-base font-bold">Thinkz<span className="text-purple-500">.ai</span></span>
            </Link>

            <p className="text-sm text-gray-400 hidden sm:block">Admin Console</p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button className="text-gray-500 hover:text-white transition-colors cursor-pointer">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 bg-[#112435] px-2 sm:px-4 py-2 rounded-xl text-left border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-teal-600 flex items-center justify-center text-xs text-cyan-400">
                    {(user?.name || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-[#112435]"></div>
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-400">{user?.role || 'System Admin'}</p>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform hidden sm:block ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#1A1F2B] border border-gray-800 rounded-lg shadow-xl z-20 overflow-hidden">
                  <ul className="text-sm text-gray-300">
                    <li>
                      <NavLink to="/admin/profile" onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800/60 transition-colors">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        View Profile
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/profile/edit" onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800/60 transition-colors">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit Profile
                      </NavLink>
                    </li>
                    <li className="border-t border-gray-800"></li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800/60 transition-colors text-left cursor-pointer"
                      >
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Nav Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#1A1E2A] text-white border-b border-gray-800 px-4 py-4 space-y-1 shadow-xl z-30 relative">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Main Content View with Page Scroll Support */}
        <main className="flex-1 p-4 sm:p-8 z-0">
          <Outlet />
        </main>
      </div>

      {(isDropdownOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 bg-transparent z-20"
          onClick={() => { setIsDropdownOpen(false); setIsMobileMenuOpen(false); }}
        />
      )}
    </div>
  );
}