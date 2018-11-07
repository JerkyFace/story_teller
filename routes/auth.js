var express = require('express'),
    passport = require('passport'),
    router = express.Router(),
    User = require('../models/users');

router.get('/', (req, res) => {
    res.render('landing');
});

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', (req, res) => {
    let newUser = new User({
        username: req.body.username
    });
    let password = req.body.password;
    User.register(newUser, password, (error, user) => {
        if (!error) {
            console.log(`${user.username} succesfully registered`);
            passport.authenticate('local')(req, res, () => {
                res.redirect('/stories');
            });
        } else {
            console.log(error.message);
            return res.redirect('/register');
        }
    });
});

//login
router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/stories',
    failureRedirect: '/login'
}), (req, res) => {});

//logout
router.get('/logout', (req, res) => {
    console.log(`${req.session.passport.user} is loged out`);
    req.logout();
    res.redirect('/');
});

module.exports = router;