let User = require('../models/users'),
    Story = require('../models/story'),
    express = require('express'),
    router = express.Router(),
    middleware = require('../middleware');


router.get('/adminpanel', middleware.isAuthorized, (req, res) => {
    if (req.user.isAdmin) {
        res.render('admin/admin', {
            user: req.user
        });
    } else {
        return res.redirect('/');
    }
});


module.exports = router;