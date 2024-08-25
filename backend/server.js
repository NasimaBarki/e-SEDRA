'use strict';

// import
const express = require('express');
const session = require('express-session'); // sessioni
const morgan = require('morgan'); // logging middleware
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // email e psw per il login
const topicDao = require('./dao/topicDao.js');

// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
    function (username, password, done) {
        userDao.getUser(username, password).then(({ user, check }) => {
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!check) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        })
    }
));

// serialize and de-serialize the user (user object <-> session)
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    userDao.getUserById(id).then(user => {
        done(null, user);
    });
});

// crea app
const app = express();

// set up logging
app.use(morgan('tiny'));

// CORS
var cors = require('cors');
app.use(cors());

// ogni richiesta sarà fatta in JSON
app.use(express.json());

// porta
const port = 3000;

// set up sessione
app.use(session({
    //store: new FileStore(), // by default, Passport uses a MemoryStore to keep track of the sessions - if you want to use this, launch nodemon with the option: --ignore sessions/
    secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
    resave: false,
    saveUninitialized: false
}));

// REST API

// POST /sessions
app.post('/sessions', (req, res) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            // display wrong login messages
            return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, function (err) {
            if (err) { return next(err); }
            // req.user contains the authenticated user
            return res.json(req.user.email);
        });
    })(req, res, next);
})

// GET /topics
app.get('/topics', (req, res) => {
    topicDao.getAllTopics()
        .then((topics) => res.json(topics))
        .catch(() => res.status(500).end());
})

// attivazione server
app.listen(port, () => {
    console.log(`Server in ascolto alla porta ${port}`)
})