PrestoAdmin = xo.view.extend({

	start : function(endpoints){

		var self = this;

		_.each(endpoints, function(ep){
			var collection;
			if(ep === '/api/calculators'){
				collection = xo.collection.extend({
					model : Presto_Model_Calculator
				});
				self.calculators = collection
			}else {
				collection = xo.collection.extend({
					model : xo.model.extend({
						urlRoot : ep
					})
				});
			}

			var group = Presto_View_EndpointGroup.create(collection);
			group.injectInto($('.routes__container'));
			collection.fetch();
		});

		this.content = Presto_View_Content.create();



		//Loads All the calculator scripts to text area
		$('.BACKUP').click(function(){

			self.content.dom.buttons.hide()
			self.content.dom.data.val(
				"[" + _.map(self.calculators, function(calc){
					return calc.script;
				}) + "]"
				);

			self.content.resize();
		});

		$('.RESTORE').click(function(){

			if(!confirm("Delete all current calcaultors and restore with code in box?")){
				return;
			}
			var calcData = parseText(self.content.dom.data.val());

			if(calcData.length === 0){
				alert('No restore calculator data found');
				return;
			}

			console.log(calcData);

		});


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