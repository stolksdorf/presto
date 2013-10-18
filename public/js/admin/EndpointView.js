Presto_View_Endpoint = xo.view.extend({
	schematic : 'endpoint',


	render : function(){
		var self = this;
		this.dom.block.text(this.model.email || this.model.title || this.model.id);

		this.model.on('delete', function(){
			self.remove();
		});

		this.dom.block.click(function(){
			$('.selected').removeClass('selected');
			self.dom.block.addClass('selected');
			PrestoAdmin.loadContent(self.model);
		});

		return this;
	},
});