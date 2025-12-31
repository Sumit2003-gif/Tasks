const express = require("express")
const { registerUser, loginUser, getUser, updateUser } = require("../controller/authController")
const authMiddleware = require("../middleware/authMiddleware")
const { validateProfile } = require("../middleware/validator")
const router = express.Router()

router.post('/register',registerUser)

router.post('/login',loginUser)

router.get('/user', authMiddleware, getUser)

router.put('/update',authMiddleware,validateProfile,updateUser)
module.exports = router