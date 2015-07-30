define([
	'../../../app',
    'marionette',
    'tpl!../templates/createProject.html'
], function( app, Marionette, templ ) {
	'use strict';
	
    return Marionette.ItemView.extend({
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
			'click #create_project':'onCreatePress'
		},
		template: templ,
		onCreatePress: function(e){
			if($(this.ui.text).val() == ""){
				app.commands.execute('app:notify', {
					type: 'warning',
					title: 'Empty description',
					description: 'Description is mandatory field'
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
		onRender:function(){
			if(this.model.get('projects') === ''){
				$(this.ui.isProject).attr('disabled','disabled');
				$(this.ui.is_entry).attr('disabled','disabled');
				$(this.ui.isList).attr('checked','checked');
			}
		}
    });
});
