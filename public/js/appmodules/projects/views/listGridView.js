define([
	'../../../app',
	'views/templateHelpers',
    'marionette',
    './projectListGridRowView',
    'tpl!../templates/listGrid.html',
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
				this.trigger('project:edit');
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
        },
        addItemView: function(child, ChildView, index){
            if (typeof child.get('_id') !== 'undefined' && !child.get('isHeader') && $(this.itemViewContainer).length) {
				this.numberOfHead++;
				try{
					Marionette.CollectionView.prototype.addItemView.apply(this, arguments);
				}catch(e){}
				if($('#empty_it_img').length){
					$('#imgWhenEmpty').remove();
				}
            }
        }
    });
    return view;
});
