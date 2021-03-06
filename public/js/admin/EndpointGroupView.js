Presto_View_EndpointGroup = xo.view.extend({
	schematic : 'endpointGroup',

	initialize : function(){
		this.collection = this.model;
		return this;
	},


	render : function(){
		var self = this;

		this.dom.title.text(this.collection.urlRoot);

		this.endpointViews = [];

		this.collection.on('add', function(endpoint){

			_.each(self.endpointViews, function(epv){
				epv.remove();
			});

			_.each(self.collection, function(endpoint){
				var newV = Presto_View_Endpoint.create(endpoint);
				newV.injectInto(self.dom.container);
				self.endpointViews.push(newV);
			});

		});


		this.dom.title.click(function(){
			$('.selected').removeClass('selected');
			self.dom.block.addClass('selected');
			PrestoAdmin.loadContent(self.collection);
		});

		return this;
	},





})