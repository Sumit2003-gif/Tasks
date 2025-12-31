import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEnvelope, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux'; // useSelector add kiya
import { logout } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const [showProfile, setShowProfile] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Direct Redux se data lena hamesha updated rehta hai
  const { user } = useSelector((state) => state.auth);
  const currentUser = user?.user || user;
  
  const displayUsername = currentUser?.username || 'User';
  const displayEmail = currentUser?.email || 'email@example.com';

  const onLogout = () => {
    dispatch(logout());
    setShowProfile(false);
    navigate('/login');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowProfile(!showProfile)}
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-all focus:ring-2 focus:ring-blue-500"
      >
        <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
          {displayUsername.charAt(0).toUpperCase()}
        </div>
        <div className="hidden md:flex flex-col items-start leading-tight">
          <span className="text-sm font-bold text-gray-800">{displayUsername}</span>
          <span className="text-[10px] text-gray-500 uppercase font-semibold">Active</span>
        </div>
      </button>

      <AnimatePresence>
        {showProfile && (
          <>
            {/* Backdrop taaki bahar click karne pe band ho jaye */}
            <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)}></div>
            
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
            >
              <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {displayUsername.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate">{displayUsername}</p>
                    <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-2">
                <Link 
                  to="/profile" 
                  onClick={() => setShowProfile(false)}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                >
                  <FaCog className="mr-3" /> Account Settings
                </Link>
                
                <button
                  onClick={onLogout}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <FaSignOutAlt className="mr-3" /> Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;