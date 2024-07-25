define([
	'../../app',//app.translate('Calendar view')
	'./customData/taskDataView',
	'./customData/routeDataView',
	'./customData/formsDataView',
	'./customData/submDataView',
	'./customData/historyDataView',
	'./customData/countDataView',
	'./customData/statsDataView'
], function( app, taskDataView, routesDataView, formsDataView, submDataView, historyDataView, countDataView, statsDataView ) {
    return [
		{
		id:"historyy_data", 
		innerHtml: function(){
			if(location.href.indexOf("/entry/") > -1){
				return historyDataView.innerHtml();
			}else{
				return '';
			}
		},
		onRerender: function(){
			if(location.href.indexOf("/entry/") > -1){
				historyDataView.onRerender();
			}
		},
		onRender: function(){
			if(location.href.indexOf("/entry/") > -1){
				historyDataView.onRender();
			}
		},
		buttonHtml: function(model){
			if(location.href.indexOf("/entry/") > -1){
				this.model = model;
				historyDataView.setModel(model);
				return '<button id="historyy_info_view" class="right_model_menu"><div class="glyphicon glyphicon-hourglass icon-in-menu icon-turn-off" aria-hidden="true"></div></button>';
			}else{
				return '';
			}
		}
		},
		{
		id:"countt_data", 
		innerHtml: function(){
			if(location.href.indexOf("/entry/") > -1){
				return countDataView.innerHtml();
			}else{
				return "";
			}
		},
		onRerender: function(){
			if(location.href.indexOf("/entry/") > -1){
				countDataView.onRerender();
			}
		},
		onRender: function(){
			if(location.href.indexOf("/entry/") > -1){
				countDataView.onRender();
			}
		},
		buttonHtml: function(model){
			if(location.href.indexOf("/entry/") > -1){
				this.model = model;
				countDataView.setModel(model);
				return '<button id="countt_info_view" class="right_model_menu"><div class="glyphicon glyphicon-screenshot icon-in-menu icon-turn-off" aria-hidden="true"></div></button>';
			}else{
				return '';
			}
		}
		},
		{
		id:"tasks_data", 
		innerHtml: function(){
			return taskDataView.innerHtml();
		},
		onRerender: function(){
			taskDataView.onRerender();
		},
		onRender: function(){
			taskDataView.onRender();
		},
		buttonHtml: function(model){
			this.model = model;
			taskDataView.setModel(model);
			return '<button id="tasks_info_view" class="right_model_menu"><div class="glyphicon glyphicon-calendar icon-in-menu icon-turn-off" aria-hidden="true"></div> '+app.translate('Calendar')+' (<span id="tasksNumb">'+this.model.get('tasks').filter(function(e){return e}).length+'</span>)</button>';
		}
		},
		{
		id:"routes_data", 
		innerHtml: function(){
			return routesDataView.innerHtml();
		},
		onRerender: function(){
			routesDataView.onRerender();
		},
		onRender: function(){
			routesDataView.onRender();
		},
		buttonHtml: function(model){
			this.model = model;
			var routesData = JSON.parse(this.model.get('routes_data'));
			routesDataView.setModel(model);
			return '<button id="routes_info_view" class="right_model_menu"><div class="glyphicon glyphicon-road icon-in-menu icon-turn-off" aria-hidden="true"></div> '+app.translate('Routes')+' (<span id="routesNumb">'+routesData.filter(function(e){return e}).length+'</span>)</button>';
		}
		},
		{
		id:"statsdats_data", 
		innerHtml: function(){
			return statsDataView.innerHtml();
		},
		onRerender: function(){
			statsDataView.onRerender();
		},
		onRender: function(){
			statsDataView.onRender();
		},
		buttonHtml: function(model){
			this.model = model;
			var routesData = JSON.parse(this.model.get('statsdats_data'));
			statsDataView.setModel(model);
			return '<button id="statsdats_info_view" class="right_model_menu"><div class="glyphicon glyphicon-stats icon-in-menu icon-turn-off" aria-hidden="true"></div> '+app.translate('Statistics')+' (<span id="statsdatsNumb">'+routesData.filter(function(e){return e}).length+'</span>)</button>';
		}
		},
		{
		id:"forms_data", 
		innerHtml: function(){
			return formsDataView.innerHtml();

		},
		onRerender: function(){
				formsDataView.onRerender();
			
		},
		onRender: function(){
				formsDataView.onRender();
			
		},
		buttonHtml: function(model){
				this.model = model;
				var formsData = JSON.parse(this.model.get('forms_data'));
				formsDataView.setModel(model);
				return '<button id="forms_data_info_view" class="right_model_menu"><div class="glyphicon glyphicon-th-list icon-in-menu icon-turn-off" aria-hidden="true"></div> '+app.translate('Forms')+' (<span id="formsdataNumb">'+formsData.filter(function(e){return e}).length+'</span>)</button>';

		}
		},
		{
		id:"subm_data", 
		innerHtml: function(){
			if(location.href.indexOf("/entry/") > -1){
				return submDataView.innerHtml();
			}else{
				return "";
			}
		},
		onRerender: function(){
			if(location.href.indexOf("/entry/") > -1){
				submDataView.onRerender();
			}
		},
		onRender: function(){
			if(location.href.indexOf("/entry/") > -1){
				submDataView.onRender();
			}
		},
		buttonHtml: function(model){
			if(location.href.indexOf("/entry/") > -1){
				this.model = model;
				submDataView.setModel(model);
				return '<button id="submitted_data_info_view" class="right_model_menu"><div class="glyphicon glyphicon-tasks icon-in-menu icon-turn-off" aria-hidden="true"></div>(<span id="formssubmNumb_got_data_submittted_data"></span>)</button>';
			}else{
				return "";
			}
		}
		}
	];
});