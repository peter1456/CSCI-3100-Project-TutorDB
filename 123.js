var express = require('express');
var app = express();

var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');
app.use(morgan('combined')); 
app.use(bodyParser.urlencoded({
	extended: true
  }));

var kittySchema = mongoose.Schema({
    name: String
  });

var Kitten = mongoose.model('Kitten', kittySchema);

app.get('/', (req, res) => {res.sendFile(path.join(__dirname, 'register.html'))});
app.post('/register', (req, res) => {
    console.log(req.body);
    var silence = new Kitten({ name: 'Silence' });
    console.log(silence.name); // 'Silence'
    silence.save();
    res.redirect('/');
})

app.listen(3000);
console.log("listening on port 3000.");