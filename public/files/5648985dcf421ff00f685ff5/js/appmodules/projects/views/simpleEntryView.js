define([
    '../../../app',
    'underscore',
    'marionette',
    'tpl!../templates/simple_entry.html'
], function (app, _, Marionette, templ) {
    'use strict';

    return Marionette.ItemView.extend({
        template: templ,
        ui:{
            projectMain:'.projectMain'
        },
        events:{
            'change #fileToUpload':'_fileChangeEvent',
            'click .projectsUploadFile':'onprojectsUploadFile',
            'click .projectsDelete':'onprojectsDelete',
            'click .projectsEdit':'onprojectsEdit',
            'click #commentSubmit':'addComment',
			'click #removeComment':'removeComment',
            'click .removeFriendFromList':'onremoveFriendFromList'
        },
		removeComment: function(e){
			var date = e.toElement.getAttribute('data-date');
			this.trigger('delete:comment',date);
		},
		addComment: function(){
			var comment = $('#commentAdd').val();
			this.trigger('add:comment',comment);
		},
        onremoveFriendFromList: function(e){
            var myModel = this.model;
            myModel.set('id', myModel.get('_id'));
            myModel.set('friendDeleteEntry', e.currentTarget.getAttribute('pid'));
            myModel.set('friendAddToEntry', '');
            myModel.url = '/project/'+myModel.get('_id');
            myModel.save();
            this.model.removeFromFriends(e.currentTarget.getAttribute('pid'));
                this.model.set('cChooseFriends', this.friendsHtmlV(app.userConnected.data2.friends));
                this.model.set('cFriendsOn', this.friendsAddedV(app.userConnected.data2.friends));
                this.render();
        },
        onprojectsEdit: function(e){
            var delete_files = [];
            $('.delete_files').each(function(i, obj) {
                if($(this).is(':checked')){
                    delete_files.push($(this).attr('file_name'));
                }
            });
            var filess = this.eraseFiles(delete_files);
            var myModel = this.model;
            myModel.set('id', myModel.get('_id'));
            myModel.set('files', [filess]);
            myModel.set('friendDeleteEntry', '');
            myModel.set('friendAddToEntry', $("#friendAddToEntry").val());
            myModel.set('text', $('#projectText').val());
            myModel.set('name', $('#projectName').val());
            myModel.set('color', $('#color').val());
            myModel.url = '/project/'+myModel.get('_id');
            myModel.save();
            $('#project_'+myModel.get('_id')).attr('style','width:auto; border:2px solid '+$('#color').val());
            if($("#friendAddToEntry").val() !== ''){
                this.model.addToFriends($("#friendAddToEntry").val());
                this.model.set('friends', newModell);
                this.model.set('cChooseFriends', this.friendsHtmlV(app.userConnected.data2.friends));
                this.model.set('cFriendsOn', this.friendsAddedV(app.userConnected.data2.friends));
                this.render();
            }
        },
        eraseFiles: function(files_delete){
            if(this.model.get('files') != ''){
                var files = this.model.get('files')[0].split(',');
                var files_in = "";
                for (var i in files) {
                    if(files[i] != 'undefined' && !$.inArray(files[i], files_delete)) {
                        if(i==0){
                            files_in += files[i];
                        }else{
                            files_in += ','+files[i];
                        }
                    }
                }
                return files_in;
            }
            return '';
        },
        onprojectsDelete: function(e){
            if(e.toElement.getAttribute('identity') == this.model.get('_id')){
                this.model.set('id', this.model.get('_id'));
                this.model.url = '/project/'+this.model.get('_id');
				
				var myModel = this;
            app.commands.execute("app:dialog:confirm", {
                icon: 'info-sign',
                title: 'Delete action',
                message: 'Do you really want to delete '+myModel.model.get('text')+' ?',
                confirmNo: function() {
                },
                confirmYes: function() {
					myModel.model.destroy();
					if(myModel.model.get('inProjects')[0] != ""){
						Backbone.history.navigate('#project/'+myModel.model.get('inProjects')[0],{ trigger:true, replace: true });
					}else{
						var splitPath = window.location.hash.substring(2).split('/');
						Backbone.history.navigate('#projects/'+splitPath[1],{ trigger:true, replace: true });
					}
                }
            });
				
            }
        },
        onprojectsUploadFile:function(e){
            if(e.toElement.getAttribute('identity') == this.model.get('_id')){
                this.$el.find('#fileToUpload').trigger('click');
            }
        },
        _fileChangeEvent: function(e){
            if(e.target.getAttribute('identity') == this.model.get('_id')){
                this.uploadFilesToServer(e.target.files);
            }
        },
        renderr: function(){
            if(this.model.get('files') != '' &&
                Array.isArray(this.model.get('files'))){
                var files = this.model.get('files')[0].split(',');
                var files_in = "";
                for (var i in files) {
                    if(files[i] != 'undefined') {
                        files_in += '<a href="/files/project_managing_files/'+this.model.get('_id')+'/'+files[i]+'">'+files[i]+'</a> <input file_name="'+files[i]+'" type="checkbox" class="delete_files"> Delete<br/>';
                    }
                }
                return files_in;
            }
            return '';
        },
        initialize: function(){
            this.$el.attr("pid", this.model.get('_id'));
            this.model.set('cFriendsOn', '');
            this.model.set('cChooseFriends', '');
            this.model.set('cFiles','');
            //this.model.set('cFiles',this.renderr());
        },
        friendsAddedV: function(friends){
            var html = '<div id="friendThereInEntry">';
                var ffriends = this.model.get('friends');
            if(Array.isArray(ffriends)){
                for(var jj=0; jj < ffriends.length; jj++){
                    var name = 'Friend was removed';
                    for(var ii=0; ii < friends.length; ii++){
                        if(friends[ii]._id === ffriends[jj]._id){
                            name = friends[ii].firstname+' '+friends[ii].lastname;
                        }
                    }
                    html += '<div id="">'+name+' <span style="cursor:pointer" pid="'+ffriends[jj]._id+'" class="removeFriendFromList">Remove</span>'+'</div>';
                }
            }
            html += '</div>';
            return html;
        },
        friendsHtmlV: function(friends){
            var html = '<select name="friendAddToEntry" id="friendAddToEntry">';
            html += '<option value="">Add friend</option>';
            if(Array.isArray(friends)){
                for(var i=0; i < friends.length; i++){
                    var canChoose = true;
                    var ffriends = this.model.get('friends');
                    if(Array.isArray(ffriends) && ffriends.length > 0 && ffriends !== ''){
                        for(var jj=0; jj < ffriends.length; jj++){
                            if(friends[i]._id === ffriends[jj]._id){
                                canChoose = false;
                            }
                        }
                    }
                    if(canChoose){
                        html += '<option value="'+friends[i]._id+'">'+friends[i].firstname+' '+friends[i].lastname+'</option>';
                    }
                }
            }
            html += '</select>';
            return html;
        },
        _dropEvent: function (e) {
            if (e.originalEvent) e = e.originalEvent
            var data = this._getCurrentDragData(e)

            if (e.preventDefault) e.preventDefault()
            if (e.stopPropagation) e.stopPropagation() // stops the browser from redirecting

            if (this._draghoverClassAdded) this.$el.removeClass("draghover")

            this.drop(data, e.dataTransfer, e)
        },
        drop: function (data, dataTransfer, e) {
            this.uploadFilesToServer(dataTransfer.files);
            $('.project_one_good_loading').hide();
        },
        _dragOverEvent: function (e) {
            if (e.originalEvent) e = e.originalEvent
            var data = this._getCurrentDragData(e)

            if (this.dragOver(data, e.dataTransfer, e) !== false) {
                if (e.preventDefault) e.preventDefault()
                e.dataTransfer.dropEffect = 'copy' // default
            }
        },
        dragOver: function (data, dataTransfer, e) {
            var ok = dataTransfer && dataTransfer.types && dataTransfer.types.indexOf('Files') >= 0;
                if(ok){
                    if(!this.model.get('isHeader')){
                        this._draghoverClassAddedFile = true;
                        $('.project_one_good_loading').hide();
                        this.$el.find('.project_one_good_loading').show();
                    }
                }
        },
        uploadFilesToServer: function(files){
            var fd = new FormData();
            fd.append("project", this.model.get('_id'));
            fd.append("pfiles", this.model.get('files'));
            var files_in = this.model.get('files')[0];
            for (var i in files) {
                if(files[i].name != 'undefined' && files[i].name != 'item'){
                    files_in += ','+files[i].name;
                }
                fd.append("uploadedFile", files[i]);
            }
            this.model.set('files', [files_in]);
            var xhr = new XMLHttpRequest();
            //xhr.upload.addEventListener("progress", uploadProgress, false);
             xhr.addEventListener("load", function(){ location.reload(); }, false);
            //xhr.addEventListener("error", uploadFailed, false);
            //xhr.addEventListener("abort", uploadCanceled, false);
            xhr.open("POST", "/project_upload");
            //scope.progressVisible = true;
            xhr.send(fd);
        },
        findNavigation: function(projectsInT){
            var pmodel_th = {modelName:"Project",isMore:''};
            if(typeof this.options.mainP != 'undefined'){
                if(typeof this.options.mainP.mainProject.get(projectsInT) !== 'undefined'){
                    pmodel_th = {modelName:this.options.mainP.mainProject.get(projectsInT).get('text'),isMore:''};
                }
            }
            if(typeof this.options.projectsAll != 'undefined' && pmodel_th.modelName === 'Project'){
                for(var jj=0; jj < this.options.projectsAll.length;jj++){
                    if(typeof this.options.projectsAll[jj].get(projectsInT) !== 'undefined'){
                        pmodel_th = {modelName:this.options.projectsAll[jj].get(projectsInT).get('text'),isMore:this.options.projectsAll[jj].get(projectsInT).get('inProjects')};
                    }
                }
            }
            return pmodel_th;
        },
        searchNavigation: function(projectsInT, username){
            var g_ret = "";
            if(typeof projectsInT != 'undefined'){
                for(var ii=0; ii < projectsInT.length; ii++){
                    if(projectsInT[ii] !== ''){
                        var pmodel_th = this.findNavigation(projectsInT[ii]);
                        if(pmodel_th.isMore !== ''){
                            g_ret += this.searchNavigation(pmodel_th.isMore, username);
                        }
                        g_ret += ' - <a href="#/project/'+username+'/'+projectsInT[ii]+'">'+pmodel_th.modelName+'</a>';
                    }
                }
            }
            return g_ret;
        },
        searchRoute: function(projectsInT, username){
            return this.searchNavigation(projectsInT, username);
        },
        renderNavigation: function(){
            if(typeof this.options.navigationModel != 'undefined'){
				var splitPath = window.location.hash.substring(2).split('/');
				var navLinks = '<a href="#projects/'+splitPath[1]+'">Home</a>';
                var projectsInT = this.options.navigationModel.get('inProjects');
                if(typeof projectsInT != 'undefined'){
                    navLinks += this.searchRoute(projectsInT, splitPath[1]);
					var textToAdd = this.options.navigationModel.get('text');
					var tempDom = $('<output>').append($.parseHTML( this.options.navigationModel.get('text') ));
					var appContainer = $('.hover', tempDom);
					if(appContainer.length > 0){
						textToAdd = appContainer.html();
					}
                    navLinks += ' - '+textToAdd;
                }
                $('#navigation_main').html(navLinks);
            }
        },
        onRender: function(){
            this.renderNavigation();
        }
    });
});
