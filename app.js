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

//Modules
mail          = require('./modules/mail.js');
mw            = require('./modules/middleware.js');
xo            = require('./modules/node-xo.js');
payments      = require('./modules/payments.js')



//Models
require('./modules/models/calculator.js');
require('./modules/models/user.js');
require('./modules/models/keys.js');


//Routes
app.get('/', function (req, res) {
	res.render('home.html');
});

app.get('/home', function (req, res) {
	res.render('home.html');
});

app.get('/index', [mw.loadUser], function(req,res){
	return res.render('index.html', {
		user : req.user || {}
	});
});

//This will force the login check then just route to the index page
app.get('/login', function (req, res) {
	return res.redirect('/index');
});

app.get('/calc/:calcId', [mw.loadUser], function(req,res){
	Calculator.findByUrlOrId(req.params.calcId, function(err, calc){
		if(err || !calc) return res.redirect('/uhoh');
		return res.render('calculator.html', {
			user : req.user || {},
			calcId : calc.id
		});
	});
});

app.get('/account', [mw.forceUser], function(req,res){
	return res.render('account.html', {
		user : req.user
	});
});

//Process new card
app.post('/account', [mw.forceUser], function(req,res){
	var stripeToken = req.body.stripeToken;

	payments.saveUser(req.user, stripeToken, function(err, user){
		if(err){ return res.send(500, err);}
		return res.send(200, user);
	});


/*
	payments.charge(stripeToken, function(err, charge){
		if(err){ return res.send(500, err);}
		return res.send(200, charge);
	});

*/
});

app.get('/account2', [mw.forceUser], function(req,res){

	payments.chargeUser(req.user, function(err, result){
		if(err){ return res.send(500, err);}
		return res.send(200, result);
	})

});


//TODO: Remove once new home page is made
app.get('/signup', function(req, res){
	res.render('register.html');
});

app.get('/admin', [mw.adminOnly], function(req, res){
	return res.render('admin.html', {
		user : req.user,
		routes : xo.endpoints
	});
});

app.get('/uhoh', function (req, res) {
	res.render('404.html');
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

app.get('/dropall',[mw.adminOnly], function(req,res){
	User.remove({}, function(){});
	ActivationKey.remove({}, function(){});
	Calculator.remove({}, function(){});
	res.send('dropped all');
});
app.get('/dropcalcs',[mw.adminOnly], function(req,res){
	Calculator.remove({}, function(){});
	res.send('dropped calcs');
});

//Catch bad pages
app.get('*', function (req, res) {
	res.redirect('/uhoh');
});
var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});