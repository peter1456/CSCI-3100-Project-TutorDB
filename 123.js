var express = require('express');
var app = express();
var morgan = require('morgan');

var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/user');
var User = require("./user");

app.use(morgan('dev')); 
app.use(bodyParser.urlencoded({
	extended: true
  }));

app.get('/', (req, res) => {
  User.find({sex: "male"}, (err, info) => {
    console.log("finding male");
    console.log(info);
  });
  User.find({timeAvai}, (err, info) => {
    console.log("finding trans");
    console.log(info);
  });
  User.find({username: "happy"}, (err, info) => {
    console.log("finding happy");
    console.log(info);
  });
  res.sendFile(__dirname + "/search.html")
});

app.listen(3000);
console.log("listening on port 3000.");