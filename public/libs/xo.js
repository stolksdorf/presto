jQuery.getSchematic = function(schematicName){
	var schematicElement = jQuery('[xo-schematic="' + schematicName + '"]');
	if(schematicElement.length === 0 ){throw 'ERROR: Could not find schematic with name "' + schematicName + '"';}
	var schematicCode = jQuery('<div>').append(schematicElement.clone().removeAttr('xo-schematic')).html();
	return jQuery(schematicCode);
};

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






























;(function(){
	jQuery("<style type='text/css'> [xo-schematic]{display:none !important;} </style>").appendTo("head");

	var xo_ajax = function(args){
		var self = this;
		if(!args.url) throw 'XO : Url not set';
		var callback = args.callback || function(){};
		var http = {
			'fetch ' : 'GET',
			'save'   : (self.id ? 'PUT' : 'POST'),
			'delete' : 'DELETE'
		};
		self.trigger('before:'+args.type, self);
		jQuery.ajax({
			url  : args.url + (self.id ? "/" + self.id : ""),
			type : http[args.type],
			data : args.data,
			success : function(data){
				args.success.call(self, data);
				callback(undefined, self);
				self.trigger(args.type, self);
			},
			error : function(err){
				callback(err);
				self.trigger('error');
				self.trigger('error:'+args.type, err);
			},
		});
	};

	xo = {
		view : Archetype.extend({
			view      : undefined,
			schematic : undefined,

			bindToView : function()
			{
				this.dom = this.dom || {};
				this.dom.block = jQuery('[xo-view="' + this.view + '"');
				this.dom.block.find('[xo-element]').each(function(index, element){
					self.dom[jQuery(element).attr('xo-element')] = jQuery(element);
				});
				this.render();
				return this;
			},
			injectInto : function(target, options)
			{
				var self = this;
				options = options || {};
				this.dom = this.dom || {};
				if(target.length === 0 ){throw 'XO: Could not find target';}
				if(!this.schematic){throw 'XO: Schematic name not set' ;}

				var getSchematic = function(schematicName){
					var schematicElement = jQuery('[xo-schematic="' + schematicName + '"]');
					if(schematicElement.length === 0 ){throw 'XO: Could not find schematic with name "' + schematicName + '"';}
					var schematicCode = jQuery('<div>').append(schematicElement.clone().removeAttr('xo-schematic')).html();
					return jQuery(schematicCode);
				};

				if(options.at_top){
					this.dom.block = getSchematic(this.schematic).prependTo(target);
				} else {
					this.dom.block = getSchematic(this.schematic).appendTo(target);
				}
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
		}),

		model : Archetype.extend({
			urlRoot : undefined,

			initialize : function(obj)
			{
				this.set(obj);
				return this;
			},
			set : function(key, value)
			{
				if(typeof key === 'object' && typeof value === 'undefined'){
					var self = this;
					_.map(key, function(v, k){
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
					event(self[attrName]);
				});
				event(this[attrName]);
				return this;
			},
			attributes : function()
			{
				var self = this;
				return _.reduce(this, function(result, v,k){
					if(	k === '__events__' ||
						k === '__super__' ||
						k === 'urlRoot' ||
						typeof v ==='function'){ return result;}
					result[k] = v;
					return result;
				}, {});
			},
			toJSON : function()
			{
				return JSON.stringify(this.attributes());
			},
			save : function(callback)
			{
				xo_ajax.call(this,{
					url  : this.urlRoot,
					type : 'save',
					data : this.attributes(),
					callback : callback,
					success : function(data){
						this.set(data);
					}
				});
				return this;
			},
			fetch : function(callback)
			{
				xo_ajax.call(this,{
					url  : this.urlRoot,
					type : 'fetch',
					callback : callback,
					success : function(data){
						this.set(data);
					}
				});
				return this;
			},
			delete : function(callback)
			{
				xo_ajax.call(this,{
					url  : this.urlRoot,
					type : 'delete',
					callback : callback
				});
				return this;
			},
		}),

		collection : Archetype.extend({
			model : undefined,

			extend : function(props)
			{
				var col = _.extend([], this, props);
				col.initialize();
				return col;
			},
			create : function(arr)
			{
				arr = arr || [];
				var col = _.extend(arr, this)
				col.initialize();
				return col;
			},
			add : function(obj)
			{
				this.push(this.model.create(obj));
				this.trigger('add', obj);
				return this;
			},
			clear : function()
			{
				self.length = 0;
				return this;
			},
			fetch : function(callback)
			{
				xo_ajax.call(this,{
					url  : this.model.urlRoot,
					type : 'fetch',
					callback : callback,
					success : function(data){
						var self = this;
						this.clear();
						_.map(data, function(data){
							self.add(data);
						});
					}
				});
				return this;
			},
			delete : function(callback)
			{
				xo_ajax.call(this,{
					url  : this.model.urlRoot,
					type : 'delete',
					callback : callback,
					success : function(data){
						this.clear();
					}
				});
				return this;
			},
			save : function(callback)
			{
				var self = this,
					count = this.length;
				this.trigger('before:save', this);
				this.clear();
				_.map(this, function(model){
					model.save(function(err, data){
						count--;
						self.add(data);
						if(typeof callback === 'function'){
							if(count === 0){
								self.trigger('save', self);
								callback(undefined, self);
							}
							if(err){
								self.trigger('error:save', self);
								callback(err);
							}
						}
					});
				});
				return this;
			},
		})
	};

})();





