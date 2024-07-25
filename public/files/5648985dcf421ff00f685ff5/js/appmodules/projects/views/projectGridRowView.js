define([
    'underscore',
    'marionette',
    'tpl!../templates/projectGridRow.html',
    'models/project'
], function (_, Marionette, templ, Project) {
    'use strict';

    return Marionette.ItemView.extend({
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
            'change #fileToUpload':'_fileChangeEvent'
        },
        initialize: function(){
            //this.$el.attr("draggable", "true");
            this.$el.attr("pid", this.model.get('_id'));
            //this.$el.bind("dragstart", _.bind(this._dragStartEvent, this));

            this.$el.bind("dragover", _.bind(this._dragOverEvent, this));
            //this.$el.bind("dragenter", _.bind(this._dragEnterEvent, this));
            //this.$el.bind("dragleave", _.bind(this._dragLeaveEvent, this));
            this.$el.bind("drop", _.bind(this._dropEvent, this));

            this._draghoverClassAdded = false;
            this._draghoverClassAddedFile = false;
            Project.selectedVieww = "";
        },
        onprojectsUploadFile:function(e){
            if(e.toElement.getAttribute('identity') == this.model.get('_id')){
                this.$el.find('#fileToUpload').trigger('click');
            }
        },
        _fileChangeEvent: function(e){
            if(e.target.getAttribute('identity') == this.model.get('_id')){
                console.log('files:', e.target.files);
                this.uploadFilesToServer(e.target.files);
                //this.$el.find('#fileToUpload').val('');
            }
        },
        _dragOverEvent: function (e) {
            if (e.originalEvent) e = e.originalEvent
            var data = this._getCurrentDragData(e)

            if (this.dragOver(data, e.dataTransfer, e) !== false) {
                if (e.preventDefault) e.preventDefault()
                e.dataTransfer.dropEffect = 'copy' // default
            }
        },

        _dragEnterEvent: function (e) {
            if (e.originalEvent) e = e.originalEvent
            if (e.preventDefault) e.preventDefault()
        },

        _dragLeaveEvent: function (e) {
            if (e.originalEvent) e = e.originalEvent
            var data = this._getCurrentDragData(e)
            this.dragLeave(data, e.dataTransfer, e)
        },

        _dropEvent: function (e) {
            if (e.originalEvent) e = e.originalEvent
            var data = this._getCurrentDragData(e)

            if (e.preventDefault) e.preventDefault()
            if (e.stopPropagation) e.stopPropagation() // stops the browser from redirecting

            if (this._draghoverClassAdded) this.$el.removeClass("draghover")

            this.drop(data, e.dataTransfer, e)
        },

        _getCurrentDragData: function (e) {
            var data = null
            if (window._backboneDragDropObject) data = window._backboneDragDropObject
            return data
        },

        dragOver: function (data, dataTransfer, e) {
            var ok = dataTransfer && dataTransfer.types && dataTransfer.types.indexOf('Files') >= 0;
            if(Project.selectedVieww == ""){
                if(ok){
                    if(!this.model.get('isHeader')){
                        this._draghoverClassAddedFile = true;
                        $('.project_one_good_loading').hide();
                        this.$el.find('.project_one_good_loading').show();
                    }
                }
            }
        },

        dragLeave: function (data, dataTransfer, e) { // optionally override me
            if (this._draghoverClassAdded){
                if(this.model.get('isHeader')){
                    this.$el.removeClass("draghover");
                }else{
                    this.$el.removeClass("dragHoverElement");
                }
            }
            /*if(e.currentTarget.getAttribute('class') == 'headerMain' && !this.model.get('isHeader') && Project.selectedVieww == ""){
                $('.project_one_good_loading').hide();
                $("#dragHoverElement").remove();
                $("#dragHoverElementHeader").remove();
            }*/
        },
        renderr: function(){
            if(this.model.get('files') != ''){
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
            xhr.upload.addEventListener("progress", function(oEvent){
                if(!$('#project_'+this.model.get('_id')+' #progress').length){
                    $('#project_'+this.model.get('_id')).append('<div id="progress" style="color:white;background:red;"></div>');
                }
                if (oEvent.lengthComputable) {
                    var percentComplete = oEvent.loaded / oEvent.total;
                    $('#project_'+this.model.get('_id')+' #progress').css('height', '10px');
                    $('#project_'+this.model.get('_id')+' #progress').css('width', (percentComplete*100)+'%');
                } else {
                    $('#project_'+this.model.get('_id')+' #progress').html('Uploading ... ');
                }
            }.bind(this), false);
             xhr.addEventListener("load", function(){
                 $('#project_'+this.model.get('_id')+' #progress').remove();
             }.bind(this), false);
            //xhr.addEventListener("error", uploadFailed, false);
            //xhr.addEventListener("abort", uploadCanceled, false);
            xhr.open("POST", "/project_uploadd");
            //scope.progressVisible = true;
            xhr.send(fd);
        },
        drop: function (data, dataTransfer, e) {
            if(Project.selectedVieww == "" && !this.model.get('isHeader')){
                this.uploadFilesToServer(dataTransfer.files);
            }/*else{
            if(!Project.selectedVieww.model.get('isHeader')){
                var inHeader = this.model.get('inHeader');
                if(this.model.get('isHeader')){
                    inHeader = this.model.get('_id');
                }
                Project.selectedVieww.model.set('id', Project.selectedVieww.model.get('_id'));
                Project.selectedVieww.model.set('inHeader', inHeader);
                Project.selectedVieww.model.save();
                Project.selectedVieww.model.set('positionLayerY', e.layerY);
                Project.selectedVieww.model.set('positionModelId', this.model.get('_id'));
                Project.selectedVieww.model.set('positionModelIsHeader', this.model.get('isHeader'));
            }else{
                Project.selectedVieww.model.set('id', Project.selectedVieww.model.get('_id'));

                var plus = 0;
                if(!this.model.get('isHeader')){
                    plus = 25;
                }
                var widthX = parseInt(e.x/(e.currentTarget.clientWidth+plus));
                var width_sub = (widthX*(e.currentTarget.clientWidth+plus));
                if(widthX == 0){
                    width_sub = 0;
                }
                var layerX= ((e.x-width_sub)/2)+1;

                Project.selectedVieww.model.set('positionLayerX', layerX);
                var inHeaderId = this.model.get('_id');
                if(!this.model.get('isHeader')){
                    inHeaderId = this.model.get('inHeader');
                }
                Project.selectedVieww.model.set('positionModelIdX', inHeaderId);
            }
            }*/
            Project.selectedVieww = "";
            $('.project_one_good_loading').hide();
            $("#dragHoverElement").remove();
            $("#dragHoverElementHeader").remove();
        },

        _dragStartEvent:function(e){
            var data
            if (e.originalEvent) e = e.originalEvent
            e.dataTransfer.effectAllowed = "copy" // default to copy
            data = this.dragStart(e.dataTransfer, e)

            window._backboneDragDropObject = null
            if (data !== undefined) {
                window._backboneDragDropObject = data // we cant bind an object directly because it has to be a string, json just won't do
            }
        },
        dragStart: function (dataTransfer, e) {
            $('.project_one_good_loading').hide();
            $("#dragHoverElement").remove();
            $("#dragHoverElementHeader").remove();
            if(Project.selectedVieww == ""){
                Project.selectedVieww = this;
            }
        },
        onpprojectMain: function(e){
            if(this.model.get('isHeader')){
                return;
            }
            /*if(this.model.get('isProject')){*/
                window.location = '#/entry/'+this.model.get('email')+'/'+this.model.get('_id');
            /*}else{
                this.model.set('id', this.model.get('_id'));
                var myModel = this.model;
                this.editDialog(myModel);
            }*/
        },
        onprojectsEdit: function(e){
            if(e.currentTarget.getAttribute('identity') == this.model.get('_id')){
                this.model.set('id', this.model.get('_id'));
                var myModel = this.model;
                this.editDialog(myModel);
            }
        },
        editDialog: function(myModel){
            var th = this;
            app.commands.execute("app:dialog:confirm", {
                icon: 'info-sign',
                title: 'Edit',
                message: '<textarea class="form-control" id="name">'+this.model.get('name')+'</textarea>'+
                '<textarea class="form-control" id="text">'+this.model.get('text')+'</textarea>'+
                '<input type="color" class="form-control" id="color" value="'+this.model.get('color')+'" />'+
                this.friendsHtmlV(app.userConnected.data2.friends)+' '+
                this.friendsAddedV(app.userConnected.data2.friends)+
                this.renderr(),
                confirmNo: function() {
                },
                confirmYes: function() {
                    var delete_files = [];
                        $('.delete_files').each(function(i, obj) {
                            if($(this).is(':checked')){
                                delete_files.push($(this).attr('file_name'));
                            }
                        });
                    var filess = th.eraseFiles(delete_files);
                    var removed_ff = $('#remove_friend_f_f').val();
                    var add_ff = $('#friendAddToEntry').val();
                    myModel.set('friendDeleteEntry', '');
                    myModel.set('friendAddToEntry', '');
                    if(removed_ff !== ''){
                        myModel.set('friendDeleteEntry', removed_ff);
                        myModel.removeFromFriends(removed_ff);
                    }
                    if(add_ff !== ''){
                        myModel.set('friendAddToEntry', add_ff);
                        myModel.addToFriends(add_ff);
                    }
                    myModel.set('id', myModel.get('_id'));
                    myModel.set('files', [filess]);
                    myModel.set('name', $('#name').val());
                    myModel.set('text', $('#text').val());
                    myModel.set('color', $('#color').val());
                    myModel.save();
                    $('#text_id'+myModel.get('_id')).html($('#text').val());
                    //$('#text_id'+myModel.get('_id')).attr('style','background: '+$('#color').val());
                    //$('#project_'+myModel.get('_id')).attr('style','position:relative; border: 1px solid '+$('#color').val());
                    $('#project_'+myModel.get('_id')+' .glyphicon-list-alt').attr('style','color:'+$('#color').val());
                    this.trigger('project:edit');
                }
            });
        },
        friendsAddedV: function(friends){
            var html = '<select name="remove_friend_f_f" id="remove_friend_f_f">';
            html += '<option value="">Remove friend</option>';
            var ffriends = this.model.get('friends');
            for(var jj=0; jj < ffriends.length; jj++){
                var name = 'Friend was removed';
                for(var ii=0; ii < friends.length; ii++){
                    if(friends[ii]._id === ffriends[jj]._id){
                        name = friends[ii].firstname+' '+friends[ii].lastname;
                    }
                }
                html += '<option value="'+ffriends[jj]._id+'">'+name+'</option>';
            }
            html += '</select>';
            return html;
        },
        friendsHtmlV: function(friends){
            var html = '<select name="friendAddToEntry" id="friendAddToEntry">';
            html += '<option value="">Add friend</option>';
            for(var i=0; i < friends.length; i++){
                var canChoose = true;
                var ffriends = this.model.get('friends');
                if(ffriends.length > 0 && ffriends !== ''){
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
            html += '</select>';
            return html;
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
            if(e.currentTarget.getAttribute('identity') == this.model.get('_id')){
                this.model.set('id', this.model.get('_id'));
                this.model.url = '/projectt/'+this.model.get('_id');
				var myModel = this;
            app.commands.execute("app:dialog:confirm", {
                icon: 'info-sign',
                title: 'Delete action',
                message: 'Do you really want to delete '+myModel.model.get('text')+' ?',
                confirmNo: function() {
                },
                confirmYes: function() {
					$('#project_'+myModel.model.get('_id')).remove();
					myModel.model.destroy();
					myModel.trigger('project:delete');
                }
            });
            }
        }
    });
});
