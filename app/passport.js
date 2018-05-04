// load the strategy from passport
var LocalStrategy   = require('passport-local').Strategy;

// load the user model
var User = require("./user.js");

module.exports = function(passport) {
    // for login session
    passport.serializeUser(function(user, done){
        done(null, user.id);
    })
    // given userid, return the details of user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log(user);
            done(null, user);
        });
    });

    // function for register
    passport.use('local-signup', new LocalStrategy(
        {
            passReqToCallback: true
        },
        function(req, username, password, done){
            // find if the username is used or not
            User.findOne({'username': username}, function(err,user){
                    // error handling
                    if(err){
                        console.log("err");
                        return done(err);
                    }
                    // if exist program would return false
                    if(user){
                        console.log("exist");
                        return done(null, false);
                    } else {
                        // create a new user and save it
                        var newUser = new User();
                        newUser.username = username;
                        newUser.password = password;
                        newUser.firstName = req.body.firstName;
                        newUser.lastName = req.body.lastName;
                        newUser.identity = req.body.identity;
                        newUser.sex = req.body.sex;
                        newUser.region = req.body.region;
                        newUser.educationLevel = req.body.educationLevel;
                        newUser.timeAvailable = req.body.timeAvailable;
                        newUser.priceRequested = req.body.priceRequested;
                        newUser.subject = req.body.subject;
                        console.log("New User Created!");
                        console.log(newUser);
                        newUser.save(function(err,newUser){
                            if(err){
                                throw err;
                            } 
                            return done(null, newUser);
                        });
                    }
                })
            })
    );   

    // login
    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, username, password, done){
        console.log("logging in");
        console.log(req.body);
        // find by username in database
        User.findOne({'username': username}, function(err,user){
            if(err){
                console.log("error");
                return done(err);
            }
            // if no such user in database
            if(!user){
                console.log("no such user");
                return done(null, false);
            }
            // if the password does not match
            if(user.password != password){
                console.log("wrong pwd");
                return done(null, false);
            }
            // success
            console.log("success");
            return done(null, user);
        })
    }
    ));   
}