import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerUser, reset } from '../store/slices/authSlice';
import { showToast } from '../utils/toast';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaEye, FaEyeSlash, FaCheckCircle, FaCircle, FaExclamationCircle } from 'react-icons/fa';

const registerSchema = z.object({
  username: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Uppercase required")
    .regex(/[a-z]/, "Lowercase required")
    .regex(/[0-9]/, "Number required")
    .regex(/[@$!%*?&]/, "Special character required"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Register = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange"
  });

  const passwordValue = watch("password", "");

  const checks = [
    { label: "8+ characters", met: passwordValue.length >= 8 },
    { label: "One uppercase", met: /[A-Z]/.test(passwordValue) },
    { label: "One lowercase", met: /[a-z]/.test(passwordValue) },
    { label: "One number", met: /[0-9]/.test(passwordValue) },
    { label: "One special character", met: /[@$!%*?&]/.test(passwordValue) },
  ];

  useEffect(() => {
    if (isError) {
      showToast(message, 'error');
      dispatch(reset()); // State reset turant karein
    }
    if (isSuccess) {
      showToast("Account created successfully!", 'success');
      navigate('/dashboard'); // Direct dashboard bhejein
      dispatch(reset());
    }
  }, [isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = (data) => {
    const { confirmPassword, ...registerData } = data;
    dispatch(registerUser(registerData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-md w-full"
      >
        <div className="text-center mb-6">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto shadow-lg shadow-blue-200 mb-4">
            <FaUserPlus />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h2>
          <p className="text-gray-500 mt-1">Join us and start managing your tasks</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 space-y-4">
          
          {/* Username */}
          <div className="space-y-1">
            <div className="relative">
              <FaUser className={`absolute left-4 top-4 transition-colors ${errors.username ? 'text-red-400' : 'text-gray-400'}`} />
              <input 
                {...register("username")} 
                placeholder="Username" 
                className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-xl outline-none transition-all ${errors.username ? 'border-red-400 bg-red-50 focus:ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'}`} 
              />
            </div>
            <AnimatePresence>
              {errors.username && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-red-500 text-[11px] flex items-center gap-1 px-1">
                  <FaExclamationCircle /> {errors.username.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <div className="relative">
              <FaEnvelope className={`absolute left-4 top-4 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
              <input 
                {...register("email")} 
                placeholder="Email Address" 
                className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-xl outline-none transition-all ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'}`} 
              />
            </div>
            {errors.email && <p className="text-red-500 text-[11px] px-1 flex items-center gap-1"><FaExclamationCircle /> {errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="relative">
              <FaLock className={`absolute left-4 top-4 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
              <input 
                {...register("password")}
                type={showPass ? "text" : "password"}
                placeholder="Password"
                className={`w-full pl-11 pr-12 py-3.5 bg-gray-50 border rounded-xl outline-none transition-all ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'}`}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-4 text-gray-400 hover:text-blue-600 transition-colors">
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              {checks.map((check, index) => (
                <div key={index} className="flex items-center gap-2">
                  {check.met ? (
                    <FaCheckCircle className="text-green-500 text-[10px]" />
                  ) : (
                    <FaCircle className="text-gray-300 text-[8px]" />
                  )}
                  <span className={`text-[10px] font-bold ${check.met ? 'text-green-600' : 'text-gray-400'}`}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <div className="relative">
              <FaLock className={`absolute left-4 top-4 transition-colors ${errors.confirmPassword ? 'text-red-400' : 'text-gray-400'}`} />
              <input 
                {...register("confirmPassword")}
                type={showConfirmPass ? "text" : "password"}
                placeholder="Confirm Password"
                className={`w-full pl-11 pr-12 py-3.5 bg-gray-50 border rounded-xl outline-none transition-all ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'}`}
              />
              <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-4 text-gray-400 hover:text-blue-600">
                {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-[11px] px-1 flex items-center gap-1"><FaExclamationCircle /> {errors.confirmPassword.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-black text-white transition-all shadow-lg active:scale-95 ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : 'Get Started'}
          </button>

          <p className="text-center text-sm text-gray-500 pt-2">
            Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;