import { FaTrash, FaClock, FaCheckCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { deleteTask, updateTask } from '../../store/slices/taskSlice';

const TaskCard = ({ task }) => {
  const dispatch = useDispatch();

  const toggleStatus = () => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    dispatch(updateTask({ id: task._id, taskData: { status: newStatus } }));
  };

  return (
    <div className={`p-5 rounded-2xl border bg-white transition-all shadow-sm hover:shadow-md ${task.status === 'completed' ? 'border-green-100 bg-green-50/30' : 'border-gray-100'}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className={`font-semibold text-lg ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {task.title}
        </h3>
        <button onClick={() => dispatch(deleteTask(task._id))} className="text-gray-300 hover:text-red-500 transition-colors">
          <FaTrash size={14} />
        </button>
      </div>
      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center justify-between mt-auto">
        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${task.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
          {task.status}
        </span>
        <button 
          onClick={toggleStatus}
          className={`p-2 rounded-full transition-colors ${task.status === 'completed' ? 'text-green-500' : 'text-blue-500 hover:bg-blue-50'}`}
        >
          {task.status === 'completed' ? <FaCheckCircle size={20}/> : <FaClock size={20}/>}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;