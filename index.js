// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// check timestamp is a valid number
function validateTimestamp(input) {
  const unixTimestampPattern = /^\d+$/;
  if (unixTimestampPattern.test(input)) {
    // Unix timestamp detected, convert it to a Date object
    const timestamp = parseInt(input);
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) {
      // Valid Unix timestamp
      return true;
    }
  }
  // Invalid input
  return false;
};

// check date is a valid YYYY-MM-DD , where MM and DD could be single or double digit, start by zero
function validateDate(input) {
  // Check if the input matches the date format (YYYY-MM-DD)
  const dateFormatPattern = /^\d{4}-(0\d|1[0-2])-([0-2]\d|3[01])$/;
  if (dateFormatPattern.test(input)) {
    // Date format detected, parse it using Date object
    const date = new Date(input);
    if (!isNaN(date.getTime())) {
      // Valid date format
      return true;
    }
  }
  // Invalid input
  return false;
};

// your first API endpoint... 
app.get("/api/:dateOrTimestamp", function (req, res, next) {
  if (validateTimestamp(req.params.dateOrTimestamp)) {
    req.unix = parseInt(req.params.dateOrTimestamp);
    req.utc = new Date(req.unix).toUTCString();
    req.invalidDate = false;
  } else if (validateDate(req.params.dateOrTimestamp)) {
    var newDate = new Date(req.params.dateOrTimestamp);
    req.unix = newDate.getTime();
    req.utc = newDate.toUTCString();
    req.invalidDate = false;
  } else {
    var date = new Date(req.params.dateOrTimestamp);
    if (isNaN(date)) {
      req.invalidDate = true;
    } else {
      req.unix = date.getTime();
      req.utc = newDate.toUTCString();
      req.invalidDate = false;
    }
  };
  console.log(req.params.dateOrTimestamp);
  next();
}, function(req, res) {
    if (req.invalidDate) {
      res.json({error: "Invalid Date"});
    } else {
      res.json({unix: req.unix, utc: req.utc});  
    }    
});

// handle empty input for /api
app.get("/api", function (req, res){
  var newDate = new Date();
  newUnix = newDate.getTime();
  newUtc = newDate.toUTCString();
  res.json({unix: newUnix, utc: newUtc})
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
