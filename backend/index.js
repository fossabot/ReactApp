const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const controller = require('./controller.js');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

// @parameter e.g name
app.get('/api/pokemon', (req, res) => {
  
  // REST View-Consuming
  const name = req.query.name;
  console.log('Front-End Request Received: ' + name);
  
  // REST Interaction
  var messageContent = 'dummy'
  var messageRest = controller.getPokemon(name);
  console.log("REST Interaction Result: " + messageRest);
  
  // Process Promise from REST Interaction for Response
  // messageRest.then(response => console.log('Content of Controller Feedback: ' + response))
  // .then(response =>(
    // console.log('Code')
  // ))
  // .catch(error => console.log('Error: ' + error));

  // REST Ouput-View
  res.setHeader('Content-Type', 'application/json');
  var message = JSON.stringify({ pokemon: `Hello ${name}!`, message : messageContent });
  res.send(message);
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);