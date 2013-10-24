PrestoAdmin = xo.view.extend({

	start : function(endpoints){

		var self = this;

		_.each(endpoints, function(ep){
			var model;
			if(ep === '/api/calculators'){
				model = Presto_Model_Calculator;
			}else {
				model = xo.model.extend({
					urlRoot : ep
				});
			}

			var col = xo.collection.extend({
				model : model
			});

			var group = Presto_View_EndpointGroup.create(col);
			group.injectInto($('.routes'));
			col.fetch();
		});

		this.content = Presto_View_Content.create();

		return this;
	},

	loadContent : function(newContent){

		this.content.load(newContent);

		return this;
	},


});

parseText = function(text){
	var result = [];
	var slush = '';
	var inCalc = false;
	var count = 0;
	for(i in text){
		var letter = text[i];

		if(letter === '{' && !inCalc){
			inCalc = true;
			count = 1;
		} else if(letter === '{' && inCalc){
			count++;
		}

		if(letter === '}' && inCalc){
			count--;
			if(count === 0){
				slush += '}';
				result.push(slush);
				slush = '';
				inCalc = false;
			}
		}
		if(inCalc){
			slush += letter;
		}

	}
	return result;
}