const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/events', async (req, res) => {
    console.log('event received in moderation service', req.body.type);
    const { type, data } = req.body;
    if (type === 'CommentCreated') {
        // moderate comment
        // console.log('>>>>>>>>>>>>>>>>>COMMENT CREATED AND IN THE MODERATE-COMMENT SERVICE NOW<<<<<<<<<<<<<<<<<<<<')
        const status = data.content.includes('mean') ? 'rejected' : 'approved';
        // console.log('>>>>>>>>>>>>>>>>>>STATUS<<<<<<<<<<<<<<<<', status);
        await axios.post('http://event-bus-srv:4005/events', {
            type:  'CommentModerated',
            data: {
                id: data.id,
                content: data.content,
                postId: data.postId,
                status
            }
        }).catch(error => { console.log('Error', error)});
    }
    res.send({});
});

app.listen(4003, () => {
    console.log('Moderate-comment Service App listening on port 4003');
});