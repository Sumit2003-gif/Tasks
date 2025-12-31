import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks, reset as taskReset } from '../store/slices/taskSlice';
import TaskForm from '../components/Task/Taskform';
import TaskList from '../components/Task/TaskList';
import Navbar from '../components/Navbar'; // Aapka Navbar use karein
import { FaTasks, FaCheckCircle, FaSpinner, FaLayerGroup } from 'react-icons/fa';
import { showToast } from '../utils/toast';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { tasks, isLoading, isError, message } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (isError) showToast(message, 'error');
    dispatch(getTasks());
    return () => dispatch(taskReset());
  }, [isError, message, dispatch]);

  const stats = [
    { label: 'Total Tasks', count: tasks.length, icon: <FaLayerGroup />, color: 'bg-blue-500' },
    { label: 'Pending', count: tasks.filter(t => t.status === 'pending').length, icon: <FaSpinner />, color: 'bg-yellow-500' },
    { label: 'Completed', count: tasks.filter(t => t.status === 'completed').length, icon: <FaCheckCircle />, color: 'bg-green-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> 
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
            >
              <div className={`${stat.color} p-4 rounded-xl text-white text-xl`}>{stat.icon}</div>
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.count}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1"><TaskForm /></div>
          <div className="lg:col-span-2 text-gray-800"><TaskList tasks={tasks} isLoading={isLoading} /></div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;