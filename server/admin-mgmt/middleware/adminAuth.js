const jwt = require('jsonwebtoken');
const User = require('../../user-mgmt/models/user');

const adminAuth = async (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;

        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        next();
    } catch (err) {
        console.error('Authentication error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = adminAuth;