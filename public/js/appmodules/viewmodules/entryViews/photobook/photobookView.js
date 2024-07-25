define([
	'../../../../app',
	'../../../../config',
	'jquerysvg',
	'nicEdit',
	'./components/views'
], function( app, config, jquerysvg, nicEdit, views ) {
    return {
		changeZoomingCount: function(value){
					var what_to_add = 50+value;
					now = 100 + what_to_add;
					$(".slider_info_data").text(what_to_add);
					var zoomIn = what_to_add/100;
					$(".photobook_main_view_inner_whole").css("zoom", zoomIn);
		},
		on_change_view: function(e){
			views.on_change_view(e);
		},
		OnPhotobook_add_view_one: function(e){
			/*var identity = e.currentTarget.getAttribute('identity');
			e.stopImmediatePropagation();
			if(this.model.get("_id") == identity){
				e.stopPropagation();
				this.addOneViewPhotobook();
				e.stopPropagation();
			}*/
			views.OnPhotobook_add_view_one(e);
		},
		addOneViewPhotobook: function(){
			/*	var pages_all = JSON.parse(this.model.get("photobook_data"));
				var id_of_the = pages_all.length;
				for(var ii=0; ii < pages_all.length; ii++){
					if(parseInt(pages_all[ii].id) > id_of_the){
						id_of_the = parseInt(pages_all[ii].id);
					}
				}
				id_of_the = id_of_the+1;
				var addNew = {id: id_of_the, page1:"", page2:"", size:this.photobook_get_size_of_elem_def()};
				pages_all.push(addNew);
				var save_what = JSON.stringify(pages_all);
				this.model.set("photobook_data", save_what);
				this.model.save();
				return id_of_the;
				*/
			return views.addOneViewPhotobook();
		},
		setObjStyleOfText: function(obj, text_obj, styles){
				var ffsize = obj.css("font-size");
				var exist_text = {big:false, normal:false};
				if(ffsize == styles.big_text.font_size){
					exist_text.big = true;
					obj.css("font-family", styles.big_text.font_family);
					obj.css("color", styles.big_text.text_color);
					if(styles.big_text.background_color !== ""){
						text_obj.parent().css("background-color",styles.big_text.background_color);
					}else{
						text_obj.parent().css("background-color","rgba(0,0,0,0.0)");
					}
				}else{
					exist_text.normal = true;
					obj.css("font-family", styles.normal_text.font_family);
					obj.css("color", styles.normal_text.text_color);
					if(styles.normal_text.background_color !== ""){
						text_obj.parent().css("background-color",styles.normal_text.background_color);
					}else{
						text_obj.parent().css("background-color","rgba(0,0,0,0.0)");
					}
				}
				return exist_text;
		},
		setTextStyle: function(text_obj, tagName, styles){
			var th = this;
			var exist_text = {big:false, normal:false};
			if(!text_obj.find("span").length && !text_obj.find("font").length){
				var exist_textt = th.setObjStyleOfText(text_obj, text_obj, styles);
				if(exist_textt.big){
					exist_text.big = true;
				}
				if(exist_textt.normal){
					exist_text.normal = true;
				}
			}
			text_obj.find(tagName).each(function() {
				var obj = $(this);
				var exist_textt = th.setObjStyleOfText(obj, text_obj, styles);
				if(exist_textt.big){
					exist_text.big = true;
				}
				if(exist_textt.normal){
					exist_text.normal = true;
				}
			});
			return exist_text;
		},
		changeContentOfTheView: function(newContent, styles_if_exist){
			var getViewsId = this.getSelectedViewsId();
			if(getViewsId !== ""){
				removeListingOnAll();
				var childrenCount1 = $(".photobook_main_view_inner_page1").find(".droppable").children().length;
				var childrenCount2 = $(".photobook_main_view_inner_page2").find(".droppable").children().length;
				var th = this;
					//if(childrenCount1 < 1){ 
					//	views1 = newContent.views1; 
					//}else{
						var nexist_img = true;
						var nexist_head_text = true;
						var nexist_simple_text = true;
						var the_page_obj = $(".photobook_main_view_inner_page1");
						the_page_obj.find(".dropped").each(function() {
							var obj = $(this);
							if(obj.hasClass("text_frame")){
								var exist_t1 = th.setTextStyle(obj.find(".text_this_one"), "span", styles_if_exist);
								var exist_t2 = th.setTextStyle(obj.find(".text_this_one"), "font", styles_if_exist);
								if(exist_t1.big || exist_t2.big){
									nexist_head_text = false;
								}
								if(exist_t1.normal || exist_t2.normal){
									nexist_simple_text = false;
								}
							}
							if(obj.hasClass("image_frame")){
								if(obj.css("background-image").indexOf(styles_if_exist.pic_link) > -1){
									obj.css("z-index","950");
									nexist_img = false;
								}else{
									if(obj.css("z-index") == "950"){
										obj.css("z-index","949");
									}
								}
							}
						});
						if(nexist_img){
							the_page_obj.find(".droppable").append(styles_if_exist.add_element);
						}
						if(nexist_simple_text){
							the_page_obj.find(".droppable").append(styles_if_exist.normal_text_html);
						}
						if(nexist_head_text){
							the_page_obj.find(".droppable").append(styles_if_exist.big_text_html);
						}
					//}
					//if(childrenCount2 < 1){ 
					//	views2 = newContent.views2; 
					//}else{
						var nexist_img2 = true;
						var nexist_head_text2 = true;
						var nexist_simple_text2 = true;
						var the_page_obj2 = $(".photobook_main_view_inner_page2");
						the_page_obj2.find(".dropped").each(function() {
							var obj = $(this);
							if(obj.hasClass("text_frame")){
								var exist_t1 = th.setTextStyle(obj.find(".text_this_one"), "span", styles_if_exist);
								var exist_t2 = th.setTextStyle(obj.find(".text_this_one"), "font", styles_if_exist);
								if(exist_t1.big || exist_t2.big){
									nexist_head_text2 = false;
								}
								if(exist_t1.normal || exist_t2.normal){
									nexist_simple_text2 = false;
								}
							}
							if(obj.hasClass("image_frame")){
								if(obj.css("background-image").indexOf(styles_if_exist.pic_link) > -1){
									obj.css("z-index","950");
									nexist_img2 = false;
								}else{
									if(obj.css("z-index") == "950"){
										obj.css("z-index","949");
									}
								}
							}
						});
						if(nexist_img2){
							the_page_obj2.find(".droppable").append(styles_if_exist.add_element);
						}
						if(nexist_simple_text2){
							the_page_obj2.find(".droppable").append(styles_if_exist.normal_text_html2);
						}
						if(nexist_head_text2){
							the_page_obj2.find(".droppable").append(styles_if_exist.big_text_html2);
						}
					//}
				var views1 = $(".photobook_main_view_inner_page1").html();
				var views2 = $(".photobook_main_view_inner_page2").html();
				if(childrenCount1 < 1){ views1 = ""; }
				if(childrenCount2 < 1){ views2 = ""; }
				this.changeDataOfSelectedView(getViewsId, views1, views2);
				if(this.model.get("parentvisibility") != "editpublic" && this.model.get("parentvisibility") != "editprivate"){}else{
					startListingOnAll();
				}
			}
		},
		saveDataForViews: function(e){
			var getViewsId = this.getSelectedViewsId();
			if(getViewsId !== ""){
				removeListingOnAll();
				$(".photobook_main_view_inner .photobook_top_general_button_inner_drag").each(function() {
					var obj = $(this);
					var getinsattr = obj.attr("style").split("inset:");
					var getins = "";
					if (getinsattr.length > 1) {
						getins = getinsattr[1].split(";")[0].trim();
					}
					var myattr = obj.attr("style");
					
					if (typeof getins != "undefined" && getins != "" && getins != "-2px auto auto" && getins.split(" ").length == 4) {
						var sstring = "";
						var getinssplit = getins.split(" ");
						if (getinssplit[0] != "auto") {
							sstring = " top: "+getinssplit[0]+";";
						} else {
							if (getinssplit[2] != "auto") {
								sstring = " bottom: "+getinssplit[2]+";";
							}
						}
						if (getinssplit[3] != "auto") {
							sstring += " left: "+getinssplit[3]+";";
						} else {
							if (getinssplit[1] != "auto") {
								sstring += " right: "+getinssplit[1]+";";
							}
						}
						if (sstring != "") {
							if (myattr.indexOf("absolute") == -1) {
								sstring = sstring+" position: absolute;";
							}
							obj.attr("style", myattr+sstring);
						}
					}
				});
				var views1 = $(".photobook_main_view_inner_page1").html();
				var views2 = $(".photobook_main_view_inner_page2").html();
				
				var childrenCount1 = $(".photobook_main_view_inner_page1").find(".droppable").children().length;
				var childrenCount2 = $(".photobook_main_view_inner_page2").find(".droppable").children().length;
				if(childrenCount1 < 1){ views1 = ""; }
				if(childrenCount2 < 1){ views2 = ""; }
				this.changeDataOfSelectedView(getViewsId, views1, views2);
				if(this.model.get("parentvisibility") != "editpublic" && this.model.get("parentvisibility") != "editprivate"){}else{
					startListingOnAll();
				}
				if(typeof e !== "undefined"){
					e.stopImmediatePropagation();
				}
			}
		},
		saveDataForViewsAll: function(e){
				this.saveDataForViews(e);
		},
		getSelectedViewsId: function(){
			var view_sel = this.model.get("photobook_view_selected");
			if(typeof view_sel !== "undefined" && view_sel !== ""){
				return view_sel;
			}else{
				var pages_all = JSON.parse(this.model.get("photobook_data"));
				if(pages_all.length > 0){
					return pages_all[0].id;
				}else{
					return "";
				}
			}
		},
		changeDataOfSelectedView: function(view_id, page1, page2){
			var pages_all = JSON.parse(this.model.get("photobook_data"));
			for(var ii=0; ii < pages_all.length; ii++){
				if(pages_all[ii].id == view_id){
					pages_all[ii].page2 = page2;
					pages_all[ii].page1 = page1;
				}
			}
			var save_what = JSON.stringify(pages_all);
			this.model.set("photobook_data", save_what);
			this.model.save();
		},
		setViewSelectedOnRend: function(){
			var view_sel = this.model.get("photobook_view_selected");
			if(typeof view_sel !== "undefined" && view_sel !== ""){
				this.setViewSelected(view_sel);
				var viewSelDataz = this.getViewFromViewId(view_sel);
				if(viewSelDataz.size !== "undefined" && viewSelDataz !== ""){
					this.model.set("photobook_document_size",viewSelDataz.size);
				}
			}else{
				var pages_all = JSON.parse(this.model.get("photobook_data"));
				if(pages_all.length > 0){
					this.setViewSelected(pages_all[0].id);
					if(typeof pages_all[0].size !== "undefined" && pages_all[0].size !== ""){
						this.model.set("photobook_document_size",pages_all[0].size);
					}
				}
			}
		},
		getViewFromViewId: function(view_id){
			var viewThat = "";
			var pages_all = JSON.parse(this.model.get("photobook_data"));
			for(var ii=0; ii < pages_all.length; ii++){
				if(pages_all[ii].id == view_id){
					viewThat = pages_all[ii];
				}
			}
			return viewThat;
		},
		setViewSelected: function(view_id){
			views.setViewSelected(view_id);
		},
		photobook_remove_view_one: function(e){
			e.stopImmediatePropagation();
			views.photobook_remove_view_one(e);
		},
		photobook_document_layout_change: function(e){
			var datashow = e.currentTarget.getAttribute('data-show');
				var getongnr = getOngoingIdNumber();
				var getongnr1 = getOngoingIdNumber()+1;
			if(datashow === "layout1"){
				var sizeofpage = "page_size_30x30";
				
				var picture = '<div class="photobook_top_general_button_inner_drag inlineblock  image_frame dropped ui-droppable droppedSelected" style="position: absolute; z-index: 950; width: 1002px; right: auto; height: 619px; bottom: auto; left: -273px; top: -124px; background-image: url(&quot;'+config.filesurl+'/files/project_managing_files/57c181f1c8ac78282b06ccd4/cup.jpg&quot;); background-size: contain; background-repeat: no-repeat; opacity: 1;"></div>';
				
				var big_text = '<div class="photobook_top_general_button_inner_drag inlineblock  text_frame dropped" style="position: absolute; z-index: 1015; width: 262px; right: auto; height: 90px; bottom: auto; left: 40px; top: 3px; opacity: 1; background-color: rgba(255, 0, 128, 0.341176);"><div class="text_this_one" id="text_this_one'+getongnr+'" contenteditable="true"><div><br></div><div><span style="font-family: impact; font-size: xx-large;">Rytinė kava</span><br></div></div></div>';
				
				var normal_text = '<div class="photobook_top_general_button_inner_drag inlineblock  text_frame dropped" style="position: absolute; z-index: 1001; width: 206px; right: auto; height: 38px; bottom: auto; left: 32px; top: 336px;"><div class="text_this_one" id="text_this_one'+getongnr1+'" contenteditable="true"><font size="5" face="comic sans ms" color="#ffffff">Puikus rytas;)</font></div></div>';
				
				var big_text2 = '<div class="photobook_top_general_button_inner_drag inlineblock  text_frame dropped" style="position: absolute; z-index: 1015; width: 262px; right: auto; height: 90px; bottom: auto; left: 40px; top: 3px; opacity: 1; background-color: rgba(255, 0, 128, 0.341176);"><div class="text_this_one" id="text_this_one'+(getongnr+2)+'" contenteditable="true"><div><br></div><div><span style="font-family: impact; font-size: xx-large;">Rytinė kava</span><br></div></div></div>';
				
				var normal_text2 = '<div class="photobook_top_general_button_inner_drag inlineblock  text_frame dropped" style="position: absolute; z-index: 1001; width: 206px; right: auto; height: 38px; bottom: auto; left: 32px; top: 336px;"><div class="text_this_one" id="text_this_one'+(getongnr1+2)+'" contenteditable="true"><font size="5" face="comic sans ms" color="#ffffff">Puikus rytas;)</font></div></div>';
				
				var styles_of = {
					add_element: picture, 
					big_text: {font_size: "32px", font_family:"impact", background_color:"rgba(255, 0, 128, 0.341176)", text_color:"black"},
					big_text_html: big_text,
					big_text_html2: big_text2,
					normal_text:{font_size: "24px", font_family:"comic sans ms", background_color:"", text_color:"white"},
					normal_text_html: normal_text,
					normal_text_html2: normal_text2,
					pic_link: "57c181f1c8ac78282b06ccd4/cup.jpg"
				};
				
				var data = '<div class="page_left_margin '+sizeofpage+'">	<div id="drawzone">	  <div class="grid" data-size="10">	  </div>	  <div class="droppable ui-droppable">';
				
				data += picture;
				data += big_text;
				data += normal_text;
				
				data += "</div>	</div></div>";
				
				var data2 = '<div class="page_left_margin '+sizeofpage+'">	<div id="drawzone">	  <div class="grid" data-size="10">	  </div>	  <div class="droppable ui-droppable">';
				
				data2 += picture;
				data2 += big_text;
				data2 += normal_text;
				
				data2 += "</div>	</div></div>";
				
				this.changeContentOfTheView({views1: data, views2: data2}, styles_of);
			}
			if(datashow === "layout2"){
				var sizeofpage = "page_size_30x30";
				
				var picture = '<div class="photobook_top_general_button_inner_drag inlineblock  image_frame dropped ui-droppable droppedSelected" style="position: absolute; z-index: 950; width: 1002px; right: auto; height: 619px; bottom: auto; left: -233px; top: -50px; background-image: url(&quot;/files/project_managing_files/57c181f1c8ac78282b06ccd4/21001_HC-Photo-Books-Nav.jpg&quot;); background-size: contain; background-repeat: no-repeat; opacity: 1;"></div>';
				
				var big_text = '<div class="photobook_top_general_button_inner_drag inlineblock  text_frame dropped" style="position: absolute; z-index: 1015; width: 262px; right: auto; height: 115px; bottom: auto; left: 223px; top: 14px; opacity: 1; background-color: rgba(255, 0, 128, 0);"><div class="text_this_one" id="text_this_one'+getongnr+'" contenteditable="true"><div><br></div><h1 style="text-align: center;"><font face="verdana" size="6" color="#ff0066"><b><i>Knyga</i></b></font></h1></div></div>';
				
				var normal_text = '<div class="photobook_top_general_button_inner_drag inlineblock  text_frame dropped" style="position: absolute; z-index: 1001; width: 206px; right: auto; height: 72px; bottom: auto; left: 252px; top: 229px; background-color: rgba(0, 0, 0, 0);"><div class="text_this_one" id="text_this_one'+getongnr1+'" contenteditable="true"><font face="impact" color="#ff3366" size="5">Apie knygą nieko blogo</font></div></div>';
				
				var big_text2 = '<div class="photobook_top_general_button_inner_drag inlineblock  text_frame dropped" style="position: absolute; z-index: 1015; width: 262px; right: auto; height: 115px; bottom: auto; left: 223px; top: 14px; opacity: 1; background-color: rgba(255, 0, 128, 0);"><div class="text_this_one" id="text_this_one'+(getongnr+2)+'" contenteditable="true"><div><br></div><h1 style="text-align: center;"><font face="verdana" size="6" color="#ff0066"><b><i>Knyga</i></b></font></h1></div></div>';
				
				var normal_text2 = '<div class="photobook_top_general_button_inner_drag inlineblock  text_frame dropped" style="position: absolute; z-index: 1001; width: 206px; right: auto; height: 72px; bottom: auto; left: 252px; top: 229px; background-color: rgba(0, 0, 0, 0);"><div class="text_this_one" id="text_this_one'+(getongnr1+2)+'" contenteditable="true"><font face="impact" color="#ff3366" size="5">Apie knygą nieko blogo</font></div></div>';
				
				var styles_of = {
					add_element: picture, 
					big_text: {font_size: "32px", font_family:"verdana", background_color:"", text_color:"#ff0066"},
					big_text_html: big_text,
					big_text_html2: big_text2,
					normal_text:{font_size: "24px", font_family:"impact", background_color:"", text_color:"#ff3366"},
					normal_text_html: normal_text,
					normal_text_html2: normal_text2,
					pic_link: "57c181f1c8ac78282b06ccd4/21001_HC-Photo-Books-Nav.jpg"
				};
				
				var data = '<div class="page_left_margin '+sizeofpage+'">	<div id="drawzone">	  <div class="grid" data-size="10">	  </div>	  <div class="droppable ui-droppable">';
				
				data += picture;
				data += big_text;
				data += normal_text;
				
				data += "</div>	</div></div>";
				
				var data2 = '<div class="page_left_margin '+sizeofpage+'">	<div id="drawzone">	  <div class="grid" data-size="10">	  </div>	  <div class="droppable ui-droppable">';
				
				data2 += picture;
				data2 += big_text;
				data2 += normal_text;
				
				data2 += "</div>	</div></div>";
				
				this.changeContentOfTheView({views1: data, views2: data2}, styles_of);
			}
			
		},
		photobook_document_size_change: function(e){
			var datashow = e.currentTarget.getAttribute('data-show');
			var addClassThis = this.photobook_get_class_of_elem(datashow);
			this.photobook_document_size_set_to_all(addClassThis, datashow);
			this.photobook_document_size_set(datashow);
			e.stopImmediatePropagation();
		},
		photobook_document_size_set_to_all: function(addClassThis, datashow){
			var pages_all = JSON.parse(this.model.get("photobook_data"));
			for(var ii=0; ii < pages_all.length; ii++){
					var pages1 = pages_all[ii].page1;
					pages1 = pages1.replace("page_size_7x9", "");
					pages1 = pages1.replace("page_size_8x8", "");
					pages1 = pages1.replace("page_size_8x10", "");
					pages1 = pages1.replace("page_size_ax3", "");
					pages1 = pages1.replace("page_size_ax4", "");
					pages1 = pages1.replace("page_size_ax6", "");
					pages1 = pages1.replace("page_size_10x10", "");
					pages1 = pages1.replace("page_size_30x30", "");
					pages1 = pages1.replace("page_size_14x11", "");
					pages1 = pages1.replace("page_left_margin", "page_left_margin "+addClassThis);
					pages_all[ii].page1 = pages1;
					var pages2 = pages_all[ii].page2;
					pages2 = pages2.replace("page_size_7x9", "");
					pages2 = pages2.replace("page_size_8x8", "");
					pages2 = pages2.replace("page_size_8x10", "");
					pages2 = pages2.replace("page_size_ax3", "");
					pages2 = pages2.replace("page_size_ax4", "");
					pages2 = pages2.replace("page_size_ax6", "");
					pages2 = pages2.replace("page_size_10x10", "");
					pages2 = pages2.replace("page_size_30x30", "");
					pages2 = pages2.replace("page_size_14x11", "");
					pages2 = pages2.replace("page_left_margin", "page_left_margin "+addClassThis);
					pages_all[ii].page2 = pages2;
					pages_all[ii].size = datashow;
			}
			var save_what = JSON.stringify(pages_all);
				this.model.set("photobook_data", save_what);
				this.model.save();
		},
		photobook_document_size_set: function(datashow){
			$(".page_left_margin").removeClass("page_size_7x9");
			$(".page_left_margin").removeClass("page_size_8x8");
			$(".page_left_margin").removeClass("page_size_8x10");
			$(".page_left_margin").removeClass("page_size_ax6");
			$(".page_left_margin").removeClass("page_size_ax3");
			$(".page_left_margin").removeClass("page_size_ax4");
			$(".page_left_margin").removeClass("page_size_10x10");
			$(".page_left_margin").removeClass("page_size_14x11");
			$(".page_left_margin").removeClass("page_size_30x30");
			$(".photobook_document_size_selected").removeClass("photobook_document_size_selected");
			var addClassThis = this.photobook_get_class_of_elem(datashow);
			if(datashow === "7x9"){
				$(".page_left_margin").addClass(addClassThis);
				$(".photobook_document_size_7x9").addClass("photobook_document_size_selected");
				this.model.set("photobook_document_size","7x9");
			}
			if(datashow === "8x8"){
				$(".page_left_margin").addClass(addClassThis);
				$(".photobook_document_size_8x8").addClass("photobook_document_size_selected");
				this.model.set("photobook_document_size","8x8");
			}
			if(datashow === "8x10"){
				$(".page_left_margin").addClass(addClassThis);
				$(".photobook_document_size_8x10").addClass("photobook_document_size_selected");
				this.model.set("photobook_document_size","8x10");
			}			
			if(datashow === "ax3"){
				$(".page_left_margin").addClass(addClassThis);
				$(".photobook_document_size_ax3").addClass("photobook_document_size_selected");
				this.model.set("photobook_document_size","ax3");
			}				
			if(datashow === "ax4"){
				$(".page_left_margin").addClass(addClassThis);
				$(".photobook_document_size_ax4").addClass("photobook_document_size_selected");
				this.model.set("photobook_document_size","ax4");
			}			
			if(datashow === "ax6"){
				$(".page_left_margin").addClass(addClassThis);
				$(".photobook_document_size_ax6").addClass("photobook_document_size_selected");
				this.model.set("photobook_document_size","ax6");
			}
			if(datashow === "10x10"){
				$(".page_left_margin").addClass(addClassThis);
				$(".photobook_document_size_10x10").addClass("photobook_document_size_selected");
				this.model.set("photobook_document_size","10x10");
			}
			if(datashow === "14x11"){
				$(".page_left_margin").addClass(addClassThis);
				$(".photobook_document_size_14x11").addClass("photobook_document_size_selected");
				this.model.set("photobook_document_size","14x11");
			}
			if(datashow === "12x12"){
				$(".page_left_margin").addClass(addClassThis);
				$(".photobook_document_size_12x12").addClass("photobook_document_size_selected");
				this.model.set("photobook_document_size","12x12");
			}
		},
		photobook_set_default_or_not_documentsize: function(){
			var size_doc = this.model.get("photobook_document_size");
			if(typeof size_doc === "undefined" || size_doc === ""){
				size_doc = "12x12";
			}
			this.photobook_document_size_set(size_doc);
		},
		photobook_get_class_of_elem_def: function(){
			var size_doc = this.model.get("photobook_document_size");
			if(typeof size_doc === "undefined" || size_doc === ""){
				size_doc = "12x12";
			}
			return this.photobook_get_class_of_elem(size_doc);
		},
		photobook_get_size_of_elem_def: function(){
			return views.photobook_get_size_of_elem_def();
		},
		photobook_get_class_of_elem: function(datashow){
			return views.photobook_get_class_of_elem(datashow);
		},
		photobook_get_cm_of_doc_size_def: function(){
			var elem = "30.48cm*30.48cm";
			var size_doc = this.model.get("photobook_document_size");
			if(typeof size_doc === "undefined" || size_doc === ""){
				size_doc = "12x12";
			}
			if(size_doc === "7x9"){
				elem = "17.78cm*22.86cm";
			}
			if(size_doc === "8x8"){
				elem = "20.32cm*20.32cm";
			}
			if(size_doc === "8x10"){
				elem = "20.32cm*25.4cm";
			}			
			if(size_doc === "ax4"){
				elem = "21.0cm*29.7cm";
			}			
			if(size_doc === "ax6"){
				elem = "10.5cm*14.8cm";
			}			
			if(size_doc === "ax3"){
				elem = "29.7cm*42.0cm";
			}
			if(size_doc === "10x10"){
				elem = "25.4cm*25.4cm";
			}
			if(size_doc === "14x11"){
				elem = "35.56cm*27.94cm";
			}
			return elem;
		},
		CheckPrice: function(e){
			$(".get_check_price_glyph").removeClass("glyphicon-ok");
			$(".get_check_price_glyph").html("<img style='max-height: 30px;' src='/files/loading.gif' alt='' />");
			if($(".get_check_price_glyph").find("img").length){
				this.saveDataForViewsAll();
				var createHtmlFile = new Backbone.Model();
				createHtmlFile.url = config.urlAddr+"/createhtmlfile";
				createHtmlFile.set("photobook_data",this.model.get("photobook_data"));
				createHtmlFile.set("_id",this.model.get("_id"));
				createHtmlFile.set("id",this.model.get("_id"));
				var this_id_of = this.model.get("_id");
				var sizeincm = this.photobook_get_cm_of_doc_size_def();
				
				createHtmlFile.save(null,{
					success: function(model, response) {
						var html_file = response.file_name;
						var savepdf = new Backbone.Model();
						savepdf.url = config.urlAddr+"/download_pdf";
						savepdf.set("_id", this_id_of);
						savepdf.set("sizeincm", sizeincm);
						savepdf.set("id", this_id_of);
						savepdf.save(null, {
							success: function(model, response) {
								$(".get_check_price_glyph").html("");
								$(".get_check_price_glyph").addClass("glyphicon-ok");
								//$(".photobook_this_pdf_link_one").trigger("click");
								//document.getElementById("photobook_this_pdf_link_one").click();
								var urlofFile = "/"+this_id_of;//"/users_html/html_file"+this_id_of+".pdf";
								changeWindHref("/#/entry_pdf/57a748f44f825a84247c216f"+urlofFile);
								console.log("OK");
							}
						});
					},
					error: function(model, response) {
					}
				});
				e.stopImmediatePropagation();
			}
		},
		changeDeleteThatElement: function(e){
			$(".droppedSelected").remove();
			whenMouseOnOtherThanElement();
			e.stopImmediatePropagation();
		},
		changeTextOneText: function(e){
			/*var textHtml = $(".droppedSelected .photobook_text_edit").val();
			$(".droppedSelected .photobook_text_edit").text(textHtml);
			$(".droppedSelected .photobook_text_show").text(textHtml);
			$(".droppedSelected .photobook_text_show").toggle();
			$(".droppedSelected .photobook_text_edit").toggle();*/
			if(!$("#myNicPanel").is(":visible")){
				var textThisOne = $(".droppedSelected").find(".text_this_one");
				$("#myNicPanel").css("display","inline-block");
				if(typeof textThisOne !== "undefined" && typeof textThisOne.attr("id") !== "undefined" && textThisOne.attr("id") !== "" && typeof window.myNicEditor !== "undefined"){
					var textThisOn = textThisOne.attr("id");
					$('#'+textThisOn).focus();
				}
				try{
					$(".droppedSelected").draggable( "destroy" );
					$(".droppedSelected").resizable( "destroy" );
				}catch(err){}
				$(".changeTextOneText").find(".photobook_top_body_bottom_text").text("Drag text");
			}else{
				$("#myNicPanel").css("display","none");
				var $obj = $(".droppedSelected");
				addEverytingToObj($obj, "notnew");
				$(".changeTextOneText").find(".photobook_top_body_bottom_text").text("Edit text");
			}
			e.stopImmediatePropagation();
		},
		getPDFfile: function(e){
			$(".get_pdf_glyph").removeClass("glyphicon-ok");
			$(".get_pdf_glyph").html("<img style='max-height: 30px;' src='/files/loading.gif' alt='' />");
			if($(".get_pdf_glyph").find("img").length){
				this.saveDataForViewsAll();
				var createHtmlFile = new Backbone.Model();
				createHtmlFile.url = config.filesurl+"/createhtmlfile";
				createHtmlFile.set("photobook_data",this.model.get("photobook_data"));
				createHtmlFile.set("_id",this.model.get("_id"));
				createHtmlFile.set("id",this.model.get("_id"));
				var this_id_of = this.model.get("_id");
				var sizeincm = this.photobook_get_cm_of_doc_size_def();
				
				createHtmlFile.save(null,{
					success: function(model, response) {
						var html_file = response.file_name;
						var savepdf = new Backbone.Model();
						savepdf.url = config.filesurl+"/download_pdf";
						savepdf.set("_id", this_id_of);
						savepdf.set("id", this_id_of);
						savepdf.set("sizeincm", sizeincm);
						savepdf.save(null, {
							success: function(model, response) {
								$(".get_pdf_glyph").addClass("glyphicon-ok");
								$(".get_pdf_glyph").html("");
								//$(".photobook_this_pdf_link_one").trigger("click");
								document.getElementById("photobook_this_pdf_link_one").click();
							}
						});
					},
					error: function(model, response) {
					}
				});
				e.stopImmediatePropagation();
			}
		},
		changeBackgroundColorAndTransparency: function(opac){
				var backgroundColor = $(".droppedSelected").css("background-color");
				if(backgroundColor.indexOf("rgba") > -1){
					var newBGColoraa = backgroundColor.split(",");
					var newBGColor = newBGColoraa[0]+","+newBGColoraa[1]+","+newBGColoraa[2]+","+opac+")";
					$(".droppedSelected").css("background-color",newBGColor);
				}else{
					if(backgroundColor.indexOf("rgb") > -1){
						var newBGColor = backgroundColor.replace('rgb','rgba').replace(')', ','+opac+')');
						$(".droppedSelected").css("background-color",newBGColor);
					}
				}
		},
		slider_change_of_transparency: function(new_value){
			if($(".droppedSelected").length){
				var opac = new_value/100;
				this.changeBackgroundColorAndTransparency(opac);
			}
		},
		slider_change_of_opacity: function(new_value){
			if($(".droppedSelected").length){
				var backgroundColor = $(".droppedSelected").css("background-color");
				var opac = new_value/100;
				$(".droppedSelected").css("opacity",opac);
			}
		},
		slider_change_of_z_index: function(new_value){
			if($(".droppedSelected").length){
				var val_z_ind = 951+new_value;
				$(".droppedSelected").css("z-index",val_z_ind);
			}
		},
		
		slider_border_info: function(new_value){
			if($(".droppedSelected").length){
				var val_bord_size = new_value;
				$(".droppedSelected").css("border-width",val_bord_size+"px");
			}
		},
		slider_corner_info: function(new_value){
			if($(".droppedSelected").length){
				var val_radius = new_value;
				$(".droppedSelected").css("border-radius",val_radius+"px");
			}
		},
		slider_rotate_info: function(new_value){
			if($(".droppedSelected").length){
				var val_rotate = (new_value/100)*360;
				$(".droppedSelected").css("transform","rotate("+val_rotate+"deg)");
			}
		},
		
		background_color_of_general: function(e){
			if($(".droppedSelected").length){
				var backg = $("#background_color_of_general").val();
				$(".droppedSelected").css("background-color",backg);
				var transp_info = $(".slider_transparency_info").slider( "value" );
				this.slider_change_of_transparency(transp_info);
			}
			e.stopImmediatePropagation();
		},
		border_color_of_general: function(e){
			if($(".droppedSelected").length){
				var backg = $("#border_color_of_general").val();
				$(".droppedSelected").css("border-color",backg);
			}
			e.stopImmediatePropagation();
		},
		onRender: function(){
			var filesImg = this.get_html_files();
			var viewsOfItHere = this.get_pages_photobook_html();
			$(".photobook_existing_images").html(filesImg);
			$(".photobook_existing_views").html(viewsOfItHere);
			$("#photobook_trigger_this_for_rerendering").click(function(){ this.onRender(); }.bind(this));
			$(".on_change_view").click(this.on_change_view.bind(this));
			$(".photobook_top_button").click(this.onClickButton.bind(this));
			$(".photobook_add_view_one").click(this.OnPhotobook_add_view_one.bind(this));
			$(".photobook_remove_view_one").click(this.photobook_remove_view_one.bind(this));
			$(".saveDataForViews").click(this.saveDataForViews.bind(this));
			$(".getPDFfile").click(this.getPDFfile.bind(this));
			$(".changeTextOneText").click(this.changeTextOneText.bind(this));
			$(".changeDeleteThatElement").click(this.changeDeleteThatElement.bind(this));
			$(".CheckPrice").click(this.CheckPrice.bind(this));
			$(".photobook_document_size_change").click(this.photobook_document_size_change.bind(this));
			$(".photobook_document_layout_change").click(this.photobook_document_layout_change.bind(this));
			$("#background_color_of_general").change(this.background_color_of_general.bind(this));
			$("#border_color_of_general").change(this.border_color_of_general.bind(this));
			
			//nicEdit
			//bkLib.onDomLoaded(function() { nicEditors.allTextAreas() });
			setTimeout(function(){
					//bkLib.onDomLoaded(function() {
						$("#myNicPanel").html("");
						window.myNicEditor = new nicEditor();
						window.myNicEditor.setPanel('myNicPanel');
						if(this.model.get("parentvisibility") != "editpublic" && this.model.get("parentvisibility") != "editprivate"){}else{
						startListingOnAllForNicEditor();
						}
					//});
			}.bind(this), 1);
			
			$(".slider_transparency_info_opacity").slider({
				value:100,
				slide: function( event, ui ) {
					this.slider_change_of_opacity(ui.value);
				}.bind(this)
			});
			$(".slider_transparency_info").slider({
				value:100,
				slide: function( event, ui ) {
					this.slider_change_of_transparency(ui.value);
				}.bind(this)
			});
			$(".slider_z_info").slider({
				value:50,
				slide: function( event, ui ) {
					this.slider_change_of_z_index(ui.value);
				}.bind(this)
			});
			
			$(".slider_border_info").slider({
				value:50,
				slide: function( event, ui ) {
					this.slider_border_info(ui.value);
				}.bind(this)
			});
			$(".slider_corner_info").slider({
				value:50,
				slide: function( event, ui ) {
					this.slider_corner_info(ui.value);
				}.bind(this)
			});
			$(".slider_rotate_info").slider({
				value:50,
				slide: function( event, ui ) {
					this.slider_rotate_info(ui.value);
				}.bind(this)
			});
			
			this.setViewSelectedOnRend();
			this.setShowingWhat();
			this.photobook_set_default_or_not_documentsize();
			if(this.model.get("parentvisibility") != "editpublic" && this.model.get("parentvisibility") != "editprivate"){}else{
				startListingOnAll();
			}
			$(".slider_button_right").click(function(){
				var now = parseInt($(".slider_info_data").text());
				now = now-50+2;
				sliderr.slider( "value", now );
				this.changeZoomingCount(now);
			}.bind(this));
			$(".slider_button_left").click(function(){
				var now = parseInt($(".slider_info_data").text());
				now = now-50-2;
				sliderr.slider( "value", now );
				this.changeZoomingCount(now);
			}.bind(this));
			var sliderr = $(".slider_zoom").slider({
				value:50,
				slide: function( event, ui ) {
					var now = parseInt($(".slider_info_data").text());
					this.changeZoomingCount(ui.value);
				}.bind(this)
			});
			setTimeout(function(){
				renderDraggable();
				createGrid(".grid", 400, 400, 10, 20);
			}.bind(this), 10);
		},
		onClickButton: function(e){
			var datasHow = e.currentTarget.getAttribute('data-show');
			if(datasHow !== "Save"){
				this.showWhat(datasHow);
				$(e.currentTarget).addClass("photobook_top_button_selected");
				$(e.currentTarget).addClass("innerIconsColorBackground");
			}else{
				this.saveDataForViews(e);
			}
		},
		setShowingWhat: function(){
			var showing_of_in_now = this.model.get("photobook_showing_now");
			if(typeof showing_of_in_now !== "undefined" && showing_of_in_now !== ""){
				this.showWhat(showing_of_in_now);
				$(".photobook_top_button_data_here"+showing_of_in_now).addClass("photobook_top_button_selected");
				$(".photobook_top_button_data_here"+showing_of_in_now).addClass("innerIconsColorBackground");
			}
		},
		showWhat: function(datasHow){
			$("#photobook_home_container").hide();
			$("#navigation_main").hide();
			$("#photobook_images_container").hide();
			$("#photobook_views_container").hide();
			$("#photobook_layouts_container").hide();
			$("#photobook_documentsizes_container").hide();
			$("#photobook_printed_container").hide();
			$("#photobook_generalOne_container").hide();
			$("#photobook_textOne_container").hide();
			$("#photobook_imageOne_container").hide();
			
			$(".photobook_top_button_selected").removeClass("innerIconsColorBackground");
			$(".photobook_top_button_selected").removeClass("photobook_top_button_selected");
			
			if(datasHow === "Documentsize"){
				this.model.set("photobook_showing_now","Documentsize");
				$("#photobook_documentsizes_container").show();
			}
			if(datasHow === "Layouts"){
				this.model.set("photobook_showing_now","Layouts");
				$("#photobook_layouts_container").show();
			}
			if(datasHow === "Navigation"){
				this.model.set("photobook_showing_now","Home");
				$("#navigation_main").show();
			}
			if(datasHow === "Getprinted"){
				this.model.set("photobook_showing_now","Getprinted");
				$("#photobook_printed_container").show();
			}
			if(datasHow === "Views"){
				this.model.set("photobook_showing_now","Views");
				$("#photobook_views_container").show();
			}
			if(datasHow === "Images"){
				this.model.set("photobook_showing_now","Images");
				$("#photobook_images_container").show();
			}
			if(datasHow === "TextOne"){
				this.model.set("photobook_showing_now","Home");
				$("#photobook_textOne_container").show();
			}
			if(datasHow === "GeneralOne"){
				this.model.set("photobook_showing_now","Home");
				$("#photobook_generalOne_container").show();
			}
			if(datasHow === "ImageOne"){
				this.model.set("photobook_showing_now","Home");
				$("#photobook_imageOne_container").show();
			}
			if(datasHow === "Home"){
				this.model.set("photobook_showing_now","Home");
				$("#photobook_home_container").show();
			}
		},
		setModel: function(model){
			views.setModel(model);
			this.model = model;
		},
		ColorLuminance: function(hex, lum) {

			// validate hex string
			hex = String(hex).replace(/[^0-9a-f]/gi, '');
			if (hex.length < 6) {
				hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
			}
			lum = lum || 0;

			// convert to decimal and change luminosity
			var rgb = "#", c, i;
			for (i = 0; i < 3; i++) {
				c = parseInt(hex.substr(i*2,2), 16);
				c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
				rgb += ("00"+c).substr(c.length);
			}

			return rgb;
		},
		css_custom: function(){
			var innerIconsColor = app.getSettingInWhole("innerIconsColor");
			var outerIconsColor = app.getSettingInWhole("outerIconsColor");
			var textbackgroundcolor = app.getSettingInWhole("textbackgroundcolor");
			var use_defined_style = app.getSettingInWhole("use_defined_style");

			if(use_defined_style != "" && use_defined_style == "true"){}else{
				textbackgroundcolor = app.getDefaulttextbackgroundcolor();
				outerIconsColor = app.getDefaultouterIconsColor();
				innerIconsColor = app.getDefaultInnerIconsColor();
			}
			var display_navig = "display:none;";
			var he_can_add = true;
			if(this.model.get("parentvisibility") != "editpublic" && this.model.get("parentvisibility") != "editprivate"){
				he_can_add = false;
				//display_navig = "";
			}
			//outerIconsColor = this.ColorLuminance(outerIconsColor,0.9);
			var css = '<link rel="stylesheet" href="/external/jquery-ui.css">';//<link type="text/css" href="/external/jquery.jscrollpane.css" rel="stylesheet" media="all" />
			css += "<style>table{border-collapse:collapse;}";
			css += ".slider_button{ outline:none; border:none; background:none; text-align:center; width:50px; padding-right:10px;  color:white; display:inline-block; position:relative; top: 4px; }";
			css += ".dropped .ui-resizable-handle{ display:none!important; }";
			css += ".droppedSelected .ui-resizable-handle{ display:block!important; }";
			css += ".slider_button .glyphicon{ position:relative; top: 4px; }";
			css += ".slider_info{ width:50px; padding-right:10px;  color:white; display:inline-block; position:relative; top: 4px; }";
			css += ".slider_zoom{ display:inline-block;  width:150px; height:5px; margin-top:13px; }";
			css += ".zooming_all_cont_info{ position:relative; top:-4px;  }";
			css += ".zoom_container_in{ width:400px;  margin-left:auto;  }";
			css += ".ui-slider-handle{     margin-top: -3px; }";
			css += ".ui-state-focus{  background:#ccc!important; border:none!important; outline:none; }";
			
			css += ".photobook_text_edit{ text-align:left; white-space: pre-wrap; padding:0px; margin:0px; width:100%!important; height:100%!important; background:none; }";
			css += ".page_size_30x30_disabled{ overflow:hidden; position:relative; width:500px; height:500px; background:#ccc;  }";
			css += ".page_size_30x30{ overflow:hidden; position:relative; width:500px; height:500px; background:white;  }";
			css += ".page_size_7x9{ overflow:hidden; position:relative; width:292px; height:375px; background:white;  }";
			css += ".page_size_8x8{ overflow:hidden; position:relative; width:333.3px; height:333.3px; background:white;  }";
			css += ".page_size_8x10{ overflow:hidden; position:relative; width:333.3px; height:416.6px; background:white;  }";
			css += ".page_size_ax3{ overflow:hidden; position:relative; width:477.6px; height:706.6px; background:white;  }";
			css += ".page_size_ax4{ overflow:hidden; position:relative; width:353.3px; height:477.6px; background:white;  }";
			css += ".page_size_ax6{ overflow:hidden; position:relative; width:176.65px; height:238.3px; background:white;  }";
			css += ".page_size_10x10{ overflow:hidden; position:relative; width:416.6px; height:416.6px; background:white;  }";
			css += ".page_size_14x11{ overflow:hidden; position:relative; width:583.3px; height:458.3px; background:white;  }";
			css += ".page_left_margin{ margin-left:auto; margin-top:20px; margin-right:5px; }";
			css += ".photobook_main_view_inner_page2 .page_left_margin{ margin-left:0px; margin-right:auto; margin-top:20px;  }";
			css += "text{ cursor:move; }";
			
			css += ".photobook_main_view_inner_page2{ display:inline-block; width:50%;  height:100%; }";
			css += ".photobook_main_view_inner_page1{ position:relative; display:inline-block; width:50%;  height:100%; }";
			css += ".photobook_main_view_inner{ overflow-y:auto; width:100%; height:100%; }";
			css += ".photobook_main_view_inner_whole{ width:1220px; height:100%; margin:auto; }";
			
			css += "#navigation_main{  z-index: 555; position: absolute; top:105px; color: white; "+display_navig+" } #navigation_main a{ color:white; }";
			css += ".photobook_top_top_body{ height:66px; padding-left:10px; margin-top:3px; }";
			css += ".photobook_top_top_body img{ max-height:60px; max-width:60px; line-height:60px; vertical-align:middle; margin-left:5px; margin-right:5px; }";
			css += ".photobook_top_body_button_container{ display:inline-block; }";
			css += ".photobook_top_top_buttons{ padding-left:10px; background:white; border-bottom:1px solid #ccc;  }";
			css += ".photobook_top_button:hover{			}";
			css += ".photobook_top_button{ margin-top:2px; margin-left:2px; font-size:14px; background:"+outerIconsColor+"; color:"+innerIconsColor+"; outline:none; border:none; padding:5px; padding-left:15px; padding-right:15px;   }";
			css += ".photobook_top_button_color_pink{ background:pink;   }";
			css += ".photobook_top_body_button{ margin-top:2px; margin-left:2px; font-size:14px; background:rgba(0,0,0,0.0); outline:none; border:none; padding:5px; padding-left:15px; padding-right:15px; min-height:39px;   }";
			css += ".photobook_top_body_bottom_text{ text-align:center; font-size:13px;  }";
			css += ".photobook_top_button_selected{ position:relative; bottom:-1px;  border-top:1px solid #ccc; border-left:1px solid #ccc; border-right:1px solid #ccc; color:"+innerIconsColor+"; }";
			css += ".photobook_all_cont{ border:2px solid #000; background:white; }";
			css += ".photobook_left_menu{ position:absolute; left:0px; top:0px; border-top:37px solid violet; width:150px; height:100%; background:pink; z-index:3; }";
			css += ".photobook_top_menu{  width:100%; height:100px; background:"+outerIconsColor+"; position:absolute; z-index:2; top:55px; }";//border-left:150px solid red;
			css += ".photobook_main_view{ width:100%; height:100vh;  position:absolute; top:0px; left:0px; border-bottom:31px solid red; border-top:155px solid rgba(0,0,0,0.0); z-index:1; }";//border-left:150px solid purple;
			
			css += ".photobook_bottom_menu{ width:100%; position:absolute; bottom:0px; height:31px; background:"+outerIconsColor+"; z-index:4; }";
			css += ".photobook_top_body_button_container{ margin-left:3px; position:relative; top:-6px;  }";
			css += "";
			css += '';
			css += ".photobook_existing_images{ width:100%;     border-left: 90px solid rgba(0,0,0,0.0);  position:relative;  display:inline-block; margin-left:0px; overflow:auto; }";
			css += ".photobook_existing_views{ width:100%;     border-left: 90px solid rgba(0,0,0,0.0);  position:relative;  display:inline-block; margin-left:0px; overflow:auto; }";
			css += ".photobook_images_left_button_add{ z-index:999;  position:absolute;  vertical-align: top;     margin-top: 5px; width:90px; display:inline-block; margin-left:0px; }";
			css += ".photobook_text_align_center{ text-align:center; color:white; }";
			css += ".photobook_image_inner_block{ margin:0px; padding:0px; position:relative; }";
			css += ".photobook_images_container_table{ margin:0px; padding:0px; }";
			css += ".photobook_removeImgOne{ background:white; border-radius:50%; font-size:20px; color:red; position:absolute; top:0px; right:4px; cursor:pointer; }";
			css += ".photobook_one_view{ display:inline-block; background:white; border:1px solid #ccc; height: 37px;  width: 83px; cursor:pointer;     margin-top: 4px; margin-right:8px; }";
			css += ".photobook_one_view_left{ display:inline-block; width:40px; height:35px; border-right:1px solid #ccc; }";
			css += ".photobook_one_view_right{ display:inline-block; width:40px; height:35px; border-left:1px solid #ccc; }";
			css += ".photobook_color_white{ color:white;     margin-right: 8px; }";
			css += ".disabled_this_page{ background:#ccc; }";
			css += ".photobook_one_view_page_selected{ background:#F2F2F2; }";
			css += ".photobook_top_general_button{ display:inline-block; }";
			css += ".photobook_top_general_button_inner{ position:relative; top:-2px; }";
			css += ".photobook_top_general_button_inner_drag{ position:relative; top:-2px; }";
			
			css += ".photobook_container_width_overflow_scroll{ width:100%;   position:relative;  display:inline-block; margin-left:0px; overflow:auto; }";
			css += ".photobook_document_container_one_element{ margin-right:10px; display:inline-block; text-align:center; }";
			css += ".photobook_document_size_top{ cursor:pointer; width:50px; height:43px; background-color:white; text-align:center; }";
			css += ".photobook_document_size_top_height{ cursor:pointer; width:50px; height:60px; background-color:white; text-align:center; }";
			css += ".photobook_document_size_top_height:hover{ background:#ccc; }";
			css += ".photobook_document_size_top:hover{ background:#ccc; }";
			css += ".photobook_document_size_selected{ background-color:#ccc; }";
			css += ".photobook_document_size_12x12{ width:50px; height:43px; }";
			css += ".photobook_document_size_bottom{ color:white; font-size:14px; text-align:center; }";
			
			css += "@media screen and (max-width: 740px) {";
				css += ".photobook_main_view{ border-top:170px solid rgba(0,0,0,1.0); }";
				css += ".photobook_top_top_body{ background:#464f58; }";
				css += "#navigation_main{ top:110px; }";
				css += ".meniu_of_whole{ top:-5px; }  ";
			css += "}";
			
			css += "</style>";
			return css;
		},
		get_pages_photobook: function(){
			var pages_all = JSON.parse(this.model.get("photobook_data"));
			return pages_all;
		},
		get_pages_photobook_html: function(){
			var pages_all = JSON.parse(this.model.get("photobook_data"));
			if(pages_all.length === 0){
				var thisViewId = this.addOneViewPhotobook();
				this.setViewSelected(thisViewId);
				pages_all = JSON.parse(this.model.get("photobook_data"));
			}
			var pagesHtml = "<table class='photobook_images_container_table'><tr>";
			 //pagesHtml += "<td class='photobook_image_inner_block'><div class='photobook_one_view'><div class='photobook_one_view_left'></div><div class='photobook_one_view_right'></div></div><div class='photobook_color_white photobook_top_body_bottom_text'>Cover</div></td>";
			 var nr_on_going = 2;
			for(var ii=0; ii < pages_all.length; ii++){
				var good_left = "";
				var good_right = "";
				var text_name_plus_one = nr_on_going+1;
				var text_name = nr_on_going + " - "+text_name_plus_one;
				var removeItAA = "<div view_id='"+pages_all[ii].id+"' data-which_page='"+pages_all[ii].id+"' identity='"+this.model.get("_id")+"' class='photobook_removeImgOne photobook_remove_view_one glyphicon glyphicon-remove-sign'></div>";
				if(ii === 1){
					good_left = "disabled_this_page";
					text_name = "1";
				}
				if(ii === (pages_all.length-1)){
					good_right = "disabled_this_page";
					text_name = nr_on_going;
				}
				if(ii === 0){
					text_name = "Cover";
					removeItAA = "";
					good_right = "";
					good_left = "";
				}
				if(ii !== 0 && ii !== 1){
					nr_on_going = nr_on_going+2;
				}
				pagesHtml += "<td class='photobook_image_inner_block'><div view_id='"+pages_all[ii].id+"' class='on_change_view photobook_one_view photobook_one_view_page"+pages_all[ii].id+"'><div view_id='"+pages_all[ii].id+"' class='photobook_one_view_left "+good_left+"'></div><div view_id='"+pages_all[ii].id+"' class='photobook_one_view_right  "+good_right+"'></div></div><div view_id='"+pages_all[ii].id+"' class='photobook_color_white photobook_top_body_bottom_text'>"+text_name+"</div>"+removeItAA+"</td>";
			}
			pagesHtml += "</tr></table>";
			return pagesHtml;
		},
		get_html_files: function(){
			var filesImg = "";
			if(typeof this.model.get("files") !== "undefined" && typeof this.model.get("files")[0] !== "undefined"){
				var filesThere = this.model.get("files")[0].split(",");
				for(var ii=0; ii < filesThere.length; ii++){
					var srcgetall = filesThere[ii].split(".");
					if(filesThere[ii] !== "" && (srcgetall[srcgetall.length-1] == "jpg" || srcgetall[srcgetall.length-1] == "JPG" ||srcgetall[srcgetall.length-1] == "png" ||srcgetall[srcgetall.length-1] == "PNG")){
						filesImg += "<td class='photobook_image_inner_block'><img onerror='changeImgToLoading(this)' class='draggable_imgs' src='"+config.filesurl+"/files/project_managing_files/"+this.model.get("_id")+"/"+filesThere[ii]+"' alt='' /><div data-file_name='"+filesThere[ii]+"' class='photobook_removeImgOne delete_files_one glyphicon glyphicon-remove-sign'></div></td>";
					}
				}
				if(filesImg !== ""){
					filesImg = "<table class='photobook_images_container_table'><tr>"+filesImg+"</tr></table>";
				}
			}
			return filesImg;
		},
		getDocumentSizesHtmlInner: function(){
			var data = "";
				data += "<div class='photobook_container_width_overflow_scroll'>";
				
				data += "<div class='photobook_document_container_one_element'>";
					data += "<div data-show='7x9' class='photobook_document_size_change photobook_document_size_top photobook_document_size_7x9'>";
					data += "</div>";
					data += "<div class='photobook_document_size_bottom'>7x9</div>";
				data += "</div>";
				
				data += "<div class='photobook_document_container_one_element'>";
					data += "<div data-show='8x8' class='photobook_document_size_change photobook_document_size_top photobook_document_size_8x8'>";
					data += "</div>";
					data += "<div class='photobook_document_size_bottom'>8x8</div>";
				data += "</div>";
				
				data += "<div class='photobook_document_container_one_element'>";
					data += "<div data-show='8x10' class='photobook_document_size_change photobook_document_size_top photobook_document_size_8x10'>";
					data += "</div>";
					data += "<div class='photobook_document_size_bottom'>8x10</div>";
				data += "</div>";				
				
				data += "<div class='photobook_document_container_one_element'>";
					data += "<div data-show='ax3' class='photobook_document_size_change photobook_document_size_top photobook_document_size_ax3'>";
					data += "</div>";
					data += "<div class='photobook_document_size_bottom'>A3</div>";
				data += "</div>";				
				
				data += "<div class='photobook_document_container_one_element'>";
					data += "<div data-show='ax4' class='photobook_document_size_change photobook_document_size_top photobook_document_size_ax4'>";
					data += "</div>";
					data += "<div class='photobook_document_size_bottom'>A4</div>";
				data += "</div>";
				
				data += "<div class='photobook_document_container_one_element'>";
					data += "<div data-show='ax6' class='photobook_document_size_change photobook_document_size_top photobook_document_size_ax6'>";
					data += "</div>";
					data += "<div class='photobook_document_size_bottom'>A6</div>";
				data += "</div>";
				
				data += "<div class='photobook_document_container_one_element'>";
					data += "<div data-show='10x10' class='photobook_document_size_change photobook_document_size_top photobook_document_size_10x10'>";
					data += "</div>";
					data += "<div class='photobook_document_size_bottom'>10x10</div>";
				data += "</div>";
				
				data += "<div class='photobook_document_container_one_element'>";
					data += "<div data-show='12x12' class='photobook_document_size_change photobook_document_size_top photobook_document_size_selected photobook_document_size_12x12'>";
					data += "</div>";
					data += "<div class='photobook_document_size_bottom'>12x12</div>";
				data += "</div>";
				
				data += "<div class='photobook_document_container_one_element'>";
					data += "<div data-show='14x11' class='photobook_document_size_change photobook_document_size_top photobook_document_size_14x11'>";
					data += "</div>";
					data += "<div class='photobook_document_size_bottom'>14x11</div>";
				data += "</div>";
				
				data += "</div>";
			return data;
		},
		getLayoutsHtmlInner: function(){
			var data = "";
				data += "<div class='photobook_container_width_overflow_scroll'>";
				
				data += "<div class='photobook_document_container_one_element'>";
					data += "<div data-show='layout1' class='photobook_document_layout_change photobook_document_size_top photobook_document_size_top_height photobook_margin_right5 photobook_without_backcolor photobook_hover_on_opacity'>";
						data += "<img style='margin:0px;' src='"+config.urlAddr+"/files/layouts/ryts.png' alt='' >";
					data += "</div>";
				data += "</div>";
				
				data += "<div class='photobook_document_container_one_element'>";
					data += "<div data-show='layout2' class='photobook_document_layout_change photobook_document_size_top photobook_document_size_top_height photobook_margin_right5 photobook_without_backcolor photobook_hover_on_opacity'>";
						data += "<img style='margin:0px;' src='"+config.urlAddr+"/files/layouts/knyg.png' alt='' >";
					data += "</div>";
				data += "</div>";
				
				data += "</div>";
			return data;
		},
		innerHtml: function(){
			$("#allTheBottom").hide();
			var html = this.css_custom();
			var filesImg = this.get_html_files();
			var viewsOfItHere = this.get_pages_photobook_html();
				/*html += "<div class='photobook_top_body_button_container'><button data-show='Home' class=' photobook_top_body_button'>"+'<div class="glyphicon glyphicon-font icon-in-menu icon-turn-off" aria-hidden="true"></div>'+"</button><div class='photobook_top_body_bottom_text'>Add text</div></div>";
				html += "<div class='photobook_top_body_button_container'><button data-show='Home' class=' photobook_top_body_button'>"+'<div class="glyphicon glyphicon-picture icon-in-menu icon-turn-off" aria-hidden="true"></div>'+"</button><div class='photobook_top_body_bottom_text'>Add image</div></div>";*/
			
			var imgs_data = '<input type="file" id="fileToUpload" class="FileUploadIt'+this.model.get("_id")+' fileToUploadClient" identity="'+this.model.get("_id")+'" style="display:none;">';
			
			var saveButtonsAllViews = "";//"<div class='saveDataForViews photobook_top_general_button'><div class='photobook_top_general_button_inner photobook_top_body_button_container photobook_text_align_center'><button identity='"+this.model.get("_id")+"' data-show='Save_views' class=' photobook_top_body_button '>"+'<div class="glyphicon glyphicon-ok icon-in-menu icon-turn-off" aria-hidden="true"></div>'+"</button><div class='photobook_top_body_bottom_text'>Save</div></div></div>";
			
			 html += "<div class='photobook_all_container_top'><div id='photobook_trigger_this_for_rerendering' style='display:none;'></div>";
			 html += "<div class='photobook_top_menu  innerIconsColorBackground'>";
				html += "<div class='photobook_top_top_buttons'>";
				var canEditHe = true;
				if(this.model.get("parentvisibility") != "editpublic" && this.model.get("parentvisibility") != "editprivate"){ 			   canEditHe = false;
				}
				if(canEditHe){
					html += "<button data-show='Save' class='photobook_top_button photobook_top_button_data_hereSave'>Save</button>";
				}
				html += "<button data-show='Navigation' class='photobook_top_button photobook_top_button_data_hereNavigation'>Navigation</button>";
				if(canEditHe){
					html += "<button data-show='Home' class=' photobook_top_button photobook_top_button_data_hereHome photobook_top_button_selected innerIconsColorBackground'>Home</button>";
					html += "<button data-show='Images' class='photobook_top_button_data_hereImages photobook_top_button'>Images</button>";
					html += "<button data-show='Views' class=' photobook_top_button photobook_top_button_data_hereViews photobook_top_button_data_hereView'>Views</button>";
					html += "<button data-show='Documentsize' class=' photobook_top_button photobook_top_button_data_hereDocumentsize'>Document size</button>";
					html += "<button data-show='Layouts' class=' photobook_top_button photobook_top_button_data_hereLayouts'>Layouts</button>";
				}
				html += "<button data-show='Getprinted' class=' photobook_top_button photobook_top_button_data_hereGetprinted'>Get Printed version</button>";
				if(canEditHe){
					html += "<button data-show='GeneralOne' style='display:none;' class=' photobook_top_button photobook_top_button_color_pink photobook_top_button_data_hereGeneral'>General</button>";
					//html += "<button data-show='ImageOne' style='display:none;' class=' photobook_top_button photobook_top_button_color_pink photobook_top_button_data_hereImage'>Image</button>";
					html += "<button data-show='TextOne' style='display:none;' class=' photobook_top_button photobook_top_button_color_pink photobook_top_button_data_hereText'>Text</button>";
				}
				html += "</div>";
				html += "<div class='photobook_top_top_body' id='photobook_images_container' style='display:none;'>";
				html += "<div class='photobook_images_left_button_add'><div class='photobook_top_body_button_container photobook_text_align_center'><button identity='"+this.model.get("_id")+"' data-show='Upload_images' class=' photobook_top_body_button projectsUploadFileDialog'>"+'<div class="glyphicon glyphicon-picture icon-in-menu icon-turn-off" aria-hidden="true"></div>'+"</button><div class='photobook_top_body_bottom_text'>Upload image</div></div></div><div class='photobook_existing_images'>";
				html += filesImg;
				html += "</div>"+imgs_data+"</div>";
				
				html += "<div class='photobook_top_top_body' id='photobook_views_container' style='display:none;'>";
				html += "<div class='photobook_images_left_button_add'><div class='photobook_top_body_button_container photobook_text_align_center'><button identity='"+this.model.get("_id")+"' data-show='Add_view_images' class=' photobook_top_body_button photobook_add_view_one'>"+'<div class="glyphicon glyphicon-picture icon-in-menu icon-turn-off" aria-hidden="true"></div>'+"</button><div class='photobook_top_body_bottom_text'>Add view</div></div></div><div class='photobook_existing_views'>";
				html += viewsOfItHere;
				html += "</div></div>";

				
				html += "<div class='projectclass_"+this.model.get("_id")+"'></div>";
				var show_home_there = "style='display:none;'";
				if(canEditHe){
					show_home_there = "";
				}
				html += "<div class='photobook_top_top_body' id='photobook_home_container' "+show_home_there+">";
						html += '<div id="parts">';
						html += '	  <div class="">';
						html += saveButtonsAllViews;
							html += '	  <div class="photobook_top_general_button_inner_drag draggable image_frame_get photobook_top_cust_buttons inlineblock innerIconsColorBackground ">';
								html += '	  <div class="glyphicon glyphicon-picture icon-in-menu icon-turn-off photobook_cust_glyph" aria-hidden="true"></div>';
								html += "	  <div class='photobook_top_body_bottom_text'>Add image</div>";
							html += '	  </div>';
							html += '	  <div class="photobook_top_general_button_inner_drag draggable text_frame_get photobook_top_cust_buttons inlineblock innerIconsColorBackground ">';
								html += '	  <div class="glyphicon glyphicon-font icon-in-menu icon-turn-off photobook_cust_glyph" aria-hidden="true"></div>';
								html += "	  <div class='photobook_top_body_bottom_text'>Add text</div>";
							html += '	  </div>';
						html += '	  </div>';
						html += '	</div>';
				html += "</div>";
				
				html += "<div class='photobook_top_top_body' id='photobook_layouts_container' style='display:none;'>";
						html += this.getLayoutsHtmlInner();
				html += "</div>";
				
				html += "<div class='photobook_top_top_body' id='photobook_documentsizes_container' style='display:none;'>";
						html += this.getDocumentSizesHtmlInner();
				html += "</div>";
				
				html += "<div class='photobook_top_top_body' id='photobook_printed_container' style='display:none;'>";
						html += "<div class='getPDFfile photobook_top_general_button'><div class='photobook_top_general_button_inner photobook_top_body_button_container photobook_text_align_center'><button identity='"+this.model.get("_id")+"' data-show='get_pdf' class=' photobook_top_body_button '>"+'<div class="glyphicon get_pdf_glyph glyphicon-ok icon-in-menu icon-turn-off" aria-hidden="true"></div>'+"</button><div class='photobook_top_body_bottom_text'>Get PDF</div></div></div>";
						html += "<a style='display:none;' download id='photobook_this_pdf_link_one' class='photobook_this_pdf_link_one' href='"+config.filesurl+"/files/project_managing_files/"+this.model.get("_id")+"/html_file"+this.model.get("_id")+".pdf"+"'>PDF</a>";
						/*html += "<div class='CheckPrice photobook_top_general_button'><div class='photobook_top_general_button_inner photobook_top_body_button_container photobook_text_align_center'><button identity='"+this.model.get("_id")+"' data-show='get_pdf' class=' photobook_top_body_button '>"+'<div class="glyphicon get_check_price_glyph glyphicon-ok icon-in-menu icon-turn-off" aria-hidden="true"></div>'+"</button><div class='photobook_top_body_bottom_text'>Check price</div></div></div>";*/
				html += "</div>";
				
				html += "<div class='photobook_top_top_body' id='photobook_generalOne_container' style='display:none;'>";
						html += "<div class='changeDeleteThatElement photobook_top_general_button'><div class='photobook_top_general_button_inner photobook_top_body_button_container photobook_text_align_center'><button identity='"+this.model.get("_id")+"' data-show='elem' class=' photobook_top_body_button '>"+'<div class="glyphicon get_pdf_glyph glyphicon-remove-sign icon-in-menu icon-turn-off" aria-hidden="true"></div>'+"</button><div class='photobook_top_body_bottom_text'>Delete</div></div></div>";
						
						html += "<div class='photobook_top_general_button'><div class='photobook_top_general_button_inner photobook_top_body_button_container photobook_text_align_center'><input type='color' id='background_color_of_general' ><div class='photobook_top_body_bottom_text'>Background color</div></div></div>";
						html += "<div class='photobook_top_general_button'><div class='photobook_top_general_button_inner photobook_top_body_button_container photobook_text_align_center'><div class='slider_of_standart slider_transparency_info'></div><div class='photobook_top_body_bottom_text'>Background transparency</div></div></div>";
						html += "<div class='photobook_top_general_button'><div class='photobook_top_general_button_inner photobook_top_body_button_container photobook_text_align_center'><div class='slider_of_standart slider_transparency_info_opacity'></div><div class='photobook_top_body_bottom_text'>Opacity</div></div></div>";
						html += "<div class='photobook_top_general_button'><div class='photobook_top_general_button_inner photobook_top_body_button_container photobook_text_align_center'><div class='slider_of_standart slider_z_info'></div><div class='photobook_top_body_bottom_text'>Depth</div></div></div>";
						
						html += "<div class='photobook_top_general_button'><div class='photobook_top_general_button_inner photobook_top_body_button_container photobook_text_align_center'><input type='color' id='border_color_of_general' ><div class='photobook_top_body_bottom_text'>Border color</div></div></div>";
						html += "<div class='photobook_top_general_button'><div class='photobook_top_general_button_inner photobook_top_body_button_container photobook_text_align_center'><div class='slider_of_standart slider_border_info'></div><div class='photobook_top_body_bottom_text'>Border size</div></div></div>";
						html += "<div class='photobook_top_general_button'><div class='photobook_top_general_button_inner photobook_top_body_button_container photobook_text_align_center'><div class='slider_of_standart slider_corner_info'></div><div class='photobook_top_body_bottom_text'>Corner size</div></div></div>";
						
						html += "<div class='photobook_top_general_button'><div class='photobook_top_general_button_inner photobook_top_body_button_container photobook_text_align_center'><div class='slider_of_standart slider_rotate_info'></div><div class='photobook_top_body_bottom_text'>Rotation</div></div></div>";
				html += "</div>";
				
				html += "<div class='photobook_top_top_body' id='photobook_textOne_container' style='display:none;'>";
						html += "<div class='changeTextOneText photobook_top_general_button'><div class='photobook_top_general_button_inner photobook_top_body_button_container photobook_text_align_center'><button identity='"+this.model.get("_id")+"' data-show='get_pdf' class=' photobook_top_body_button '>"+'<div class="glyphicon get_pdf_glyph glyphicon-edit icon-in-menu icon-turn-off" aria-hidden="true"></div>'+"</button><div class='photobook_top_body_bottom_text'>Edit text</div></div></div>";
						html += '<div id="myNicPanel"></div>';
				html += "</div>";
				html += "<div class='photobook_top_top_body' id='photobook_imageOne_container' style='display:none;'>";
						html += "<div class='changeTextadaOneText photobook_top_general_button'><div class='photobook_top_general_button_inner photobook_top_body_button_container photobook_text_align_center'><button identity='"+this.model.get("_id")+"' data-show='get_pdf' class=' photobook_top_body_button '>"+'<div class="glyphicon get_pdf_glyph glyphicon-ok icon-in-menu icon-turn-off" aria-hidden="true"></div>'+"</button><div class='photobook_top_body_bottom_text'>Change text</div></div></div>";
				html += "</div>";
				
				
			 html += "</div>";
			 html += "<div class='photobook_main_view textbackgroundcolorBackground'>";
				 html += "<div class='photobook_main_view_inner'>";
					 html += "<div class='photobook_main_view_inner_whole'>";
						 html += "<div class='photobook_main_view_inner_page1'>";
							 html += "<div class='page_size_30x30 page_left_margin'>";
								html += '	<div id="drawzone">';
								html += '	  <div class="grid" data-size="10">';
								html += '	  </div>';
								html += '	  <div class="droppable">';
								html += '	  </div>';
								html += '	</div>';
							 html += "</div>";
						 html += "</div>";
						 html += "<div class='photobook_main_view_inner_page2'>";
							 html += "<div class='page_size_30x30 page_left_margin'>";
								html += '	<div id="drawzone">';
								html += '	  <div class="grid" data-size="10">';
								html += '	  </div>';
								html += '	  <div class="droppable">';
								html += '	  </div>';
								html += '	</div>';
							 html += "</div>";
						 html += "</div>";
					 html += "</div>";
				 html += "</div>";
			 html += "</div>";
			 html += "<div class='photobook_bottom_menu innerIconsColorBackground'>";
				 html += "<div class='container zooming_all_cont_info'>";
					html += "<div class='zoom_container_in'>";
						 html += "<div class='slider_info'>";
						 html += "<span class='slider_info_data'>100</span>%</div>";
						 html += "<button class='slider_button slider_button_left'>"+'<div class="glyphicon glyphicon-minus icon-in-menu icon-turn-off" aria-hidden="true"></div>'+"</button>";
						 html += "<div class='slider_zoom'>";
						 html += "</div>";
						 html += "<button class='slider_button slider_button_right'>"+'<div class="glyphicon glyphicon-plus icon-in-menu icon-turn-off" aria-hidden="true"></div>'+"</button>";
					html += "</div>";
				 html += "</div>";
			 html += "</div>";
			 html += "</div>";
			return html;
		}
	};
});
