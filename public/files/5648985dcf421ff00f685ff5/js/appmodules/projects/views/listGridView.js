define([
    '../../../app',
    'marionette',
    './projectGridRowView',
    'tpl!../templates/listGrid.html'
], function (app,Marionette, projectGridRowView, projectGrid) {
    'use strict';

    var view = Marionette.CompositeView.extend({
        template:projectGrid,
        itemView:projectGridRowView,
        itemViewContainer:'.projects div',
        className:'projects_one_in_header projects_one_in_list',
        initialize:function(options){
			this.numberOfHead = 0;
            this.on('refresh:dom',function(){
                this.onRender();
            });
            this.on('itemview:project:edit',function(view){
                this.trigger('project:edit',view);
            });
            this.on('itemview:project:delete',function(view){
                this.trigger('project:delete', view);
            });

        },
        findNavigation: function(projectsInT){
            var pmodel_th = {modelName:"Project",isMore:''};
            if(typeof this.options.mainP != 'undefined'){
                if(typeof this.options.mainP.mainProject.get(projectsInT) !== 'undefined'){
                    pmodel_th = {modelName:this.options.mainP.mainProject.get(projectsInT).get('text'),isMore:''};
                }
            }
            if(typeof this.options.projectsAll != 'undefined' && pmodel_th.modelName === 'Project'){
                for(var jj=0; jj < this.options.projectsAll.length;jj++){
                    if(typeof this.options.projectsAll[jj].get(projectsInT) !== 'undefined'){
                        pmodel_th = {modelName:this.options.projectsAll[jj].get(projectsInT).get('text'),isMore:this.options.projectsAll[jj].get(projectsInT).get('inProjects')};
                    }
                }
            }
            return pmodel_th;
        },
        searchNavigation: function(projectsInT, username){
            var g_ret = "";
            if(typeof projectsInT != 'undefined'){
                for(var ii=0; ii < projectsInT.length; ii++){
                    if(projectsInT[ii] !== ''){
                        var pmodel_th = this.findNavigation(projectsInT[ii]);
                        if(pmodel_th.isMore !== ''){
                            g_ret += this.searchNavigation(pmodel_th.isMore, username);
                        }
                        g_ret += ' - <a href="#/project/'+username+'/'+projectsInT[ii]+'">'+pmodel_th.modelName+'</a>';
                    }
                }
            }
            return g_ret;
        },
        searchRoute: function(projectsInT, username){
            return this.searchNavigation(projectsInT, username);
        },
        renderNavigation: function(){
            if(typeof this.options.navigationModel != 'undefined'){
				var splitPath = window.location.hash.substring(2).split('/');
				var navLinks = '<a href="#projects/'+splitPath[1]+'">Home</a>';
                var projectsInT = this.options.navigationModel.get('inProjects');
                if(typeof projectsInT != 'undefined'){
                    navLinks += this.searchRoute(projectsInT, splitPath[1]);
					var textToAdd = this.options.navigationModel.get('text');
					var tempDom = $('<output>').append($.parseHTML( this.options.navigationModel.get('text') ));
					var appContainer = $('.hover', tempDom);
					if(appContainer.length > 0){
						textToAdd = appContainer.html();
					}
                    navLinks += ' - '+textToAdd;
                }
                $('#navigation_main').html(navLinks);
            }
        },
        onRender: function(){
            this.renderNavigation();
			if(this.numberOfHead === 0){
				if(!$('#empty_it_img').length){
					$('#navigation_main').after('<div><img  style="max-height:800px; max-width:800px;" id="empty_it_img" src="/files/aa.jpg" alt="" /></div>');
				}
				$('.tsortable').html('');
			}
        },
        addItemView: function(child, ChildView, index){
            if (typeof child.get('_id') !== 'undefined' && !child.get('isHeader')) {
				this.numberOfHead++;
                Marionette.CollectionView.prototype.addItemView.apply(this, arguments);
            }
        }
    });
    return view;
});
