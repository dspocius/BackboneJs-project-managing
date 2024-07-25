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
            load_more_for_header:'.load_more_for_header',
            projectMain:'.projectMain',
            projectsDelete:'.projectsDelete',
            goonnewtext:'.goonnewtext',
            projectsEdit:'.projectsEdit',
            projectsUploadFile:'.projectsUploadFile',
            projectsOpenTreeView:'.projectsOpenTreeView',
            name:'#name',
            text:'#text',
            showAddNew:'#showAddNew',
            saveNewPostHere:'.saveNewPostHere',
            createNewButton:'.createNewButton',
            fileToUpload:'#fileToUpload'
        },
		initialize: function(){
			this.projects = [];
            this.$el.attr("pid", this.model.get('_id'));
            this.$el.attr("class", "project_row_one");
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
			this.listenTo(this.model,'change:inHeader',this.onAfterDropInHere);
			this.listenTo(this.model,'change:inProjects',this.onAfterDropInHere);
			this.listenTo(this.model,'afterdropintriggered',this.onAfterDropInHere);
			this.listenTo(this.model,'change',this.rerenderEverything);
			var thh = this;
			/*this.listenTo(this.model,'change',function(){
				var modell = this.model;
				if(typeof modell != "undefined" && (typeof modell.get('inCollectionData') === 'undefined' ||
						modell.get('inCollectionData') === '')){
					if(typeof window.treeprojects != "undefined" && typeof window.treeprojects['.treeInShowHere'+modell.get('_id')] != "undefined"){
						if(!modell.get("isHeader")){
							var treedataView = window.treeprojects['.treeInShowHere'+modell.get('_id')];
							$('.treeInShowHere'+modell.get('_id')).html(treedataView.$el);
							treedataView.render();
						}else{
							$("#text_id"+modell.get("_id")).html(modell.get("text"));
						}
					}
				}
			}.bind(this));*/
		},
        events:{
            'click .load_more_for_header':'load_more_for_header',
            'click .projectClickIn':'onpprojectMain',
            'click .projectsEdit':'onprojectsEdit',
            'click .files_images_show':'onprojectsImageView',
            'click .goonnewtext':'goonnewtext',
            'click .projectsDelete':'onprojectsDelete',
            'click .projectsSharedRemoveMe':'projectsSharedRemoveMe',
            'click .projectsUploadFile':'onprojectsUploadFile',
            'click .projectsOpenTreeView':'onprojectsOpenTreeView',
            'click .createNewButton':'createNewButton',
            'click .saveNewPostHere':'saveNewPostHere',
            'change #fileToUpload':'_fileChangeEvent',
			'click #projectsExpandCollapse':'projectsExpandCollapse',
			'click .showComments':'showComments',
			'click .likeEntrPro':'likeEntrPro',
			'click .proLikesSee':'proLikesSee',
			'click .projectsShare':'projectsShare',
			'click .onAddCommentsTime':'onAddCommentsTime'
        },
		addingCommentsHere: function() {
			var th = this;
			var idOf = th.commentsCol.get('_id');
			var comments = $('#commentAddminiTimeLineView'+th.model.get("_id")).val();
			if(comments != ''){
				th.addComment(comments, idOf);
			}
			$('#commentAddminiTimeLineView'+th.model.get("_id")).val('');
		},
		onAddCommentsTime: function() {
			var th = this;
			if (typeof th.commentsCol == "undefined") {
			}else{
				th.addingCommentsHere();
			}
		},
		projectsShare: function(e) {
			event.stopPropagation();
			event.stopImmediatePropagation();
			this.projectsShareH();
		},
		proLikesSee: function(e) {
			event.stopPropagation();
			event.stopImmediatePropagation();
			this.showProLikesH();
		},
		likeEntrPro: function(e) {
			event.stopPropagation();
			event.stopImmediatePropagation();
			this.likesPostHere();
			$(e.currentTarget).remove();
		},
		showComments: function(e) {
			event.stopPropagation();
			event.stopImmediatePropagation();
			$(".commentsHereToShowForTime"+this.model.get("_id")).toggleClass("showCommentsDisplay");
			
				this.getAllCommentsAndAdd();
			
		},
		onAfterDropInHere: function(){
			$(".load_more_for_header").click(this.load_more_for_header.bind(this));
			$(".projectClickIn").click(this.onpprojectMain.bind(this));
			$(".projectsEdit").click(this.onprojectsEdit.bind(this));
			$(".files_images_show").click(this.onprojectsImageView.bind(this));
			$(".goonnewtext").click(this.goonnewtext.bind(this));
			$(".projectsDelete").click(this.onprojectsDelete.bind(this));
			$(".projectsSharedRemoveMe").click(this.projectsSharedRemoveMe.bind(this));
			$(".projectsUploadFile").click(this.onprojectsUploadFile.bind(this));
			$(".projectsOpenTreeView").click(this.onprojectsOpenTreeView.bind(this));
			$(".createNewButton").click(this.createNewButton.bind(this));
			$(".saveNewPostHere").click(this.saveNewPostHere.bind(this));
			$("#fileToUpload").change(this._fileChangeEvent.bind(this));
		}
    });
});
