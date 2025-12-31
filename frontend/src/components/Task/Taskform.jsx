import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from '../../store/slices/taskSlice';
import { FaPlus, FaPen, FaCalendarAlt, FaFlag } from 'react-icons/fa';

const TaskForm = () => {
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '',
    priority: 'medium',
    dueDate: '' 
  });

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createTask(formData));
    setFormData({ title: '', description: '', priority: 'medium', dueDate: '' });
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <FaPen size={18} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Add New Task</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Title Field */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Task Title</label>
          <input 
            type="text" required
            placeholder="e.g. Design Landing Page"
            className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
            value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        {/* Description Field */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Description</label>
          <textarea 
            rows="2"
            placeholder="What needs to be done?"
            className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none"
            value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Priority Field  */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
              <FaFlag size={10} /> Priority
            </label>
            <select 
              className="w-full mt-1 px-3 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Due Date Field */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
              <FaCalendarAlt size={10} /> Due Date
            </label>
            <input 
              type="date"
              className="w-full mt-1 px-3 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 mt-2"
        >
          <FaPlus size={14} /> Create Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;