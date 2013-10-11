var mongoose = require('mongoose');


var CalculatorSchema = mongoose.Schema({
	id          : String,
	script      : { type : String, default : fs.readFileSync('default_calculator.js','utf8')},
	created     : { type: Date, default: Date.now },
}, { strict: false });



Calculator = mongoose.model('Calculator', CalculatorSchema);