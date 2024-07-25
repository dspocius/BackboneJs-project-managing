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
            fileToUpload:'#fileToUpload'
        },
        events:{
            'click .projectMain':'onpprojectMain',
            'click .projectsEdit':'onprojectsEdit',
            'click .projectsDelete':'onprojectsDelete',
            'click .projectsUploadFile':'onprojectsUploadFile',
			'click .projectsOpenTreeView':'onprojectsOpenTreeView',
            'change #fileToUpload':'_fileChangeEvent',
            'click #projectsExpandCollapse':'projectsExpandCollapse'
        },
		projectsExpandCollapse:function(e){
			if(e.toElement.getAttribute('data-id') == this.model.get('_id')){
				var id = e.toElement.getAttribute('data-id');
				$('#projects_one_in'+id).toggle();
				if($('#projects_one_in'+id).is(':visible')){
					$(e.toElement).removeClass('glyphicon-menu-down');
					$(e.toElement).addClass('glyphicon-menu-up');	
				}else{
					$(e.toElement).removeClass('glyphicon-menu-up');
					$(e.toElement).addClass('glyphicon-menu-down');
				}
			}
		},
		onAfterDropInHere: function(){
			$(".projectMain").click(this.onpprojectMain.bind(this));
			$(".projectsEdit").click(this.onprojectsEdit.bind(this));
			$(".projectsDelete").click(this.onprojectsDelete.bind(this));
			$(".projectsUploadFile").click(this.onprojectsUploadFile.bind(this));
			$(".projectsOpenTreeView").click(this.onprojectsOpenTreeView.bind(this));
			$("#fileToUpload").change(this._fileChangeEvent.bind(this));
			$("#projectsExpandCollapse").click(this.projectsExpandCollapse.bind(this));
		}
    });
});
