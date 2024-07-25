define([
	'../../../app',
	'views/templateHelpers',
    'underscore',
    'marionette',
    'tpl!../templates/projectListGridRow.html',
    'models/project',
	'views/BaseRowView'
], function (app, templateHelpers, _, Marionette, templ, Project, BaseRowView) {
    'use strict';

    return BaseRowView.extend({
		templateHelpers:templateHelpers,
        template: templ,
        tagName:'div',
        className:'headerMain',
        ui:{
            projectMain:'.projectMain',
            projectsDelete:'.projectsDelete',
            projectsEdit:'.projectsEdit',
            projectsUploadFile:'.projectsUploadFile',
            name:'#name',
            text:'#text',
			goonnewtext:'.goonnewtext',
            fileToUpload:'#fileToUpload'
        },
        events:{
            'click .projectMain':'onpprojectMain',
            'click .projectsEdit':'onprojectsEdit',
            'click .projectsDelete':'onprojectsDelete',
            'click .projectsSharedRemoveMe':'projectsSharedRemoveMe',
            'click .projectsUploadFile':'onprojectsUploadFile',
			'click .goonnewtext':'goonnewtext',
            'click .createNewButton':'createNewButton',
            'click .saveNewPostHere':'saveNewPostHere',
			'click .projectsOpenTreeView':'onprojectsOpenTreeView',
            'change #fileToUpload':'_fileChangeEvent',
            'click #projectsExpandCollapse':'projectsExpandCollapse'
        },
		projectsExpandCollapse:function(e){
			if(e.currentTarget.getAttribute('data-id') == this.model.get('_id')){
				var id = e.currentTarget.getAttribute('data-id');
				$('#projects_one_in'+id).toggle();
				if($('#projects_one_in'+id).is(':visible')){
					$(e.currentTarget).removeClass('glyphicon-menu-down');
					$(e.currentTarget).addClass('glyphicon-menu-up');	
				}else{
					$(e.currentTarget).removeClass('glyphicon-menu-up');
					$(e.currentTarget).addClass('glyphicon-menu-down');
				}
			}
		},
		onAfterDropInHere: function(){
			$(".projectMain").click(this.onpprojectMain.bind(this));
			$(".projectsEdit").click(this.onprojectsEdit.bind(this));
			$(".projectsDelete").click(this.onprojectsDelete.bind(this));
			$(".projectsSharedRemoveMe").click(this.projectsSharedRemoveMe.bind(this));
			$(".projectsUploadFile").click(this.onprojectsUploadFile.bind(this));
			$(".goonnewtext").click(this.goonnewtext.bind(this));
			$(".createNewButton").click(this.createNewButton.bind(this));
			$(".saveNewPostHere").click(this.saveNewPostHere.bind(this));
			$(".projectsOpenTreeView").click(this.onprojectsOpenTreeView.bind(this));
			$("#fileToUpload").change(this._fileChangeEvent.bind(this));
			$("#projectsExpandCollapse").click(this.projectsExpandCollapse.bind(this));
		}
    });
});
