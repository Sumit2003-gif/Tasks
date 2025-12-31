const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Register New User
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        user = new User({ username, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };
        
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ 
                    message: 'Registration successful!',
                    token, 
                    user: { 
                        id: user.id, 
                        username: user.username, 
                        email: user.email 
                    } 
                });
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error during registration' });
    }
};

// 2. Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    message: `Welcome back, ${user.username}!`,
                    token, 
                    user: { 
                        id: user.id, 
                        username: user.username, 
                        email: user.email 
                    }
                }); 
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server Error during login' });
    }
};

// 3. Get User data
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Could not fetch user profile' });
    }
};

// 4. Update User Data
exports.updateUser = async (req, res) => {
    try {
        const { username, email, bio, phoneNumber, location } = req.body;
        
        const userFields = {};
        if (username) userFields.username = username;
        if (email) userFields.email = email;
        if (bio !== undefined) userFields.bio = bio; 
        if (phoneNumber !== undefined) userFields.phoneNumber = phoneNumber;
        if (location !== undefined) userFields.location = location;

        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User account not found' });
        }

        user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: userFields },
            { new: true, runValidators: true } 
        ).select('-password');

        res.json({ 
            message: 'Profile updated successfully', 
            user 
        });
    } catch (error) {
        console.error("Update Error:", error.message);
        res.status(500).json({ message: 'Error updating profile data' });
    }
};