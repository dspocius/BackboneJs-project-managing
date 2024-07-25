define([
	'../../app',
	'./listViews/list/listGridView'
], function( app, listGridView ) {
    return [
		{
			id:"list_view_show", 
			html: function(view){ return '<li id="list_view_show" class="viewButtonsIn '+view+'">'+app.translate('List view')+'</li>'; }, 
			view:listGridView,
			onAfterRendered: function(parent_model){ 
				$("#the_all_projects_wrapper").css("background", parent_model.get("color"));
			}
		}
	];
});
