define([
	'../../app',
	'./projectViews/calendar/projectCalendarView',
	'./projectViews/list/projectListView',
	'./projectViews/routes/routesView',
	'./projectViews/time/timeView',
	'./projectViews/article/articleView',
	'./projectViews/catalog/catalogView',
	'./projectViews/statistic/statisticView',
	'./projectViews/showcase/articleView',
	'./projectViews/charts/chartCalendarView'
], function( app, projectCalendarView, projectListView, routesView, timeView, articleView, catalogView, statisticView, showcaseView, chartCalendarView ) {
    return [
		{
			id:"calendar_view_show", 
			html: function(view){ return '<li id="calendar_view_show" class="viewButtonsIn '+view+'">'+app.translate('Calendar view')+'</li>'; }, 
			view:projectCalendarView,
			dontdrag: true
		}, 
		{
			id:"list_view_show", 
			html: function(view){ return '<li id="list_view_show" class="viewButtonsIn '+view+'">'+app.translate('List view')+'</li>'; }, 
			view:projectListView,
			onAfterRendered: function(parent_model){ $("#the_all_projects").attr('style','width:auto; margin:auto;'); },
			dontdrag: true
		}, 
		{
			id:"routes_view_show", 
			html: function(view){ return '<li id="routes_view_show" class="viewButtonsIn '+view+'">'+app.translate('Routes view')+'</li>'; }, 
			view:routesView,
			dontdrag: true
		}, 
		{
			id:"article_view_show", 
			html: function(view){ return '<li id="article_view_show" class="viewButtonsIn '+view+'">'+app.translate('Article view')+'</li>'; }, 
			view:articleView,
			onAfterRendered: function(parent_model){ 
				//$("#the_all_projects").attr('style','width:auto; margin:auto;'); 
				//$("#the_all_projects_wrapper").css('background',parent_model.get("color"));
			},
			dontdrag: true
		}, 		
		{
			id:"time_view_show", 
			html: function(view){ return '<li id="time_view_show" class="viewButtonsIn '+view+'">'+app.translate('Timeline view')+'</li>'; }, 
			view:timeView,
			onAfterRendered: function(parent_model){ 
				//$("#the_all_projects").attr('style','width:auto; margin:auto;'); 
				//$("#the_all_projects_wrapper").css('background',parent_model.get("color"));
			},
			dontdrag: true
		}, 
		{
			id:"catalog_view_show", 
			html: function(view){ return '<li id="catalog_view_show" class="viewButtonsIn '+view+'">'+app.translate('Catalog view')+'</li>'; }, 
			view:catalogView,
			onAfterRendered: function(parent_model){ 
				//$("#the_all_projects").attr('style','width:auto; margin:auto;'); 
				//$("#the_all_projects_wrapper").css('background',parent_model.get("color"));
			},
			dontdrag: true
		}, 
		{
			id:"statistic_view_show", 
			html: function(view){ return '<li id="statistic_view_show" class="viewButtonsIn '+view+'">'+app.translate('Statistic view')+'</li>'; }, 
			view:statisticView,
			dontdrag: true
		},
		{
			id:"showcase_view_show", 
			html: function(view){ return '<li id="showcase_view_show" class="viewButtonsIn '+view+'">'+app.translate('Showcase view')+'</li>'; }, 
			view:showcaseView,
			onAfterRendered: function(parent_model){ 
				//$("#the_all_projects").attr('style','width:auto; margin:auto;'); 
				//$("#the_all_projects_wrapper").css('background',parent_model.get("color"));
			},
			dontdrag: true
		},
		{
			id:"chart_view_show", 
			html: function(view){ return '<li id="chart_view_show" class="viewButtonsIn '+view+'">'+app.translate('Chart view')+'</li>'; }, 
			view:chartCalendarView,
			onAfterRendered: function(parent_model){ 
				//$("#the_all_projects").attr('style','width:auto; margin:auto;'); 
				//$("#the_all_projects_wrapper").css('background',parent_model.get("color"));
			},
			dontdrag: true
		}
	];
});
