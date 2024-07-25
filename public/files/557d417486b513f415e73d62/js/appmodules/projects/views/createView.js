define([
	'../../../app',
	'views/templateHelpers',
    'marionette',
    'tpl!../templates/createProject.html'
], function( app, templateHelpers, Marionette, templ ) {
	'use strict';
	
    return Marionette.ItemView.extend({
		templateHelpers:templateHelpers,
		ui:{
		   name:'#project_name',
		   text:'#project_text',
		   isProject:'#is_project',
			is_entry:'#is_entry',
		   isList:'#is_list',
		   create:'#create_project',
		   project_id:'#project_id',
			radio_good:'#radio_good',
			color_this:'#color_this'
		},
		events:{
			'click #create_project':'onCreatePress',
			'click input[name="radioSelectProjectType"]':'onChangeType'
		},
		template: templ,
		onChangeType: function(){
			var radioSelected = $("input[name='radioSelectProjectType']:checked").val();
			$('#color_this').val(this.model.get('entryColor'));
			if(radioSelected === 'project'){
				$('#color_this').val(this.model.get('color'));
			}
			if(radioSelected === 'list'){
				$('#color_this').val(this.model.get('listsColor'));
			}
		},
		onCreatePress: function(e){
			if($(this.ui.text).val() == ""){
				app.commands.execute('app:notify', {
					type: 'warning',
					title: app.translate('Empty description'),
					description: app.translate('Description is mandatory field')
				});
				return;
			}
			var radioSelected = $("input[name='radioSelectProjectType']:checked").val();
			var ispProject = false;
			var islList = false;
			if(radioSelected === 'project'){
				ispProject = true;
			}
			if(radioSelected === 'list'){
				islList = true;
			}
			this.trigger('project:save',{
				name: '-',
				text: $(this.ui.text).val(),
				color: $(this.ui.color_this).val(),
				isProject: ispProject,
				isHeader: islList,
				inHeader: $('#inprojectwhich').val(),
				/*inHeader: $('#radio_good:checked').val(),*/
				inProjects: [$(this.ui.project_id).val()]
			});
			$(this.ui.text).val('');
			//$(this.ui.isProject).removeAttr('checked');
			//$(this.ui.isList).removeAttr('checked');
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
		searchNavigation: function(projectsInT){
			var g_ret = "";
			if(typeof projectsInT != 'undefined'){
				for(var ii=0; ii < projectsInT.length; ii++){
					if(projectsInT[ii] !== ''){
						var pmodel_th = this.findNavigation(projectsInT[ii]);
						if(pmodel_th.isMore !== ''){
							g_ret += this.searchNavigation(pmodel_th.isMore);
						}
						g_ret += ' - <a href="#/project/'+projectsInT[ii]+'">'+pmodel_th.modelName+'</a>';
					}
				}
			}
			return g_ret;
		},
		searchRoute: function(projectsInT){
			return this.searchNavigation(projectsInT);
		},
		renderNavigation: function(){
			if(typeof this.options.navigationModel != 'undefined'){
				var navLinks = app.getDefaultRoots();
				var projectsInT = this.options.navigationModel.get('inProjects');
				if(typeof projectsInT != 'undefined'){
					navLinks += this.searchRoute(projectsInT);
					navLinks += ' - '+this.options.navigationModel.get('text');
				}
				$('#navigation_main').html(navLinks);
			}
		},
		onRender: function(){
			this.renderNavigation();
			if(this.model.get('projects') === '' && this.model.get('projects') !== 'list'){
				$(this.ui.isProject).attr('disabled','disabled');
				$(this.ui.is_entry).attr('disabled','disabled');
				$(this.ui.isList).attr('checked','checked');
			}
			if(this.model.get('projects') === 'list'){
				$(this.ui.isList).attr('disabled','disabled');
			}
			setTimeout(function(){ this.onChangeType(); }.bind(this), 1);
		}
    });
});
