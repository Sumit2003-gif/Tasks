import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTasks, FaSignOutAlt, FaUserEdit, FaChevronDown } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const userData = user?.user || user; 
  const username = userData?.username || "User";
  const email = userData?.email || "";

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              <FaTasks size={18} />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-800">
              Task<span className="text-blue-600">Flow</span>
            </span>
          </Link>

          {/* User Profile Section */}
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 p-1 pl-1 pr-3 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-gray-800 leading-none">{username}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Account</p>
              </div>
              <FaChevronDown size={10} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isOpen && (
                <>
                  {/* Overlay to close when clicking outside */}
                  <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)}></div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 overflow-hidden"
                  >
                    {/* Mini Profile Header */}
                    <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50 mb-1">
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Logged in as</p>
                       <p className="text-sm font-semibold text-gray-800 truncate">{email}</p>
                    </div>

                    <Link 
                      to="/profile" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <FaUserEdit className="opacity-70" /> Profile Settings
                    </Link>

                    <hr className="my-1 border-gray-50" />

                    <button 
                      onClick={onLogout} 
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt className="opacity-70" /> Logout
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;