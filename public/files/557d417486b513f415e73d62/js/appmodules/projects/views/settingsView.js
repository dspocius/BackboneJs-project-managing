define([
    '../../../app',
	'views/templateHelpers',
    'underscore',
    'marionette',
    'tpl!../templates/settings.html'
], function (app, templateHelpers, _, Marionette, templ) {
    'use strict';

    return Marionette.ItemView.extend({
		templateHelpers:templateHelpers,
        template: templ,
		ui:{
			changeSettings:'#changeSettings',
			settingColor:'#settingColor'
		},
		events:{
		'click #changeSettings':'changeSettings',
		'click .projectsUploadFile':'onprojectsUploadFile',
		'change #fileToUpload':'_fileChangeEvent',
		'click #use_def_style':'changeViewOfDefinedClickedTr',
		'change #use_defined_style':'changeViewOfDefinedClicked'
		},
		changeViewOfDefinedClickedTr: function(){
			$("#use_defined_style").trigger("click");
		},
		changeViewOfDefinedClicked: function(){
			if(!$('#use_defined_style').is(':checked')){
				//$('#use_defined_style').removeAttr('checked');
				$("#optional_fields_on_off").hide();
			}else{
				//$('#use_defined_style').attr('checked','checked');
				$("#optional_fields_on_off").show();
			}
		},
		uploadFilesToServer: function(files){
            var fd = new FormData();
            fd.append("project", 'ProjectManagementFiles');
            fd.append("pfiles", 'do_not_update');
            var files_in = '';
            for (var i in files) {
                if(files_in == '' && files[i].name != 'undefined' && files[i].name != 'item'){
                    files_in = files[i].name;
                }
                fd.append("uploadedFile", files[i]);
            }
            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", function(oEvent){
                if(!$('#projectManagementFilesProg'+' #progress').length){
                    $('#projectManagementFilesProg').append('<div id="progress" style="color:white;background:red;"></div>');
                }
                if (oEvent.lengthComputable) {
                    var percentComplete = oEvent.loaded / oEvent.total;
                    $('#projectManagementFilesProg'+' #progress').css('height', '10px');
                    $('#projectManagementFilesProg'+' #progress').css('width', (percentComplete*100)+'%');
                } else {
                    $('#projectManagementFilesProg'+' #progress').html(app.translate('Uploading ... '));
                }
            }.bind(this), false);
             xhr.addEventListener("load", function(){
                 $('#projectManagementFilesProg'+' #progress').remove();
				 $('#backgroundPicture').val(files_in);
			 }.bind(this), false);
            //xhr.addEventListener("error", uploadFailed, false);
            //xhr.addEventListener("abort", uploadCanceled, false);
            xhr.open("POST", "/project_upload");
            //scope.progressVisible = true;
            xhr.send(fd);
        },
		_fileChangeEvent: function(e){
            if(e.target.getAttribute('identity') == 'ProjectManagementFiles'){
                console.log('files:', e.target.files);
                this.uploadFilesToServer(e.target.files);
                //this.$el.find('#fileToUpload').val('');
            }
        },
		onprojectsUploadFile:function(e){
            if(e.toElement.getAttribute('identity') == 'ProjectManagementFiles'){
                this.$el.find('#fileToUpload').trigger('click');
            }
        },
		changeSettings:function(){
			var color = $('#settingColor').val();
			var websiteStyle = $('#websiteStyle').val();
			var backgroundPicture = $('#backgroundPicture').val();
			var borderRadius = $('#borderRadius').val();
			var listsColor = $('#listsColor').val();
			var entryColor = $('#entryColorrr').val();
			var innerIconsColor = $('#innerIconsColor').val();
			var outerIconsColor = $('#outerIconsColor').val();
			var defaultViewOfSite = $('#defaultViewOfSite').val();
			var use_defined_style = "";
			if($('#use_defined_style').is(':checked')){
				use_defined_style = "true";
			}
			this.trigger('change:settings',{use_defined_style:use_defined_style, defaultViewOfSite:defaultViewOfSite, outerIconsColor:outerIconsColor, innerIconsColor:innerIconsColor, entryColor:entryColor, listsColor:listsColor, borderRadius:borderRadius, backgroundPicture:backgroundPicture, color:color, websiteStyle:websiteStyle});
		}
    });
});
