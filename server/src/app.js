require('dotenv').config();
const express = require('express');
const app = express();
const {authRouter} = require('./routes/authenticationRouter');
const {postRouter} = require('./routes/postRouter');
const {catchErrors} = require('./errors/errorHandler');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/authentication', authRouter);
app.use('/api/posts', postRouter);

app.use(catchErrors);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
})