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




/*
app.configure(function(){
        app.set('views', __dirname + '/views');
        app.use(express.static(__dirname + '/public'));
});
*/


app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));


//Schema
var CalculatorModel = mongoose.model('CalculatorModel', mongoose.Schema({
	id       : String,
	title       : String,
	description : String,
	color       : String,
	icon        : String,
	url         : String,
	script      : String
}));



//Routes
app.get('/', function (req, res) {
	res.render('home.html',
	{ title : 'Home' }
	);
});

app.get('/calc/*', function(req,res){
	res.send('trying to load calc' + req.params[0])
})



	//Add a calc
app.get('/api/calculator', function(req, res){
	console.log('getting calcs');
	CalculatorModel.find(function(err, calculators){
		res.send(calculators);
	});
});

app.post('/api/calculator', function(req, res){

	var newCalc = new CalculatorModel(req.body);
	newCalc.id = newCalc._id;
	newCalc.url = '/calc/' + newCalc.id;

	console.log('saving' ,newCalc);
	newCalc.save(function(error, newCalc){
		res.send(newCalc);
	});
});

app.get('/reset', function(req, res){
	mongoose.connection.db.dropDatabase();
	res.send('db dropped');
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