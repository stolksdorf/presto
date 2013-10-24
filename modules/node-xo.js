
var DEBUG = false;

exports.endpoints = [];

//Removes the mongoose properties from the objects
exports.clean = function(obj){
	if(!obj) return obj;
	if(typeof obj.length === 'number'){
		return _.map(obj, function(obj){
			return exports.clean(obj);
		});
	}
	var result = obj.toObject();
	delete result._id;
	delete result.__v;
	return result;
};

exports.api = function(endpoint, Model, middleware, handleError){
	exports.endpoints.push(endpoint);
	middleware = middleware || [];
	var mw = {
		//all  : middleware,
		get  : middleware,
		post : middleware,
		put  : middleware,
		del  : middleware
	};

	if(!_.isArray(middleware)){
		//mw.all  = middleware.all  || [];
		mw.get  = middleware.get  || [];
		mw.post = middleware.post || [];
		mw.put  = middleware.put  || [];
		mw.del  = middleware.del  || [];
	}

	handleError = handleError || function(err, req, res){
		console.log('ERROR:', err);
		res.send(500, err);
	};

	mw.findAll = function(req,res,next){
		Model.find(function(err, documents){
			if(err) return handleError(err, req, res);
			req.documents = documents;
			return next();
		});
	};

	mw.find = function(req,res,next){
		Model.findById(req.params.id, function(err, obj){
			if(err) return handleError(err, req, res);
			req.document = obj;
			return next();
		});
	};

	mw.create = function(req,res,next){
		req.document = new Model(req.body);
		req.document.id = req.document._id;
		return next();
	};

	mw.update = function(req,res,next){
		Model.findById(req.params.id, function(err, obj){
			if(!obj || err) return handleError(err, req, res);
			req.document = _.extend(obj, req.body);
			return next();
		});
	};


	app.get(endpoint, mw.findAll, mw.get, function(req,res){
		return res.send(exports.clean(req.documents) || []);
	});

	app.get(endpoint + '/:id', mw.find, mw.get, function(req,res){
		return res.send(200, exports.clean(req.document) || {});
	});

	app.delete(endpoint + '/:id', mw.find, mw.del, function(req,res){
		if(!req.document) return handleError('no doc', req, res);
		req.document.remove(function(err){
			if(err) return handleError(err, req, res);
			return res.send(200);
		});
	});

	app.post(endpoint, mw.create, mw.post, function(req, res){
		req.document.save(function(err, obj){
			if(err) return handleError(err, req, res);
			return res.send(exports.clean(obj));
		});
	});

	app.put(endpoint + '/:id', mw.update, mw.put, function(req,res){
		req.document.save(function(err, obj){
			if(err) return handleError(err, req, res);
			return res.send(exports.clean(obj));
		});
	});

	//Allow for post updating
	app.post(endpoint + '/:id', mw.update, mw.post, function(req,res){
		req.document.save(function(err, obj){
			if(err) return handleError(err, req, res);
			return res.send(exports.clean(obj));
		});
	});
}