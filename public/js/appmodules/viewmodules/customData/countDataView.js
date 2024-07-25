define([
	'../../../app',
	'../../../config',
	'marionette'
], function( app, config, Marionette ) {
	return {
		appendName: function(){
			return "_got_count_data";
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
			return datasHtml;
		},
			changeDataOfCustom: function(id, ippp, countries){
				var objj = {from:'ip', message:ippp};
				var cntrys = JSON.stringify(countries).replace(/"/g, "'");
				var obj2 = {from:'countries', message:cntrys};
				var commentNew = new Backbone.Model();
				commentNew.set('message',[objj, obj2]);
				commentNew.set('idd',id);
                commentNew.url = config.urlAddr+'/commentReset';
				commentNew.save();
				
				var allcounties = countries;
				countAll = 0;
				for(var ii=0; ii < allcounties.length; ii++){
					var cntcountry = parseInt(allcounties[ii].count);
					countAll += cntcountry;
				}
			},
		findInObjectArrCountry: function(myArray, country){
			var index = -1;
			for(var i = 0, len = myArray.length; i < len; i++) {
				if (myArray[i].cd === country) {
					index = i;
					break;
				}
			}
			return index;
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
		getDatasView: function(){
			if(typeof this.model == "undefined"){
				return "";
			}
			var datasHtml = '<div id="countt_info_view_container_data">'+app.noRecordsInIt()+'</div>';
				
			var commentsCol = new Backbone.Model();
			commentsCol.url = '/comments/countt'+this.model.get("_id")+'/'+0;
			
			//location.href.indexOf("entry") > -1 && 
		if((typeof this.model.get("ip_info_from_ip") == "undefined" || this.model.get("ip_info_from_ip") == "")){
			this.model.set("ip_info_from_ip","true");
			commentsCol.fetch().done(function(){
			var ipInfo = new Backbone.Model();
			
			ipInfo.url = config.urlAddr+'/get_info_from_ip';
				ipInfo.fetch().done(function(){
					var ipOf = ipInfo.get("ip");
					var countrieOfName = ipInfo.get("country_name");
					var countrieOf = ipInfo.get("country_code");
					var msgs = commentsCol.get("messages");
					if(msgs.length == 0){
						var ippps = ipOf;
						var countriess = [{cn:countrieOfName, cd:countrieOf, count:1}];
						this.changeDataOfCustom(commentsCol.get("_id"), ipOf, countriess);
					}else{
						var ips = msgs[0].message;
						try{
							var countries = JSON.parse(msgs[1].message.replace(/'/g, '"'));
							this.model.set("ip_info_from_ip_counties",countries);
							
								var htmlData = "";
								var hist = countries;
								for(var ii=0; ii < hist.length; ii++){
									var one_hist = hist[ii];
									htmlData += "<div><b>"+this.escapeHtml(one_hist.cd)+" ("+this.escapeHtml(one_hist.cn)+") - "+this.escapeHtml(one_hist.count.toString())+"</b>"+"</div>";
								}
								setTimeout(function(){
									if(htmlData != ""){
										$("#countt_info_view_container_data").html(htmlData);
									}
								}, 100);
							
							if(ips.indexOf(ipOf) == -1){
								ips += ", "+ipOf;
								var indexOffcnt = this.findInObjectArrCountry(countries, countrieOf);
								if(indexOffcnt > -1){
									var thatCntrl = countries[indexOffcnt].count+1;
									countries[indexOffcnt].count = thatCntrl;
								}else{
									countries.push({cn:countrieOfName, cd:countrieOf, count:1});
								}
								this.changeDataOfCustom(commentsCol.get("_id"), ips, countries);
							}
						}catch(e){}
						
					}
				}.bind(this));
			}.bind(this));
		}else{
			var hist = this.model.get("ip_info_from_ip_counties");
			var htmlData = "";
			if(typeof hist != "undefined"){
				for(var ii=0; ii < hist.length; ii++){
					var one_hist = hist[ii];
					htmlData += "<div><b>"+this.escapeHtml(one_hist.cd)+" ("+this.escapeHtml(one_hist.cn)+") - "+this.escapeHtml(one_hist.count.toString())+"</b>"+"</div>";
				}
				setTimeout(function(){
					if(htmlData != ""){
						$("#countt_info_view_container_data").html(htmlData);
					}
				}, 100);
			}
		}
			
			
				//commentsCol.get('_id')
			return datasHtml;
		},
		innerHtml: function(){
			var datasViewButtons = this.getDatasViewButtons();
			var datasViewAllIn = this.getDatasView();
			if(this.model.get("parentvisibility") != "editpublic" && this.model.get("parentvisibility") != "editprivate"){ datasViewButtons = ""; }
			
			
				return '<div class="views_in_all countt_info_view" style="display:none;">'+
				datasViewButtons+'<div id="datasViewAllIn'+this.appendName()+'">'+datasViewAllIn+'</div>'+
				'</div>';
		},
		onRerender: function(){
			var datasViewAll = this.getDatasView();
			//if(datasViewAll == ""){
			//	datasViewAll = app.noRecordsInIt();
			//}
			$("#datasViewAllIn"+this.appendName()).html(datasViewAll);
		},
		onRender: function(){
			//setTimeout(function(){
			//}.bind(this), 1);
		},
		setModel: function(model){
			this.model = model;
		}
		};
});
