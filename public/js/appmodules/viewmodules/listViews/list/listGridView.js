define([
	'../../../../app',
	'views/templateHelpers',
    'marionette',
    './listGridRowView',
    'tpl!./listGrid.html',
	'views/BaseGridView'
], function (app,templateHelpers,Marionette, projectGridRowView, projectGrid, BaseGridView) {
    'use strict';

    var view = BaseGridView.extend({
		templateHelpers:templateHelpers,
        template:projectGrid,
        itemView:projectGridRowView,
        itemViewContainer:'.projects div',
        className:'projects_one_in_header projects_one_in_list projects_list_data_only',
        initialize:function(options){
			this.numberOfHead = 0;
			this.listenTo(this.collection, 'add remove',function(){
				this.onRender();
			}.bind(this));
            this.on('refresh:dom',function(){
                this.onRender();
            });
            this.on('itemview:project:edit',function(view, optionss){
                this.trigger('project:edit',view, optionss);
            });
            this.on('itemview:project:delete',function(view, optionss){
                this.trigger('project:delete', view, optionss);
            });
            this.on('itemview:project:treeview',function(view,data){
                this.trigger('project:treeview',view, data);
            });
        },
        onRender: function(){
            this.renderNavigation();
			if(this.numberOfHead === 0){
				if(!$('#empty_it_img').length){
					app.getWhenNoBoardItemsWhereTo("#project_all_inner_container_one_list");
				}
				//$('.tsortable').html('');
			}
            /*var size_of = 0;
            if(typeof this.collection.models !== 'undefined'){
                this.collection.each(function(project) {
                        size_of += 214;
                });
            }
            if(size_of != '' && typeof this.model == 'undefined'){
                $("#the_all_projects").attr('style','width: '+size_of+'px; margin:auto;');
            }*/
        },
        addItemView: function(child, ChildView, index){
            if (typeof child.get('_id') !== 'undefined' && !child.get('isHeader')) {
				this.numberOfHead++;
                Marionette.CollectionView.prototype.addItemView.apply(this, arguments);
				if($('#empty_it_img').length){
					$('#imgWhenEmpty').remove();
				}
            }
        }
    });
    return view;
});
