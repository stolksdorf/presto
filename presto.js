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


//Schema
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


var BetaUsers = mongoose.model('BetaUsers', mongoose.Schema({
	email : String,
	time : Date
}));





//Routes
app.get('/', function (req, res) {
	res.redirect('/v0');
});

app.get('/calc/*', function (req, res) {
	res.render('calculator.html',{
		beta : false,
		calcId : req.params[0]
	});
});

app.get('/v0', function(req, res){
	res.render('home.html', {beta:false});
});


app.get('/launch', function(req, res){
	res.render('launch.html');
});


//Beta Routes not working
/*
app.get('/beta', function (req, res) {
	res.render('home.html', {beta : true});
});

app.get('/beta/calc/*', function (req, res) {
	res.render('calculator.html',{
		beta : true,
		calcId : req.params[0]
	});
});
*/


//Promo calcs
app.get('/promo1', function(req, res){
	res.render('calculator.html',{
		beta : true,
		calcId : '5235efea5b067b0200000001'
	});
});
app.get('/promo2', function(req, res){
	res.render('calculator.html',{
		beta : true,
		calcId : '5224b01edbcf7e0200000002'
	});
});
app.get('/promo3', function(req, res){
	res.render('calculator.html',{
		beta : true,
		calcId : '5225fd4c26539b0200000001'
	});
});
app.get('/promo4', function(req, res){
	res.render('calculator.html',{
		beta : true,
		calcId : '5224a0d9dbcf7e0200000001'
	});
});




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




app.post('/signup', function(req, res){
	if(!/(.+)@(.+){2,}\.(.+){2,}/.test(req.body.email)){
		console.log('no good');
		return res.send(500, 'invalid');
	}

	var newUser = new BetaUsers({
		email : req.body.email,
		time : new Date()
	});

	newUser.save(function(error){
		if(!error){
			console.log('added new user!');
			return res.send(200);
		}
		console.log('bad save');
		return res.send(500);
	});
});









//Mongoose test


/*

app.get('/add', function(req, res){
	console.log(req.query);
	var newCat = new Kitten({name : req.query.name});

	newCat.save(function(error, newCat){
		res.send("added " + newCat.name);
	});
});

app.get('/get', function(req, res){
	Kitten.find(function(err, kittens){
		res.send(kittens);
	});
});

*/







var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});