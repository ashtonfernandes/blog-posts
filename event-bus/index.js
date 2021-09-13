const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const events = [];

// Events post handler
app.post('/events', (req, res) => {
  // console.log('>>>>>>>>>>>>>>>>>EVENT RECEIVED AND IN THE EVENTS BUS SERVICE NOW<<<<<<<<<<<<<<<<<<<<');
  const event = req.body;
  events.push(event);

  // Emit events to all services
  axios.post('http://create-post-clusterip-srv:4000/events', event).catch(error => { console.log('Error', error.message) }); // create-post service
  axios.post('http://create-comment-srv:4001/events', event).catch(error => { console.log('Error', error.message) }); // create-comment service
  axios.post('http://query-srv:4002/events', event).catch(error => { console.log('Error', error.message) }); // query service
  axios.post('http://moderate-comment-srv:4003/events', event).catch(error => { console.log('Error', error.message) }); // moderate-comment service

  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log('Event-bus Service App is listening on port 4005');
})