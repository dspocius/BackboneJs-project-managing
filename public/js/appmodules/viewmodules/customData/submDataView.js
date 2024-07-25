define([
	'../../../app',
	'../../../config',
	'marionette'
], function( app, config, Marionette ) {
	return {
		appendName: function(){
			return "_got_data_submittted_data";
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
		
		getDatasViewButtons: function(){
			var datasHtml = '';
			datasHtml += app.addInfoAbout("Answers - there you can see answers for your forms.");
			return datasHtml;
		},
		countNumberOfComments: function(){
			var commentsColllSS = new Backbone.Model();
			commentsColllSS.url = config.urlAddr+'/countByUsername/formsManagementon_form_only_'+this.model.get("_id");
			if(typeof this.model.get("formss_info_only_is_comment_count_is_loaded_on") == "undefined" || this.model.get("formss_info_only_is_comment_count_is_loaded_on") == ""){
				this.model.set("formss_info_only_is_comment_count_is_loaded_on","true");
				var eh_model_th = this;
				eh_model_th.model.set("formss_info_only_is_comment_count", 0);
				commentsColllSS.fetch().done(function(){
					if(typeof commentsColllSS.attributes[0] != "undefined"){
					var countAttr = commentsColllSS.attributes[0]["numberOfMessages"];
					eh_model_th.model.set("formss_info_only_is_comment_count", countAttr);
					eh_model_th.onRerender();
					}
				});
			}
		},
		getSubmDataAsComments: function(){
			var commentsCol = new Backbone.Model();
			commentsCol.url = config.urlAddr+'/comments/formsManagementon_form_only_'+this.model.get("_id")+'/'+0;
			if(typeof this.model.get("formss_info_only_is") == "undefined" || this.model.get("formss_info_only_is") == ""){
				this.model.set("formss_info_only_is","true");
				var eh_model_th = this;
				commentsCol.fetch().done(function(){
					var htmlData = "";
					var hist = commentsCol.get("messages");
					eh_model_th.model.set("formss_info_only_is_hist_comm_id",commentsCol.get("_id"));
					var array_new_one = [];
					for(var ij=0; ij < hist.length; ij++){
						array_new_one.push(JSON.parse(hist[ij].message));
					}
					eh_model_th.model.set("formss_info_only_is_hist",array_new_one);
					/*for(var ii=0; ii < hist.length; ii++){
						var one_hist = hist[ii];
						htmlData += "<div><b>"+one_hist.date+" - "+one_hist.from+"</b>: "+one_hist.message+"</div>";
					}*/
						eh_model_th.onRerender();
				}.bind(this));
			}
		},
		load_everything_more_subm: function(e){
			e.stopImmediatePropagation();
			e.stopPropagation();
			var dataOf_loaded = this.model.get("formss_info_only_is_hist");
			var skip_count = dataOf_loaded.length;
			var commentsCol_load = new Backbone.Model();
			commentsCol_load.url = config.urlAddr+'/comments/formsManagementon_form_only_'+this.model.get("_id")+'/'+skip_count;
			var eh_model_th = this;
			commentsCol_load.fetch().done(function(){
				var hist_col = commentsCol_load.get("messages");
					for(var ij=0; ij < hist_col.length; ij++){
						dataOf_loaded.push(JSON.parse(hist_col[ij].message));
					}
				eh_model_th.onRerender();
			});
		},
		getDatasView: function(){
			if(typeof this.model == "undefined"){
				return "";
			}
			var th_of_subm_data = this;
			this.countNumberOfComments();
			this.getSubmDataAsComments();
			var dataOf = JSON.parse(this.model.get('submitted_data'));
			var datasHtml = '';
			if(typeof this.model.get("formss_info_only_is_hist") != "undefined" && Array.isArray(this.model.get("formss_info_only_is_hist"))){
				dataOf = this.model.get("formss_info_only_is_hist");
				datasHtml += this.getSubmittedStatisticHtmlData();
			}
				for(var i=0; i < dataOf.length; i++){
					if(typeof dataOf[i] != 'undefined' && dataOf[i] != null){
						datasHtml+='<div class="commentInModal" id="dataThereUnId'+dataOf[i].date.replace(/ /g,'').replace(/:/g,'')+'">';
						datasHtml+='<button class="general_button" onclick="$('+"'"+'#dataThereUnIdInner'+dataOf[i].date.replace(/ /g,'').replace(/:/g,'')+"'"+').toggle();">'+th_of_subm_data.escapeHtml(dataOf[i].date)+'</button>';
						datasHtml+='<div style="display:none;" class="commentInModalInner" id="dataThereUnIdInner'+dataOf[i].date.replace(/ /g,'').replace(/:/g,'')+'">';
						datasHtml += '<div>User: <a href="/#'+th_of_subm_data.escapeHtml(dataOf[i].user)+'">'+th_of_subm_data.escapeHtml(dataOf[i].user)+'</a></div>';
						var formsdat = dataOf[i].formsdata;
						for(var ij=0; ij < formsdat.length; ij++){
							if(formsdat[ij] !== ""){
								datasHtml += "<div>";
								datasHtml += ""+th_of_subm_data.escapeHtml(formsdat[ij].about)+" - ";
								datasHtml += "("+th_of_subm_data.escapeHtml(formsdat[ij].defaultValue)+")";
								datasHtml += "</div>";
							}
						}
						var other_data = dataOf[i].other_data;
						for(var ij=0; ij < other_data.length; ij++){
							if(other_data[ij] !== ""){
								var other_dt_array = other_data[ij].array;
								var other_dt_object = other_data[ij].object;
									datasHtml += "<div>";
									datasHtml += ""+th_of_subm_data.escapeHtml(other_data[ij].data)+"";
									datasHtml += "</div>";
								for(var ijj=0; ijj < other_dt_array.length; ijj++){
									datasHtml += "<div>";
									if(other_dt_array[ijj].indexOf("Uploaded file") > -1){
										var regex = /(<([^>]+)>)/ig;
										var flsz_fiails = other_dt_array[ijj].replace(regex, "").replace("Uploaded file - ","");
										datasHtml += '<a target="_blank" href="'+this.model.get('filesurl')+'/files/project_managing_files/'+this.model.get('_id')+'/'+th_of_subm_data.escapeHtml(flsz_fiails)+'">'+"Uploaded file - "+th_of_subm_data.escapeHtml(flsz_fiails)+'</a>';
									}else{
										datasHtml += ""+th_of_subm_data.escapeHtml(other_dt_array[ijj])+"";
									}
									datasHtml += "</div>";
								}
								for(var izkey in other_dt_object){
									datasHtml += "<div>";
									datasHtml += ""+th_of_subm_data.escapeHtml(izkey)+" - ";
									datasHtml += ""+th_of_subm_data.escapeHtml(other_dt_object[izkey])+"";
									datasHtml += "</div>";
								}
							}
						}
						datasHtml+="<span style='font-size:12px;'> ";
						datasHtml+=th_of_subm_data.escapeHtml(dataOf[i].date);
						datasHtml+="</span><div> ";
						datasHtml+="";
						if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate"){
							datasHtml += '<button data-date="'+dataOf[i].date+'" class=" general_button height35 removeDataOne'+this.appendName()+'"><span data-date="'+dataOf[i].date+'" class="glyphicon glyphicon-remove icon-in-menu icon-turn-off"></span></button>';
						}
						datasHtml += '</div></div></div>';
					}
				}
			return datasHtml;
		},
		listenToRemoveDataOne: function(e){
			var date = e.currentTarget.getAttribute('data-date');
				if(date != '' ){
				$('#dataThereUnId'+date.replace(/ /g,'').replace(/:/g,'')).remove();
							var commentNew = new Backbone.Model();
							commentNew.set('date',date);
							commentNew.set('id',this.model.get("formss_info_only_is_hist_comm_id"));
							commentNew.set('taskid',this.model.get('_id'));
							commentNew.url = config.urlAddr+'/comment';
							commentNew.save(null, { type: 'POST' });
					//var myModel = this.model;
					//myModel.set('id', myModel.get('_id'));
					//myModel.set('submitted_data', JSON.stringify(dataOf));
					//myModel.url = '/project/'+myModel.get('_id');
					//myModel.save();
				}
		},
		innerHtml: function(){
			var datasViewButtons = this.getDatasViewButtons();
			var datasViewAllIn = this.getDatasView();
			if(datasViewAllIn == ""){
				datasViewAllIn = app.noRecordsInIt();
			}
			if(this.model.get("parentvisibility") != "editpublic" && this.model.get("parentvisibility") != "editprivate"){ datasViewButtons = ""; }
			
				return '<div class="views_in_all submitted_data_info_view" style="display:none;">'+
				datasViewButtons+'<div id="datasViewAllIn'+this.appendName()+'">'+datasViewAllIn+'</div>'+
				'</div>';
		},
		onRerender: function(){
			var datasViewAll = this.getDatasView();
			if(datasViewAll == ""){
				datasViewAll = app.noRecordsInIt();
			}
			var button_for_loading_more = "";
			var dataNumber = 0;
			if(typeof this.model != "undefined"){
				 if(typeof this.model.get("formss_info_only_is_comment_count") != "undefined" && !isNaN(this.model.get("formss_info_only_is_comment_count"))){
					 dataNumber = this.model.get("formss_info_only_is_comment_count");
					 	if(typeof this.model.get("formss_info_only_is_hist") != "undefined" && Array.isArray(this.model.get("formss_info_only_is_hist"))){
							dataOf_loaded = this.model.get("formss_info_only_is_hist");
							var cnt_every = dataNumber-dataOf_loaded.length;
							if(cnt_every > 0){
								button_for_loading_more = "<button class='load_everything_more_subm"+this.appendName()+"'>Load more</button> Loaded - "+dataOf_loaded.length+". Not loaded - "+cnt_every;
							}
						}
				 }
			}
			$("#datasViewAllIn"+this.appendName()).html(button_for_loading_more+datasViewAll);
			$("#formssubmNumb"+this.appendName()).html(dataNumber);
			$(".removeDataOne"+this.appendName()).click(this.listenToRemoveDataOne.bind(this));
			$(".load_everything_more_subm"+this.appendName()).click(this.load_everything_more_subm.bind(this));
		},
		onRender: function(){
			setTimeout(function(){
				$(".removeDataOne"+this.appendName()).click(this.listenToRemoveDataOne.bind(this));
				$(".load_everything_more_subm"+this.appendName()).click(this.load_everything_more_subm.bind(this));
			var dataNumber = 0;
			if(typeof this.model != "undefined"){
				 if(typeof this.model.get("formss_info_only_is_comment_count") != "undefined" && !isNaN(this.model.get("formss_info_only_is_comment_count"))){
					 dataNumber = this.model.get("formss_info_only_is_comment_count");
				 }
			}
			$("#formssubmNumb"+this.appendName()).html(dataNumber);
			}.bind(this), 1);
		},
		setModel: function(model){
			this.model = model;
		},
		escapeHtml: function(unsafe) {
			if(typeof unsafe != "undefined"){
				unsafe = unsafe.toString();
			return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
		 }else{
			 return unsafe;
		 }
		},
		getCustomDataOn: function(){
			var th_of_subm_data = this;
			return [{
			id:"formss_info_only_is_hist", 
			name:"Submitted data",
			custom: [
				{attr:"user", attr_func: function(get_val){ return get_val; }, name:function(attrVal, outerArr, this_models_id){ return attrVal; }},
				{attr:"formsdata", attr_func: function(get_val){ return "formsdata"; }, name:function(attrVal, outerArr, outerArrUsed, this_models_id){
					var array_of_fdata = "";
					var column = "about";
					var column_val = "defaultValue";
					for(var ii=0; ii < attrVal.length; ii++){
						var ind_if = outerArrUsed.indexOf(attrVal[ii][column]);
						if(ind_if > -1){
							var this_outer_arr = outerArr[ind_if];
							var was_found_in_arr = false;
							for(var onn=0; onn < this_outer_arr.length; onn++){
								if(this_outer_arr[onn].val == attrVal[ii][column_val]){
									this_outer_arr[onn].count = this_outer_arr[onn].count+1;
									was_found_in_arr = true;
								}
							}
							if(!was_found_in_arr){
								this_outer_arr.push({ count:1, val: attrVal[ii][column_val] });
							}
						}else{
							outerArrUsed.push(attrVal[ii][column]);
							outerArr.push([{ count:1, val: attrVal[ii][column_val] }]);
						}
					}
					
					return "Forms"; 
				}},
				{attr:"other_data", attr_func: function(get_val){ return "other_data"; }, name:function(attrVal, outerArr, outerArrUsed, this_models_id){
					var array_of_fdata = "";
					var column = "array";
					var column_val = "defaultValue";
					for(var ii=0; ii < attrVal.length; ii++){
						var files_arr = attrVal[ii][column];
						for(var onn=0; onn < files_arr.length; onn++){
							var html_of_file = files_arr[onn];
							outerArrUsed.push(html_of_file);
						}
					}
					
					return "Files"; 
				}}
				]
			}];
		},
		getSubmittedStatisticHtmlData: function(){
			var th_of_subm_data = this;
			var customDataSimple = this.getSubmittedStatistic();
			var htmlAdd = "";
			for(var ijj=0; ijj < customDataSimple.length; ijj++){
				htmlAdd += "<div>"+th_of_subm_data.escapeHtml(customDataSimple[ijj].name)+": "+th_of_subm_data.escapeHtml(customDataSimple[ijj].count)+"</div>";
				var cust_attr_data = customDataSimple[ijj].custom_attr_data_in;
				var custom_attr_data_in_inner_arr = customDataSimple[ijj].custom_attr_data_in_inner_arr;
				var custom_attr_data_in_inner_arr_used = customDataSimple[ijj].custom_attr_data_in_inner_arr_used;
				for(var ojj=0; ojj < cust_attr_data.length; ojj++){
					htmlAdd += "<div> ------- "+th_of_subm_data.escapeHtml(cust_attr_data[ojj].name)+": "+th_of_subm_data.escapeHtml(cust_attr_data[ojj].count)+"</div>";
				}
				for(var ojj=0; ojj < custom_attr_data_in_inner_arr_used.length; ojj++){
					var inner_arr = custom_attr_data_in_inner_arr[ojj];
					var name_of_inner_arr = custom_attr_data_in_inner_arr_used[ojj];
							if(name_of_inner_arr.indexOf("Uploaded file") > -1){
								var regex = /(<([^>]+)>)/ig;
								var flsz_fiails = name_of_inner_arr.replace(regex, "").replace("Uploaded file - ","");
								html_of_file = '<a target="_blank" href="'+this.model.get('filesurl')+'/files/project_managing_files/'+th_of_subm_data.model.get("_id")+'/'+th_of_subm_data.escapeHtml(flsz_fiails)+'">'+"Uploaded file - "+th_of_subm_data.escapeHtml(flsz_fiails)+'</a>';
								htmlAdd += "<div> -------------- "+html_of_file+"</div>";
							}else{
								htmlAdd += "<div> -------------- "+th_of_subm_data.escapeHtml(name_of_inner_arr)+"</div>";
							}
					if(typeof inner_arr != "undefined" && inner_arr != ""){
						for(var umm=0; umm < inner_arr.length; umm++){
							htmlAdd += "<div> -------------- ----- "+th_of_subm_data.escapeHtml(inner_arr[umm].val)+": "+th_of_subm_data.escapeHtml(inner_arr[umm].count)+"</div>";
						}
					}
				}
			}
			return htmlAdd;
		},
		getSubmittedStatistic: function(){
			var this_model = this.model;
			var this_models_id = this.model.get("_id");
			var customDataSimple = this.getCustomDataOn();
			
			for(var ijj=0; ijj < customDataSimple.length; ijj++){
				customDataSimple[ijj].count = 0;
				customDataSimple[ijj].custom_attr_data = [];
				customDataSimple[ijj].custom_attr_data_in = [];
				customDataSimple[ijj].custom_attr_data_in_inner_arr = [];
				customDataSimple[ijj].custom_attr_data_in_inner_arr_used = [];
			}
			
							for(var ijj=0; ijj < customDataSimple.length; ijj++){
								if(typeof customDataSimple[ijj] != "undefined"){
									if(typeof this_model.attributes[customDataSimple[ijj].id] != "undefined"){
										var dataOfff = "";
										if(typeof this_model.attributes[customDataSimple[ijj].id] != "object"){
											 dataOfff = JSON.parse(this_model.attributes[customDataSimple[ijj].id]);
										}else{
											dataOfff = this_model.attributes[customDataSimple[ijj].id];
										}
										var customOn = customDataSimple[ijj].custom;
										if(typeof customOn != "undefined" && customOn != ""){
											for(var cus_cnt = 0; cus_cnt < customOn.length; cus_cnt++){
												var oding_cust_data = customOn[cus_cnt];
												for(var dataOfff_cnt = 0; dataOfff_cnt < dataOfff.length; dataOfff_cnt++){
													var in_data_off_by_attr = oding_cust_data.attr_func(dataOfff[dataOfff_cnt][oding_cust_data.attr]);
													if(typeof in_data_off_by_attr != "undefined" && in_data_off_by_attr != ""){
														var name_of_custom_attr = oding_cust_data.name(dataOfff[dataOfff_cnt][oding_cust_data.attr], customDataSimple[ijj].custom_attr_data_in_inner_arr, customDataSimple[ijj].custom_attr_data_in_inner_arr_used, this_models_id);
														var get_index_of_that_name_good = customDataSimple[ijj].custom_attr_data.indexOf(in_data_off_by_attr);
														if(get_index_of_that_name_good > -1){
															customDataSimple[ijj].custom_attr_data_in[get_index_of_that_name_good].count = customDataSimple[ijj].custom_attr_data_in[get_index_of_that_name_good].count+1;
														}else{
															customDataSimple[ijj].custom_attr_data.push(in_data_off_by_attr);
															customDataSimple[ijj].custom_attr_data_in.push({name: name_of_custom_attr, count:1 });
														}
													}
												}
											}
										}
										customDataSimple[ijj].count += dataOfff.length;
									}
								}
							}
						
			return customDataSimple;
		}
		};
});
