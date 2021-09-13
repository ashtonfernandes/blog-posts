const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

const handleEvent = (type,  data) => {
  if (type === "PostCreated") {
    // console.log('>>>>>>>>>>>>>>>>>PostCreated IN THE QUERY SERVICE NOW<<<<<<<<<<<<<<<<<<<<');
    const { id, title } = data;
    posts[id] = { id, title, comments: [] }
  }

  if (type === "CommentCreated") {
    // console.log('>>>>>>>>>>>>>>>>>CommentCreated IN THE QUERY SERVICE NOW<<<<<<<<<<<<<<<<<<<<');
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status })
  }

  if (type === 'CommentUpdated') {
    // console.log('>>>>>>>>>>>>>>>>>CommentUpdated IN THE QUERY SERVICE NOW<<<<<<<<<<<<<<<<<<<<');
    const { id, postId, content, status } = data;
    const post = posts[postId];
    const comment = post.comments.find(comment => {
      return comment.id === id;
    });
    comment.content = content;
    comment.status = status
  }
}

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  console.log('event received in query service', req.body.type);
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({});
});

app.listen(4002, async () => {
  console.log('Query Service App is listening on port 4002!');

  const res = await axios.get('http://event-bus-srv:4005/events');

  for (let event of res.data) {
    console.log('PROCESSING EVENT', event.type);
    handleEvent(event.type, event.data);
  }
});