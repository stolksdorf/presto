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