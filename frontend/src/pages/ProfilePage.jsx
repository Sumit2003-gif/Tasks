import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import authService from '../service/authService';
import { showToast } from '../utils/toast';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft, FaSave, FaSpinner, FaUser, 
  FaPen, FaPhone, FaMapMarkerAlt, FaTimes, FaEdit 
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const userData = user?.user || user;
    
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form States
    const [formData, setFormData] = useState({
        username: userData?.username || '',
        bio: userData?.bio || '',
        phoneNumber: userData?.phoneNumber || '',
        location: userData?.location || ''
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                username: userData.username || '',
                bio: userData.bio || '',
                phoneNumber: userData.phoneNumber || '',
                location: userData.location || ''
            });
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        // Client-side Validation Check
        if (formData.username.trim().length < 3) {
            return showToast("Username must be at least 3 characters", "error");
        }
        if (formData.bio.length > 160) {
            return showToast("Bio cannot exceed 160 characters", "error");
        }

        setLoading(true);
        try {
            const token = user?.token || localStorage.getItem('token');
            
            // Backend API call
            await authService.updateProfile(formData, token);
            
            // Success: Update LocalStorage
            const finalUserData = { 
                ...user, 
                user: { ...userData, ...formData } 
            };
            localStorage.setItem('user', JSON.stringify(finalUserData));
            
            showToast("Profile Updated Successfully!", "success");
            setIsEditing(false);
        } catch (err) {
            // Backend validation errors (express-validator) handle karna
            const backendErrors = err.response?.data?.errors;
            const errorMessage = err.response?.data?.message;

            if (backendErrors && Array.isArray(backendErrors)) {
                showToast(backendErrors[0], "error");
            } else if (errorMessage) {
                showToast(errorMessage, "error");
            } else {
                showToast("Update Failed. Please try again.", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
            <motion.div layout className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
                
                {/* Header */}
                <div className="bg-indigo-600 p-10 text-white text-center relative">
                    <Link title="Back" to="/dashboard" className="absolute top-8 left-8 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                        <FaArrowLeft size={16} />
                    </Link>
                    <div className="h-24 w-24 bg-white shadow-xl rounded-full mx-auto flex items-center justify-center text-4xl font-black text-indigo-600 border-4 border-indigo-400 mb-4">
                        {formData.username.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-2xl font-black">{isEditing ? "Edit Profile" : formData.username}</h2>
                    <p className="text-indigo-100 text-sm">{userData?.email}</p>
                </div>

                <AnimatePresence mode="wait">
                    {!isEditing ? (
                        /* --- VIEW MODE --- */
                        <motion.div 
                            key="view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="p-10 space-y-8"
                        >
                            <div className="grid grid-cols-1 gap-6">
                                <ProfileDetail icon={<FaUser />} label="Full Name" value={formData.username} />
                                <ProfileDetail icon={<FaPhone />} label="Phone" value={formData.phoneNumber || 'Not provided'} />
                                <ProfileDetail icon={<FaMapMarkerAlt />} label="Location" value={formData.location || 'Not set'} />
                                <ProfileDetail icon={<FaPen />} label="Bio" value={formData.bio || 'No bio added yet.'} />
                            </div>

                            <button 
                                onClick={() => setIsEditing(true)}
                                className="w-full bg-indigo-50 text-indigo-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                            >
                                <FaEdit /> EDIT PROFILE
                            </button>
                        </motion.div>
                    ) : (
                        /* --- EDIT MODE (FORM) --- */
                        <motion.div 
                            key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="p-10"
                        >
                            <form onSubmit={handleUpdate} className="space-y-5">
                                <div className="space-y-4">
                                    <InputField label="Username" icon={<FaUser />} value={formData.username} onChange={(v) => setFormData({...formData, username: v})} />
                                    <InputField label="Phone" icon={<FaPhone />} value={formData.phoneNumber} onChange={(v) => setFormData({...formData, phoneNumber: v})} />
                                    <InputField label="Location" icon={<FaMapMarkerAlt />} value={formData.location} onChange={(v) => setFormData({...formData, location: v})} />
                                    
                                    {/* BIO TEXTAREA WITH CHARACTER COUNTER */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center ml-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bio</label>
                                            <span className={`text-[10px] font-bold ${formData.bio.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                                                {formData.bio.length} / 160
                                            </span>
                                        </div>
                                        <textarea 
                                            value={formData.bio} 
                                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                            className={`w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 font-medium transition-all resize-none ${
                                                formData.bio.length > 160 ? 'focus:ring-red-500 bg-red-50 text-red-600' : 'focus:ring-indigo-500 text-gray-700'
                                            }`} 
                                            rows="3"
                                            placeholder="Tell us about yourself..."
                                        />
                                        {formData.bio.length > 160 && (
                                            <p className="text-[10px] text-red-500 font-bold ml-1 italic animate-pulse">
                                                * Character limit exceeded!
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button 
                                        type="submit" disabled={loading || formData.bio.length > 160}
                                        className="flex-1 bg-indigo-600 disabled:bg-gray-300 text-white py-4 rounded-2xl font-black shadow-lg flex justify-center items-center gap-2 active:scale-95 transition-all"
                                    >
                                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />} SAVE CHANGES
                                    </button>
                                    <button 
                                        type="button" onClick={() => setIsEditing(false)}
                                        className="px-6 bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

// Helper Component for View Mode
const ProfileDetail = ({ icon, label, value }) => (
    <div className="flex items-start gap-4 group">
        <div className="p-3 bg-gray-50 rounded-xl text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">{icon}</div>
        <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
            <p className="text-gray-700 font-bold leading-tight">{value}</p>
        </div>
    </div>
);

// Helper Component for Edit Mode
const InputField = ({ label, icon, value, onChange }) => (
    <div className="space-y-1">
        <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">{label}</label>
        <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">{icon}</span>
            <input 
                type="text" value={value} onChange={(e) => onChange(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-700 transition-all"
                placeholder={`Enter ${label}`}
            />
        </div>
    </div>
);

export default ProfilePage;