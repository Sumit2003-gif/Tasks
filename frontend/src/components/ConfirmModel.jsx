import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaTrashAlt } from 'react-icons/fa';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
      >
        <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaExclamationTriangle className="text-red-500 text-3xl" />
        </div>
        
        <h3 className="text-2xl font-black text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-8 leading-relaxed">{message}</p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2"
          >
            <FaTrashAlt /> Yes, Delete it
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 py-4 rounded-2xl font-bold transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmModal;