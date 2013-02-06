// load dependencies
var express = require('express')
	, http = require('http')
	, path = require('path');
var election = require('./routes/election')
	, auth = require('./routes/auth');
var login = require('./helpers/login');
var passport = require('passport')
  , NYUPassportStrategy = require('passport-nyu').Strategy;

// prepare database
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/voting');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	// schema for users
	var Election = require('./models/election');
});

// start app server
var app = express();

// configure express
app.configure(function(){
	app.set('port', process.env.PORT || 5000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser( process.env.SECRET ));
	app.use(express.session({ key: 'voting.sess', secret: process.env.SECRET }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(__dirname + '/public'));
});

// --- development
app.configure('development', function(){
	app.use(express.errorHandler());
});

// all routes
app.get('/', [login.ensure, election.list]);
app.get('/election/new', [login.ensure, election.new]);
app.get('/election/:id/vote', [login.ensure, election.view]);
app.post('/election/:id/vote', [login.ensure, election.vote]);
// app.get('/election/:election/vote/:race/for/:candidate', election.vote);


// authentication with passport
passport.serializeUser(function(user, done) {
	done(null, JSON.stringify(user));
});

passport.deserializeUser(function(user, done) {
	done(null, JSON.parse( user ) );
});

// oauth
passport.use('nyu-passport', new NYUPassportStrategy({
	clientID: process.env.PASSPORT_ID,
	clientSecret: process.env.PASSPORT_SECRET,
	callbackURL: process.env.BASE_URL + '/auth/passport/callback'
	},
	function(accessToken, refreshToken, profile, done) {
		user = {
			token: accessToken,
			netID: profile.netID,
			class: profile.class
		};
		done(null, user);
	}
));

// passport auth
app.get('/auth/start', auth.start); // start the auth process
app.get('/auth/passport', passport.authenticate('nyu-passport')); // pass along to passport
app.get('/auth/passport/callback', passport.authenticate('nyu-passport', { successRedirect: '/auth/end', failureRedirect: '/auth/passport' })); // hear back from Passport
app.get('/auth/end', auth.finish); // finish the auth process

// start listening
var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});