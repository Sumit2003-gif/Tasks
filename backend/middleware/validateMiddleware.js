exports.validateRegister = (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ msg: "All fields are required" });
    }
    if (password.length < 6) {
        return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }
    next();
};