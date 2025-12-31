import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEdit, FaTrash, FaCheck, FaClock, 
  FaHourglassHalf, FaCalendarAlt, FaTimes 
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { updateTask } from '../../store/slices/taskSlice';
import { showToast } from '../../utils/toast';
import ConfirmModal from '../ConfirmModel';

const TaskItem = ({ task, onStatusChange, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
  });

  const dispatch = useDispatch();

  const handleEdit = () => setIsEditing(true);
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
    });
  };

  const handleSave = async () => {
    if (!editForm.title.trim() || editForm.title.length < 3) {
      showToast('Title must be at least 3 characters', 'error');
      return;
    }
    try {
      await dispatch(updateTask({ id: task._id, taskData: editForm })).unwrap();
      setIsEditing(false);
      showToast('Task updated successfully!', 'success');
    } catch (error) {
      showToast(error || 'Failed to update task', 'error');
    }
  };

  const confirmDelete = () => {
    onDelete(task._id);
    setIsModalOpen(false);
  };

  const onChange = (e) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getPriorityColor = (p) => {
    const colors = { 
        high: 'bg-red-500 text-white shadow-red-100', 
        medium: 'bg-yellow-500 text-white shadow-yellow-100', 
        low: 'bg-green-500 text-white shadow-green-100' 
    };
    return colors[p] || 'bg-gray-500 text-white';
  };

  const getStatusIcon = (s) => {
    if(s === 'completed') return <FaCheck className="text-green-500" />;
    if(s === 'in-progress') return <FaHourglassHalf className="text-blue-500" />;
    return <FaClock className="text-gray-400" />;
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
      >
        <AnimatePresence mode="wait">
          {isEditing ? (
            // EDIT MODE 
            <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-4 bg-indigo-50/20">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-indigo-900">Edit Task</h3>
                <button onClick={handleCancel} className="bg-white p-2 rounded-full text-gray-400 hover:text-red-500 shadow-sm transition-colors">
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  name="title"
                  value={editForm.title}
                  onChange={onChange}
                  className="w-full px-5 py-3.5 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                  placeholder="Task title"
                />
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={onChange}
                  rows="3"
                  className="w-full px-5 py-3.5 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  placeholder="Details..."
                />
                <div className="grid grid-cols-2 gap-3">
                  <select name="priority" value={editForm.priority} onChange={onChange} className="px-4 py-3 rounded-2xl border-none bg-white shadow-sm font-bold text-gray-600 outline-none">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <input type="date" name="dueDate" value={editForm.dueDate} onChange={onChange} className="px-4 py-3 rounded-2xl border-none bg-white shadow-sm font-bold text-gray-600 outline-none" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-3.5 rounded-2xl font-black shadow-lg shadow-indigo-100 active:scale-95 transition-all">Save</button>
                <button onClick={handleCancel} className="px-6 bg-white text-gray-400 py-3.5 rounded-2xl font-bold border border-gray-100 transition-all">Cancel</button>
              </div>
            </motion.div>
          ) : (
            /* --- VIEW MODE --- */
            <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  
                  {/* FIX: Mobile par buttons hamesha dikhenge, Desktop par hover par */}
                  <div className="flex gap-1 sm:gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <button onClick={handleEdit} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white active:scale-90 transition-all">
                      <FaEdit size={16} />
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white active:scale-90 transition-all">
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <div className="min-w-[20px]">{getStatusIcon(task.status)}</div>
                  <h4 className={`font-black text-gray-800 text-lg leading-tight ${task.status === 'completed' ? 'line-through text-gray-300' : ''}`}>
                    {task.title}
                  </h4>
                </div>

                <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2 font-medium">
                  {task.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] font-black text-gray-400 uppercase">
                  {task.dueDate && (
                    <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg whitespace-nowrap">
                      <FaCalendarAlt /> {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  <span className="bg-gray-50 px-3 py-1.5 rounded-lg">{task.status.replace('-', ' ')}</span>
                </div>
              </div>

              {/* Status Toggles */}
              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex gap-1.5">
                {['pending', 'in-progress', 'completed'].map((s) => (
                  <button
                    key={s}
                    onClick={() => onStatusChange(task._id, s)}
                    className={`flex-1 py-2.5 text-[9px] font-black uppercase rounded-xl transition-all ${
                      task.status === s 
                        ? 'bg-white shadow-sm border border-gray-100 text-indigo-600' 
                        : 'text-gray-300 hover:text-gray-500'
                    }`}
                  >
                    {s.split('-')[0]}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <ConfirmModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={confirmDelete}
            title="Delete Task?"
            message="Are you sure you want to remove this task? This cannot be undone."
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default TaskItem;