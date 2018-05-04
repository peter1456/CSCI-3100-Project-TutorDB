// definition of routes
module.exports = function (app,passport,User){
    var ChatHandler = require(__dirname + "/chat.js");
    var chatHandler = new ChatHandler();

    // homepage 
    app.get('/', (req, res) => {
        // if the user is logged in 
        if(req.isAuthenticated()){
            // prepare data for showing list of students / tutors depending on the identity
            var query = {identity: req.user.identity == "tutor" ? "student" : "tutor"};
            User.find(query,(err, results) => {
                if (err) {
                    throw err;
                }
            console.log(results);
            // pass the user's name and the list to the view engine (ejs)
            res.render('loginhomepage', {firstName: req.user.firstName, lastName: req.user.lastName, result: results});
        })
        } else {
            // show the homepage for 
            res.render('homepage');
        }
        });

    // contact us
    app.get('/contactus', (req, res) => {
        if(req.isAuthenticated()){
            res.render('contactus');
        } else {
            res.render('outcontactus');
        }
    });

    // login page
    app.get('/login', (req, res) => {res.render('login')});

    // personal page
    app.get('/personal', isLoggedIn, (req, res) => {res.render('personal', {user: req.user})});

    // register page
    app.get('/register', (req, res) => {res.render('register')});

    // search page 
    app.get('/search', isLoggedIn, (req, res) => {res.render('search', {identity: req.user.identity})});

    // update page
    app.get('/update', isLoggedIn, (req, res) => {res.render('update',{user: req.user})});

    // chat
    app.get('/chat', isLoggedIn, (req, res) => {res.render('chat')});

    // logout
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    // handling post requests
    // register
    app.post('/register', 
        passport.authenticate('local-signup',{successRedirect:'/',failureRedirect: '/register'})
    );

    // login
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/personal',
        failureRedirect: '/login', 
    }));

    // personal page
    app.post('/personal', isLoggedIn, (req, res) => {
        User.findById(req.body.id, (err, result) => {
            res.render('personal', {user: result}); // render with user's personal details
        })
    });

    // update
    app.post('/update', isLoggedIn, (req, res) => {
        var update = req.body;
        if (update.oldPassword != req.user.password){
            res.render('update', {user: req.user});
        } else {
            delete update["oldPassword"];
            update["password"] = update["newPassword"];
            delete update["password"];
            User.findById(req.user.id, (err, user) => {
                if (err){
                    throw err;
                } 
                    user.password = update.newPassword;
                    user.region = update.region;
                    user.educationLevel = update.educationLevel;
                    user.subject = update.subject;
                    user.timeAvailable = update.timeAvailable;
                    user.save((err) => {
                        if (err) {
                            throw err;
                        }
                    })
            });
            res.redirect('/personal')
        }
    });

    // search
    app.post('/search', isLoggedIn, (req, res) => {
        var query = req.body;
        // removing empty properties
        for (var prop in query){
            if (query[prop] == 'null'){
              delete query[prop];
            }
        }
        // inserting identity and activeness to query
        query["identity"] = req.user.identity == "tutor" ? "student" : "tutor";
        query["activeness"] = true;
        console.log("The query is");
        console.log(query);
        // do query in database
        User.find(query,(err, results) => {
            if (err) {
                throw err;
            }
            console.log(results);
            res.render('result', {result: results});
        })
    });

    // create new chat 
    app.post('/chat', (req, res) => {
        console.log(req.body.id);
        chatHandler.createConversation(req.user.id, req.body.id).then(res.redirect('/chat'));
    });
}
// check the user is logged in or not
function isLoggedIn (req, res, next){
    if(req.isAuthenticated()){
        next();
    } else {
        console.log("Someone is not logged in!")
        // redirect to homepage
        res.redirect("/");
    } 
}