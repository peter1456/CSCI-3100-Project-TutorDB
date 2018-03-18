// initial code for csci3100 project

// initializing tools
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport'); // for authentication

var morgan = require('morgan'); // log the requests
var cookieParser = require('cookie-parser'); 
var bodyParser = require('body-parser');
var session = require('express-session'); // for login session

app.use(morgan('dev')); 
app.use(cookieParser());
app.use(bodyParser()); 

// for passport
app.use(session({ secret: 'michaellyuishandsome' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // login sessions

// chat tools
const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

//Connect and chat
mongo.connect('mongodb://127.0.0.1/project',function(err,db){
	if(err){
		throw err;
    }
	console.log('Connected');
	client.on('connecttion', function(socket){
		let chat = db.collection('chat');
		sendStatus = function(s){
			socket.emit('status',s);
		}
		chat.find().limit(100).sort({_is:1}).toArray(function(err,res){
			if(err){
				throw err;
			}
			socket.emit('output',res);
		});
		socket.on('input', function(data){
			let name = data.name;
			let message = data.message;
			if(message == ''){
				sendStatus('Please enter message!!');
			}else{
				chat.insert({message: message}, function(){
					client.emit('output',[data]);
					sendStatus({
						message: 'message sent',
						clear: true
					});
				});
			}
		});
		socket.on('clear', function(data){
			chat.remove({}, function(){
				socket.emit('cleared');
			});
		});
	});
});

// load the routes           
require("routes.js")(app, passport); 

// load the passport for configuration
require("passport.js")(passport);

// listen at port 3000
app.listen(3000);
console.log("listening on port 3000");