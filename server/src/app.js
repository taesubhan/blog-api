require('dotenv').config();
const express = require('express');
const app = express();
const {postRouter} = require('./routes/postRouter');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.json({message: 'server working'});
})

app.use('/api', postRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
})