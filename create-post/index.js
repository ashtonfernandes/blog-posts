const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

// Creating a post
app.post('/posts/create', async (req, res) => {
    // console.log('>>>>>>>>>>>>>>>>>POST CREATED AND IN THE POST SERVICE NOW<<<<<<<<<<<<<<<<<<<<');
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id,
        title
    };

    // Send event to events bus
    await axios.post('http://event-bus-srv:4005/events', {
        type: "PostCreated",
        data: {
            id,
            title
        }
    }).catch(error => { console.log('Error', error)});

    res.status(201).send(posts[id]);
});

// Confirmation of event received
app.post('/events', (req, res) => {
    console.log('event received in posts service', req.body.type);
    res.send({ status: 'OK' });
});

app.listen(4000, () => {
    console.log('Create-post Service App listening on 4000');
});