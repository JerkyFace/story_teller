let express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    expressSession = require('express-session'),
    LocalStrategy = require('passport-local'),
    sanitizer = require('express-sanitizer'),
    flash = require('connect-flash-plus'),
    methodOverride = require('method-override'),
    User = require('./models/users'),
    app = express();

const PORT = process.env.PORT || 5000;

let commentRoutes = require('./routes/comments'),
    storiesRoutes = require('./routes/stories'),
    userRoutes = require('./routes/user'),
    authRoutes = require('./routes/auth'),
    adminRoutes = require('./routes/admin');

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
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});
app.use(methodOverride('_method'));

app.use(authRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use('/stories/:id/comments', commentRoutes);
app.use('/stories', storiesRoutes);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(`mongodb://JerkFace:GBGBcmrf321@ds113454.mlab.com:13454/storyteller`, {
    useNewUrlParser: true
});
mongoose.set('useFindAndModify', false);

app.listen(PORT, () => {
    console.log('server started');
});