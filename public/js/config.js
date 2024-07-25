/*global define */

define(function () {
	'use strict';

	var bottom_html = "<div class='container text_white_color'>";
	bottom_html += "<div>© Copyright 2022 - "+new Date().getFullYear()+".  All Rights Reserved. </div>";
	//bottom_html += "<a href='/#/entry/583c42ca4300de1a056515ff'><b>About</b></a> - <a href='/#/entry/583c42514300de1a056515fa'><b>Information About Cookies</b></a>";
	//bottom_html += " - <a href='/#/entry/583c42044300de1a056515f5'><b>Privacy policy</b></a>";
	//bottom_html += " - <a href='/#/entry/583c41604300de1a056515ee'><b>Third party code</b></a>";
	//bottom_html += " - <a href='/#/entry/583c41dc4300de1a056515f3'><b>Contact us</b></a>";
	//bottom_html += " - <a href='/#Way'><b>Our blog</b></a>";
	bottom_html += "";
	bottom_html += "</div>";
	
	var use_tinymce_editor = true;
	//if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	if (screen.width <=  450) {
		use_tinymce_editor = false;
	}
	let filesurl = 'https://f.doingtalk.com';
	let firstPageUse = "pro";
	let srclogoUseLogin = "../files/loggo.png";
	let srclogoUse = "/files/loggo.png";
	let srclogoUseTop = "/files/loggo.png";
	let firsttextpage = '<span style="font-weight: bold;">MY</span> EMMA <div style="text-align:center; font-size:14px;">My Love</div>';
	let titleText = "EMMA - Project Management";
	let backgroundPhotoSt = "html { background-image: url('files/bmw.jpg'); }";
	let favicongo = "files/brand/logo_ico_new.ico";
	let lang = "";
	if (location.href.indexOf("bendrauju") > -1) {
		lang = "lt";
		firstPageUse = "bendrauju";
		titleText = "Bendrauju";
		firsttextpage = '<span style="font-weight: bold;">Bendrauju:)</span> Bendrauju:) <div style="text-align:center; font-size:14px;">Bendrauju:)</div>';
		srclogoUse = "/files/be.png";
		srclogoUseTop = "/files/be.png";
		srclogoUseLogin = "../files/be.png";
		backgroundPhotoSt = "html { background-image: none;  background: linear-gradient(180deg, #f1f1f1, #f1f1f1); }";
	}	
	if (location.href.indexOf("doingtalk") > -1) {
		titleText = "Doing Talk";
		firstPageUse = "talk";
		firsttextpage = '<span style="font-weight: bold;">Talk:)</span> Talk:) <div style="text-align:center; font-size:14px;">Talk:)</div>';
		srclogoUse = "/files/dtalk.png";
		srclogoUseTop = "/files/dtalk.png";
		srclogoUseLogin = "../files/dtalk.png";
		backgroundPhotoSt = "html { background-image: none; background: linear-gradient(180deg, #f1f1f1, #f1f1f1); }";
	}
	if (location.href.indexOf("ronaldocom") > -1) {
		titleText = "Ronaldo Community Fans";
		firstPageUse = "ronaldo";
		srclogoUse = "/files/rlogo.png";
		srclogoUseTop = "/files/rloggo.png";
		srclogoUseLogin = "../files/rlogo.png";
		backgroundPhotoSt = "html { background-image: url('files/ronaldo.jpg'); }";
		firsttextpage = '<span style="font-weight: bold;">Ronaldo</span> The Best <div style="text-align:center; font-size:14px;">of All Time</div>';
		favicongo = "files/brand/foot.ico";
	}
	if (location.href.indexOf("projisgo") > -1) {
		titleText = "ProjisGo";
		firstPageUse = "projisgo";
		srclogoUse = "/files/proj.png";
		srclogoUseTop = "/files/proj.png";
		srclogoUseLogin = "../files/proj.png";
		backgroundPhotoSt = "html { background-image: url('files/projis.png'); }";
		firsttextpage = '<span style="font-weight: bold;">ProjisGo</span> We Live <div style="text-align:center; font-size:14px;">We Create</div>';
		favicongo = "files/brand/projis.ico";
	}
	var linkk = document.querySelector("link[rel~='icon']");
	if (!linkk) {
		linkk = document.createElement('link');
		linkk.rel = 'icon';
		document.getElementsByTagName('head')[0].appendChild(linkk);
	}
	linkk.href = favicongo;

	
	
	let linkForMainPage = "/#/"+firstPageUse;
	document.getElementById("stylingBackgroundGo").innerHTML = backgroundPhotoSt;
	document.getElementById("just_on_the_start_loading_ok_innergo").innerHTML = firsttextpage;
	if (document.getElementById("mainlogofallpagesSec")) {
		document.getElementById("mainlogofallpagesSec").src = srclogoUseTop;
		document.getElementById("mainlogofallpagesSecLink").href = linkForMainPage;
	}
	if (document.getElementById("mainlogofallpages")) {
		document.getElementById("mainlogofallpages").innerHTML = titleText;
		document.getElementById("mainlogofallpagesLink").href = linkForMainPage;
	}
	
	return {
		lang: lang,
		filesurl: filesurl,
		titleText: titleText,
		desc: titleText,
		srclogo: srclogoUse,
		srclogoUseLogin: srclogoUseLogin,
		urlAddr: window.location.protocol+'//'+window.location.host,
        firstPage: firstPageUse,
        letRegister: true,
        letLogin: true,
        showBottom: false,
        for_every_logged_in: false,
        let_add_html_data: true,
        let_add_html_data_title: false,
        use_tinymce_editor: use_tinymce_editor,
		addBottomHtml:bottom_html
	};
});

