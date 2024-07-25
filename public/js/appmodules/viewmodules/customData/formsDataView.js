define([
	'../../../app',
	'../../../config'
], function( app, config ) {
	return {
		appendName: function(){
			return "_forms_data";
		},
		sendUpdateToUiIfInEntry: function(){
			$("#updateAllTheViewNotDisplayed").trigger("click");
			$("#forms_data_info_view").trigger("click");
		},
		getTimeNow: function(){
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
				return today;
		},
			edit_data_edit_view_cancel_edit: function(){
				$('#edit_data_edit_view'+this.appendName()).hide();
				$('#edit_data_edit_view_cancel_edit'+this.appendName()).hide();
				$('#edit_routes_new_view'+this.appendName()).html("");
			},
			save_data_edit_view_cancel_save: function(){
				$('#add_routes_new_view'+this.appendName()).html("");
				$('#save_data_edit_view'+this.appendName()).hide();
				$('#save_data_edit_view_cancel_save'+this.appendName()).hide();
			},
			saveData: function(){
				var th = this;
				$( ".forms_data_info_view .addOneDataToIt"+this.appendName() ).each(function( index ) {
					var about = $( this ).find('.addClassDataAbout').val();
					var defaultValue = $( this ).find('.addClassDataDefaultValue').val();
					var typeData = $( this ).find('.typeofdata').val();
					var typeDataShowing = $( this ).find('.typeofshowing').val();
					
					var regex = /(<([^>]+)>)/ig;
					about = about.replace(regex, "");
					defaultValue = defaultValue.replace(regex, "");
					typeData = typeData.replace(regex, "");
					typeDataShowing = typeDataShowing.replace(regex, "");
								
				  if(typeData != ''  && about != ''){
					  var listdata = "";
					  if(typeData === "List" || typeData === "Table" || typeData === "Radio"){
						  var valNames = $(".typeofdataoptionName").val();
						  var valValues = $(".typeofdataoptionValue").val();
						  	valNames = valNames.replace(regex, "");
							valValues = valValues.replace(regex, "");
							
						  listdata = [];
						  $( ".forms_data_info_view .typeofdataoptionValue" ).each(function( index ) {
							var nameOfit = $( ".forms_data_info_view .typeofdataoptionName:eq("+index+")" ).val();
							var valusse = $( ".forms_data_info_view .typeofdataoptionValue:eq("+index+")" ).val();
						  	nameOfit = nameOfit.replace(regex, "");
							valusse = valusse.replace(regex, "");
							
							if(nameOfit !== "" && valusse !== ""){
								listdata.push({name: nameOfit, value:valusse});
							}
						  });
					  }
					var myModel = th.model;
					myModel.set('id', myModel.get('_id'));
					var dataObj = {about:about, type:typeData, date:th.getTimeNow(), listdata:listdata, defaultValue:defaultValue, showing:typeDataShowing};
					var routesData = JSON.parse(myModel.get('forms_data'));
					routesData.push(dataObj);
					myModel.set('forms_data', JSON.stringify(routesData));
					myModel.set("forms_data_info", JSON.stringify(routesData));
					myModel.url = config.urlAddr+'/project/'+myModel.get('_id');
					myModel.save();
			$('#save_data_edit_view'+th.appendName()).hide();
			$('#save_data_edit_view_cancel_save'+th.appendName()).hide();
					th.sendUpdateToUiIfInEntry();
					$( this ).find('.addClassDataDefaultValue').val("");
					$( this ).find('.addClassDataAbout').val("");
					$( this ).find('.typeofdata').val("Text");
					$( this ).find('.typeofshowing').val("standart_show_forms");
					$( this ).find('.selectionValuesNames').hide();
					var taskNew = '<input type="text" class="typeofdataoptionName" placeholder="'+app.translate('Name')+'" />';
					taskNew += '<input type="text" class="typeofdataoptionValue" placeholder="'+app.translate('Value')+'" />';
					$( this ).find(".selectionValuesNamesOfTwo").html(taskNew);
				  }
				});
			},
		let_answer_more_than_one: function(e){
			var id_of_change = 'let_answer_more_than_one'+this.appendName();
			var can_answer_more_than = this.model.get("submitted_data_can_answer_more");
			if(can_answer_more_than == "false" || can_answer_more_than == "False"){
				this.model.set("submitted_data_can_answer_more", "true");
			}else{
				this.model.set("submitted_data_can_answer_more", "false");
			}
			var now_can_he_answer = "One time per person - Change";
			if(can_answer_more_than == "true" || can_answer_more_than == "True"){
				now_can_he_answer = "More than one time per person - Change";
			}
			this.model.save();
			$("#"+id_of_change).text(now_can_he_answer);
				e.stopImmediatePropagation();
				e.stopPropagation();
		},
		addDataWindow: function(){
			$('#save_data_edit_view'+this.appendName()).show();
			$('#save_data_edit_view_cancel_save'+this.appendName()).show();
			var taskNew = '<div class="addOneDataToIt'+this.appendName()+'"><input type="text" class="addClassDataAbout" placeholder="'+app.translate('Name')+'" /> <input type="text" class="addClassDataDefaultValue" placeholder="'+app.translate('Default value')+'" />';
			taskNew += app.translate('Type');
			taskNew += "<select class='typeofdata'>";
			taskNew += "<option value='Text'>Text</option>";
			taskNew += "<option value='TextArea'>TextArea</option>";
			taskNew += "<option value='Number'>Number</option>";
			taskNew += "<option value='Checkbox'>Checkbox</option>";
			taskNew += "<option value='List'>List</option>";
			taskNew += "<option value='Table'>Table</option>";
			taskNew += "<option value='Radio'>Radio</option>";
			taskNew += "<option value='About'>About</option>";
			taskNew += "<option value='File'>File</option>";
			taskNew += "</select>";
			taskNew += app.translate('Show');
			taskNew += "<select class='typeofshowing'>";
			taskNew += "<option value='standart_show_forms'>Standart not required</option>";
			taskNew += "<option value='standart_show_forms_required'>Standart required</option>";
			/*taskNew += "<option value='standart_show_forms_background'>Standart with background</option>";
			taskNew += "<option value='left_show_forms'>Left</option>";
			taskNew += "<option value='left_show_forms_background'>Left with background</option>";
			taskNew += "<option value='right_show_forms'>Right</option>";
			taskNew += "<option value='right_show_forms_background'>Right with background</option>";
			taskNew += "<option value='full_width_show_forms'>Full width</option>";
			taskNew += "<option value='full_width_show_forms_background'>Full width with background</option>";*/
			
			taskNew += "</select>";
			taskNew += '<div class="selectionValuesNames" style="display:none;">';
				taskNew += '<button class="addOptionsForOnlyForms">Add</button>';
				taskNew += '<div class="selectionValuesNamesOfTwo">';
				taskNew += '<input type="text" class="typeofdataoptionName" placeholder="'+app.translate('Name')+'" />';
				taskNew += '<input type="text" class="typeofdataoptionValue" placeholder="'+app.translate('Value')+'" />';
				taskNew += "</div>";
			taskNew += "</div>";
			taskNew += "</div>";
			
			$('#add_routes_new_view'+this.appendName()).html(taskNew);
			$('.typeofdata').click(function(){
				var value = $(this).val();
				if(value === "List" || value === "Table" || value === "Radio"){
					$(".selectionValuesNames").show();
				}else{
					$(".selectionValuesNames").hide();
				}
			});
			$('.addOptionsForOnlyForms').click(function(){
				var taskNew = '<input type="text" class="typeofdataoptionName" placeholder="'+app.translate('Name')+'" />';
				taskNew += '<input type="text" class="typeofdataoptionValue" placeholder="'+app.translate('Value')+'" />';
				$(".selectionValuesNamesOfTwo").append(taskNew);
			});
		},
		editDataWindow: function(data){
			$('#edit_data_edit_view'+this.appendName()).show();
			$('#edit_data_edit_view_cancel_edit'+this.appendName()).show();
			var taskNew = '<div class="addOneDataToItEdit'+this.appendName()+'"><input type="hidden" value="'+data.date+'" class="addClassDataDate" placeholder="'+app.translate('Name')+'" style="display:none;" /><input type="text" value="'+data.about+'" class="addClassDataAbout" placeholder="'+app.translate('Name')+'" /> <input type="text" value="'+data.defaultValue+'" class="addClassDataDefaultValue" placeholder="'+app.translate('Default value')+'" />';
			taskNew += app.translate('Type');
			taskNew += "<select class='typeofdata'>";
			var aboutSel = "";
			var textSel = "";
			var textareaSel = "";
			var numberSel = "";
			var checkboxSel = "";
			var listSel = "";
			var tableSel = "";
			var radioSel = "";
			var fileSel = "";
			var totalSel = "";
			var submitSel = "";
			if(data.type === "About"){ aboutSel = "selected"; }
			if(data.type === "Text"){ textSel = "selected"; }
			if(data.type === "TextArea"){ textareaSel = "selected"; }
			if(data.type === "Number"){ numberSel = "selected"; }
			if(data.type === "Checkbox"){ checkboxSel = "selected"; }
			if(data.type === "List"){ listSel = "selected"; }
			if(data.type === "Table"){ tableSel = "selected"; }
			if(data.type === "Radio"){ radioSel = "selected"; }
			if(data.type === "File"){ fileSel = "selected"; }
			if(data.type === "Submit"){ submitSel = "selected"; }
			if(data.type === "Total"){ totalSel = "selected"; }
			taskNew += "<option value='About' "+aboutSel+">About</option>";
			taskNew += "<option value='Text' "+textSel+">Text</option>";
			taskNew += "<option value='TextArea' "+textareaSel+">TextArea</option>";
			taskNew += "<option value='Number' "+numberSel+">Number</option>";
			taskNew += "<option value='Checkbox' "+checkboxSel+">Checkbox</option>";
			taskNew += "<option value='List' "+listSel+">List</option>";
			taskNew += "<option value='Table' "+tableSel+">Table</option>";
			taskNew += "<option value='Radio' "+radioSel+">Radio</option>";
			taskNew += "<option value='File' "+fileSel+">File</option>";
			taskNew += "<option value='Submit' "+submitSel+">Submit</option>";
			taskNew += "<option value='Total' "+totalSel+">Total</option>";
			taskNew += "</select>";
			
			
			var standart_show_forms = "";
			var standart_show_forms_required = "";
			var standart_show_forms_background = "";
			var left_show_forms = "";
			var left_show_forms_background = "";
			var right_show_forms = "";
			var right_show_forms_background = "";
			var full_width_show_forms = "";
			var full_width_show_forms_background = "";
			if(data.showing === "standart_show_forms"){ standart_show_forms = "selected"; }
			if(data.showing === "standart_show_forms_required"){ standart_show_forms_required = "selected"; }
			if(data.showing === "standart_show_forms_background"){ standart_show_forms_background = "selected"; }
			if(data.showing === "left_show_forms"){ left_show_forms = "selected"; }
			if(data.showing === "left_show_forms_background"){ left_show_forms_background = "selected"; }
			if(data.showing === "right_show_forms"){ right_show_forms = "selected"; }
			if(data.showing === "right_show_forms_background"){ right_show_forms_background = "selected"; }
			if(data.showing === "full_width_show_forms"){ full_width_show_forms = "selected"; }
			if(data.showing === "full_width_show_forms_background"){ full_width_show_forms_background = "selected"; }
			taskNew += app.translate('Show');
			taskNew += "<select class='typeofshowing'>";
			taskNew += "<option value='standart_show_forms' "+standart_show_forms+">Standart not required</option>";
			taskNew += "<option value='standart_show_forms_required' "+standart_show_forms_required+">Standart required</option>";
			
			/*taskNew += "<option value='standart_show_forms_background' "+standart_show_forms_background+">Standart with background</option>";
			taskNew += "<option value='left_show_forms' "+left_show_forms+">Left</option>";
			taskNew += "<option value='left_show_forms_background' "+left_show_forms_background+">Left with background</option>";
			taskNew += "<option value='right_show_forms' "+right_show_forms+">Right</option>";
			taskNew += "<option value='right_show_forms_background' "+right_show_forms_background+">Right with background</option>";
			taskNew += "<option value='full_width_show_forms' "+full_width_show_forms+">Full width</option>";
			taskNew += "<option value='full_width_show_forms_background' "+full_width_show_forms_background+">Full width with background</option>";*/
			taskNew += "</select>";
			
			var notDisplay = "display:none;";
			if(data.type === "List" || data.type === "Table" || data.type === "Radio"){
				notDisplay = "display:block;";
			}
			taskNew += '<div class="selectionValuesNames" style="'+notDisplay+'">';
				taskNew += '<button class="addOptionsForOnlyForms">Add</button>';
				taskNew += '<div class="selectionValuesNamesOfTwo">';
				if(data.type === "List" || data.type === "Table" || data.type === "Radio"){
					var listdata = data.listdata;
					for(var ii=0; ii < listdata.length; ii++){
							if(listdata[ii].name !== "" && listdata[ii].value !== ""){
						taskNew += '<input value="'+listdata[ii].name+'" type="text" class="typeofdataoptionName" placeholder="'+app.translate('Name')+'" />';
						taskNew += '<input value="'+listdata[ii].value+'" type="text" class="typeofdataoptionValue" placeholder="'+app.translate('Value')+'" />';
							}
					}
				}else{
					taskNew += '<input type="text" class="typeofdataoptionName" placeholder="'+app.translate('Name')+'" />';
					taskNew += '<input type="text" class="typeofdataoptionValue" placeholder="'+app.translate('Value')+'" />';
				}
				taskNew += "</div>";
			taskNew += "</div>";
			taskNew += "</div>";
			
			$('#edit_routes_new_view'+this.appendName()).html(taskNew);
			$('.typeofdata').click(function(){
				var value = $(this).val();
				if(value === "List" || value === "Table" || value === "Radio"){
					$(".selectionValuesNames").show();
				}else{
					$(".selectionValuesNames").hide();
				}
			});
			$('.addOptionsForOnlyForms').click(function(){
				var taskNew = '<input type="text" class="typeofdataoptionName" placeholder="'+app.translate('Name')+'" />';
				taskNew += '<input type="text" class="typeofdataoptionValue" placeholder="'+app.translate('Value')+'" />';
				$(".selectionValuesNamesOfTwo").append(taskNew);
			});
		},
		
		
		getDatasViewButtons: function(){
			var can_answer_more_than = this.model.get("submitted_data_can_answer_more");
			var now_can_he_answer = "One time per person";
			if(can_answer_more_than == "false" || can_answer_more_than == "False"){
				now_can_he_answer = "More than one time per person";
			}
			var datasHtml = '';
			datasHtml += '<div>';
			datasHtml += app.addInfoAbout("Forms - there you can create your own forms. One time per person - means that person can only answer this form once");
			datasHtml += '	<button id="let_answer_more_than_one'+this.appendName()+'" class="buttonChange">'+now_can_he_answer+" - "+app.translate("Change")+'</button>';
			datasHtml += '	<button id="add_data_edit_view'+this.appendName()+'" class="buttonChange">'+app.translate("Add")+'</button>';
			datasHtml += '	<button id="save_data_edit_view'+this.appendName()+'" style="display:none;" class="buttonChange">'+app.translate("Save")+'</button>';
			datasHtml += '	<button id="save_data_edit_view_cancel_save'+this.appendName()+'" style="display:none;" class="buttonChange">'+app.translate("Cancel save")+'</button>';
			datasHtml += '	<button id="edit_data_edit_view'+this.appendName()+'" style="display:none;" class="buttonChange">'+app.translate("Edit")+'</button>';
			datasHtml += '	<button id="edit_data_edit_view_cancel_edit'+this.appendName()+'" style="display:none;" class="buttonChange">'+app.translate("Cancel edit")+'</button>';
			datasHtml += '	<div id="add_routes_new_view'+this.appendName()+'"></div>';
			datasHtml += '	<div id="edit_routes_new_view'+this.appendName()+'"></div>';
			datasHtml += '</div>';
			return datasHtml;
		},
		getDatasView: function(){
			if(typeof this.model == "undefined"){
				return "";
			}
			var dataOf = JSON.parse(this.model.get('forms_data'));
			var datasHtml = '';
				for(var i=0; i < dataOf.length; i++){
					if(typeof dataOf[i] != 'undefined' && dataOf[i] != null){
						datasHtml+='<div class="commentInModal" id="dataThereUnId'+dataOf[i].date.replace(/ /g,'').replace(/:/g,'')+'">';
						datasHtml+=dataOf[i].about;
						datasHtml+="<span style='font-size:12px;'> ";
						datasHtml+=dataOf[i].date;
						datasHtml+="</span><div> ";
						datasHtml+=dataOf[i].type;
						datasHtml+=" - "+dataOf[i].defaultValue;
						if(dataOf[i].type === "List" || dataOf[i].type === "Table" || dataOf[i].type === "Radio"){
							datasHtml+= "<div>";
							var listdata = dataOf[i].listdata;
							for(var ij=0; ij < listdata.length; ij++){
								datasHtml+= "<div>";
								datasHtml+= dataOf[i].listdata[ij].name+" - ";
								datasHtml+= dataOf[i].listdata[ij].value;
								datasHtml+= "</div>";
							}
							datasHtml+= "</div>";
						}
						datasHtml+="";
						if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate"){
							datasHtml += '<button data-date="'+dataOf[i].date+'" class=" general_button height35 editDataOne'+this.appendName()+'"><span data-date="'+dataOf[i].date+'" class="glyphicon glyphicon-edit icon-in-menu icon-turn-off"></span></button>';
							datasHtml += '<button data-date="'+dataOf[i].date+'" class=" general_button height35 removeDataOne'+this.appendName()+'"><span data-date="'+dataOf[i].date+'" class="glyphicon glyphicon-remove icon-in-menu icon-turn-off"></span></button>';
							datasHtml += '<button data-date="'+dataOf[i].date+'" class=" general_button height35 moveTopDataOne'+this.appendName()+'"><span data-date="'+dataOf[i].date+'" class="glyphicon glyphicon-arrow-up icon-in-menu icon-turn-off"></span></button>';
							datasHtml += '<button data-date="'+dataOf[i].date+'" class=" general_button height35 moveBottomDataOne'+this.appendName()+'"><span data-date="'+dataOf[i].date+'" class="glyphicon glyphicon-arrow-down icon-in-menu icon-turn-off"></span></button>';
							datasHtml += '</div></div>';
						}
					}
				}
			return datasHtml;
		},
		listenToEditDataOne: function(e){
			var date = e.currentTarget.getAttribute('data-date');
			var dataSelected = "";
				if(date != '' ){
				var dataOf = JSON.parse(this.model.get('forms_data'));
					for(var i = dataOf.length - 1; i >= 0; i--){
						if(typeof dataOf[i] != 'undefined' && dataOf[i] != null){
							if(dataOf[i].date === date) {
								dataSelected = dataOf[i];
								//dataOf.splice(i, 1);
								//$('#dataThereUnId'+date.replace(/ /g,'').replace(/:/g,'')).remove();
							}
						}
					}
					var myModel = this.model;
					//myModel.set('id', myModel.get('_id'));
					//myModel.set('forms_data', JSON.stringify(dataOf));
					//myModel.url = '/project/'+myModel.get('_id');
					//myModel.save();
				}
				if(dataSelected !== ""){
					//edit_routes_new_view'+this.appendName()+'
					this.editDataWindow(dataSelected);
					
				}
		},
			saveEditData: function(){
				var th = this;
				$( ".forms_data_info_view .addOneDataToItEdit"+this.appendName() ).each(function( index ) {
					var about = $( this ).find('.addClassDataAbout').val();
					var typeData = $( this ).find('.typeofdata').val();
					var typeDataShowing = $( this ).find('.typeofshowing').val();
					var dateOfData = $( this ).find('.addClassDataDate').val();
					var defaultValues = $( this ).find('.addClassDataDefaultValue').val();
					var regex = /(<([^>]+)>)/ig;
					about = about.replace(regex, "");
					typeData = typeData.replace(regex, "");
					typeDataShowing = typeDataShowing.replace(regex, "");
					dateOfData = dateOfData.replace(regex, "");
					defaultValues = defaultValues.replace(regex, "");
					
				  if(typeData != ''){
					  var listdata = "";
					  if(typeData === "List" || typeData === "Table" || typeData === "Radio"){
						  var valNames = $(".typeofdataoptionName").val();
						  var valValues = $(".typeofdataoptionValue").val();
						  valNames = valNames.replace(regex, "");
						  valValues = valValues.replace(regex, "");
						  listdata = [];
						  $( ".forms_data_info_view .typeofdataoptionValue" ).each(function( index ) {
							var nameOfit = $( ".forms_data_info_view .typeofdataoptionName:eq("+index+")" ).val();
							var valusse = $( ".forms_data_info_view .typeofdataoptionValue:eq("+index+")" ).val();
							nameOfit = nameOfit.replace(regex, "");
							valusse = valusse.replace(regex, "");
							
							if(nameOfit !== "" && valusse !== ""){
								listdata.push({name: nameOfit, value:valusse});
							}
						  });
					  }
					var myModel = th.model;
					myModel.set('id', myModel.get('_id'));
					
					
					var routesData = JSON.parse(myModel.get('forms_data'));
					for(var i = routesData.length - 1; i >= 0; i--){
						if(typeof routesData[i] != 'undefined' && routesData[i] != null){
							if(routesData[i].date === dateOfData) {
								routesData[i] = { showing:typeDataShowing, about:about, type:typeData, date:th.getTimeNow(), listdata:listdata, defaultValue:defaultValues };
							}
						}
					}
					myModel.set('forms_data', JSON.stringify(routesData));
					myModel.set("forms_data_info", JSON.stringify(routesData));
					myModel.url = config.urlAddr+'/project/'+myModel.get('_id');
					myModel.save();
					th.sendUpdateToUiIfInEntry();
					$('#edit_routes_new_view'+th.appendName()).html("");
				  }
				});
				$('#edit_data_edit_view'+this.appendName()).hide();
				$('#edit_data_edit_view_cancel_edit'+this.appendName()).hide();
			},
		listenToRemoveDataOne: function(e){
			var th = this;
			var date = e.currentTarget.getAttribute('data-date');
				if(date != '' ){
				var dataOf = JSON.parse(this.model.get('forms_data'));
					for(var i = dataOf.length - 1; i >= 0; i--){
						if(typeof dataOf[i] != 'undefined' && dataOf[i] != null){
							if(dataOf[i].date === date) {
								dataOf.splice(i, 1);
								$('#dataThereUnId'+date.replace(/ /g,'').replace(/:/g,'')).remove();
							}
						}
					}
					var myModel = this.model;
					myModel.set('id', myModel.get('_id'));
					myModel.set('forms_data', JSON.stringify(dataOf));
					myModel.set("forms_data_info", JSON.stringify(dataOf));
					myModel.url = config.urlAddr+'/project/'+myModel.get('_id');
					myModel.save();
					th.sendUpdateToUiIfInEntry();
				}
		},
		innerHtml: function(){
			var datasViewButtons = this.getDatasViewButtons();
			var datasViewAllIn = this.getDatasView();
			if(datasViewAllIn == ""){
				datasViewAllIn = app.noRecordsInIt();
			}
			if(this.model.get("parentvisibility") != "editpublic" && this.model.get("parentvisibility") != "editprivate"){ datasViewButtons = ""; }
			
				return '<div class="views_in_all forms_data_info_view" style="display:none;">'+
				datasViewButtons+'<div id="datasViewAllIn'+this.appendName()+'">'+datasViewAllIn+'</div>'+
				'</div>';
		},
		moveTopDataOne: function(e){
			var th = this;
				e.stopImmediatePropagation();
				e.stopPropagation();
			var date = e.currentTarget.getAttribute('data-date');
				if(date != '' ){
				var dataOf = JSON.parse(this.model.get('forms_data'));
				var newarr_data = [];
				var this_selected_id = "";
				for(var i = 0; i < dataOf.length; i++){
					if(typeof dataOf[i] != 'undefined' && dataOf[i] != null){
						if(dataOf[i].date === date) {
							this_selected_id = i;
						}
					}
				}
					if(this_selected_id != ""){
						for(var i = 0; i < dataOf.length; i++){
							if(typeof dataOf[i] != 'undefined' && dataOf[i] != null){
								if(dataOf[i].date === date) {
									
								}else{
									if((this_selected_id-1) == i){
										newarr_data.push(dataOf[this_selected_id]);
										this_selected_id = "";
									}
									newarr_data.push(dataOf[i]);
								}
							}
						}
						if(this_selected_id != ""){
							newarr_data.push(dataOf[this_selected_id]);
							this_selected_id = "";
						}
						var myModel = this.model;
						myModel.set('id', myModel.get('_id'));
						myModel.set('forms_data', JSON.stringify(newarr_data));
						myModel.set("forms_data_info", JSON.stringify(newarr_data));
						myModel.url = config.urlAddr+'/project/'+myModel.get('_id');
						myModel.save();
						th.sendUpdateToUiIfInEntry();
					}
				}
		},
		moveBottomDataOne: function(e){
			var th = this;
				e.stopImmediatePropagation();
				e.stopPropagation();
			var date = e.currentTarget.getAttribute('data-date');
				if(date != '' ){
				var dataOf = JSON.parse(this.model.get('forms_data'));
				var newarr_data = [];
				var this_to_bottom = "";
					for(var i = 0; i < dataOf.length; i++){
						if(typeof dataOf[i] != 'undefined' && dataOf[i] != null){
							if(dataOf[i].date === date) {
								this_to_bottom = dataOf[i];
							}else{
								newarr_data.push(dataOf[i]);
								if(this_to_bottom != ""){
									newarr_data.push(this_to_bottom);
									this_to_bottom = "";
								}
							}
						}
					}
					if(this_to_bottom != ""){
						newarr_data.push(this_to_bottom);
						this_to_bottom = "";
					}
					var myModel = this.model;
					myModel.set('id', myModel.get('_id'));
					myModel.set('forms_data', JSON.stringify(newarr_data));
					myModel.set("forms_data_info", JSON.stringify(newarr_data));
					myModel.url = config.urlAddr+'/project/'+myModel.get('_id');
					myModel.save();
					th.sendUpdateToUiIfInEntry();
				}
		},
		onRerender: function(){
			var datasViewAll = this.getDatasView();
			if(datasViewAll == ""){
				datasViewAll = app.noRecordsInIt();
			}
			$("#datasViewAllIn"+this.appendName()).html(datasViewAll);
			var dataNumber = 0;
			if(typeof this.model != "undefined"){
				var routesData = JSON.parse(this.model.get('forms_data'));
				 dataNumber = routesData.filter(function(e){return e}).length;
			}
			$("#formsdataNumb").text(dataNumber);
			$(".removeDataOne"+this.appendName()).click(this.listenToRemoveDataOne.bind(this));
			$(".editDataOne"+this.appendName()).click(this.listenToEditDataOne.bind(this));
			$(".moveTopDataOne"+this.appendName()).click(this.moveTopDataOne.bind(this));
			$(".moveBottomDataOne"+this.appendName()).click(this.moveBottomDataOne.bind(this));
		},
		onRender: function(){
			setTimeout(function(){
				$("#edit_data_edit_view"+this.appendName()).click(this.saveEditData.bind(this));
				$("#edit_data_edit_view_cancel_edit"+this.appendName()).click(this.edit_data_edit_view_cancel_edit.bind(this));
				$("#save_data_edit_view_cancel_save"+this.appendName()).click(this.save_data_edit_view_cancel_save.bind(this));
				$("#save_data_edit_view"+this.appendName()).click(this.saveData.bind(this));
				$("#let_answer_more_than_one"+this.appendName()).click(this.let_answer_more_than_one.bind(this));
				$("#add_data_edit_view"+this.appendName()).click(this.addDataWindow.bind(this));
				$(".removeDataOne"+this.appendName()).click(this.listenToRemoveDataOne.bind(this));
				$(".editDataOne"+this.appendName()).click(this.listenToEditDataOne.bind(this));
				$(".moveTopDataOne"+this.appendName()).click(this.moveTopDataOne.bind(this));
				$(".moveBottomDataOne"+this.appendName()).click(this.moveBottomDataOne.bind(this));
			}.bind(this), 1);
		},
		setModel: function(model){
			this.model = model;
		}
		};
});
