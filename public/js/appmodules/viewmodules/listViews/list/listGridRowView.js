define([
	'../../../../app',
	'views/templateHelpers',
    'underscore',
    'marionette',
    'tpl!./listGridRow.html',
    'models/project',
	'views/BaseRowView'
], function (app, templateHelpers, _, Marionette, templ, Project, BaseRowView) {
    'use strict';

    return BaseRowView.extend({
		templateHelpers:templateHelpers,
        template: templ,
        tagName:'div',
        className:'headerMain listViewThreeColumnss',
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
		initialize: function(){
			this.projects = [];
            this.$el.attr("pid", this.model.get('_id'));
			if(this.model.get('inProjects') != '' &&
			typeof this.model.get('inProjects') != 'undefined'){
				this.$el.attr("pid_project", this.model.get('inProjects'));
			}else{
				this.$el.attr("pid_project", '');
			}
            this.$el.bind("dragover", _.bind(this._dragOverEvent, this));
            this.$el.bind("drop", _.bind(this._dropEvent, this));

            this._draghoverClassAdded = false;
            this._draghoverClassAddedFile = false;
            Project.selectedVieww = "";
			this.model.set('friendsThis',[]);
			this.model.set('colorLighter',this.ColorLuminance(this.model.get("color"), 0.2));
			
			
			if(typeof app.userConnected != 'undefined' && 
				typeof app.userConnected.data2 != 'undefined'){
				//this.friendsAddedV(app.userConnected.data2.friends);
			}
			this.listenTo(this.model,'change:position',this.onAfterDropInHere);
			this.listenTo(this.model,'change',this.rerenderEverything);
			this.listenTo(this.model,'change',function(){
				var modell = this.model;
				if(typeof modell != "undefined" && (typeof modell.get('inCollectionData') === 'undefined' ||
						modell.get('inCollectionData') === '')){
					if(typeof window.treeprojects != "undefined" && typeof window.treeprojects['.treeInShowHere'+modell.get('_id')] != "undefined"){
						//var htmlOfTree = $('.treeInShowHere'+modell.get('_id')).html();
						if(!modell.get("isHeader")){
							var treedataView = window.treeprojects['.treeInShowHere'+modell.get('_id')];
							this.render();
							$('.treeInShowHere'+modell.get('_id')).html(treedataView.$el);
							treedataView.render();
						}else{
							$("#text_id"+modell.get("_id")).html(modell.get("text"));
						}
						//$('.treeInShowHere'+modell.get('_id')).html(htmlOfTree);
					}else{
						if(!modell.get("isHeader")){
							this.render();
						}else{
							$("#text_id"+modell.get("_id")).html(modell.get("text"));
						}
					}
				}
			}.bind(this));
		},
        events:{
            'click .projectClickIn':'onpprojectMain',
            'click .projectsEdit':'onprojectsEdit',
            'click .files_images_show':'onprojectsImageView',
            'click .projectsDelete':'onprojectsDelete',
            'click .projectsUploadFile':'onprojectsUploadFile',
            'click .projectsOpenTreeView':'onprojectsOpenTreeView',
            'change #fileToUpload':'_fileChangeEvent'
        },
		onAfterDropInHere: function(){
			$(".projectClickIn").click(this.onpprojectMain.bind(this));
			$(".projectsEdit").click(this.onprojectsEdit.bind(this));
			$(".files_images_show").click(this.onprojectsImageView.bind(this));
			$(".projectsDelete").click(this.onprojectsDelete.bind(this));
			$(".projectsUploadFile").click(this.onprojectsUploadFile.bind(this));
			$(".projectsOpenTreeView").click(this.onprojectsOpenTreeView.bind(this));
			$("#fileToUpload").change(this._fileChangeEvent.bind(this));
		}
    });
});
