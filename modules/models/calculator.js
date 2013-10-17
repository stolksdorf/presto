var mongoose = require('mongoose');


var CalculatorSchema = mongoose.Schema({
	id          : String,
	script      : { type : String, default : fs.readFileSync('default_calculator.js','utf8')},
	created     : { type: Date, default: Date.now },
}, { strict: false });


CalculatorSchema.post('save', function(calc){
	calc.script = calc.script.replace('{{ID}}', calc.id);
	calc.update({script : calc.script.replace('{{ID}}', calc.id)}, function(err){});
});

Calculator = mongoose.model('Calculator', CalculatorSchema);