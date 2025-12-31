const jwt = require('jsonwebtoken')

const authMiddleware = (req,res,next) => {
    try {
        
    
    // 1. Token from header by jwtToken 
    const token = req.header('Authorization')?.split(' ')[1] || req.header('x-auth-token')

    // If Token issue 
    if ( !token) {
        return res.status(401).json({ msg: 'Access Denied. No token provided.' });
    }
    // token verify 
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded.user
    next(); // next function k liye

    } catch (error) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
    

}

module.exports = authMiddleware