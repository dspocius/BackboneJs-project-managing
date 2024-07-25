var fs      = require('fs');
var http = require('http');
var pdf2img = require('pdf2img');
var pdftohtml = require('html-pdf');

exports.index = function(req, res) {
	var pdf_file = req.params.pdf_file || '';
	if (pdf_file == '') {
		return res.status(400).end();
	}
	pdf_file = pdf_file.replace(/;/g,"/");
	pdf_file = "./../public/files/project_managing_files/"+pdf_file;
	Object.keys(require.cache).forEach(function(key) { delete require.cache[key] })
	
	var PDFParser = require("pdf2json/PDFParser");
    var pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", errData => { res.status(500).end(); } );
    pdfParser.on("pdfParser_dataReady", pdfData => {
		res.status(200).json(pdfData);
    });

    pdfParser.loadPDF(pdf_file);
};
exports.createhtmlfileapigo = function(req, res) {
    var project = req.body;

	var gdata = "";
	for (var key in project) {
		gdata = key+"="+project[key];
	}
	
	var mydata = JSON.parse(gdata);
	
	var project_id = mydata.mainID;
	var photobook_data = [mydata];
	
	generategoodhtml(project_id, photobook_data, function (datares) {
		if (datares.success) {
			return res.json({file_name: datares.file_name});	
		} else {
			return res.status(400).end();
		}
	});
};

exports.createhtmlfile = function(req, res) {
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
    if (username == '' || token == ''){
        //return res.status(400).end();
    }
	
    var project = req.body;
	
    if (project == null || project.photobook_data == null || project._id == null) {
        return res.status(400).end();
    }
	
	
	var project_id = project._id;
	var photobook_data = JSON.parse(project.photobook_data);
	
	generategoodhtml(project_id, photobook_data, function (datares) {
		console.log("ASD",datares);
		if (datares.success) {
			return res.status(200).json({file_name: datares.file_name});	
		} else {
			return res.status(400).end();
		}
	});
};

function generategoodhtml(project_id, photobook_data, callback) {
	
	var df_all_the = "<!DOCTYPE html>";
df_all_the += '<html lang="en">';
df_all_the += '<head>';
df_all_the += '	<meta charset="utf-8">';
df_all_the += '	<title>Test</title>';
df_all_the += '	<meta name="viewport" content="width=device-width, initial-scale=1.0">';
df_all_the += '	<meta name="description" content="Test">';
df_all_the += '	<meta name="author" content="Test">';
df_all_the += '	<meta name="msapplication-TileColor" content="#ffffff">';
df_all_the += '	<meta name="theme-color" content="#ffffff">';
df_all_the += '	<style type="text/css">';

df_all_the += '	body, html{';
df_all_the += '		border:none;';
df_all_the += '		outline:none;';
df_all_the += '		margin:0px!important;';
df_all_the += '		padding:0px!important;';
df_all_the += '	} table{ border-collapse:collapse; }';
df_all_the += '	.dropped .draggable_imgs {';
df_all_the += '		position: absolute;';
df_all_the += '		max-width: 100%;';
df_all_the += '		max-height: 100%;';
df_all_the += '		left: 0px;';
df_all_the += '		top: 0px;';
df_all_the += '	}';
	
df_all_the += '.dropped {';
df_all_the += '    ';
df_all_the += '    border: 1px solid #000;';
df_all_the += '    height: 38px;';
df_all_the += '    text-align: center;';
df_all_the += '    width: 38px;';
df_all_the += '}';
df_all_the += '.page_size_30x30 {';
df_all_the += '	zoom: 1.727;';
df_all_the += '    overflow: hidden;';
df_all_the += '    position: relative;';
df_all_the += '    width: 500px;';
df_all_the += '    height: 500px;';
 df_all_the += '   background: white;';
df_all_the += '}';
df_all_the += '.page_size_7x9 {';
df_all_the += '	zoom: 1.727;';
df_all_the += '    overflow: hidden;';
df_all_the += '    position: relative;';
df_all_the += '    width:292px;';
df_all_the += '    height:375px;';
 df_all_the += '   background: white;';
df_all_the += '}';

df_all_the += '.page_size_8x8 {';
df_all_the += '	zoom: 1.727;';
df_all_the += '    overflow: hidden;';
df_all_the += '    position: relative;';
df_all_the += '    width:333.3px;';
df_all_the += '    height:333.3px;';
 df_all_the += '   background: white;';
df_all_the += '}';
df_all_the += '.page_size_8x10 {';
df_all_the += '	zoom: 1.727;';
df_all_the += '    overflow: hidden;';
df_all_the += '    position: relative;';
df_all_the += '    width:333.3px;';
df_all_the += '    height:416.6px;';
 df_all_the += '   background: white;';
df_all_the += '}';
df_all_the += '.page_size_ax4 {';
df_all_the += '	zoom: 1.727;';
df_all_the += '    overflow: hidden;';
df_all_the += '    position: relative;';
df_all_the += '    width:353.3px; height:487.6px;';
 df_all_the += '   background: white;';
df_all_the += '}';
df_all_the += '.page_size_ax3 {';
df_all_the += '	zoom: 1.727;';
df_all_the += '    overflow: hidden;';
df_all_the += '    position: relative;';
df_all_the += '    width:477.6px; height:706.6px;';
 df_all_the += '   background: white;';
df_all_the += '}';
df_all_the += '.page_size_ax6 {';
df_all_the += '	zoom: 1.727;';
df_all_the += '    overflow: hidden;';
df_all_the += '    position: relative;';
df_all_the += '    width:176.65px; height:238.3px;';
 df_all_the += '   background: white;';
df_all_the += '}';
df_all_the += '.page_size_10x10 {';
df_all_the += '	zoom: 1.727;';
df_all_the += '    overflow: hidden;';
df_all_the += '    position: relative;';
df_all_the += '    width:416.6px;';
df_all_the += '    height:416.6px;';
 df_all_the += '   background: white;';
df_all_the += '}';
df_all_the += '.page_size_12x12 {'; 
df_all_the += '	zoom: 1.727;';
df_all_the += '    overflow: hidden;';
df_all_the += '    position: relative;';
df_all_the += '    width:500px;';
df_all_the += '    height:500px;';
 df_all_the += '   background: white;';
df_all_the += '}';
df_all_the += '.page_size_14x11 {';
df_all_the += '	zoom: 1.727;';
df_all_the += '    overflow: hidden;';
df_all_the += '    position: relative;';
df_all_the += '    width:583.3px;';
df_all_the += '    height:458.3px;';
 df_all_the += '   background: white;';
df_all_the += '}';



df_all_the += '	</style>';
df_all_the += '</head>';
df_all_the += '<body>';
	
	
	
	var htmlOfPhotob = "";
	var pages_all = photobook_data;
		for(var ii=0; ii < pages_all.length; ii++){
			//if(pages_all[ii].id == view_id){
			//	viewSelData = pages_all[ii].id;
				var views_page1 = pages_all[ii].page1;
				var views_page2 = pages_all[ii].page2;
				if(views_page1 !== ""){
					views_page1 = views_page1.replace(/&quot;/g, "'");
					
					if (views_page1.split("https://").length > 1) {
						var getdomhttps = views_page1.split("https://")[1].split("/")[0];
						views_page1 = views_page1.split("https://"+getdomhttps).join("https://f.doingtalk.com");
					}					
					if (views_page1.split("http://").length > 1) {
						var getdomhttp = views_page1.split("http://")[1].split("/")[0];
						views_page1 = views_page1.split("http://"+getdomhttp).join("https://f.doingtalk.com");
					}
					
					htmlOfPhotob += views_page1
				}
				if(views_page2 !== ""){
					views_page2 = views_page2.replace(/&quot;/g, "'");
					
					if (views_page2.split("https://").length > 1) {
						var getdomhttpss = views_page2.split("https://")[1].split("/")[0];
						views_page2 = views_page2.split("https://"+getdomhttpss).join("https://f.doingtalk.com");
					}					
					if (views_page2.split("http://").length > 1) {
						var getdomhttpp = views_page2.split("http://")[1].split("/")[0];
						views_page2 = views_page2.split("http://"+getdomhttpp).join("https://f.doingtalk.com");
					}
					
					htmlOfPhotob += views_page2;
				}
			//}
		}
		df_all_the += htmlOfPhotob;
		df_all_the += '</body>';
		df_all_the += '</html>';//"./public/files/project_managing_files/"
		
try {
    fs.mkdirSync('./../public/files/project_managing_files/'+project_id);
  } catch(e) {
    //if ( e.code != 'EEXIST' ) throw e;
  }
		
	fs.writeFile("./../public/files/project_managing_files/"+project_id+"/html_file"+project_id+".html", df_all_the, function(err) {
		if(err) {
			 callback({success: false});
		} else {
		
		callback({success: true, file_name: "html_file"+project_id+".html"});
		}
	}); 
};



exports.downloadpdfapigo = function(req, res) {
    var project = req.body;

	var gdata = "";
	for (var key in project) {
		gdata = key+""+project[key];
	}
	
	var mydata = JSON.parse(gdata);
	
	var project_id = mydata.mainID || '';
	var project_size = mydata.sizeincm || "30.48cm*30.48cm";
	
	if (project_id == '' || project_size == '') {
		return res.status(400).end();
	}
	
	downloadfilegoload(project_id, project_size, function (datares) {
		return res.status(200).json(datares);
	});
};
exports.download_pdf = function(req, res) {
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
    if (username == '' || token == ''){
       // return res.status(400).end();
    }
	
    var project = req.body;
    if (project == null || project._id == null) {
        return res.status(400).end();
    }
	var project_id = project._id;
	var project_size = project.sizeincm || "30.48cm*30.48cm";
	
	downloadfilegoload(project_id, project_size, function (datares) {
		return res.status(200).json(datares);
	});
};

function downloadfilegoload(project_id, project_size, callback) {
	
	var getsize = project_size.split("*");

	var urlofhtml = "./../public/files/project_managing_files/"+project_id+"/html_file"+project_id+".html";
	//&orientation=portrait&margin=0cm&format="+project_size;
	
	var options = { height: getsize[1], width: getsize[0] };
	
  //"format": "Letter",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
  //"orientation": "portrait", // portrait or landscape
	
 // "height": "10.5in",        // allowed units: mm, cm, in, px
 // "width": "8in",            // allowed units: mm, cm, in, px
	
	var html = fs.readFileSync(urlofhtml, 'utf8');

	pdftohtml.create(html, options).toFile('./../public/files/project_managing_files/'+project_id+'/html_file'+project_id+'.pdf', function(err, ress){
	 callback({ok: "ok", file_name: "html_file"+project_id+".pdf"});
	});

};