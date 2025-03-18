const express = require('express');
const mongoose = require('./database');
const Message = require('./models/Message');

const app = express();
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    try {
        const messages = await Message.find();
        res.render('index', { messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send('Error fetching messages');
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
