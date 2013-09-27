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


//My Modules
var Inked     = require('./Inked.js').setup(app, mongoose);



var sneakpeek = require('./sneakpeek.js').setup(app, mongoose);




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
	//TODO: search up for the user here
	console.log('Showing home', userId);
	res.render('home.html', {beta:false});
});

Inked.setRegisterPage('/register', function(req, res){
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
 * Pass a route and a mongoose schema to REST API
 * @param  {string}          route
 * @param  {Mongoose Schema} Model
 */
var createAPI = function(route, Model){
	app.get(route, function(req, res){
		Model.find(function(err, models){
			if(err){ return res.send(500,err); }
			return res.send(200, models);
		});
	});

	app.get(route + '/*', function(req, res){
		Model.find({id : req.params[0]}, function(err, model){
			if(err){ return res.send(500, err); }
			return res.send(200, model[0]);
		});
	});

	app.post(route, function(req, res){
		var newModel = new Model(req.body);
		if(!newModel.id){ newModel.id = newModel._id; }
		newModel.save(function(err, newModel){
			if(err){ return res.send(500, err); }
			return res.send(200, newModel);
		});
	});

	app.put(route + '/*', function(req, res){
		var fields = req.body;
		delete fields._id;
		Model.findByIdAndUpdate(req.body.id,
			{$set: fields},
			function(err, model){
				if(err){ return res.send(500, err); }
				if (!model) {
					return res.send(404);
				}
				return res.send(200, model);
			}
		);
	});

	app.delete(route + '/*', function(req, res){
		Model.findById(req.params[0], function (err, model) {
			return model.remove(function (err) {
				if(err){ return res.send(500, err); }
				return res.send(200, model);
			});
		});
	});
}



/**
 *
 * Experimentation
 *
 */
app.get('/inkedall', function(req, res){
	Inked.all(function(users){
		res.send(users);
	});
});













var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});