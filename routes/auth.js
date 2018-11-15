var express = require('express'),
    passport = require('passport'),
    router = express.Router(),
    User = require('../models/users');

router.get('/', (req, res) => {
    res.render('landing');
});

//register routes
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
            passport.authenticate('local')(req, res, () => {
                req.flash('success', `Wellcome, ${user.username}!`);
                res.redirect('/stories');
            });
        } else {
            console.log(error.message);
            req.flash('error', error.message);
            return res.redirect('/register');
        }
    });
});

//login routes
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
    req.flash('success', `${req.session.passport.user} is loged out`);
    req.logout();
    res.redirect('/stories');
});

module.exports = router;