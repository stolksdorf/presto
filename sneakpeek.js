

exports.setup = function(app, mongoose){

	var BetaUsers = mongoose.model('BetaUsers', mongoose.Schema({
		email : String,
		time : Date
	}));

	app.get('/', function (req, res) {
		res.redirect('/sneakpeek');
	});

	app.get('/launch', function(req, res){
		res.redirect('/sneakpeek');
	});

	app.get('/sneakpeek', function(req, res){
		res.render('launch.html');
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

	//Promo calcs
	app.get('/promo1', function(req, res){
		res.render('calculator.html',{
			beta : true,
			//ROP calc
			calcId : '52351d5e77bcb70200000001'
		});
	});
	app.get('/promo2', function(req, res){
		res.render('calculator.html',{
			beta : true,
			//Fixed vs variable
			calcId : '523854d1f0021f0200000001'
		});
	});

	return this;
};