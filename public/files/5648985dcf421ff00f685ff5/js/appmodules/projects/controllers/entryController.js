define([
    '../../../app',
    'models/base',
    'underscore',
    '../views/simpleEntryView',
    'models/project'
], function( app, base, _, simpleEntryView, project ) {
    return base.extend({
        initialize: function(options){
            if(typeof options.mainProjectCtrl !== 'undefined'){
                this.commentProject = '';
				this.comments = [];
				this.projects = options.mainProjectCtrl.projects;
                this.projectModels = options.mainProjectCtrl.projectModels;
            }else{
                this.comments = [];
                this.projects = [];
                this.projectModels = [];
				this.commentProject = '';
            }
        },
        show: function(options, username){
            if(typeof this.get('mainProjectCtrl') !== 'undefined'){
               // this.projects = this.get('mainProjectCtrl').projects;
                //this.projectModels = this.get('mainProjectCtrl').projectModels;
            }
            app.vent.trigger('top:leftmenu:show');
            var entryId = options.id;
            var commentsCol;
            var projec;
            var cView = '';
            if(typeof this.projects[options.id] != 'undefined' && typeof this.projects[options.id].models == 'undefined'){
                 commentsCol = this.comments[options.id];
                 projec = this.projects[options.id];
				 projec.set('messages',commentsCol.get('messages'));
            }else{
                projec = new project({_id: entryId});
				projec.set('messages',[]);
                this.projects.push(projec);
                this.projects[options.id] = projec;
                app.vent.trigger('add:cachedModels:resource', this.projects[options.id]);
                projec.url = '/projectentryy/'+username+'/'+entryId;
                projec.fetch().done(function(){
                    cView.render();
                });
				
				var commentsCol = new project();
				commentsCol.url = '/comments/'+options.id+'/'+0;
                this.comments.push(commentsCol);
                this.comments[options.id] = commentsCol;
				commentsCol.fetch().done(function(){
					this.commentProject = commentsCol;
					projec.set('messages',commentsCol.get('messages'));
					cView.render();
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
                        thisProj.url = '/projectentryy/'+username+'/'+options.id;
                        thisProj.fetch().done(function(){
                            cView.options.navigationModel = thisProj;
                            cView.renderNavigation();
                        });
                        this.projectModels[options.id] = thisProj;
                    }
                    cView = new simpleEntryView({model: projec, navigationModel:thisProj, projectsAll:this.projects, mainP:this.get('mainProjectCtrl')});
                }else{
                    cView = new simpleEntryView({model: projec, navigationModel:navigation_pr, projectsAll:this.projects, mainP:this.get('mainProjectCtrl')});
                }
			projec.set('_id', options.id);
            app.main.show(cView);
			this.listenTo(cView,'add:comment', function(comment){
				var commentNew = new project();
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1;
				var hours = today.getHours();
				var minutes = today.getMinutes();

				var yyyy = today.getFullYear();
				if(dd<10){
					dd='0'+dd
				}
				if(mm<10){
					mm='0'+mm
				} 
				var today = yyyy+' '+mm+' '+dd+' '+hours+':'+minutes;

				var msgsObj = {from:app.userConnected.data2.firstname+' '+app.userConnected.data2.lastname,message:comment,files:'',date:today};
				commentNew.set('message',msgsObj);
				commentNew.set('id',this.commentProject.get('_id'));
                commentNew.url = '/comment';
				commentNew.save();
				var msgs = this.commentProject.get('messages');
				msgs.unshift(msgsObj);
				cView.render();
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
				cView.render();
			});
            cView.render();
        }
    });
});