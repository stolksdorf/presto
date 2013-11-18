Presto_View_Endpoint = xo.view.extend({
	schematic : 'endpoint',


	render : function(){
		var self = this;
		this.model.on('change', function(){
			self.dom.view.text(self.model.email || self.model.title || self.model.id);
		});

		this.dom.view.text(this.model.email || this.model.title || this.model.id);

		this.model.on('delete', function(){
			self.remove();
		});

		this.dom.view.click(function(){
			$('.selected').removeClass('selected');
			self.dom.view.addClass('selected');
			PrestoAdmin.loadContent(self.model);
		});

		return this;
	},
});