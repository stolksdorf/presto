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



//errorHandler = ;


//Routes
app.get('/', function (req, res) {
	res.render('home.html');
});

app.get('/calc/*', function (req, res) {
	res.render('calculator.html');
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






app.get('/reset', function(req, res){
	mongoose.connection.db.dropDatabase();
	res.send('db dropped');
});



app.get('/add', function(req,res){

	var LTC = new CalculatorModel({
		title : 'LTC Price Comparison',
		description : 'Super cool thing',
		icon : 'icon-plane',
			color       : 'blue',
			script      : "{\n		title : 'LTC Price Comparison',\n		description : 'Super cool thing',\n		icon : 'icon-plane',\n\n		inputs : {\n			inflationGuard : {\n				title : 'Inflation Guard (off-claim)',\n				description : 'The estimated inflation rate while off-claim',\n				type : Type.Percent,\n				value : 0.02\n			},\n			onClaim : {\n				title : 'On-Claim',\n				type : Type.Percent,\n				value : 0.03\n			},\n			unguarded : {\n				title : 'Unguarded Benefit',\n				type : Type.Money,\n				value : 650\n			},\n			guarded : {\n				title : 'Guarded Benefit',\n				type : Type.Money,\n				value : 500\n			},\n			age : {\n				title : 'Age',\n				type : Type.Number,\n				value : 25\n			},\n			notes : {\n				title : 'Notes',\n				type : Type.Text,\n				value : 'Cool stuff'\n			}\n		},\n\n		chart : {\n			title : 'LTC Run Down',\n			columns : {\n				age : {\n					title : 'Age',\n					type : Type.Number,\n					value : function(){\n						return Inputs.age;\n					},\n					fn : Functions.Increment()\n				},\n				benefitBase : {\n					title : 'Benefit Base',\n					type : Type.Money,\n					value : function(){\n						return Inputs.guarded;\n					},\n					fn : function(index, previousCellValue){\n						return previousCellValue*(1 + Inputs.inflationGuard);\n					}\n				},\n				onClaim : {\n					title : 'On-Claim',\n					type : Type.Money,\n					value : function(){\n						return Inputs.guarded;\n					},\n					fn : function(index, previousCellValue){\n						return previousCellValue*(1 + Inputs.onClaim);\n					}\n				},\n			}\n		},\n\n		outputs : {\n			breakEvenOff : {\n				title : 'Breakeven (off-claim)',\n				description : 'Age at which youll make back your initial investment',\n				type : Type.Number,\n				value : function(){\n					var breakEvenAge = Chart.age.find(function(index, age){\n						if(Chart.benefitBase[index] > Inputs.unguarded){\n							return true;\n						}\n						return false;\n					});\n					return breakEvenAge;\n				}\n			},\n			breakEvenOn : {\n				title : 'Breakeven (on-claim)',\n				type : Type.Number,\n				value : function(){\n					var breakEvenAge = Chart.age.find(function(index, age){\n						if(Chart.onClaim[index] > Inputs.guarded){\n							return true;\n						}\n						return false;\n					});\n					return breakEvenAge;\n				}\n			}\n		}\n	}",
			url         : ''

	});
	if(!LTC.id) LTC.id = LTC._id;
	LTC.url = '/calc/' + LTC.id;
	LTC.save(function(error, LTC){
		res.send(LTC);
	});
})












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