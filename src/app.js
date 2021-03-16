const express = require('express');
const readerControllers = require('./controllers/readers');

const app = express();

app.use(express.json());

app.get('/', (req, res) =>{
    res.send("Hello, world!");
});

app.get('/readers', readerControllers.getAll);
app.get('/readers/:readerId', readerControllers.getById);
app.post('/readers', readerControllers.create);
app.patch('/readers/:readerId', readerControllers.updateById);
app.delete('/readers/:readerId', readerControllers.deleteById);

module.exports = app;