let Story = require('../models/story'),
    Comment = require('../models/comments');


let middlewareObj = {};

middlewareObj.isAuthorized = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        console.log('access denied');
        res.redirect('/login');
    }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (error, foundComment) => {
            if (!error) {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('/stories');
                }
            } else {
                res.redirect('back');
            }
        });
    }
};

middlewareObj.checkStoryOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Story.findById(req.params.id, (error, foundStory) => {
            if (!error) {
                if (foundStory.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('/stories');
                }
            } else {
                res.redirect('back');
            }
        });
    }
};


module.exports = middlewareObj;