define([
	'../../app',
	'./entryViews/photobook/photobookView'
], function( app, photobookView ) {
    return [
		{
			id:"photobook_view_show", 
			html: function(model){ photobookView.setModel(model); return photobookView.innerHtml(); }, 
			view:photobookView,
			show_main_html:false,
			onRender: function(){
				photobookView.onRender();
			},
			onAfterRendered: function(parent_model){ 
				//$("#the_all_projects_wrapper").css("background", parent_model.get("color"));
			}
		}
	];
});
