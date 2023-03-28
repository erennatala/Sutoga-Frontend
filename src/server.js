const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.identifier);
});

passport.deserializeUser((identifier, done) => {
    done(null, { identifier });
});



passport.use(new SteamStrategy({
            returnURL: 'http://localhost:3000/register',
            realm: 'http://localhost:3001/',
            apiKey: '4D3BE17D82F44DE7727A8287A7F0F869'
        },
        (identifier, profile, done) => {
            process.nextTick(() => {
                profile.identifier = identifier;
                return done(null, profile);
            });
        })
);

app.get('/auth/steam',
    passport.authenticate('steam', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
    });

// ...

app.get('/auth/steam/return',
    passport.authenticate('steam', { failureRedirect: '/login' }),
    (req, res) => {
        const { _json: { steamid } } = req.user;
        // res.redirect(`http://localhost:3001/?steamid=${steamid}`);
        res.redirect(`http://localhost:3000/register/?steamid=${steamid}`);
    });

// ...

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});