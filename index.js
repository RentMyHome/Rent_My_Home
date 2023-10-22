require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const imgRoutes = require('./api/routes/imgroute');
const userRoutes = require('./api/routes/userRoute');
const postRoutes = require('./api/routes/postRoute');

const app = express();
const PORT = process.env.PORT || 3000;
// const MONGODB = `mongodb://localhost:27017/rent`
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rent", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to database');
    })
    .catch((error) => {
        console.log(error);
        console.log('Connection failed');
    });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', userRoutes);
app.use('/', postRoutes);
app.use('/',imgRoutes);
app.use('/', (req, res) => {
    res.status(404).send('Welcome to Rent-My-Home');
});

app.listen(PORT, () => {
    console.log('Server started on port 3000');
});
