define([
    'underscore',
    'marionette',
    'tpl!../templates/entry.html'
], function (_, Marionette, templ) {
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
            'click .projectsEdit':'onprojectsEdit'
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
            myModel.set('text', $('#projectText').val());
            myModel.set('name', $('#projectName').val());
            myModel.set('color', $('#color').val());
            myModel.url = '/project/'+myModel.get('_id');
            myModel.save();
            $('#project_'+myModel.get('_id')).attr('style','width:auto; border:2px solid '+$('#color').val());

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
                this.model.destroy();
                console.log(this.model.get('inProjects'));
                if(this.model.get('inProjects')[0] != ""){
                    Backbone.history.navigate('#project/'+this.model.get('inProjects')[0],{ trigger:true, replace: true });
                }else{
                    Backbone.history.navigate('#home',{ trigger:true, replace: true });
                }
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
        initialize: function(){
            this.$el.attr("pid", this.model.get('_id'));
            this.model.set('cFiles',this.renderr());
            this.$el.bind("dragover", _.bind(this._dragOverEvent, this));
            this.$el.bind("drop", _.bind(this._dropEvent, this));
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
        }
    });
});
