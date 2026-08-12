import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../features/auth/authSlice';

export default function LearnerLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  
  // Dark mode state prep for Step 2
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Toggle Dark Mode (will attach to context/redux later)
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0c0914] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Top Navigation Bar */}
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-md ${isDarkMode ? 'bg-[#151025]/80 border-purple-500/20' : 'bg-white/80 border-gray-200'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo & Main Links */}
            <div className="flex items-center gap-8">
              <Link to="/learner" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                  <span className="font-bold text-white text-xl leading-none">tz</span>
                </div>
                <span className={`font-bold text-xl tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>thinkz ai</span>
              </Link>
              
              <div className="hidden md:flex space-x-6">
                <Link to="/learner" className={`text-sm font-medium hover:text-cyan-400 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>My Dashboard</Link>
                <Link to="/learner/courses" className={`text-sm font-medium hover:text-cyan-400 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Catalog</Link>
              </div>
            </div>

            {/* Right Side: Theme Toggle & User Profile */}
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-yellow-400' : 'bg-gray-200 hover:bg-gray-300 text-indigo-900'}`}
                title="Toggle Dark Mode"
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-500/30">
                <span className={`text-sm font-medium hidden sm:block ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {user?.name || 'Learner'}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-xs uppercase tracking-wider font-bold text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Child routes (Dashboard, Course Player) will render here */}
        <Outlet /> 
      </main>

    </div>
  );
}