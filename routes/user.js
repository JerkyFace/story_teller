var express = require('express'),
    passport = require('passport'),
    router = express.Router(),
    middleware = require('../middleware/index'),
    User = require('../models/users'),
    Story = require('../models/story');


router.get('/user/:user_id', (req, res) => {
    User.findById(req.params.user_id, (error, foundUser) => {
        if (!error && foundUser) {
            Story.find({}, (error, userStories) => {
                if (!error && userStories) {
                    let list = userStories.filter(story => {
                        story.author.username = foundUser.username;
                    });
                    console.log(list);
                    res.render('user/userpage', {
                        user: foundUser,
                        userStories: list
                    });
                } else {
                    res.render('user/userpage', {
                        user: foundUser
                    });
                }
            });
        } else {
            console.log(error);
            req.flash('error', error.message);
            res.redirect('/stories');
        }
    });
});

module.exports = router;