// definition of routes
module.exports = function (app,passport){
    // homepage 
    app.get('/', (req, res) => {res.sendFile('homepage.html')});

    // contact us
    app.get('/contactus', (req, res) => {res.sendFile('contactus.html')});

    // login page
    app.get('/login', (req, res) => {res.sendFile('login.html')});

    // personal page
    app.get('/personal', isLoggedIn, (req, res) => {
        // callback function to redirect it to tutor / student personal page
        // by checking the identity of user (student/tutor)
        // the personal page will be rendered by backend 
    });

    // register page
    app.get('/register', (req, res) => {res.sendFile('register.html')});

    // search page 
    app.get('/search', isLoggedIn, (req, res) => {res.sendFile('register.html')});

    // handling post requests
    // register
    app.post('/register', passport.authenticate("local-signup", {
        successfulRedirect: '/personal',
        failureRedirect: '/register', 
    }));

    // login
    app.post('/login', passport.authenticate("local-login", {
        successfulRedirect: '/personal',
        failureRedirect: '/login', 
    }));

    // rate
    app.post('/rate', 
        // function to rate the tutor and update the tutor database, and disable the button
    );

    // search
    app.post('/search', 
        // search the database return results
    );

    // logout
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
};

function isLoggedIn (req, res, next){
    // middleware function to check a user is logged in the session or not
    // redirect the user to homepage if he/she is not logged in
}