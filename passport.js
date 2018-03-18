// load the strategy from passport
var LocalStrategy   = require('passport-local').Strategy;

// load the user model
var User = require("user.js");

module.exports = function(passport) {
    // for login session
    passport.serializeUser(function(){
        // serializing the user
    })
    passport.deserializeUser(function(id, done) {
        // deserializing the user
    });

    // function for signup
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true 
    },
    // function to check the username exists already or not, create 
    // the user if it is valid
    ));   

    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true 
    },
    // function to check the login is valid or not
    ));   
}