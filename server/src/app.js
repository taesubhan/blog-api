require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const {authRouter} = require('./routes/authenticationRouter');
const {postRouter} = require('./routes/postRouter');
const {catchErrors} = require('./errors/errorHandler');

console.log(process.env.DEV_FRONTEND_URL);
app.use(cors());
const isDev = process.env.NODE_ENV === 'development';
const allowedOrigin = isDev
    ? process.env.DEV_FRONTEND_URL
    : process.env.PROD_FRONTEND_URL;
app.use(cors({
    // origin: allowedOrigin,
    origin: '*',
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type','Authorization']
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/authentication', authRouter);
app.use('/api/posts', postRouter);

app.use('/api/', (req, res) => {
    res.status(404).json({
        error_message: 'API route not found'
    })
})

app.use(catchErrors);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
})