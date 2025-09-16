const {Router} = require('express');
const authRouter = Router();
const {signUp, login} = require('../controllers/authenticationController');


authRouter.post('/sign-up', signUp);
authRouter.post('/login', login);

module.exports = {
    authRouter
}