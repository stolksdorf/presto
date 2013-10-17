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
XO            = require('./modules/node-xo.js');


//Models
require('./modules/models/calculator.js');
require('./modules/models/user.js');
require('./modules/models/keys.js');



//Routes
app.get('/', [mw.loadUser], function (req, res) {
	return res.redirect('/index');
	/*
	return res.render('home.html', {
		user : req.user
	});*/
});

app.get('/home', [mw.loadUser], function (req, res) {
	return res.redirect('/');
	/*
	return res.render('home.html', {
		user : req.user
	});*/
});


app.get('/calc/:calcId', [mw.loadUser], function(req,res){
	return res.render('calculator.html', {
		user : req.user,
		calcId : req.params.calcId
	});
});

app.get('/index', [mw.loadUser], function(req,res){
	return res.render('index.html', {
		user : req.user
	});
});


//TODO: Remove once new home page is made
app.get('/register', function(req, res){
	res.render('register.html');
});

app.get('/admin', [mw.loadUser, mw.adminOnly], function(req, res){
	return res.render('admin.html', {
		user : req.user,
		routes : XO.endpoints
	});
});

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

/*
XO.api('/api/users', User, [mw.loadUser, mw.adminOnly]);

XO.api('/api/calculators', Calculator, {
	get  : [mw.loadUser],
	put  : [mw.loadUser, mw.adminOnly],
	post : [mw.loadUser, mw.adminOnly],
	del  : [mw.loadUser, mw.adminOnly]
});

XO.api('/api/keys', ActivationKey, [mw.loadUser, mw.adminOnly]);
*/

app.get('/api', function(req,res){
	res.send(XO.endpoints);
});

XO.api('/api/users', User);

XO.api('/api/calculators', Calculator);

XO.api('/api/keys', ActivationKey);

















/**
 *
 * Experimentation
 *
 */
app.get('/clear_all_users', [mw.loadUser, mw.adminOnly], function(req, res){
	User.remove({}, function(err){
		console.log('All users dropped');
	});
	ActivationKey.remove({}, function(err){
		console.log('All activation keys dropped');
	});
	res.send(200, 'Dropped');
});


app.get('/clear_calcs', [mw.loadUser, mw.adminOnly], function(req, res){
	Calculator.remove({}, function(err){
		console.log('All calcs dropped');
	});
	res.send(200, 'Calcs Dropped');
});


//Testing API




var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});