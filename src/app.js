const express = require('express');
const readercontrollers = require('./controllers/readers');

const app = express();

app.use(express.json());

app.get('/', (req, res) =>{
    res.send("Hello, world!");
});

app.post('/readers', readercontrollers.create);

module.exports = app;