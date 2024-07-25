define([
	'../../../app',
	'views/templateHelpers',
    'underscore',
    'marionette',
    'tpl!../templates/projectGridRow.html',
    'models/project',
	'views/BaseRowView'
], function (app, templateHelpers, _, Marionette, templ, Project, BaseRowView) {
    'use strict';

    return BaseRowView.extend({
		templateHelpers:templateHelpers,
        template: templ,
        tagName:'td',
        className:'headerMain',
        ui:{
            projectMain:'.projectMain',
            projectsDelete:'.projectsDelete',
            projectsEdit:'.projectsEdit',
            projectsUploadFile:'.projectsUploadFile',
            projectsOpenTreeView:'.projectsOpenTreeView',
            name:'#name',
            text:'#text',
            fileToUpload:'#fileToUpload'
        },
        events:{
            'click .projectClickIn':'onpprojectMain',
            'click .projectsEdit':'onprojectsEdit',
            'click .projectsDelete':'onprojectsDelete',
            'click .projectsUploadFile':'onprojectsUploadFile',
            'click .projectsOpenTreeView':'onprojectsOpenTreeView',
            'change #fileToUpload':'_fileChangeEvent'
        },
		onAfterDropInHere: function(){
			$(".projectClickIn").click(this.onpprojectMain.bind(this));
			$(".projectsEdit").click(this.onprojectsEdit.bind(this));
			$(".projectsDelete").click(this.onprojectsDelete.bind(this));
			$(".projectsUploadFile").click(this.onprojectsUploadFile.bind(this));
			$(".projectsOpenTreeView").click(this.onprojectsOpenTreeView.bind(this));
			$("#fileToUpload").change(this._fileChangeEvent.bind(this));
		}
    });
});
