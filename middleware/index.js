let Story = require('../models/story'),
    Comment = require('../models/comments'),
    User = require('../models/users');


let middlewareObj = {};

middlewareObj.isAuthorized = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error', 'You must be signed in');
        res.redirect('/login');
    }
}; 

//check if current user is the author of the comment
middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (error, foundComment) => {
            if (!error && foundComment) {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'Access denied');
                    res.redirect('/stories');
                }
            } else {
                console.log(error);
                req.flash('error', 'Something went wrong');
                res.redirect('/stories/' + req.params.id);
            }
        });
    }
};

//Check if current user own profile page
middlewareObj.checkPageOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        let id = req.params.user_id
        User.findById(id, (error, foundUser) => {
            if(!error && foundUser) {
                if(foundUser._id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash('error', 'Access denied');
                    res.redirect(`/user/${id}`);
                }
            }
            else{
                console.log(error.message);
                req.flash('error', 'Something went wrong');
                res.redirect(`/user/${id}`);
            }
        });
    }
};

//check if current user is the author of storypage
middlewareObj.checkStoryOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Story.findById(req.params.id, (error, foundStory) => {
            if (!error && foundStory) {
                if (foundStory.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash('error', 'Access denied');
                    res.redirect('/stories');
                }
            } else {
                console.log(error);
                req.flash('error', 'Something went wrong');
                res.redirect('/stories');
            }
        });
    }
};


module.exports = middlewareObj;