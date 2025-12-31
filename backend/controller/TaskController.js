const Task = require('../model/Task');

// 1. Get All Tasks for logged in user
exports.getTask = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort('-createdAt');
        res.status(200).json({
            success: true,
            count: tasks.length,
            message: "Tasks fetched successfully",
            data: tasks,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Could not fetch tasks from server' });
    }
};

// 2. Create a new task
exports.createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        // 1. Title Validation (Min 3, Max 100)
        if (!title || title.trim().length < 3) {
            return res.status(400).json({ message: 'Title must be at least 3 characters long' });
        }
        if (title.length > 100) {
            return res.status(400).json({ message: 'Title cannot exceed 100 characters' });
        }

        // 2. Description Validation (Max 2000)
        if (description && description.length > 2000) {
            return res.status(400).json({ message: 'Description cannot exceed 2000 characters' });
        }

        // 3. Status & Priority Enum Validation
        const validStatuses = ['pending', 'in-progress', 'completed'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        // 4. Date Validation (Check if date is not in the past)
        if (dueDate && new Date(dueDate) < new Date().setHours(0,0,0,0)) {
            return res.status(400).json({ message: 'Due date cannot be in the past' });
        }

        const task = await Task.create({
            title: title.trim(),
            description: description ? description.trim() : '',
            status: status || 'pending',
            priority: priority || 'medium',
            dueDate: dueDate || null,
            user: req.user.id 
        });

        res.status(201).json({ success: true, message: 'Task created!', data: task });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
// 3. Update task
exports.updatetask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'You are not authorized to update this task' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ 
            success: true, 
            message: 'Task updated successfully',
            data: task 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during task update' });
    }
};

// 4. Delete task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'You are not authorized to delete this task' });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.status(200).json({ 
            success: true, 
            message: 'Task deleted successfully',
            data: {} 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error while deleting task' });
    }
};