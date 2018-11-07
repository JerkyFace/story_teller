var express = require('express'),
    router = express.Router({mergeParams: true}),
    Comment = require('../models/comments'),
    Story = require('../models/story');

router.get('/new', isAuthorized, (req, res) => {
    res.render('comments/new', {
        id: req.params.id,

    });
});

router.post('/', isAuthorized, (req, res) => {
    Story.findById(req.params.id, (error, foundStory) => {
        if (!error) {
            Comment.create({
                text: req.body.commentText,
                author: {
                    id: req.user._id,
                    username: req.user.username,
                }
            }, (error, comment) => {
                if (!error) {
                    foundStory.comments.push(comment);
                    foundStory.save();
                    console.log(comment);
                } else {
                    console.log(error);
                    res.redirect('/stories');
                }
            });
        } else {
            console.log(error);
            res.redirect('/stories');
        }
    });
    res.redirect('/stories/' + req.params.id);
});

function isAuthorized(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        console.log('access denied');
        res.redirect('/login');
    }
}

module.exports = router;