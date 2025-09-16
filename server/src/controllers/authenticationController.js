const jwt = require('jsonwebtoken');
const {CustomAuthenticationError} = require('../errors/errorHandler');

function tokenVerify(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        throw new CustomAuthenticationError('Token not found');
    }

    const token = authHeader.split(' ')[1];
    if (!token) 
        throw new CustomAuthenticationError('Token missing');

    try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decodedUser;
        console.log('token verified!')
        next();
    } catch(err) {
        throw new CustomAuthenticationError('Invalid or expired token');
    }
}

module.exports = {
    tokenVerify
}