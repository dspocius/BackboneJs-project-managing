define([
	'../../../../../app',
	'jquerysvg',
	'nicEdit'
], function( app, jquerysvg, nicEdit ) {
    return {
		setModel: function(model){
			this.model = model;
		},
		OnPhotobook_add_view_one: function(e){
			var identity = e.currentTarget.getAttribute('identity');
			e.stopImmediatePropagation();
			if(this.model.get("_id") == identity){
				e.stopPropagation();
				this.addOneViewPhotobook();
				e.stopPropagation();
			}
		},
		addOneViewPhotobook: function(){
				var pages_all = JSON.parse(this.model.get("photobook_data"));
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
		},
		on_change_view: function(e){
			var view_id = e.currentTarget.getAttribute('view_id');
			if(checkifNeedSaving()){
				var r = confirm("There are pending changes. Do you really want to change view?");
				if (r == true) {
					setNoNeedSavingOnTop();
					this.setViewSelected(view_id);
				}
			}else{
				this.setViewSelected(view_id);
			}
		},
		setViewSelected: function(view_id){
			var viewSelData = "";
			var views_page1 = "";
			var views_page2 = "";
			var pages_all = JSON.parse(this.model.get("photobook_data"));
			for(var ii=0; ii < pages_all.length; ii++){
				if(pages_all[ii].id == view_id){
					viewSelData = pages_all[ii].id;
					views_page1 = pages_all[ii].page1;
					views_page2 = pages_all[ii].page2;
				}
			}
			if(viewSelData !== ""){
				$(".photobook_one_view_page_selected").removeClass("photobook_one_view_page_selected");
				$(".photobook_one_view_page"+view_id).addClass("photobook_one_view_page_selected");
				var getFirstPageClass = $(".photobook_one_view_page"+view_id).find(".photobook_one_view_left").hasClass("disabled_this_page");
				var getSecPageClass = $(".photobook_one_view_page"+view_id).find(".photobook_one_view_right").hasClass("disabled_this_page");
				
				var pagesize = "page_size_30x30";
					var size_doc = this.model.get("photobook_document_size");
					if(typeof size_doc !== "undefined" && size_doc !== ""){
						pagesize = this.photobook_get_class_of_elem(size_doc);
					}
				var defaultHtml = '<div class="'+pagesize+' page_left_margin">	<div id="drawzone">	  <div class="grid" data-size="10">	  </div>	  <div class="droppable ui-droppable">	  </div>	</div></div>';
				if(views_page1 === ""){
					views_page1 = defaultHtml;
				}
				if(views_page2 === ""){
					views_page2 = defaultHtml;
				}
				 $(".photobook_main_view_inner_page1").html(views_page1);
				 $(".photobook_main_view_inner_page2").html(views_page2);

				 if(getFirstPageClass){ $(".photobook_main_view_inner_page1").html("<div class='page_size_30x30_disabled'></div>"); }
				 if(getSecPageClass){ $(".photobook_main_view_inner_page2").html("<div class='page_size_30x30_disabled'></div>"); }
				this.model.set("photobook_view_selected",view_id);
					renderDraggable();
					if(this.model.get("parentvisibility") != "editpublic" && this.model.get("parentvisibility") != "editprivate"){}else{
						startListingOnAll();
					}
			}
		},
		photobook_remove_view_one: function(e){
			e.stopImmediatePropagation();
			var identity = e.currentTarget.getAttribute('identity');
			if(this.model.get("_id") == identity){
				var view_id = e.currentTarget.getAttribute('data-which_page');
				var pages_all = JSON.parse(this.model.get("photobook_data"));
				var newpages_data = [];
				for(var ii=0; ii < pages_all.length; ii++){
					if(pages_all[ii].id != view_id){
						newpages_data.push(pages_all[ii]);
					}
				}
				var save_what = JSON.stringify(newpages_data);
				this.model.set("photobook_data", save_what);
				this.model.save();
			}
		},
		photobook_get_size_of_elem_def: function(){
			var size_doc = this.model.get("photobook_document_size");
			if(typeof size_doc === "undefined" || size_doc === ""){
				size_doc = "12x12";
			}
			return size_doc;
		},
		photobook_get_class_of_elem: function(datashow){
			var elem = "page_size_30x30";
			if(datashow === "7x9"){
				elem = "page_size_7x9";
			}
			if(datashow === "8x8"){
				elem = "page_size_8x8";
			}
			if(datashow === "8x10"){
				elem = "page_size_8x10";
			}			
			if(datashow === "ax4"){
				elem = "page_size_ax4";
			}			
			if(datashow === "ax3"){
				elem = "page_size_ax3";
			}			
			if(datashow === "ax6"){
				elem = "page_size_ax6";
			}
			if(datashow === "10x10"){
				elem = "page_size_10x10";
			}
			if(datashow === "14x11"){
				elem = "page_size_14x11";
			}
			return elem;
		}
	};
});
