define([
    '../../../app',
    'models/base',
    'underscore',
    '../views/entryView',
    'models/project'
], function( app, base, _, entryView, project ) {
    return base.extend({
        show: function(options){
			var search = options.search;
			this.search(search);
        },
		getSearch: function(inputString){
			$.get("/projectsFind/"+inputString+'/'+app.userData._id, function(data) {
				var showSearch = '';
				var find = 0;
				for(var i=0; i < data.length; i++){
					if(data[i].name.match(inputString)){
						showSearch += '<a onclick="removeValueFromSearch()" href="#/entry/'+data[i]._id+'"><div class="break searchOne">'+data[i].name+'</div></a>';
					find++;
					}
					if(data[i].text.match(inputString)){
						showSearch += '<a onclick="removeValueFromSearch()" href="#/entry/'+data[i]._id+'"><div class="break searchOne">'+data[i].text+'</div></a>';
					find++;
					}
				}
				if(find == 0){
					showSearch = app.translate('No results found');
				}
				$('#main').html(showSearch);
			});
		},
		search: function(inputString){
		if(typeof app.userData == 'undefined'){
			app.vent.on('data:triggered:userconnected', function () {
				this.getSearch(inputString);
			}.bind(this));
		}else{
			this.getSearch(inputString);
		}

		}
    });
});