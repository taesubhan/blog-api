const {Router} = require('express');
const authRouter = Router();
const {signUp, login, tokenVerify} = require('../controllers/authenticationController');


authRouter.post('/sign-up', signUp);
authRouter.post('/login', login);
authRouter.get('/verify', tokenVerify, (req, res) => {
    res.json({
        verified: true,
        user: req.user
    });
});

module.exports = {
    authRouter
}