var express = require('express'),
    passport = require('passport'),
    router = express.Router(),
    middleware = require('../middleware/index'),
    User = require('../models/users'),
    Story = require('../models/story');


router.get('/user/:user_id', (req, res) => {
    User.findById(req.params.user_id, (error, foundUser) => {
        if (!error && foundUser) {
            Story.find({
                "author.id": foundUser._id
            }, (error, userStories) => {
                if (!error && userStories.length > 0) {
                    return res.render('user/userpage', {
                        user: foundUser,
                        userStories: userStories
                    });
                } else {
                    return res.render('user/userpage', {
                        user: foundUser,
                    });
                }
            });
        } else {
            console.log(error.message);
            req.flash('error', "Something went wrong");
            return  res.redirect('/stories');
        }
    });
});

//update profile
router.put('/user/:user_id', (req, res) => {
    let id = req.params.user_id;
    let newData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        about: req.body.about
    };

    User.findByIdAndUpdate(id, newData, (error, foundUser) => {
        if (!error && foundUser) {
            req.flash('success', "Successfully updated.");
            return res.redirect(`/user/${id}`);
        } else {
            console.log(error.message);
            req.flash('error', "Unable to update profile.");
            return res.redirect(`/user/${id}`);
        }
    });
});


module.exports = router;