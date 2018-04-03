// initial code for csci3100 project

// initializing tools
var express = require('express');
var app = express();
var http = require('http').Server(app);
var mongoose = require('mongoose');
var passport = require('passport'); // for authentication

var morgan = require('morgan'); // log the requests
var cookieParser = require('cookie-parser'); 
var bodyParser = require('body-parser');
var session = require('express-session'); // for login session

var io = require('socket.io')(http); // setting up socket.io

mongoose.connect('mongodb://localhost/user');

app.use(morgan('dev')); // log the requests
app.use(express.static('public')); // location for shared resource
app.set('view engine', 'ejs'); // setting up ejs

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// for passport
app.use(session({ secret: 'michaellyuishandsome', resave: false, saveUninitialized: false })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // login sessions

// sharing session to socket.io
var sharedsession = require("express-socket.io-session");
io.use(sharedsession(session), cookieParser); 

var User = require(__dirname + '/user.js')

// load the passport for configuration
require(__dirname + "/passport.js")(passport);

// load the routes           
require(__dirname + "/routes.js")(app, passport, User); 

// load socket actions
require(__dirname + "/socket.js")(io);

// listen at port 3000
app.listen(3000);
console.log("listening on port 3000");