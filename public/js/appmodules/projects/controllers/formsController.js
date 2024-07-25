define([
	'backbone',
    '../../../app',
    'models/base',
    'underscore',
    '../views/formsGridView'
], function( backbone,app, base, _, formsGridView ) {
    return base.extend({
        show: function(options){
			app.vent.trigger('top:leftmenu:show');
			var commentsCol = app.getAllFormsModel();
			if(options.which === "ordered_items"){
				commentsCol = app.getAllFormsModelOrdered();
			}
			var newcollection = new Backbone.Collection();
			commentsCol.fetch().done(function(){
				var messagesAll = commentsCol.get("messages");
				var emailOfOne = "";
				var subtotal = 0;
				var shipping = 0;
				for(var ii=0; ii < messagesAll.length; ii++){
					var backboneData = new Backbone.Model();
					var parseMsgOf = JSON.parse(messagesAll[ii].message);
					if(messagesAll[ii].files === ""){
						if(options.which === "posted"){
							if(emailOfOne === "" || parseMsgOf.email === emailOfOne){
								emailOfOne = parseMsgOf.email;
								
								backboneData.set("date", messagesAll[ii].date);
								backboneData.set("id_of_model", messagesAll[ii].from);
								backboneData.set("formsdata", parseMsgOf.formsdata);
								backboneData.set("other_data", parseMsgOf.other_data);
								backboneData.set("email_seller", parseMsgOf.email);
								
								var dataOf = parseMsgOf;
								var other_data = dataOf.other_data;
								var priceOfProduct = 0;
								var priceOfShipping = 0;
								var nameOf = "";
								var idof = "";
								var fileOf = {pic:"", file:"", name:""};
								
								for(var ij=0; ij < other_data.length; ij++){
									if(other_data[ij].data === "Files"){
										fileOf = { pic: config.filesurl+"/files/project_managing_files/"+other_data[ij].array[0]+"/0.png", file: "/files/project_managing_files/"+other_data[ij].array[0], name: other_data[ij].array[0].split("/")[1] };
									}
									if(other_data[ij].data === "Name"){
										nameOf = other_data[ij].object.name;
										idof = other_data[ij].object.idof;
									}
									if(other_data[ij].data === "Total"){
										priceOfProduct = other_data[ij].object.Price;
										priceOfShipping = other_data[ij].object.Shipping;
										subtotal = subtotal+other_data[ij].object.Price;
										shipping = shipping+other_data[ij].object.Shipping;
									}
								}
								var datasHtml = this.getHtmlOfPendingOrder(dataOf, priceOfProduct, priceOfShipping, nameOf, idof, fileOf);
								backboneData.set("data_html", datasHtml);
								
								newcollection.add(backboneData);
							}
						}
						
					}else{
						if(options.which === "history" || options.which === "ordered_items"){
							backboneData.set("date", messagesAll[ii].date);
							backboneData.set("guid_order", messagesAll[ii].from);
							
							var dataOf = parseMsgOf;
							var datasHtmlstart = '<div style="display:none;" class="commentInModalOrdered'+messagesAll[ii].date.replace(/ /g,'').replace(/:/g,'')+'" id="dataThereUnIdInnerTop'+messagesAll[ii].from+'">';
							
							var buttonsDatHtml = '<button class="general_button commentInModalOrderedButton'+messagesAll[ii].date.replace(/ /g,'').replace(/:/g,'')+'" onclick="$('+"'"+'#dataThereUnIdInnerTop'+messagesAll[ii].from+"'"+').toggle();">'+messagesAll[ii].from+'</button> ';
							
							var getinfoabout = messagesAll[ii].files.split("____");
							var statusOf = getinfoabout[0];
							var extraInfo = "";
							if(getinfoabout.length > 1 && getinfoabout[1] !== ""){
								extraInfo = " - "+getinfoabout[1];
							}
							
							var buttonsDatHtmlStatus = ' <button class="general_button commentInModalOrderedButton'+messagesAll[ii].date.replace(/ /g,'').replace(/:/g,'')+'"">'+statusOf+extraInfo+'</button>';
							
							if(options.which === "ordered_items"){
								var emailOfBuyer = JSON.parse(messagesAll[ii].message)[0].email_buyer;
								if(statusOf === "Submitted"){
									buttonsDatHtmlStatus += ' - <button data-whom="'+emailOfBuyer+'" data-guid="'+messagesAll[ii].from+'" data-status="Working on" class="setstatusOfTheOrder general_button commentInModalOrderedButton'+messagesAll[ii].date.replace(/ /g,'').replace(/:/g,'')+'"">'+app.translate("Working on")+'</button>';
									buttonsDatHtmlStatus += ' <button data-whom="'+emailOfBuyer+'" data-guid="'+messagesAll[ii].from+'" data-status="Decline" class="setstatusOfTheOrder general_button commentInModalOrderedButton'+messagesAll[ii].date.replace(/ /g,'').replace(/:/g,'')+'"">'+app.translate("Decline")+'</button>';
									buttonsDatHtmlStatus += "<span class='commentInModalOrdered"+messagesAll[ii].date.replace(/ /g,'').replace(/:/g,'')+"'>Extra info: <input id='extra_info_add' type='text' alt= '' value='' /></span>";
								}
								if(statusOf === "Working on"){
									buttonsDatHtmlStatus += ' - <button data-whom="'+emailOfBuyer+'" data-guid="'+messagesAll[ii].from+'" data-status="Sent" class="setstatusOfTheOrder general_button commentInModalOrderedButton'+messagesAll[ii].date.replace(/ /g,'').replace(/:/g,'')+'"">'+app.translate("Sent")+'</button>';
									buttonsDatHtmlStatus += ' <button data-whom="'+emailOfBuyer+'" data-guid="'+messagesAll[ii].from+'" data-status="Decline" class="setstatusOfTheOrder general_button commentInModalOrderedButton'+messagesAll[ii].date.replace(/ /g,'').replace(/:/g,'')+'"">'+app.translate("Decline")+'</button>';
									buttonsDatHtmlStatus += "<span class='commentInModalOrdered"+messagesAll[ii].date.replace(/ /g,'').replace(/:/g,'')+"'>Extra info: <input id='extra_info_add' type='text' alt= '' value='' /></span>";
								}
							}
							var buttonToDelete = '<button data-date="'+messagesAll[ii].date+'" class=" general_button height35 removeDataOneInOrdered"><span data-date="'+messagesAll[ii].date+'" class="glyphicon glyphicon-remove icon-in-menu icon-turn-off"></span></button>';
							if(location.href.indexOf("history") > -1){
								buttonToDelete = '<button data-date="'+messagesAll[ii].date+'" class=" general_button height35 removeDataOneInPostedOrHist"><span data-date="'+messagesAll[ii].date+'" class="glyphicon glyphicon-remove icon-in-menu icon-turn-off"></span></button>';
							}
							
							var datasHtml = this.getHtmlOfHistoryOrder(dataOf);
							datasHtmlstart = buttonsDatHtml+buttonsDatHtmlStatus+datasHtmlstart+datasHtml+buttonToDelete+"</div>";
							backboneData.set("data_html", datasHtmlstart);
							
							newcollection.add(backboneData);
						}
					}
				}
				var backboneDataaaa = new Backbone.Model();
				backboneDataaaa.set("whenempty","");
				backboneDataaaa.set("show_submit","");
				if(options.which === "posted"){
					if(typeof app.userConnected.data2 !== 'undefined'){
						if(app.userData.address.country_info === "" || app.userData.address.address1_info === "" || app.userData.address.address2_info === "" || app.userData.address.city_info === "" || app.userData.address.telephone_info === "" || app.userData.address.zip_code_info === ""){
							backboneDataaaa.set("show_submit","address_missing");
						}else{
							var totalHtml = "<div>";
							 totalHtml += "<h5>Subtotal: "+subtotal+"</h5>";
							 totalHtml += "<h5>Shipping: "+shipping+"</h5>";
							 totalHtml += "<h1 style='border-top:2px solid #000;'>Total: "+(subtotal+shipping)+"</h1>";
							 totalHtml += "</div>";
							backboneDataaaa.set("totalHtml", totalHtml);
							backboneDataaaa.set("show_submit","true");
							backboneDataaaa.set("address", app.userData.address);
							
						}
					}else{
						app.vent.on("userConnected:ready", function(){
							if(app.userData.address.country_info === "" || app.userData.address.address1_info === "" || app.userData.address.address2_info === "" || app.userData.address.city_info === "" || app.userData.address.telephone_info === "" || app.userData.address.zip_code_info === ""){
								backboneDataaaa.set("show_submit","address_missing");
							}else{
							var totalHtml = "<div>";
							 totalHtml += "<h5>Subtotal: "+subtotal+"</h5>";
							 totalHtml += "<h5>Shipping: "+shipping+"</h5>";
							 totalHtml += "<h1 style='border-top:2px solid #000;'>Total: "+(subtotal+shipping)+"</h1>";
							 totalHtml += "</div>";
								backboneDataaaa.set("totalHtml", totalHtml);
								backboneDataaaa.set("show_submit","true");
								backboneDataaaa.set("address", app.userData.address);
							}
							cView.render();
						}.bind(this));
					}
					
				}
				var cView = new formsGridView({collection: newcollection, model:backboneDataaaa});
				app.main.show(cView);
				if(newcollection.models.length == 0){
					backboneDataaaa.set("whenempty",app.getWhenNoData());
					cView.render();
				}
				this.listenTo(cView,'change:settings',function(obj){

				});
				
			}.bind(this)).error(function(){});
        },
		getHtmlOfPendingOrder: function(dataOf, priceOfProduct, Shipping, nameOf, idof, fileof, isInOrdered){
			var isOrdered = "removeDataOneInPostedOrHist";
			if(typeof isInOrdered !== "undefined" && isInOrdered !== ""){
				isOrdered = "not_show";
			}
			var datasHtml = '';
						if(typeof dataOf != 'undefined' && dataOf != null){
							var imgofhtml = "";
							var fileuploaded = "";
							var emailBuyer = "<br /><span style='font-size:15px;'>Buyer: <b>"+dataOf.email_buyer+"</b></span>";
							if(typeof dataOf.email_buyer === "undefined" || dataOf.email_buyer ===  ""){
								emailBuyer = "";
							}
							if(fileof.pic !== ""){
								fileuploaded = "<br /><span style='font-size:14px;'>File: <a target='_blank' style='color:white; font-size:14px;' href='"+fileof.file+"'>"+fileof.name+"</a></span>";
								imgofhtml = "<td style='width:150px; text-align:center;'><div style='width:100px; height:100px;'><img style='max-width:100px; max-height:100px;' src='"+fileof.pic+"' alt='' /></div></td>";
							}
							var showing_of_v = "<table style='width:100%;'><tr>";
							 showing_of_v += "<td style='width:50px;'>"+'<button class="general_button" onclick="$('+"'"+'#dataThereUnIdInner'+dataOf.date.replace(/ /g,'').replace(/:/g,'')+"'"+').toggle();">'+'More'+'</button>'+"</td>";
							 showing_of_v += imgofhtml;
							 showing_of_v += "<td style='width:60%; font-weight:bold; font-size:21px; text-align:left;'><a style='color:white;' href='/#/entry/"+idof+"'>"+nameOf+"</a>"+fileuploaded+emailBuyer+"</td>";
							 showing_of_v += "<td style='text-align:left;'><div><b>Price: "+priceOfProduct+"</b></div><div><b>Shipping: "+Shipping+"</b></div></td>";
							 showing_of_v += "</tr></table>";
							 
							datasHtml+='<div class="commentInModal" id="dataThereUnId'+dataOf.date.replace(/ /g,'').replace(/:/g,'')+'">';
							datasHtml+= showing_of_v;
							datasHtml+='<div style="display:none;" class="commentInModalInner" id="dataThereUnIdInner'+dataOf.date.replace(/ /g,'').replace(/:/g,'')+'">';
							
							var formsdat = dataOf.formsdata;
							for(var ij=0; ij < formsdat.length; ij++){
								if(formsdat[ij] !== ""){
									datasHtml += "<div>";
									datasHtml += ""+formsdat[ij].about+" - ";
									datasHtml += "("+formsdat[ij].defaultValue+")";
									datasHtml += "</div>";
								}
							}
							var other_data = dataOf.other_data;
							for(var ij=0; ij < other_data.length; ij++){
								if(other_data[ij] !== "" && other_data[ij].data !== "Name" && other_data[ij].data !== "Files"){
									var other_dt_array = other_data[ij].array;
									var other_dt_object = other_data[ij].object;
										datasHtml += "<div>";
										datasHtml += "<b>"+other_data[ij].data+"</b>";
										datasHtml += "</div>";
									for(var ijj=0; ijj < other_dt_array.length; ijj++){
										datasHtml += "<div>";
										datasHtml += ""+other_dt_array[ijj]+"";
										datasHtml += "</div>";
									}
									for(var izkey in other_dt_object){
										datasHtml += "<div>";
										datasHtml += ""+izkey+" - ";
										datasHtml += ""+other_dt_object[izkey]+"";
										datasHtml += "</div>";
									}
								}
							}
							datasHtml+="<span style='font-size:12px;'> ";
							datasHtml+=dataOf.date;
							datasHtml+="</span><div> ";
							datasHtml+="";
							if(isOrdered !== "not_show"){
								datasHtml += '<button data-date="'+dataOf.date+'" class=" general_button height35 '+isOrdered+'"><span data-date="'+dataOf.date+'" class="glyphicon glyphicon-remove icon-in-menu icon-turn-off"></span></button>';
							}
							datasHtml += '</div></div></div>';
						}
			return datasHtml;
		},
		getHtmlOfHistoryOrder: function(dataOff){
			var datasHtml = '';
				for(var ii=0; ii < dataOff.length; ii++){
					var dataOf = dataOff[ii];
						if(typeof dataOf != 'undefined' && dataOf != null){
								var priceOfProduct = 0;
								var priceOfShipping = 0;
								var nameOf = "";
								var idof = "";
								var fileOf = {file:"", pic:"", name:""};
								var other_data = dataOf.other_data;
								for(var ij=0; ij < other_data.length; ij++){
									if(other_data[ij].data === "Files"){
										fileOf = { pic: config.filesurl+"/files/project_managing_files/"+other_data[ij].array[0]+"/0.png", file: "/files/project_managing_files/"+other_data[ij].array[0], name: other_data[ij].array[0].split("/")[1] };
									}
									if(other_data[ij].data === "Name"){
										nameOf = other_data[ij].object.name;
										idof = other_data[ij].object.idof;
									}
									if(other_data[ij].data === "Total"){
										priceOfProduct = other_data[ij].object.Price;
										priceOfShipping = other_data[ij].object.Shipping;
									}
								}
							datasHtml += this.getHtmlOfPendingOrder(dataOf, priceOfProduct, priceOfShipping, nameOf, idof, fileOf, "ordered");
						}
					}
			return datasHtml;
		}
    });
});