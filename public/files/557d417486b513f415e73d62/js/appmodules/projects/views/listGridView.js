define([
	'../../../app',
	'views/templateHelpers',
    'marionette',
    './projectGridRowView',
    'tpl!../templates/listGrid.html',
	'views/BaseGridView'
], function (app,templateHelpers,Marionette, projectGridRowView, projectGrid, BaseGridView) {
    'use strict';

    var view = BaseGridView.extend({
		templateHelpers:templateHelpers,
        template:projectGrid,
        itemView:projectGridRowView,
        itemViewContainer:'.projects div',
        className:'projects_one_in_header projects_one_in_list',
        initialize:function(options){
			this.numberOfHead = 0;
			this.listenTo(this.collection, 'add remove',function(){
				this.onRender();
			}.bind(this));
            this.on('refresh:dom',function(){
                this.onRender();
            });
            this.on('itemview:project:edit',function(view){
                this.trigger('project:edit',view);
            });
            this.on('itemview:project:delete',function(view){
                this.trigger('project:delete', view);
            });
            this.on('itemview:project:treeview',function(view,data){
                this.trigger('project:treeview',view, data);
            });
        },
        onRender: function(){
            this.renderNavigation();
			if(this.numberOfHead === 0){
				if(!$('#empty_it_img').length){
					$('#navigation_main').after('<div id="imgWhenEmpty"><img  style="max-height:800px; max-width:800px;" id="empty_it_img" src="/files/cat.png" alt="" /></div>');
				}
				$('.tsortable').html('');
			}
        },
        addItemView: function(child, ChildView, index){
            if (typeof child.get('_id') !== 'undefined') {
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
