// definition of routes
module.exports = function (app,passport){
    // homepage 
    app.get('/', (req, res) => {res.sendFile('./homepage.html')});

    // contact us
    app.get('/contactus', (req, res) => {res.sendFile('./contactus.html')});

    // login page
    app.get('/login', (req, res) => {res.sendFile(__dirname +'/login.html')});

    // personal page
    app.get('/personal', isLoggedIn, (req, res) => {
        
    });

    // register page
    app.get('/register', (req, res) => {res.sendFile(__dirname + '/register.html')});

    // search page 
    app.get('/search', isLoggedIn, (req, res) => {res.sendFile('search.html')});

    // handling post requests
    // register
    app.post('/register', 
        passport.authenticate('local-signup',{successRedirect:'/',failureRedirect: '/register'})
    );

    // login
    app.post('/login', passport.authenticate("local-login", {
        successfulRedirect: '/personal',
        failureRedirect: '/login', 
    }));

    app.post('/search', );

    // rate
    app.post('/rate', 
        // function to rate the tutor and update the tutor database, and disable the button
    );

    // search
    app.post('/search', 
       (req, res) => {
           var query = req.body;

       }
    );

    // logout
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
};

function isLoggedIn (req, res, next){
    if(req.isAuthenticated()){
        next();
    }
    res.redirect("/");
}