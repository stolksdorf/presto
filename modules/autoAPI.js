/**
 * Pass a route and a mongoose schema to REST API
 * @param  {string}          route
 * @param  {Mongoose Schema} Model
 */
var createAPI = function(route, Model){
	app.get(route, function(req, res){
		Model.find(function(err, models){
			if(err){ return res.send(500,err); }
			return res.send(200, models);
		});
	});

	app.get(route + '/*', function(req, res){
		Model.find({id : req.params[0]}, function(err, model){
			if(err){ return res.send(500, err); }
			return res.send(200, model[0]);
		});
	});

	app.post(route, function(req, res){
		var newModel = new Model(req.body);
		if(!newModel.id){ newModel.id = newModel._id; }
		newModel.save(function(err, newModel){
			if(err){ return res.send(500, err); }
			return res.send(200, newModel);
		});
	});

	app.put(route + '/*', function(req, res){
		var fields = req.body;
		delete fields._id;
		Model.findByIdAndUpdate(req.body.id,
			{$set: fields},
			function(err, model){
				if(err){ return res.send(500, err); }
				if (!model) {
					return res.send(404);
				}
				return res.send(200, model);
			}
		);
	});

	app.delete(route + '/*', function(req, res){
		Model.findById(req.params[0], function (err, model) {
			return model.remove(function (err) {
				if(err){ return res.send(500, err); }
				return res.send(200, model);
			});
		});
	});
}

