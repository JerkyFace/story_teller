var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    expressSession = require('express-session'),
    LocalStrategy = require('passport-local'),
    sanitizer = require('express-sanitizer'),
    methodOverride = require('method-override'),
    User = require('./models/users'),
    urls = require('./common/urls'),
    seedDB = require('./seeds'),
    app = express();

var commentRoutes = require('./routes/comments'),
    storiesRoutes = require('./routes/stories'),
    authRoutes = require('./routes/auth');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(sanitizer());

app.use(expressSession({
    secret: "Keksnaz",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});
app.use(methodOverride('_method'));

app.use(authRoutes);
app.use('/stories/:id/comments', commentRoutes);
app.use('/stories', storiesRoutes);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(`mongodb://${urls.mongo}/storyTeller`, {
    useNewUrlParser: true
});
mongoose.set('useFindAndModify', false);

seedDB();

//userpage tbc 
app.get('/im', (req, res) => {
    res.render('user/userpage');
});

app.listen(urls.port, urls.ip, () => {
    console.log('server started');
});