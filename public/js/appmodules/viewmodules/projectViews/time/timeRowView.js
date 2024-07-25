define([
	'../../../../app',
	'views/templateHelpers',
    'underscore',
    'marionette',
    'tpl!./timeGridRow.html',
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
            load_more_for_header:'.load_more_for_header',
            projectMain:'.projectMain',
            projectsDelete:'.projectsDelete',
            projectsEdit:'.projectsEdit',
            projectsUploadFile:'.projectsUploadFile',
            name:'#name',
            text:'#text',
            fileToUpload:'#fileToUpload'
        },
        events:{
            'click .load_more_for_header':'load_more_for_header',
            'click .projectMain':'onpprojectMain',
            'click .projectsEdit':'onprojectsEdit',
            'click .projectsDelete':'onprojectsDelete',
            'click .projectsUploadFile':'onprojectsUploadFile',
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
			$(".load_more_for_header").click(this.load_more_for_header.bind(this));
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
