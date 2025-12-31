const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getTask, createTask, updatetask, deleteTask } = require("../controller/TaskController");
const router = express.Router()

router.get('/', authMiddleware, getTask );
router.post('/', authMiddleware, createTask);
router.put('/:id', authMiddleware, updatetask);
router.delete('/:id', authMiddleware, deleteTask);

module.exports = router