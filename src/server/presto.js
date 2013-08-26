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
app.post('/api/addcalc', function(req, res){
	console.log(req);
	res.send({
		id : 'superTest',
		time : new Date().toString()
	});
});



//Mongoose test

var Kitten = mongoose.model('Kitten', mongoose.Schema({
	name: String
}));



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

app.get('/reset', function(req, res){
	mongoose.connection.db.dropDatabase();
	new Kitten().save();
	res.send('db dropped');
})







var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});