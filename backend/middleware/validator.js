const { check, validationResult } = require('express-validator');

// 1. Profile Update Validation Rules
exports.validateProfile = [
    check('username')
        .notEmpty().withMessage('Username cannot be empty')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .trim(),
    
    check('bio')
        .optional({ checkFalsy: true }) // Agar empty ho toh ignore karega, varna check karega
        .isLength({ max: 160 }).withMessage('Bio cannot exceed 160 characters'),
    
    check('phoneNumber')
        .optional({ checkFalsy: true })
        .isMobilePhone().withMessage('Please provide a valid phone number'),

    check('location')
        .optional({ checkFalsy: true })
        .isString().withMessage('Location must be a string'),

    // 2. Middleware function to catch errors
    (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    success: false, 
                    errors: errors.array().map(err => err.msg) 
                });
            }
            next(); 
        } catch (error) {
            // Agar middleware mein koi internal error aa jaye
            console.error("Validation Middleware Error:", error);
            res.status(500).json({ 
                success: false, 
                message: "Internal Server Error during validation" 
            });
        }
    }
];
