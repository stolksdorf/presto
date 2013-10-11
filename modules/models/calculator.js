var mongoose = require('mongoose');


var CalculatorSchema = mongoose.Schema({
	id          : String,
	title       : String,
	description : String,
	color       : String,
	icon        : String,
	script      : { type : String, default : fs.readFileSync('default_calculator.js','utf8')},
	keywords    : [String],
	group       : String,
	created : { type: Date, default: Date.now },
});



Calculator = mongoose.model('Calculator', CalculatorSchema);