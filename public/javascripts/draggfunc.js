/*
    var selectedElement = 0;
    var currentX = 0;
    var currentY = 0;
    var currentMatrix = 0;

    function selectElement(evt) {
      selectedElement = evt.target;
      currentX = evt.clientX;
      currentY = evt.clientY;
      currentMatrix = selectedElement.getAttributeNS(null, "transform").slice(7,-1).split(' ');
    
      for(var i=0; i<currentMatrix.length; i++) {
        currentMatrix[i] = parseFloat(currentMatrix[i]);
      }
      
      selectedElement.setAttributeNS(null, "onmousemove", "moveElement(evt)");
      selectedElement.setAttributeNS(null, "onmouseout", "deselectElement(evt)");
      selectedElement.setAttributeNS(null, "onmouseup", "deselectElement(evt)");
	  selectedElement.setAttributeNS(null, 'mousedown', "mouseDownElement(evt)");
    }
        
    function mouseDownElement(evt) {
		e.preventDefault();
	}
    function moveElement(evt) {
      var dx = evt.clientX - currentX;
      var dy = evt.clientY - currentY;
      currentMatrix[4] += dx;
      currentMatrix[5] += dy;
      
      selectedElement.setAttributeNS(null, "transform", "matrix(" + currentMatrix.join(' ') + ")");
      currentX = evt.clientX;
      currentY = evt.clientY;
    }
        
    function deselectElement(evt) {
      if(selectedElement != 0){
          selectedElement.removeAttributeNS(null, "onmousemove");
          selectedElement.removeAttributeNS(null, "onmouseout");
          selectedElement.removeAttributeNS(null, "onmouseup");
          selectedElement = 0;
          }
    }
	<text transform="matrix(1 0 0 1 263 144)" onmousedown="selectElement(evt)" fill="#000" font-size="45" font-family="Verdana">SVG</text>
*/ 

function changeImgToLoading(et){
	et.src = '/files/loading.gif';
}

var myGridContent = [];
var dropSnap = true;

function createGrid(t, w, h, s, g) {
  /*
  t - Target Element: OBJ
  w - Grid Width: PX
  h - Grid Height: PX
  s - Grid Size: PX
  g - Gutter Size: INT
  */
  g = (g !== null ? g : false);
 /* var ratio = {
    w: Math.floor(w / s),
    h: Math.floor(h / s)
  };
  console.log(ratio);*/
  
/*
  var parent = $(t);
  if (!parent.hasClass("grid")) {
    parent.addClass("grid");
  }
  if (g) {
    g = (parseInt(g) === g ? g : s);
    parent.css({
      width: w + "px",
      height: h + "px",
      top: g + "px",
      left: g + "px"
    });
    $(".droppable").css({
      width: w + "px",
      height: h + "px",
      top: g + "px",
      left: g + "px"
    })
  }
  var gridCells = [];
*/


  /*for (var i = 0; i < ratio.h; i++) {
    for (var p = 0; p < ratio.w; p++) {
      gridCells.push('<div style="width:', (s - 1), 'px;height:', (s - 1), 'px;" data-row="' + i + '" data-col="' + p + '"></div>');
    }
  }
  parent.html(gridCells.join(""));*/
}

function renderDraggable() {

$(function() {
  $(".draggable_imgs").draggable({
	  cursor: "move",
	  scroll: false,
    start: function(){
        $(".photobook_existing_images").css("overflow","visible");      
    },
    stop: function(){
        $(".photobook_existing_images").css("overflow","auto");   
    },
	  //containment: ".dropped",
	  //appendTo: ".image_frame",
	  helper: 'clone'
  });
  removeListeningOnImgJust();
  $(".draggable").draggable({
    helper: 'clone',
    cursor: "move",
    //containment: ".droppable",
    zIndex: 1001
    //appendTo: ".droppable"
  });
  $(".droppable").droppable({
      accept: ".draggable",
      drop: function(e, ui) {
		var droppableAddTo = $(this);
		setNeedSavingOnTop();
		
        //var pos = ui.position;
        var pos = {top:0, left:0};
        var $obj = ui.helper.clone();
		
        var c = $(".dropped").length;
		c = getOngoingIdNumber();
		
		$obj.removeClass("innerIconsColorBackground");
		if($obj.hasClass("image_frame_get")){
			$obj.removeClass("image_frame_get");
			$obj.addClass("image_frame");
		}
		if($obj.hasClass("text_frame_get")){
			$obj.removeClass("text_frame_get");
			$obj.addClass("text_frame");
		}
        $obj.removeClass("photobook_top_cust_buttons");
        $obj.removeClass("draggable");
        $obj.addClass("dropped");
        if (dropSnap) {
          pos.top = Math.round(pos.top / 10) * 10;
          pos.left = Math.round(pos.left / 10) * 10;
        }
        $obj.css({
          position: 'absolute',
          top: pos.top + "px",
          left: pos.left + "px"
        });
        c++;
			$obj.html("");
			addEverytingToObj($obj);
		$obj.data("obj", {
        id: c,
        label: $obj.text(),
        top: pos.top,
        left: pos.left,
        width: $obj.width(),
        height: $obj.height(),
        layer: $obj.zIndex() - 1000
      });
	  $obj.appendTo(droppableAddTo);
				if($obj.hasClass("text_frame")){
					$obj.append("<div class='text_this_one' id='text_this_one"+c+"'>Text</div>");
					try{
						window.myNicEditor.addInstance("text_this_one"+c);
					}catch(err){}
				}
	  myGridContent.push({
        id: c,
        l: pos.left,
        t: pos.top,
        w: $obj.width(),
        h: $obj.height(),
        bg: $obj.css("background-color")
      });
    }
  }); 
  
  $(".droppable").click(function(e) {
  if (!$(e.target).hasClass("dropped")) {
    $(".selected")
      .removeClass("selected")
      .draggable("destroy")
      .resizable("destroy");
  }
}); 
$(document).keyup(function(e) {
  if ($(".selected").length) {
    var $obj = $(".selected");
    var bump = $(".grid").data("size");
    console.log(e.keyCode);
    switch (e.keyCode) {
      case 38:
        // Up
        if ($obj.position().top >= bump) {
          $obj.css("top", $obj.position().top - bump);
        }
        break;
      case 40:
        // Down
        if ($obj.position().top + $obj.height() <= $(".droppable").height() - bump) {
          $obj.css("top", $obj.position().top + bump);
        }
        break;
      case 37:
        // left
        if ($obj.position().left >= bump) {
          $obj.css("left", $obj.position().left - bump);
        }
        break;
      case 39:
        // Right
        if ($obj.position().left + $obj.width() <= $(".droppable").width() - bump) {
          $obj.css("left", $obj.position().left + bump);
        }
        break;
      case 46:
        // Del
        $obj.remove();
    }
  }
});
});

}
function addListeningOnNicEditor($obj){
						var textThisOne = $obj.find(".text_this_one");
						//textThisOne.removeAttr("contenteditable");
						if(typeof textThisOne !== "undefined" && typeof textThisOne.attr("id") !== "undefined" && textThisOne.attr("id") !== "" && typeof window.myNicEditor !== "undefined"){
							var textThisOn = textThisOne.attr("id");
							try{
								//window.myNicEditor.removeInstance(textThisOn);
								//if(in_already_added_instance.indexOf(textThisOn) === -1){
									window.myNicEditor.addInstance(textThisOn);
								//}
							}catch(err){console.log(err);}
						}
}
function addEverytingToObj($obj, notnew){
			if($obj.hasClass("image_frame")){
				window.olderOnes = [];
				$obj.droppable({
					accept: ".draggable_imgs",
					drop: function(e, ui) {
						setNeedSavingOnTop();
						
						var currTop = "";
						var zindcurr = 0;
						for(var ii=0; ii < window.olderOnes.length; ii++){
							var zinde = parseInt($(window.olderOnes[ii]).css("z-index"));
							if(zinde > zindcurr){
								zindcurr = zinde;
								currTop = window.olderOnes[ii];
							}
						}
						if(currTop == this || currTop == ""){
							e.stopImmediatePropagation();
							e.stopPropagation();
							var $objj = ui.helper.clone();
							var thisHtm = $objj.context.outerHTML;
							var immmgs = $objj.attr("src");
							$obj.css("background-image","url('"+immmgs+"')");
							$obj.css("background-repeat","no-repeat");
							$obj.css("background-size","contain");
							$obj.find("img").remove();
							setTimeout(function(){
								window.olderOnes = [];
							}, 100);
						}
					},
					over: function(event, ui){
						window.olderOnes.push(this);
					},
					out: function(){
						var newList = [];
						for(var ii=0; ii < window.olderOnes.length; ii++){
							if(window.olderOnes[ii] != this){
								newList.push(window.olderOnes[ii]);
							}
						}
						window.olderOnes = newList;
					}
				});
			}
        //$obj.click(function(e) {
            //$(".selected").removeClass("selected");
            var self = $obj;//$(this);
           // self.addClass("selected");
            self.draggable({
				start: function(){
					$(".droppedSelected").removeClass("droppedSelected");
					$(this).addClass("droppedSelected");
					changeShowingOfTopmenu($obj);
				},
				stop: function(){
					setNeedSavingOnTop();
				}
              //containment: 'parent',
              //grid: [$(".grid").data("size"), $(".grid").data("size")]
            });
            self.click(function(){
					$(".droppedSelected").removeClass("droppedSelected");
					$(this).addClass("droppedSelected");
					
					changeShowingOfTopmenu($obj);
					
			});
            self.resizable({
                handles: "ne, nw, se, sw, n, e, s, w",
                grid: $(".grid").data("size"),
                ghost: true,
                stop: function(e, ui) {
					setNeedSavingOnTop();
                }
            }); 
			//console.log(self.data());
        //});
}

function changeShowingOfTopmenu($obj){
					$(".photobook_top_button_data_hereImage").hide();
					$(".photobook_top_button_data_hereText").hide();
					$(".photobook_top_button_data_hereGeneral").hide();
					$("#photobook_textOne_container").hide();
					$("#photobook_imageOne_container").hide();
					$("#photobook_generalOne_container").hide();
					
					if($obj.hasClass("image_frame")){
						if($(".photobook_top_button_data_hereImage").hasClass("photobook_top_button_selected")){
							$("#photobook_home_container").hide();
							$("#photobook_imageOne_container").show();  
						}
						if($(".photobook_top_button_data_hereText").hasClass("photobook_top_button_selected")){
							$(".photobook_top_button_data_hereHome").trigger("click");
						}
						$(".photobook_top_button_data_hereImage").show(); 
					}
					if($obj.hasClass("text_frame")){
						if($(".photobook_top_button_data_hereText").hasClass("photobook_top_button_selected")){
							$("#photobook_home_container").hide();
							$("#photobook_textOne_container").show();  
						}
						if($(".photobook_top_button_data_hereImage").hasClass("photobook_top_button_selected")){
							$(".photobook_top_button_data_hereHome").trigger("click");
						}
						$(".photobook_top_button_data_hereText").show(); 
					}
						var dsel = $(".droppedSelected");
						var dbackgroundop = dsel.css("background-color");
						var background_vall = "#000000";
						if(dbackgroundop.indexOf("rgb") > -1){
							var gett_opac = dbackgroundop.split(")")[0].split(",");
							var first_rgb = parseInt(gett_opac[0].split("(")[1]);
							var sec_rgb = parseInt(gett_opac[1]);
							var th_rgb = parseInt(gett_opac[2]);
							background_vall = rgbToHex(first_rgb, sec_rgb, th_rgb);
						}
					
						$("#background_color_of_general").val(background_vall);
						var background_opac = 100;
						if(dbackgroundop.indexOf("rgba") > -1){
							var get_opac = dbackgroundop.split(")")[0].split(",")[3];
							background_opac = parseFloat(get_opac)*100;
						}
						var borderColor = dsel.css("border-color");
						var borderColor_vall = "#000000";
						if(borderColor.indexOf("rgb") > -1){
							var gett_opac_bord = borderColor.split(")")[0].split(",");
							var first_rgb_bord = parseInt(gett_opac_bord[0].split("(")[1]);
							var sec_rgb_bord = parseInt(gett_opac_bord[1]);
							var th_rgb_bord = parseInt(gett_opac_bord[2]);
							borderColor_vall = rgbToHex(first_rgb_bord, sec_rgb_bord, th_rgb_bord);
						}
						$("#border_color_of_general").val(borderColor_vall);
						var borderWidt = parseInt(dsel.css("border-width").replace("px",""));
						var borderRadius = parseInt(dsel.css("border-radius").replace("px",""));
						var rot_deg = getRotationDegrees(dsel);
						var val_rotate = (rot_deg*100)/360;
						$(".slider_border_info").slider( "value", borderWidt );
						$(".slider_corner_info").slider( "value", borderRadius );
						$(".slider_rotate_info").slider( "value", val_rotate );
						
						
						$(".slider_transparency_info").slider( "value", background_opac );
						var s_info_slider = parseFloat(dsel.css("opacity"))*100;
						$(".slider_transparency_info_opacity").slider( "value", s_info_slider );
						var z_info_slider = 1051-parseInt(dsel.css("z-index"));
						$(".slider_z_info").slider( "value", z_info_slider );
					if($obj.hasClass("text_frame")){
						var texthh = $(".changeTextOneText").find(".photobook_top_body_bottom_text").html();
						if(dsel.hasClass("ui-draggable-handle")){
							if(texthh !== "Edit text"){
								$(".changeTextOneText").trigger("click");
							}
						}else{
							if(texthh === "Edit text"){
								$(".changeTextOneText").trigger("click");
							}
						}
					}
					
					if($(".photobook_top_button_data_hereGeneral").hasClass("photobook_top_button_selected")){ 
						$("#photobook_home_container").hide(); 
						$("#photobook_generalOne_container").show();  
					}
					$(".photobook_top_button_data_hereGeneral").show(); 
}

function removeListeningOnImgJust(){
	$(".dropped img").each(function() {
		var obj = $(this);
		try{
			obj.draggable( "destroy" );
		}catch(err){}
	});
}
function getOngoingIdNumber(){
	var c = $(".dropped").length;
	$(".dropped").each(function() {
		var obj = $(this);
		if(obj.hasClass("text_frame")){
			var textThisOne = obj.find(".text_this_one");
			if(typeof textThisOne.attr("id") !== "undefined" && textThisOne.attr("id") !== ""){
				var textidOfNumb = parseInt(textThisOne.attr("id").replace("text_this_one",""));
				if(c < textidOfNumb){
					c = textidOfNumb;
				}
			}
		}
	});
	c = c+1;
	return c;
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function removeListingOnAll(){
	$(".dropped").each(function() {
		var obj = $(this);
		if(obj.hasClass("text_frame")){
			var textThisOne = obj.find(".text_this_one");
			if(typeof textThisOne.attr("id") !== "undefined" && textThisOne.attr("id") !== "" && typeof window.myNicEditor !== "undefined"){
				var textThisOn = textThisOne.attr("id");
				try{
					//window.myNicEditor.removeInstance(textThisOn);
				}catch(err){}
			}
		}
		try{
			obj.draggable();
			obj.resizable();
			obj.draggable( "destroy" );
			obj.resizable( "destroy" );
		}catch(err){}
	});
}
function startListingOnAllForNicEditor(){
	$(".dropped").each(function() {
		var obj = $(this);
		addListeningOnNicEditor(obj);
	});
}
function startListingOnAll(){
	$(".dropped").each(function() {
		var obj = $(this);
		addEverytingToObj(obj, "false");
	});
}
function changeWindHref(url) {
  location.href = url;
}
function whenMouseOnOtherThanElement(){
				if($(".photobook_top_button_data_hereGeneral").hasClass("photobook_top_button_selected") || $(".photobook_top_button_data_hereText").hasClass("photobook_top_button_selected") || $(".photobook_top_button_data_hereImage").hasClass("photobook_top_button_selected")){
					$(".droppedSelected").removeClass("droppedSelected");
					$(".photobook_top_button_data_hereImage").hide();
					$(".photobook_top_button_data_hereText").hide();
					$(".photobook_top_button_data_hereGeneral").hide();
					$("#photobook_textOne_container").hide();
					$("#photobook_imageOne_container").hide();
					$("#photobook_generalOne_container").hide();
					$(".photobook_top_button_data_hereHome").trigger("click");
				}
}
function getRotationDegrees(obj) {
    var matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform")    ||
    obj.css("-ms-transform")     ||
    obj.css("-o-transform")      ||
    obj.css("transform");
    if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }
    return (angle < 0) ? angle + 360 : angle;
}
function checkifNeedSaving(){
	if($(".photobook_top_button_data_hereSave").text() == "* Save"){
		return true;
	}
	return false;
}
function setNeedSavingOnTop(){
	$(".photobook_top_button_data_hereSave").text("* Save");
	$(".photobook_top_button_data_hereSave").addClass("photobook_top_button_color_pink");
}
function setNoNeedSavingOnTop(){
	$(".photobook_top_button_data_hereSave").text("Save");
	$(".photobook_top_button_data_hereSave").removeClass("photobook_top_button_color_pink");
}
$(document).mouseup(function (e)
{
    var container = $(".dropped");
    var containerOtherimg = $(".photobook_top_menu");

    if (!container.is(e.target)
        && container.has(e.target).length === 0)
    {
		if (!containerOtherimg.is(e.target)
			&& containerOtherimg.has(e.target).length === 0)
		{
			//whenMouseOnOtherThanElement();
		}
    }
});