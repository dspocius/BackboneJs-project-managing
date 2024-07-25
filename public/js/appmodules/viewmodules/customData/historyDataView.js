define([
	'../../../app',
	'../../../config',
	'marionette'
], function( app, config, Marionette ) {
	return {
		appendName: function(){
			return "_got_history_data";
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
		countNumberOfCommentsHistory: function(){
			var commentsColll = new Backbone.Model();
			commentsColll.url = config.urlAddr+'/countByUsername/history'+this.model.get("_id");
			if(typeof this.model.get("history_info_only_is_comment_count_is_loaded") == "undefined" || this.model.get("history_info_only_is_comment_count_is_loaded") == ""){
				this.model.set("history_info_only_is_comment_count_is_loaded", "true");
				var eh_model_th = this;
				eh_model_th.model.set("history_info_only_is_comment_count", 0);
				commentsColll.fetch().done(function(){
					if(typeof commentsColll.attributes[0] !== "undefined"){
						var countAttr = commentsColll.attributes[0].numberOfMessages;
						eh_model_th.model.set("history_info_only_is_comment_count", countAttr);
						eh_model_th.onRerender();
					}
				});
			}
		},
		load_everything_more_history: function(e){
			e.stopImmediatePropagation();
			e.stopPropagation();
			var dataOf_loaded = this.model.get("history_info_only_is_hist");
			var skip_count = dataOf_loaded.length;
			var commentsCol_load = new Backbone.Model();
			commentsCol_load.url = config.urlAddr+'/comments/history'+this.model.get("_id")+'/'+skip_count;
			var eh_model_th = this;
			commentsCol_load.fetch().done(function(){
				var hist_col = commentsCol_load.get("messages");
					for(var ij=0; ij < hist_col.length; ij++){
						dataOf_loaded.push(hist_col[ij]);
					}
				eh_model_th.onRerender();
			});
		},
		getDatasViewButtons: function(){
			var datasHtml = '';
			return datasHtml;
		},
		escapeHtml: function(unsafe) {
			if(typeof unsafe != "undefined"){
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
		getDatasView: function(){
			if(typeof this.model == "undefined"){
				return "";
			}
			this.countNumberOfCommentsHistory();
			
			var datasHtml = '<div id="historyy_info_view_container_data">'+app.noRecordsInIt()+'</div>';
		if((typeof this.model.get("history_info_only_is") == "undefined" || this.model.get("history_info_only_is") == "")){
			this.model.set("history_info_only_is","true");
				
			var commentsCol = new Backbone.Model();
			commentsCol.url = config.urlAddr+'/comments/history'+this.model.get("_id")+'/'+0;
			commentsCol.fetch().done(function(){
				var htmlData = "";
				var hist = commentsCol.get("messages");
				this.model.set("history_info_only_is_hist",hist);
				for(var ii=0; ii < hist.length; ii++){
					var one_hist = hist[ii];
					htmlData += "<div><b>"+this.escapeHtml(one_hist.date)+" - "+this.escapeHtml(one_hist.from)+"</b>: "+this.escapeHtml(one_hist.message)+"</div>";
				}
				setTimeout(function(){
					if(htmlData != ""){
						var button_for_loading_more = this.getThatLoadingButton();
						$("#historyy_info_view_container_data").html(button_for_loading_more+htmlData);
						$(".load_everything_more_history"+this.appendName()).click(this.load_everything_more_history.bind(this));
					}
				}.bind(this), 100);
			}.bind(this));
		}else{
			var hist = this.model.get("history_info_only_is_hist");
			if(typeof hist != "undefined"){
			var htmlData = "";
				for(var ii=0; ii < hist.length; ii++){
					var one_hist = hist[ii];
					htmlData += "<div><b>"+this.escapeHtml(one_hist.date)+" - "+this.escapeHtml(one_hist.from)+"</b>: "+this.escapeHtml(one_hist.message)+"</div>";
				}
				setTimeout(function(){
					if(htmlData != ""){
						var button_for_loading_more = this.getThatLoadingButton();
						$("#historyy_info_view_container_data").html(button_for_loading_more+htmlData);
						$(".load_everything_more_history"+this.appendName()).click(this.load_everything_more_history.bind(this));
						
					}
				}.bind(this), 100);
			}
		}
			return datasHtml;
		},
		innerHtml: function(){
			var datasViewButtons = this.getDatasViewButtons();
			var datasViewAllIn = this.getDatasView();
			if(this.model.get("parentvisibility") != "editpublic" && this.model.get("parentvisibility") != "editprivate"){ datasViewButtons = ""; }
			
			
				return '<div class="views_in_all historyy_info_view" style="display:none;">'+
				datasViewButtons+'<div id="datasViewAllIn'+this.appendName()+'">'+datasViewAllIn+'</div>'+
				'</div>';
		},
		getThatLoadingButton: function(){
			var button_for_loading_more = "";
			var dataNumber = 0;
			if(typeof this.model != "undefined"){
				 if(typeof this.model.get("history_info_only_is_comment_count") != "undefined" && !isNaN(this.model.get("history_info_only_is_comment_count"))){
					 dataNumber = this.model.get("history_info_only_is_comment_count");
					 	if(typeof this.model.get("history_info_only_is_hist") != "undefined" && Array.isArray(this.model.get("history_info_only_is_hist"))){
							dataOf_loaded = this.model.get("history_info_only_is_hist");
							var cnt_every = dataNumber-dataOf_loaded.length;
							if(cnt_every > 0){
								button_for_loading_more = "<button class='load_everything_more_history"+this.appendName()+"'>Load more</button> Loaded - "+dataOf_loaded.length+". Not loaded - "+cnt_every;
							}
						}
				 }
			}
			return button_for_loading_more;
		},
		onRerender: function(){
			var datasViewAll = this.getDatasView();
			//if(datasViewAll == ""){
			//	datasViewAll = app.noRecordsInIt();
			//}
			var button_for_loading_more = this.getThatLoadingButton();
			var dataNumber = 0;
			$("#datasViewAllIn"+this.appendName()).html(button_for_loading_more+datasViewAll);
			$(".load_everything_more_history"+this.appendName()).click(this.load_everything_more_history.bind(this));
		},
		onRender: function(){
			$(".load_everything_more_history"+this.appendName()).click(this.load_everything_more_history.bind(this));
			//setTimeout(function(){
			//}.bind(this), 1);
		},
		setModel: function(model){
			this.model = model;
		}
		};
});
