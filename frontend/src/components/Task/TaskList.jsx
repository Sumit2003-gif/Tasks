import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { updateTask, deleteTask } from '../../store/slices/taskSlice';
import { FaSearch, FaFilter, FaList, FaThLarge } from 'react-icons/fa';
import TaskItem from './TaskItem';
import LoadingSpinner from '../LoadingSpinner';
import { showToast } from '../../utils/toast';

const TaskList = ({ tasks, isLoading }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');

  const dispatch = useDispatch();

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateTask({ id, taskData: { status: newStatus } }));
    showToast('Task status updated', 'success');
  };

  // --- FIX: Remove window.confirm from here ---
  const handleDelete = async (id) => {
    try {
      // Ab ye function sirf dispatch karega, 
      // Confirmation modal TaskItem ke andar handle hoga
      await dispatch(deleteTask(id)).unwrap();
    } catch (error) {
      showToast(error || 'Failed to delete task', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white overflow-hidden shadow-2xl rounded-[2rem] border border-gray-100"
    >
      {/* Header Section */}
      <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Your Tasks</h3>
          
          <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full pl-11 pr-4 py-3 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter & View Mode */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full pl-11 pr-8 py-3 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold appearance-none transition-all cursor-pointer"
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="hidden lg:flex bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <FaList size={16} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <FaThLarge size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FaList className="text-gray-300 text-2xl" />
            </div>
            <p className="text-gray-500 font-bold text-lg">No tasks found</p>
            <p className="text-gray-400 text-sm">Try changing filters or search terms.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4 max-w-4xl mx-auto'}>
            <AnimatePresence mode='popLayout'>
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  viewMode={viewMode}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskList;