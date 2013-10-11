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

GLOBAL._ = require('underscore');


var csv = require('csv');
var DEBUG = false;


//Modules
mail          = require('./modules/mail.js');
sneakpeek     = require('./modules/sneakpeek.js');
mw            = require('./modules/middleware.js');
XO            = require('./modules/node-xo.js');


//Models
require('./modules/models/calculator.js');
require('./modules/models/user.js');
require('./modules/models/keys.js');



//Routes
app.get('/calc/:calcId', [mw.loadUser], function(req,res){
	Calculator.findOne({id : req.params.calcId}, function(err, calculator){

		var temp = calculator.toObject();

		delete temp._id;
		delete temp.last_modified;

		return res.render('calculator.html', {
			user : req.user,
			calcId : req.params.calcId, //TODO: revert to a API call
			calc : temp
		});
	});

});

app.get('/home', [mw.loadUser], function(req,res){
	return res.render('home.html', {
		user : req.user
	});
});

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



//Testing API




var TestModel = mongoose.model('TestModel', mongoose.Schema({
	id : String,
	name :String,
	url : String,
	phone : Number,
	test : Boolean,
}));




XO.api('/test', TestModel, {
	post : [function(req,res,next){
		//console.log('wooo', req.body)

		var test = JSON.parse(req.body.script);

		console.log('woo', test.test);

		next();

	}]
});








var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});