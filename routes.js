// definition of routes
module.exports = function (app,passport,User){
    // homepage 
    app.get('/', (req, res) => {
        if(req.isAuthenticated()){
            res.render('loginhomepage', {firstName: req.user.firstName, lastName: req.user.lastName});
        } else {
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
    app.get('/register', (req, res) => {res.sendFile(__dirname + '/register.html')});

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
        successRedirect: '/search',
        failureRedirect: '/login', 
    }));

    // rate
    app.post('/rate', 
        // function to rate the tutor and update the tutor database, and disable the button
    );

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
        query["identity"] = req.user.identity == "tutor" ? "student" : "tutor";
        query["activeness"] = true;
        console.log("The query is");
        console.log(query);
        User.find(query,(err, results) => {
            if (err) {
                throw err;
            }
            console.log(results);
            res.render('result', {result: results});
        })
    });

    app.post('/chat', (req, res) => {
        console.log(req.body.id);
    });
}

function isLoggedIn (req, res, next){
    if(req.isAuthenticated()){
        next();
    } else {
        console.log("Someone is not logged in!")
        res.redirect("/");
    } 
}