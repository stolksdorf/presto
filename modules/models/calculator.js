var mongoose = require('mongoose');


var CalculatorSchema = mongoose.Schema({
	id          : String,
	script      : { type : String, default : fs.readFileSync('default_calculator.js','utf8')},
	created     : { type: Date, default: Date.now },
}, { strict: false });


CalculatorSchema.post('save', function(calc){
	if(!calc.id) calc.id = calc._id;
	calc.script = calc.script.replace('{{ID}}', calc.id);

	//HACK : For making sure the script has an id
	if(calc.script.indexOf('id') > 10 || calc.script.indexOf('id') === -1){
		calc.script = calc.script.slice(0, 3) + "id:'" + calc.id + "',\n\t" + calc.script.slice(3);
	}

	calc.update({
		script : calc.script,
		id : calc.id
	}, function(err){});
});

Calculator = mongoose.model('Calculator', CalculatorSchema);