var mongoUri = process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/presto';
mongoose = require('mongoose');
mongoose.connect(mongoUri);
mongoose.connection.on('error', function(){
	console.log(">>>ERROR: Connect Mongodb ya goof!");
});

express = require("express");
app = express();
app.set('title', 'Presto');
app.engine('html', require('ejs').renderFile);
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.static(__dirname + '/public'));

GLOBAL._ = require('underscore');

var shortId = require('shortid');
var csv = require('csv');


app.locals.inspect = require('util').inspect;


var DEBUG = false;


//Modules
mail          = require('./modules/mail.js');
sneakpeek     = require('./modules/sneakpeek.js');
auth          = require('./modules/auth.js');


//Models
require('./modules/models/calculator.js');
require('./modules/models/user.js');


//Middleware
var adminOnly = function(req,res,next){
	if(req.user){
		if(req.user.account_type === 'admin'){
			return next();
		}
	}
	return res.send(401, "woah dude");
};

var loadUser = function(req,res,next){
	var cookie = req.cookies.presto_auth;
	if(!cookie){
		return res.redirect('/register');
	}
	User.findOne({'auth.cookie' : cookie}, function(err, user){
		if(err || !user){
			console.log('ERR', err);
			return res.redirect('/register');
		}
		req.user = user;
		console.log('user', user);
		next();
	});
}


//Routes
app.get('/calc/:calcId', [loadUser], function(req,res){
	CalculatorModel.findOne({id : req.params.calcId}, function(err, calculator){

		var temp = calculator.toObject();

		delete temp._id;
		delete temp.last_modified;

		return res.render('calculator.html', {
			user : req.user,
			calcId : req.params.calcId,
			calc : temp
		});
	});

});

app.get('/home', [loadUser], function(req,res){
	return res.render('home.html', {
		user : req.user
	});
});

app.get('/register', function(req, res){
	res.render('register.html');
});


///////////////////// Activation

ActivationKeySchema = mongoose.Schema({
	user_id : String,
	key : {
		type : String,
		default : function(){
			return shortId.generate();
		}
	},
	createdAt : { type: Date, default: Date.now }
});
ActivationKey = mongoose.model('ActivationKey', ActivationKeySchema);


app.get('/activate/:key', function(req,res){
	var key = req.params.key;
	var cookie = req.cookies.presto_auth;

	console.log('key', key);
	console.log('auth', req.cookies.presto_auth);

	ActivationKey.findOne({key : key}, function(err, activation){
		if(err){ console.log('err', err);}
		User.findOne({_id : activation.user_id}, function(err, user){
			if(err){ console.log('err', err);}

			user.addCookie(cookie, function(err, user){
				console.log('added cookie');
				return res.render('activate.html');
			});
		});
	});
});


var sendActivationEmail = function(domain, user, callback){
	var newActivationKey = new ActivationKey({user_id : user._id});
	newActivationKey.save(function(error, newKey){
		var url = domain + '/activate/' + newKey.key;
		mail.sendActivationEmail(user, url, callback);
	});
};

app.post('/addLink', function(req,res){
	var domain = req.protocol + "://" + req.get('host');
	var email = req.body.email;
	User.getByEmail(email, function(err, user){
		if(err){ return res.send(500) }
		sendActivationEmail(domain, user, function(error){
			if(error){ return res.send(500)}
			return res.send(200);
		});
	})
});

app.get('/csv/:name', function(req,res){
	res.contentType('text/csv');
	return csv().from(JSON.parse(req.query.data)).to(res)
});



/**
 *  API
 */
var CalculatorModel = mongoose.model('CalculatorModel', mongoose.Schema({
	id          : String,
	title       : String,
	description : String,
	color       : String,
	icon        : String,
	url         : String,
	script      : String,
	keywords    : [String],
	group       : String,
	last_modified : { type: Date, default: Date.now },
}));

//TODO: Add admin checks
app.get('/api/calculator', function(req, res){
	CalculatorModel.find(function(err, calculators){
		res.send(calculators);
	});
});

app.get('/api/calculator/*', function(req, res){
	CalculatorModel.find({id : req.params[0]}, function(err, calculators){
		res.send(calculators[0]);
	});
});

//Create a calculator
app.post('/api/calculator', function(req, res){
	var newCalc = new CalculatorModel(req.body);
	if(!newCalc.id) newCalc.id = newCalc._id;
	newCalc.url = '/calc/' + newCalc.id;
	newCalc.last_modified = new Date();
	newCalc.save(function(error, newCalc){
		res.send(newCalc);
	});
});

app.put('/api/calculator/*', function(req, res){
	var fields = req.body;
	delete fields._id;
	CalculatorModel.findByIdAndUpdate(req.body.id,
		{$set: fields},
		function(err, calculator) {
			if (err) {
				return res.send(500, err.message);
			}
			if (!calculator) {
				return res.send(404);
			}
			return res.send(200, calculator);
		}
	);
});

app.delete('/api/calculator/*', function(req, res){
	return CalculatorModel.findById(req.params[0], function (err, calculator) {
		return calculator.remove(function (err) {
			if (!err) {
				return res.send(200, calculator);
			} else {
				return res.send(500, err.message);
			}
		});
	});
});




/**
 *
 * Experimentation
 *
 */
app.get('/all', [loadUser, adminOnly], function(req, res){
	User.find({}, function(err, users){
		res.send(users);
	});
});

app.get('/allkey', [loadUser, adminOnly], function(req, res){
	ActivationKey.find({}, function(err, keys){
		res.send(keys);
	});
});

app.get('/drop', [loadUser, adminOnly], function(req, res){
	User.remove({}, function(err){
		console.log('All users dropped');
	});
	ActivationKey.remove({}, function(err){
		console.log('All activation keys dropped');
	});
	res.send(200, 'Dropped');
});

app.get('/backup', [loadUser, adminOnly], function(req, res){
	CalculatorModel.find({}, function(err, calcs){
		if(err) return res.send(200, 'Error - ' + err);
		return res.send(calcs);
	});
})









var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});