let express = require('express'),
    router = express.Router(),
    Story = require('../models/story'),
    middleware = require('../middleware');


// default image if not chosen
const defaultPicture = 'https://pp.userapi.com/c850724/v850724974/34063/9kVPQXEaCXc.jpg';

// show all stories
router.get('/', (req, res) => {
    Story.find({}).sort({
        time: 'desc'
    }).exec((error, story) => {
        if (!error) {
            let firstColumn = story.filter((value, index) => {
                return index % 2 == 0;
            });
            let secondColumn = story.filter((value, index) => {
                return index % 2 != 0;
            });
            let popularArray = story.filter((value, index) => {
                return index < 2;
            });
            res.render('story/index', {
                firstColumn: firstColumn,
                secondColumn: secondColumn,
                popularArray: popularArray
            });
        } else {
            console.log(error);
            res.send('Something went wrong. Redirecting...');
            setTimeout(res.redirect('/', 3000));
        }
    });
});

// add story handler
router.post('/', middleware.isAuthorized, (req, res) => {
    let title = req.sanitize(req.body.storyTitle),
        content = req.sanitize(req.body.storyContent),
        img = req.body.img || defaultPicture;
    Story.create({
        author: {
            username: req.user.username,
            id: req.user._id
        },
        title: title,
        content: content,
        image: img,
        time: new Date().toLocaleDateString([], {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        })
    }, (error, result) => {
        if (!error) {
            console.log('created');
        } else {
            console.log(error);
            res.send('Something went wrong. Redirecting...');
            setTimeout(res.redirect('/', 3000));
        }
    });
    res.redirect('/stories');
});

router.get('/new', middleware.isAuthorized, (req, res) => {
    res.render('story/new', {});
});

router.get('/:id', middleware.isAuthorized, (req, res) => {
    Story.findById(req.params.id).populate('comments').exec((error, foundStory) => {
        if (!error) {
            res.render('story/post', {
                foundStory: foundStory
            });
        } else {
            console.log(error);
        }
    });
});

//edit route
router.get('/:id/edit', middleware.checkStoryOwnership, (req, res) => {
    Story.findById(req.params.id, (error, foundStory) => {
        if (!error) {
            res.render('story/edit', {
                foundStory: foundStory
            });
        } else {
            console.log(error);
            res.redirect('/stories');
        }
    });
});

//update route
router.put('/:id', middleware.checkStoryOwnership, (req, res) => {
    let id = req.params.id,
        title = req.body.storyTitle,
        content = req.body.storyContent,
        img = req.body.img || defaultPicture;
    let dataToBeUpdated = {
        title: title,
        content: content,
        image: img
    }

    Story.findByIdAndUpdate(id, dataToBeUpdated, error => {
        if (!error) {
            res.redirect(`/stories/${id}`);
        } else {
            console.log(error);
            res.redirect(`/stories/${id}`);
        }
    });
});

//destroy route
router.delete('/:id', middleware.checkStoryOwnership, (req, res) => {
    let id = req.params.id,
        author = req.session.passport.user;
    Story.findByIdAndDelete(id, (error, foundStory) => {
        if (!error) {
            console.log(`${foundStory.title} deleted by ${author}`);
            res.redirect('/stories');
        } else {
            console.log(error);
            res.redirect(`/stories/${id}`);
        }
    });
});


module.exports = router;