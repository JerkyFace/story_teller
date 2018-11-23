let express = require('express'),
    moment = require('moment'),
    router = express.Router({
        mergeParams: true
    }),
    Comment = require('../models/comments'),
    Story = require('../models/story'),
    middleware = require('../middleware');


router.get('/new', middleware.isAuthorized, (req, res) => {
    res.render('comments/new', {
        id: req.params.id,

    });
});

//add comment handler
router.post('/', middleware.isAuthorized, (req, res) => {
    Story.findById(req.params.id, (error, foundStory) => {
        if (!error) {
            Comment.create({
                text: req.body.commentText,
                author: {
                    id: req.user._id,
                    username: req.user.username,
                },
                time: moment(new Date()).format("DD-MMM-YYYY, h:mm")
            }, (error, comment) => {
                if (!error) {
                    foundStory.comments.push(comment);
                    foundStory.save();
                    req.flash('success', 'Comment successfully added');
                    res.redirect('/stories/' + req.params.id);
                } else {
                    console.log(error);
                    req.flash('error', 'Something went wrong');
                    res.redirect('/stories');
                }
            });
        } else {
            console.log(error);
            req.flash('error', 'Something went wrong');
            res.redirect('/stories');
        }
    });
});

//edit comment
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Story.findById(req.params.id, (error, foundStory) => {
        if(error || !foundStory){
            req.flash('error', 'Story not found');
            return res.redirect('/stories');
        }
    });
    Comment.findById(req.params.comment_id, (error, foundComment) => {
        if (!error) {
            let story_id = req.params.id;
            res.render('comments/edit', {
                story_id: story_id,
                comment: foundComment
            });
        } else {
            console.log(error);
            req.flash('error', 'Something went wrong');
            res.redirect('/stories');
        }
    });
});

router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, {
        text: req.body.commentText
    }, (error, comment) => {
        if (!error && comment) {
            req.flash('success', 'Your comment updated');
            res.redirect('/stories/' + req.params.id);
        } else {
            console.log(error);
            req.flash('error', 'Something went wrong');
            res.redirect('/stories');
        }
    });
});

//delete comment
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, error => {
        if (!error) {
            req.flash('success', 'Your comment succesfully deleted');
            res.redirect('/stories/' + req.params.id);
        } else {
            console.log(error);
            req.flash('error', 'Something went wrong');
            res.redirect('/stories/' + req.params.id);
        }
    });
});


module.exports = router;