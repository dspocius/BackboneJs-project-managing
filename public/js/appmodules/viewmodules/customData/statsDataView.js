define([
	'../../../app',
	'../../../config'
], function( app, config ) {
	return {
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
			save_task_edit_view_close_statsdat: function(){
				$('#add_statsdats_new_view').html("");
				$('#save_task_edit_view_close_statsdat').hide();
				$('#save_data_edit_view_statsdat').hide();
			},
			saveData: function(){
				var th = this;
				$( ".addOneDataToItstatssdat" ).each(function( index ) {
					var edit_it = "";
					var edit_that_statsdat_here = $( this ).find('.edit_that_statsdat_here').val();
					if(typeof edit_that_statsdat_here !== "undefined" && edit_that_statsdat_here !== ""){
						edit_it = edit_that_statsdat_here;
					}
					var about = "";
					var statsdat = "";
					var statsdatto = "";
					
					$( this ).find('.addClassDataAboutstatsdatdat').each(function(){
						var vall = $(this).val();
						about += vall+",";
					});
					$( this ).find('.addClassDatastatsdat').each(function(){
						var vall = $(this).val();
						statsdat += vall+",";
					});
					$( this ).find('.addClassDatastatsdatTo').each(function(){
						var vall = $(this).val();
						statsdatto += vall+",";
					});
					
					var regex = /(<([^>]+)>)/ig;
					about = about.replace(regex, "");
					statsdat = statsdat.replace(regex, "");
					statsdatto = statsdatto.replace(regex, "");
					
				  if(statsdat != ''){
					var myModel = th.model;
					myModel.set('id', myModel.get('_id'));
					var dataObj = {about:about, statsdat:statsdat, statsdatto:statsdatto, date:th.getTimeNow()};
					var statsdatsData = JSON.parse(myModel.get('statsdats_data'));
					if(edit_it === ""){
						statsdatsData.push(dataObj);
					}else{
						for(var i = statsdatsData.length - 1; i >= 0; i--){
							if(typeof statsdatsData[i] != 'undefined' && statsdatsData[i] != null){
								if(statsdatsData[i].date === edit_it) {
									statsdatsData[i] = dataObj;
								}
							}
						}
					}
					myModel.set('statsdats_data', JSON.stringify(statsdatsData));
					myModel.url = config.urlAddr+'/project/'+myModel.get('_id');
					myModel.save();
				th.save_task_edit_view_close_statsdat();
					$( this ).find('.addClassDataAboutstatsdatdat').val("");
					$( this ).find('.addClassDatastatsdat').val("");
					$( this ).find('.addClassDatastatsdatTo').val("");
				  }
				});
			},
		addDataWindow: function(e, seldata){
			if(typeof e !== "undefined" && e !== ""){
				e.stopImmediatePropagation();
				e.stopPropagation();
			}
			var about_dat = "";
			var statsdat_dat = "";
			var statsdat_dat_to = "";
			var is_it_edit_view = "";
			if(typeof seldata !== "undefined" && seldata !== ""){
				about_dat = seldata.about.split(",")[0];
				statsdat_dat = seldata.statsdat.split(",")[0];
				statsdat_dat_to = seldata.statsdatto.split(",")[0];
				is_it_edit_view = "<input type='hidden' class='edit_that_statsdat_here' value='"+seldata.date+"' />";
			}
			$('#save_data_edit_view_statsdat').show();
			$('#save_task_edit_view_close_statsdat').show();
			var taskNew = '<div class="addOneDataToItstatssdat"><input type="text" class="addClassDatastatsdat" value="'+statsdat_dat+'" placeholder="'+app.translate('Stats name')+'" /> <input type="text" class="addClassDatastatsdatTo" value="'+statsdat_dat_to+'" placeholder="'+app.translate('Stats value')+'" /><input type="text" class="addClassDataAboutstatsdatdat" value="'+about_dat+'" placeholder="'+app.translate('About')+'" />'+is_it_edit_view+'<div class="here_more_add_stats_attrs"></div><button class="addingMoreRowsForStats">'+app.translate('Add more stats')+'</button></div>';
			$('#add_statsdats_new_view').html(taskNew);
			if(typeof seldata !== "undefined" && seldata !== ""){
				var allabout = seldata.about.split(",");
				var statsdat_datsplit = seldata.statsdat.split(",");
				var statsdat_dat_tosplit = seldata.statsdatto.split(",");
				for(var i=1; i < allabout.length; i++){
					if(allabout[i] != ""){
					this.addingMoreRowsForStats("", { 
						about: allabout[i],
						statsdat_dat: statsdat_datsplit[i],
						statsdat_dat_to: statsdat_dat_tosplit[i],
					});
					}
				}
			}
			$(".addingMoreRowsForStats").click(this.addingMoreRowsForStats.bind(this));
		},
		addingMoreRowsForStats: function(e, data){
			var about_dat = "";
			var statsdat_dat = "";
			var statsdat_dat_to = "";
			if(typeof data != "undefined" && data != ""){
				about_dat = data.about;
				statsdat_dat = data.statsdat_dat;
				statsdat_dat_to = data.statsdat_dat_to;
			}
			var htmlsel = '<div><input type="text" class="addClassDatastatsdat" value="'+statsdat_dat+'" placeholder="'+app.translate('Stats name')+'" /> <input type="text" class="addClassDatastatsdatTo" value="'+statsdat_dat_to+'" placeholder="'+app.translate('Stats value')+'" /><input type="text" class="addClassDataAboutstatsdatdat" value="'+about_dat+'" placeholder="'+app.translate('About')+'" /> </div>';
			
			jQuery(".here_more_add_stats_attrs").append(htmlsel);
		},
		getDatasViewButtons: function(){
			var datasHtml = '';
			datasHtml += '<div>';
			datasHtml += '	<button id="add_data_edit_view_statsdat" class="buttonChange">'+app.translate("Add")+'</button>';
			datasHtml += '	<button id="save_data_edit_view_statsdat" style="display:none;" class="buttonChange">'+app.translate("Save")+'</button>';
			datasHtml += '	<button id="save_task_edit_view_close_statsdat" style="display:none;" class="buttonChange">'+app.translate("Cancel")+'</button>';
			datasHtml += '	<div id="add_statsdats_new_view"></div>';
			datasHtml += '</div>';
			return datasHtml;
		},
		getDatasView: function(){
			if(typeof this.model == "undefined"){
				return "";
			}
			var dataOf = JSON.parse(this.model.get('statsdats_data'));
			var datasHtml = '';
				for(var i=0; i < dataOf.length; i++){
					if(typeof dataOf[i] != 'undefined' && dataOf[i] != null){
						datasHtml+='<div class="commentInModal" id="dataThereUnId'+dataOf[i].date.replace(/ /g,'').replace(/:/g,'')+'">';
						datasHtml+=dataOf[i].about;
						datasHtml+="<span style='font-size:12px;'> ";
						datasHtml+=dataOf[i].date;
						datasHtml+="</span><div> ";
						datasHtml+=dataOf[i].statsdat;
						datasHtml+="";
						if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate"){
							datasHtml += '<button data-date="'+dataOf[i].date+'" class=" general_button height35 editstatsdatDataOne"><span data-date="'+dataOf[i].date+'" class="glyphicon glyphicon-edit icon-in-menu icon-turn-off"></span></button>';
							datasHtml += '<button data-date="'+dataOf[i].date+'" class=" general_button height35 removeDataOne"><span data-date="'+dataOf[i].date+'" class="glyphicon glyphicon-remove icon-in-menu icon-turn-off"></span></button>';
						}
						datasHtml += '</div></div>';
					}
				}
			return datasHtml;
		},
		editstatsdatDataOne: function(e){
			if(typeof e !== "undefined" && e !== ""){
				e.stopImmediatePropagation();
				e.stopPropagation();
			var date = e.currentTarget.getAttribute('data-date');
				if(date != '' ){
				var sel_data = "";
				var dataOf = JSON.parse(this.model.get('statsdats_data'));
					for(var i = dataOf.length - 1; i >= 0; i--){
						if(typeof dataOf[i] != 'undefined' && dataOf[i] != null){
							if(dataOf[i].date === date) {
								sel_data = dataOf[i];
							}
						}
					}
					if(sel_data !== ""){
						this.addDataWindow("", sel_data);
					}
				}
			}
		},
		listenToRemoveDataOne: function(e){
			var date = e.currentTarget.getAttribute('data-date');
				if(date != '' ){
				var dataOf = JSON.parse(this.model.get('statsdats_data'));
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
					myModel.set('statsdats_data', JSON.stringify(dataOf));
					myModel.url = config.urlAddr+'/project/'+myModel.get('_id');
					myModel.save();
				}
		},
		innerHtml: function(){
			var datasViewButtons = this.getDatasViewButtons();
			var datasViewAllInstatssdat = this.getDatasView();
			if(datasViewAllInstatssdat == ""){
				datasViewAllInstatssdat = app.noRecordsInIt();
			}
			if(this.model.get("parentvisibility") != "editpublic" && this.model.get("parentvisibility") != "editprivate"){ datasViewButtons = ""; }
			
				return '<div class="views_in_all statsdats_info_view" style="display:none;">'+
				datasViewButtons+'<div id="datasViewAllInstatssdat">'+datasViewAllInstatssdat+'</div>'+
				'</div>';
		},
		onRerender: function(){
			var datasViewAll = this.getDatasView();
			if(datasViewAll == ""){
				datasViewAll = app.noRecordsInIt();
			}
			$("#datasViewAllInstatssdat").html(datasViewAll);
			var dataNumber = 0;
			if(typeof this.model != "undefined"){
				var statsdatsData = JSON.parse(this.model.get('statsdats_data'));
				 dataNumber = statsdatsData.filter(function(e){return e}).length;
			}
			$("#statsdatsNumb").text(dataNumber);
			$(".removeDataOne").click(this.listenToRemoveDataOne.bind(this));
			$(".editstatsdatDataOne").click(this.editstatsdatDataOne.bind(this));
		},
		onRender: function(){
			setTimeout(function(){
				$("#save_data_edit_view_statsdat").click(this.saveData.bind(this));
				$("#save_task_edit_view_close_statsdat").click(this.save_task_edit_view_close_statsdat.bind(this));
				$("#add_data_edit_view_statsdat").click(this.addDataWindow.bind(this));
				$(".removeDataOne").click(this.listenToRemoveDataOne.bind(this));
				$(".editstatsdatDataOne").click(this.editstatsdatDataOne.bind(this));
			}.bind(this), 1);
		},
		setModel: function(model){
			this.model = model;
		}
		};
});
