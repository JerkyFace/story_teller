let express = require('express'),
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
                time: new Date().toLocaleDateString([], {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                })
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

//edit comment
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (error, foundComment) => {
        if (!error) {
            let story_id = req.params.id;
            res.render('comments/edit', {
                story_id: story_id,
                comment: foundComment
            });
        } else {
            console.log(error);
            res.redirect('back');
        }
    });
});

router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, {
        text: req.body.commentText
    }, error => {
        if (!error) {
            res.redirect('/stories/' + req.params.id);
        } else {
            console.log(error);
            res.redirect('back');
        }
    });
});

//delete comment
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, error => {
        if (!error) {
            console.log('comment deleted');
            res.redirect('/stories/' + req.params.id);
        } else {
            console.log(error);
            res.redirect('/stories/' + req.params.id);
        }
    });
});


module.exports = router;