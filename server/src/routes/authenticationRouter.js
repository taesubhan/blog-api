const {Router} = require('express');
const authRouter = Router();
const {CustomAuthenticationError} = require('../errors/errorHandler');
const db = require('../database/query/authQuery.js')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const tokenExpiresIn = '1hr';

authRouter.post('/sign-up', async (req, res) => {
    const {fullName, userName, password, passwordConfirm} = req.body;

    if (!fullName || !userName || !password) {
        throw new CustomAuthenticationError('Missing fields');
    }
    if (!!(await db.getUser(userName))) {
        throw new CustomAuthenticationError(`'${userName}' already exists`);
    }
    if (password !== passwordConfirm) {
        throw new CustomAuthenticationError('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userID = await db.createNewUser(fullName, userName, hashedPassword);
    if (!userID) {
        throw new CustomInternalServerError('Unknown server error. User ID not returned');
    }

    res.json({user_id: userID});
})

authRouter.post('/login', async (req, res) => {
    const {userName, password} = req.body;
    if (!userName || !password) {
        throw new CustomAuthenticationError('Missing fields');
    }

    const user = await db.getUser(userName);
    if (!user) {
        throw new CustomAuthenticationError('Invalid username or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new CustomAuthenticationError('Invalid username or password');
    }

    const token = jwt.sign({
        username: user.username,
        userID: user.id
    }
    ,process.env.JWT_SECRET_KEY
    ,{expiresIn: tokenExpiresIn})

    res.json({message: 'successfully logged in!', token});
})

module.exports = {
    authRouter
}