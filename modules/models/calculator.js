var mongoose = require('mongoose');


var CalculatorSchema = mongoose.Schema({
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
});



Calculator = mongoose.model('Calculator', CalculatorSchema);