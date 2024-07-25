define([
    '../../../app',
    'models/base',
    'underscore',
    '../views/entryView',
    'models/project',
	'views/MenuView',
	'collections/Nav'
], function( app, base, _, entryView, project, MenuView, Nav ) {
    return base.extend({
        initialize: function(options){
            if(typeof options.mainProjectCtrl !== 'undefined'){
                this.projects = options.mainProjectCtrl.projects;
                this.projectModels = options.mainProjectCtrl.projectModels;
                this.commentProject = '';
				this.comments = [];
			}else{
				this.commentProject = '';
				this.comments = [];
                this.projects = [];
                this.projectModels = [];
            }
        },
        show: function(options){
			var rerenderViewEntry = function(){
				this.rerenderCView();
			}.bind(this);
		  var menuTopRightCol = new Nav([]);
            var menuTopRight = new MenuView({collection: menuTopRightCol});
            app.menu.show(menuTopRight);
			
			app.CurrentCommentsView = this;
            if(typeof this.get('mainProjectCtrl') !== 'undefined'){
               // this.projects = this.get('mainProjectCtrl').projects;
                //this.projectModels = this.get('mainProjectCtrl').projectModels;
            }
            app.vent.trigger('top:leftmenu:show');
            var entryId = options.id;
            var projec;
			var commentsCol;
            var cView = '';
			this.cView = cView;
            if(typeof this.projects[options.id] != 'undefined' && typeof this.projects[options.id].models == 'undefined' && typeof this.comments[options.id] != 'undefined'){
                 commentsCol = this.comments[options.id];
                 projec = this.projects[options.id];
				 projec.set('messages',commentsCol.get('messages'));
            }else{
                projec = new project({'_id': entryId});
				projec.set('messages',[]);
                this.projects.push(projec);
                this.projects[options.id] = projec;
                app.vent.trigger('add:cachedModels:resource', this.projects[options.id]);
                projec.url = '/projectentry/'+entryId;
                projec.fetch().done(function(){
					if(cView != ''){
						rerenderViewEntry();
					}
                }).error(function(){
					app.getWhenNotFoundData();
				});
				
				var commentsCol = app.getCommentsCol(options.id);
				if(commentsCol === ''){
					var commentsCol = new project();
					commentsCol.url = '/comments/'+options.id+'/'+0;
					this.comments.push(commentsCol);
					this.comments[options.id] = commentsCol;
					app.vent.trigger('add:cachedComments:resource', {_id:options.id,data: this.comments[options.id]});
				}
				commentsCol.fetch().done(function(){
					this.commentProject = commentsCol;
					projec.set('messages',commentsCol.get('messages'));
					if(cView != ''){
						rerenderViewEntry();
					}
				}.bind(this));
            }
                /* for navigation */
                var navigation_pr = "";
                for(var ii=0; ii < this.projects.length;ii++){
                    if(typeof this.projects[ii].get(options.id) !== 'undefined'){
                        navigation_pr = this.projects[ii].get(options.id);
                    }
                }
                if(navigation_pr === ''){
                    var thisProj = "";
                    if(typeof this.projectModels[options.id] != 'undefined'){
                        thisProj = this.projectModels[options.id];
                    }else{
                        thisProj = new project({_id:options.id});
                        thisProj.url = '/projectentry/'+options.id;
                        thisProj.fetch().done(function(){
                            cView.options.navigationModel = thisProj;
                            cView.renderNavigation();
                        });
                        this.projectModels[options.id] = thisProj;
                    }
                    cView = new entryView({model: projec, navigationModel:thisProj, projectsAll:this.projects, mainP:this.get('mainProjectCtrl')});
                }else{
                    cView = new entryView({model: projec, navigationModel:navigation_pr, projectsAll:this.projects, mainP:this.get('mainProjectCtrl')});
                }
				this.cView = cView;
            app.main.show(cView);
			this.listenTo(cView,'add:comment', function(comment){
				var commentNew = new project();
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1;
				var hours = today.getHours();
				var minutes = today.getMinutes();
				var seconds = today.getSeconds();

				var yyyy = today.getFullYear();
				if(dd<10){
					dd='0'+dd
				}
				if(mm<10){
					mm='0'+mm
				} 
				if(seconds<10){
					seconds='0'+seconds
				} 
				var today = yyyy+' '+mm+' '+dd+' '+hours+':'+minutes+':'+seconds;

				var msgsObj = {from:app.userConnected.data2.firstname+' '+app.userConnected.data2.lastname,message:comment,files:'',date:today};
				commentNew.set('message',msgsObj);
				commentNew.set('id',this.commentProject.get('_id'));
                commentNew.url = '/comment';
				commentNew.save();
				var msgs = this.commentProject.get('messages');
				msgsObj._id = options.id;
				//msgs.unshift(msgsObj);
				app.emitMessage('commentSend',msgsObj);
				rerenderViewEntry();
			});
			this.listenTo(cView,'delete:comment', function(commentDate){
				var commentNew = new project();
				commentNew.set('date',commentDate);
				commentNew.set('id',this.commentProject.get('_id'));
                commentNew.url = '/comment';
				commentNew.save();
				var msgs = this.commentProject.get('messages');
				for(var i = msgs.length - 1; i >= 0; i--){
					if(msgs[i].date === commentDate) {
					   msgs.splice(i, 1);
					}
				}
				
				rerenderViewEntry();
			});
            rerenderViewEntry();
        },
		rerenderCView: function(){
			if(typeof app.userData == "undefined"){
				app.vent.on("userConnected:ready", function(){

					if(typeof this.cView.model != "undefined"){
						var visibilityOfThisproj = this.cView.model.getVisibilityOfTheProject(app);
						if(typeof visibilityOfThisproj.visibilityOfIt != "undefined"){
							if(visibilityOfThisproj.visibilityOfIt == "editcommentpublic" || visibilityOfThisproj.visibilityOfIt == "editpublic" || visibilityOfThisproj.visibilityOfIt == "public" || visibilityOfThisproj.canView){
								this.cView.model.set("parentvisibility",visibilityOfThisproj.visibilityOfIt);
								this.cView.render();
								app.main.show(this.cView);
								$("#comments_info_view").trigger("click");
							}else{
								app.getWhenPrivateData();
							}
						}
					}
				
				}.bind(this));
			}else{
				if(typeof this.cView.model != "undefined"){
					var visibilityOfThisproj = this.cView.model.getVisibilityOfTheProject(app);
					if(typeof visibilityOfThisproj.visibilityOfIt != "undefined"){
						if(visibilityOfThisproj.visibilityOfIt == "editcommentpublic" || visibilityOfThisproj.visibilityOfIt == "editpublic" || visibilityOfThisproj.visibilityOfIt == "public" || visibilityOfThisproj.canView){
							this.cView.model.set("parentvisibility",visibilityOfThisproj.visibilityOfIt);
							this.cView.render();
							app.main.show(this.cView);
							$("#comments_info_view").trigger("click");
						}else{
							app.getWhenPrivateData();
						}
					}
				}
			}
		},
		rerenderComments: function(){
			if($('#commentsInEntryForAView').length){
				this.rerenderCView();
			}
		}
    });
});