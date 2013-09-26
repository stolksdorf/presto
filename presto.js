var express = require("express");
var app = express();

var mongoUri = process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/presto';


var mongoose = require('mongoose');


mongoose.connect(mongoUri);
mongoose.connection.on('error', function(){
	console.log(">>>ERROR: Connect Mongodb ya goof!");
});

app.set('title', 'Presto');
app.engine('html', require('ejs').renderFile);



app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));


var Inked = require('./Inked.js').setup(app, mongoose);
var sneakpeek = require('./sneakpeek.js');


sneakpeek.setup(app, mongoose);




//Schemas

var PrestoUser = mongoose.model('PrestoUser', mongoose.Schema({
	name : String,
	email : String,
	account_type : String,
	date: { type: Date, default: Date.now },
}));



//Routes
app.get('/calc/*', function (req, res) {
	res.render('calculator.html',{
		beta : false,
		calcId : req.params[0]
	});
});


//Browser finger printing
Inked.route('/v0', function(req,res,userId){
	res.render('home.html', {beta:false});
});

Inked.setRegister('/register', function(req, res){
	res.render('register.html');
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
	last_modified : Date
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
				console.log("removed");
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


app.get('/fp', function(req, res){
	var un = req.query.username;
	var fp = req.query.fingerprint;
	var cc = req.query.collisionCookie;


	Inked.get(fp,cc, function(err, user){
		console.log(err,user);
		res.send(200, user);
	});

});

app.post('/fp', function(req, res){
	var un = req.body.username;
	var fp = req.body.fingerprint;
	var cc = req.body.collisionCookie;

	Inked.add(un,fp,cc, function(err, user){
		if(err){
			console.log('ERROR', err);
			return res.send(500, err);
		}
		return res.send(200, user);
	});

});

app.get('/fpall', function(req, res){

	Inked.all(function(users){
		res.send(users);
	});


});













var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});