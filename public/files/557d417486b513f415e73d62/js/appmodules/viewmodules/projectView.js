define([
	'../../app',
	'./projectViews/calendar/projectCalendarView',
	'./projectViews/list/projectListView'
], function( app, projectCalendarView, projectListView ) {
    return [
		{
			id:"calendar_view_show", 
			html:'<li id="calendar_view_show" class="viewButtonsIn">'+app.translate('Calendar view')+'</li>', 
			view:projectCalendarView
		}, 
		{
			id:"list_view_show", 
			html:'<li id="list_view_show" class="viewButtonsIn">'+app.translate('List view')+'</li>', 
			view:projectListView,
			onAfterRendered: function(){ $("#the_all_projects").attr('style','width:auto; margin:auto;'); }
		}
	];
});
