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
			save_task_edit_view_close_route: function(){
				$('#add_routes_new_view').html("");
				$('#save_task_edit_view_close_route').hide();
				$('#save_data_edit_view').hide();
			},
			saveData: function(){
				var th = this;
				$( ".addOneDataToIt" ).each(function( index ) {
					var edit_it = "";
					var edit_that_route_here = $( this ).find('.edit_that_route_here').val();
					if(typeof edit_that_route_here !== "undefined" && edit_that_route_here !== ""){
						edit_it = edit_that_route_here;
					}
					var about = $( this ).find('.addClassDataAbout').val();
					var route = $( this ).find('.addClassDataRoute').val();
					var routeto = $( this ).find('.addClassDataRouteTo').val();
					var regex = /(<([^>]+)>)/ig;
					about = about.replace(regex, "");
					route = route.replace(regex, "");
					routeto = routeto.replace(regex, "");
					
				  if(route != ''){
					var myModel = th.model;
					myModel.set('id', myModel.get('_id'));
					var dataObj = {about:about, route:route, routeto:routeto, date:th.getTimeNow()};
					var routesData = JSON.parse(myModel.get('routes_data'));
					if(edit_it === ""){
						routesData.push(dataObj);
					}else{
						for(var i = routesData.length - 1; i >= 0; i--){
							if(typeof routesData[i] != 'undefined' && routesData[i] != null){
								if(routesData[i].date === edit_it) {
									routesData[i] = dataObj;
								}
							}
						}
					}
					myModel.set('routes_data', JSON.stringify(routesData));
					myModel.url = config.urlAddr+'/project/'+myModel.get('_id');
					myModel.save();
				th.save_task_edit_view_close_route();
					$( this ).find('.addClassDataAbout').val("");
					$( this ).find('.addClassDataRoute').val("");
					$( this ).find('.addClassDataRouteTo').val("");
				  }
				});
			},
		addDataWindow: function(e, seldata){
			if(typeof e !== "undefined" && e !== ""){
				e.stopImmediatePropagation();
				e.stopPropagation();
			}
			var about_dat = "";
			var route_dat = "";
			var route_dat_to = "";
			var is_it_edit_view = "";
			if(typeof seldata !== "undefined" && seldata !== ""){
				about_dat = seldata.about;
				route_dat = seldata.route;
				route_dat_to = seldata.routeto;
				is_it_edit_view = "<input type='hidden' class='edit_that_route_here' value='"+seldata.date+"' />";
			}
			$('#save_data_edit_view').show();
			$('#save_task_edit_view_close_route').show();
			var taskNew = '<div class="addOneDataToIt"><input type="text" class="addClassDataAbout" value="'+about_dat+'" placeholder="'+app.translate('About')+'" /> <input type="text" class="addClassDataRoute" value="'+route_dat+'" placeholder="'+app.translate('Route')+'" /> <input type="text" class="addClassDataRouteTo" value="'+route_dat_to+'" placeholder="'+app.translate('Route To')+'" />'+is_it_edit_view+'</div>';
			$('#add_routes_new_view').html(taskNew);
		},
		getDatasViewButtons: function(){
			var datasHtml = '';
			datasHtml += '<div>';
			datasHtml += '	<button id="add_data_edit_view" class="buttonChange">'+app.translate("Add")+'</button>';
			datasHtml += '	<button id="save_data_edit_view" style="display:none;" class="buttonChange">'+app.translate("Save")+'</button>';
			datasHtml += '	<button id="save_task_edit_view_close_route" style="display:none;" class="buttonChange">'+app.translate("Cancel")+'</button>';
			datasHtml += '	<div id="add_routes_new_view"></div>';
			datasHtml += '</div>';
			return datasHtml;
		},
		getDatasView: function(){
			if(typeof this.model == "undefined"){
				return "";
			}
			var dataOf = JSON.parse(this.model.get('routes_data'));
			var datasHtml = '';
				for(var i=0; i < dataOf.length; i++){
					if(typeof dataOf[i] != 'undefined' && dataOf[i] != null){
						datasHtml+='<div class="commentInModal" id="dataThereUnId'+dataOf[i].date.replace(/ /g,'').replace(/:/g,'')+'">';
						datasHtml+=dataOf[i].about;
						datasHtml+="<span style='font-size:12px;'> ";
						datasHtml+=dataOf[i].date;
						datasHtml+="</span><div> ";
						datasHtml+=dataOf[i].route;
						datasHtml+="";
						if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate"){
							datasHtml += '<button data-date="'+dataOf[i].date+'" class=" general_button height35 editRouteDataOne"><span data-date="'+dataOf[i].date+'" class="glyphicon glyphicon-edit icon-in-menu icon-turn-off"></span></button>';
							datasHtml += '<button data-date="'+dataOf[i].date+'" class=" general_button height35 removeDataOne"><span data-date="'+dataOf[i].date+'" class="glyphicon glyphicon-remove icon-in-menu icon-turn-off"></span></button>';
						}
						datasHtml += '</div></div>';
					}
				}
			return datasHtml;
		},
		editRouteDataOne: function(e){
			if(typeof e !== "undefined" && e !== ""){
				e.stopImmediatePropagation();
				e.stopPropagation();
			var date = e.currentTarget.getAttribute('data-date');
				if(date != '' ){
				var sel_data = "";
				var dataOf = JSON.parse(this.model.get('routes_data'));
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
				var dataOf = JSON.parse(this.model.get('routes_data'));
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
					myModel.set('routes_data', JSON.stringify(dataOf));
					myModel.url = config.urlAddr+'/project/'+myModel.get('_id');
					myModel.save();
				}
		},
		innerHtml: function(){
			var datasViewButtons = this.getDatasViewButtons();
			var datasViewAllIn = this.getDatasView();
			if(datasViewAllIn == ""){
				datasViewAllIn = app.noRecordsInIt();
			}
			if(this.model.get("parentvisibility") != "editpublic" && this.model.get("parentvisibility") != "editprivate"){ datasViewButtons = ""; }
			
				return '<div class="views_in_all routes_info_view" style="display:none;">'+
				datasViewButtons+'<div id="datasViewAllIn">'+datasViewAllIn+'</div>'+
				'</div>';
		},
		onRerender: function(){
			var datasViewAll = this.getDatasView();
			if(datasViewAll == ""){
				datasViewAll = app.noRecordsInIt();
			}
			$("#datasViewAllIn").html(datasViewAll);
			var dataNumber = 0;
			if(typeof this.model != "undefined"){
				var routesData = JSON.parse(this.model.get('routes_data'));
				 dataNumber = routesData.filter(function(e){return e}).length;
			}
			$("#routesNumb").text(dataNumber);
			$(".removeDataOne").click(this.listenToRemoveDataOne.bind(this));
			$(".editRouteDataOne").click(this.editRouteDataOne.bind(this));
		},
		onRender: function(){
			setTimeout(function(){
				$("#save_data_edit_view").click(this.saveData.bind(this));
				$("#save_task_edit_view_close_route").click(this.save_task_edit_view_close_route.bind(this));
				$("#add_data_edit_view").click(this.addDataWindow.bind(this));
				$(".removeDataOne").click(this.listenToRemoveDataOne.bind(this));
				$(".editRouteDataOne").click(this.editRouteDataOne.bind(this));
			}.bind(this), 1);
		},
		setModel: function(model){
			this.model = model;
		}
		};
});
