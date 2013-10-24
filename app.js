var mongoUri = process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/presto';
mongoose = require('mongoose');
mongoose.connect(mongoUri);
mongoose.connection.on('error', function(){
	console.log(">>>ERROR: Connect Mongodb ya goof!");
});

express = require("express");
GLOBAL.app = express();
app.set('title', 'Presto');
app.engine('html', require('ejs').renderFile);
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.static(__dirname + '/public'));
app.locals.inspect = require('util').inspect;

GLOBAL.fs = require('fs');

GLOBAL._ = require('underscore');


var csv = require('csv');
var DEBUG = false;


//Modules
mail          = require('./modules/mail.js');
mw            = require('./modules/middleware.js');
xo            = require('./modules/node-xo.js');


//Models
require('./modules/models/calculator.js');
require('./modules/models/user.js');
require('./modules/models/keys.js');


//Routes
app.get('/', function (req, res) {
	res.redirect('/index');
});

app.get('/home', function (req, res) {
	res.render('home.html');
});


app.get('/calc/:calcId', [mw.forceLogin], function(req,res){
	return res.render('calculator.html', {
		user : req.user,
		calcId : req.params.calcId
	});
});

app.get('/index', [mw.forceLogin], function(req,res){
	return res.render('index.html', {
		user : req.user
	});
});


//TODO: Remove once new home page is made
app.get('/register', function(req, res){
	res.render('register.html');
});

app.get('/admin', [mw.adminOnly], function(req, res){
	return res.render('admin.html', {
		user : req.user,
		routes : xo.endpoints
	});
});



//Other routes

app.get('/activate/:key', function(req,res){
	var key    = req.params.key;
	var cookie = req.cookies.presto_auth;

	ActivationKey.activate(key, cookie, function(err){
		if(err){ return res.send(500, err);}
		return res.render('activate.html');
	});
});

app.post('/addLink', function(req,res){
	var domain = req.protocol + "://" + req.get('host');
	var email  = req.body.email;
	ActivationKey.addAndSend(domain, email, function(err){
		if(err){ return res.send(500, err); }
		return res.send(200);
	});
});

app.get('/csv/:filename', function(req,res){
	res.contentType('text/csv');
	return csv().from(JSON.parse(req.query.data)).to(res)
});



/*
	API
 */


xo.api('/api/users', User, [mw.adminOnly]);



xo.api('/api/keys', ActivationKey, [mw.adminOnly]);













/**
 *
 * Experimentation
 *
 */

app.get('/backup', [mw.loadUser, mw.adminOnly], function(req, res){
	Calculator.find({}, function(err, calcs){
		if(err) return res.send(200, 'Error - ' + err);
		var result = _.map(calcs, function(calc){
			return calc.script;
		});

		return res.render('backup.html', {
			calc : result
		});
	});
});




app.get('/uhoh', function (req, res) {
	res.render('404.html');
});
app.get('*', function (req, res) {
	res.redirect('/uhoh');
});


var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});