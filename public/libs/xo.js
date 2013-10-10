(function(){

	jQuery("<style type='text/css'> [xo-schematic]{display:none !important;} </style>").appendTo("head");

	XO = {};

	XO.Block = Backbone.View.extend({
		block     : '',
		schematic : '',

		initialize : function(model)
		{
			this._setup(model);
			return this;
		},

		_setup : function(model)
		{
			this.dom = this.dom || {};
			if(model instanceof Backbone.Model){
				this.model = model;
			} else {
				this.model = new XO.Model(model);
			}
			if(this.block !== ''){
				this.dom.block = jQuery('[xo-block="' + this.block + '"]');
				this.getElements();
				this.render.apply(this, arguments);
			}
			return this;
		},

		injectInto : function(injectionPoint, options)
		{
			options = options || {};
			this.dom = this.dom || {};
			if(injectionPoint.length === 0 ){throw 'XO: Could not find the injection point';}
			if(this.schematic === ''){throw 'XO: Schematic name not set' ;}
			this.trigger('before:inject', this);
			if(options.at_top){
				this.dom.block = this.getSchematic(this.schematic).prependTo(injectionPoint);
			} else {
				this.dom.block = this.getSchematic(this.schematic).appendTo(injectionPoint);
			}
			this.getElements().render();
			this.trigger('inject', this);
			return this;
		},

		getSchematic : function(schematicName)
		{
			var schematicElement = jQuery('[xo-schematic="' + schematicName + '"]');
			if(schematicElement.length === 0 ){throw 'XO: Could not find schematic with name "' + schematicName + '"';}
			var schematicCode    = jQuery('<div>').append(schematicElement.clone().removeAttr('xo-schematic')).html();
			return jQuery(schematicCode);
		},

		getElements : function()
		{
			var self = this;
			this.dom.block.find('[xo-element]').each(function(index, element){
				self.dom[jQuery(element).attr('xo-element')] = jQuery(element);
			});
			return this;
		},

		render : function()
		{
			return this;
		},

		remove : function()
		{
			if(this.dom.block) this.dom.block.remove();
			this.stopListening();
			return this;
		}
	});



	XO.Model = Backbone.Model.extend({

		/**
		 * [onChange description]
		 * @param  {[type]} attrName [description]
		 * @param  {[type]} event    [description]
		 * @return {[type]}          [description]
		 */
		onChange : function(attrName, event)
		{
			var self = this;
			this.on('change:' + attrName, function(){
				event(self.get(attrName));
			});
			event(this.get(attrName));
			return this;
		},

		/**
		 * [toJSONString description]
		 * @return {[type]} [description]
		 */
		toJSONString: function()
		{
			return JSON.stringify(this.toJSON());
		},

		log : function()
		{
			console.log(this.attributes);
			return this;
		},
	});



	XO.Collection = Backbone.Collection.extend({
		model : XO.Model,
		//Adds a new model model to the collection and saves it to the server
		addNew : function(newModel)
		{
			if(!(newModel instanceof this.model)){
				newModel = new this.model(newModel);
			}
			this.add(newModel);
			newModel.save({wait:true});
			return this;
		}
	});
	XO.Controller = Backbone.Router.extend({});


})();




xo_view = Archetype.extend({
	schematic : undefined,

	initialize : function(model)
	{
		this.model = model;
		return this;
	},

	bindToView : function(viewName)
	{
		var target = $('[xo-view="' + viewName + '"');
		this.dom = this.dom || {};
		return this;
	},

	injectInto : function(target, options)
	{
		var self = this;
		options = options || {};
		this.dom = this.dom || {};
		if(target.length === 0 ){throw 'XO: Could not find the injection point';}

		var getSchematic = function(schematicName){
			var schematicElement = jQuery('[xo-schematic="' + schematicName + '"]');
			if(schematicElement.length === 0 ){throw 'ERROR: Could not find schematic with name "' + schematicName + '"';}
			var schematicCode = jQuery('<div>').append(schematicElement.clone().removeAttr('xo-schematic')).html();
			return jQuery(schematicCode);
		};

		if(this.schematic === ''){throw 'XO: Schematic name not set' ;}
		if(options.at_top){
			this.dom.block = getSchematic(this.schematic).prependTo(target);
		} else {
			this.dom.block = getSchematic(this.schematic).appendTo(target);
		}
		//build internal dom object
		this.dom.block.find('[xo-element]').each(function(index, element){
			self.dom[jQuery(element).attr('xo-element')] = jQuery(element);
		});
		this.render();
		return this;
	},

	render : function()
	{
		return this;
	},

	remove : function()
	{
		this.dom = this.dom || {};
		if(this.dom.block) this.dom.block.remove();
		this.off();
		return this;
	},
});



model_ajax = function(self, name, type, callback, errorCallback){
	if(!self.urlRoot) throw "XO: No url set";
	self.trigger('before:'+ name, self);
	var url = self.urlRoot + (self.id ? "/" + self.id : "");
	console.log('URL', url);
	jQuery.ajax({
		url : url,
		type : type,
		data : self.attributes(),
		success : function(result){
			self.set(result);
			if(typeof callback === 'function') callback(self);
			self.trigger(name, self);
			return;
		},
		error : function(result){
			if(typeof errorCallback === 'function') errorCallback(self);
			self.trigger('error:'+ name, result);
			return self;
		},
	});
}


xo_model = Archetype.extend({
	urlRoot : undefined,

	initialize : function(obj)
	{
		this.set(obj);
		return this;
	},

	set : function(key, value)
	{
		console.log('SEETING', key, value);
		if(typeof key === 'object' && typeof value === 'undefined'){
			var self = this;
			_.each(key, function(v, k){
				self.set(k,v);
			});
			this.trigger('change');
			return this;
		}
		if(this[key] !== value){
			this[key] = value;
			this.trigger('change:' + key, value);
		}
		return this;
	},

	onChange : function(attrName, event)
	{
		var self = this;
		this.on('change:' + attrName, function(){
			event(self.get(attrName));
		});
		event(this[attrName]);
		return this;
	},

	attributes : function()
	{
		var self = this;
		return _.reduce(this, function(result, v,k){
			if(k === '__events__' || k === '__super__') return result;
			result[k] = v;
			return result;
		}, {});
	},

	toJSON : function()
	{
		return JSON.stringify(this.attributes());
	},



	save : function(callback, errorCallback)
	{
		model_ajax(this, 'save', 'POST', callback, errorCallback);
		return this;
	},

	fetch : function(callback)
	{
		model_ajax(this, 'fetch', 'GET', callback, errorCallback);
		return this;
	},

	delete : function(callback)
	{
		model_ajax(this, 'delete', 'DELETE', callback, errorCallback);
		return this;
	},

	fetchAll : function(callback)
	{

		model_ajax(this, 'fetch_all', 'GET', callback, errorCallback);
		return this;
	},


});



jQuery.getSchematic = function(schematicName){
	var schematicElement = jQuery('[xo-schematic="' + schematicName + '"]');
	if(schematicElement.length === 0 ){throw 'ERROR: Could not find schematic with name "' + schematicName + '"';}
	var schematicCode = jQuery('<div>').append(schematicElement.clone().removeAttr('xo-schematic')).html();
	return jQuery(schematicCode);
};


