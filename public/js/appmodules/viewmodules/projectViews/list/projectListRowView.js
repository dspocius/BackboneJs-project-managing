define([
	'../../../../app',
	'views/templateHelpers',
    'underscore',
    'marionette',
    'tpl!./projectListGridRow.html',
    'models/project',
	'views/BaseRowView',
	'../../../projects/views/projectGridRowView'
], function (app, templateHelpers, _, Marionette, templ, Project, BaseRowView, projectGridRowView) {
    'use strict';

    return projectGridRowView.extend({
		templateHelpers:templateHelpers,
        template: templ,
        tagName:'div',
        className:'headerMain',
		events:{
            'click #projectsExpandCollapse':'projectsExpandCollapse',
            'click .goonnewtext':'goonnewtext',
            'click .load_more_for_header':'load_more_for_header',
            'click .projectClickIn':'onpprojectMain',
            'click .projectsEdit':'onprojectsEdit',
            'click .files_images_show':'onprojectsImageView',
            'click .projectsDelete':'onprojectsDelete',
            'click .projectsSharedRemoveMe':'projectsSharedRemoveMe',
            'click .projectsUploadFile':'onprojectsUploadFile',
            'click .projectsOpenTreeView':'onprojectsOpenTreeView',
            'click .createNewButton':'createNewButton',
            'click .saveNewPostHere':'saveNewPostHere',
            'change #fileToUpload':'_fileChangeEvent',
			'click #projectsExpandCollapse':'projectsExpandCollapse',
			'click .showComments':'showComments',
			'click .onAddCommentsTime':'onAddCommentsTime'
        },
        onAfterDropInHere: function(){
            $("#projectsExpandCollapse").click(this.projectsExpandCollapse.bind(this));
			$(".load_more_for_header").click(this.load_more_for_header.bind(this));
			$(".projectClickIn").click(this.onpprojectMain.bind(this));
			$(".projectsEdit").click(this.onprojectsEdit.bind(this));
			$(".goonnewtext").click(this.goonnewtext.bind(this));
			$(".files_images_show").click(this.onprojectsImageView.bind(this));
			$(".projectsDelete").click(this.onprojectsDelete.bind(this));
			$(".projectsSharedRemoveMe").click(this.projectsSharedRemoveMe.bind(this));
			$(".projectsUploadFile").click(this.onprojectsUploadFile.bind(this));
			$(".projectsOpenTreeView").click(this.onprojectsOpenTreeView.bind(this));
			$(".createNewButton").click(this.createNewButton.bind(this));
			$(".saveNewPostHere").click(this.saveNewPostHere.bind(this));
			$("#fileToUpload").change(this._fileChangeEvent.bind(this));
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
        }
    });
});
