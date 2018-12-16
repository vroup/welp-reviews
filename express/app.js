const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

/**** Configuration ****/
const port = (process.env.PORT || 8080);
const app = express();
app.use(bodyParser.json()); // Parse JSON from the request body
app.use(morgan('combined')); // Log all requests to the console
app.use(express.static('../dist/Exam'));

// Additional headers for the response to avoid trigger CORS security
// errors in the browser
// Read more: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

/**** Mock data ****/
let data = [
  {id : 1, text : "This is some text 1", details : "Some more details 1"},
  {id : 2, text : "This is some text 2", details : "Some more details 2"},
  {id : 3, text : "This is some text 3", details : "Some more details 3"},
];

/**** Routes ****/
app.get('/api/my_data', (req, res) => res.json(data));

app.post('/api/my_data', (req, res) => {
    let text = req.body.text;
    let details = req.body.details;
    let nextId = data.reduce((acc, curr) => curr.id > acc.id ? curr : acc).id + 1;
    let newData = {
      id : nextId,
      text : text,
      details : details
    };
    data.push(newData);
    res.json(newData);
});

/**** Reroute all unknown requests to angular index.html ****/
app.get('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../dist/Exam/index.html'));
});


/**** Start ****/
app.listen(port, () => console.log(`Exam project API running on port ${port}!`));

