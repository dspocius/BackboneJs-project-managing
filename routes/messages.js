var http = require('http');
var fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');
const filesurl = "https://f.doingtalk.com";

exports.index = function(req, res) {
	res.render('index');
};

exports.messages = function(req, res) {
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
    if (username == '' || token == ''){
        return res.status(400).end();
    }
	
	var id = req.params.id || '';
	var s_id = req.params.s_id || '';
	var skip = req.params.skip || 0;
    if (id == '' || s_id == ''){
        return res.status(400).end();
    }

    var options = {
        host: '127.0.0.1',
        path: '/messages/'+id+'/'+s_id+'/'+skip,
        port: '3002',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token
        }
    };

    var reqq = http.request(options, function(response) {
        var str = '';
        response.on('data', function (data) {
            str += data;
        });

        response.on('end', function () {
            if(str == "Unauthorized" || str == "Bad Request" || str == "Internal Server Error"){
                return res.status(400).end();
            }else{
                return res.status(200).json(JSON.parse(str));
            }

        });
    });

    reqq.end();

};

exports.message = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}
	
	var id = req.body.id || '';
	var message = req.body.message || '';

	if (id == '' || message == '') {
		return res.status(400).end();
	}
	
	var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var hours = today.getHours();
    var minutes = today.getMinutes();

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    }
    if(mm<10){
        mm='0'+mm
    }
	if(minutes<10){
        minutes='0'+minutes
    }
    var today = yyyy+' '+mm+' '+dd+' '+hours+':'+minutes;

			var jsonTObj = '{"from":"'+ message.from+'","message":"'+ encodeURIComponent(message.message)+'","date":"'+today+'","files":"'+message.files+'"}';

  var post_data = '{"id": "'+id+'", "message": '+jsonTObj+'}';

var options = {
  host: '127.0.0.1',
  path: '/message',
  port: '3002',
  method: 'POST',
  headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(post_data),
		'Authorization': 'Bearer '+token
  }
};

var reqq = http.request(options, function(response) {
  var str = '';
  response.on('data', function (data) {
		str += data;
  });

  response.on('end', function () {
		if(str != "OK"){
			return res.status(400).end();
		}else{
			return res.status(200).end();
		}

  });
});

reqq.write(post_data);
reqq.end();

};
function uploadImageMsg(imageBuffer, filenameuse, mimeType, project) {
  const form = new FormData();
  form.append('file', imageBuffer, {
    contentType: mimeType,
    filename: filenameuse
  });
  form.append("project",project);
  form.append("name",filenameuse);
  return fetch(filesurl+`/messages_file_upload`, { method: 'POST', body: form });
};
exports.message_fileupload = function(req, res) {

	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}

	var str;
    var fstream;
	var filenameuse = "";
	var mimeType = "";
	var project = [];
    req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
       project[fieldname] = val;
    });
	var rawBody = new Buffer('');
    req.busboy.on('file',function(fieldname, file, filename, encoding, mimetype){
		filenameuse = filename.filename;
		mimeType = filename.mimeType;
        file.on('data',function(data){
			rawBody = Buffer.concat([rawBody, data]);
        });

        file.on('end', function(){
    	});
     });

	req.busboy.on('finish', function() {
		uploadImageMsg(rawBody,filenameuse,mimeType, project['project']).then((res) => res.json()).then((reqstr) => {
			reqstr.filepath = filesurl+reqstr.filepath;
			res.status(200).json(reqstr);
		});
    });

req.pipe(req.busboy);

};
