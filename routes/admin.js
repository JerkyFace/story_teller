let User = require('../models/users'),
    Story = require('../models/story'),
    express = require('express'),
    router = express.Router(),
    middleware = require('../middleware');


router.get('/adminpanel', middleware.isAuthorized, (req, res) => {
    if (req.user.isAdmin) {
        Story.find({}, (error, foundStories) => {
            if (!error && foundStories) {
                return res.render('admin/admin', {
                    foundStories: foundStories
                });
            } else {
                console.log(error);
                return res.redirect('/stories');
            }
        });
    } else {
        return res.redirect('/');
    }
});


module.exports = router;