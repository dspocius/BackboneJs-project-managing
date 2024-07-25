var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');
const filesurl = "http://192.168.1.234:8005";

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.addmoneytomyxacc = function(req, res){
    var project = req.body;
    if (project == null || project.custom == null || project.mc_gross == null
	 || project.sec == null){// || project.secret == null) {
        return res.status(400).end();
    }
	var sec = project.sec;
	var userid = project.custom.split(";")[1];
	var post_data = '{"userid": "'+userid+'","amount": "'+project.mc_gross+'","secret": "'+sec+'"}';	
	
	var options = {
		host: '127.0.0.1',
		path: '/addmoneytomyxacc',
		port: '3002',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(post_data)
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
				return res.status(200).end();
			}
		});
	});

	reqq.write(post_data);
	reqq.end();
};
router.payfrommyaccount = function(req, res){
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
    if (username == '' || token == ''){
        return res.status(400).end();
    }

    var project = req.body;
    if (project == null || project.pay == null) {
        return res.status(400).end();
    }
	
	var post_data = '{"pay": true}';	
	
	var options = {
		host: '127.0.0.1',
		path: '/payfrommyaccount',
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
			if(str == "Unauthorized" || str == "Bad Request" || str == "Internal Server Error"){
				return res.status(400).end();
			}else{
				return res.status(200).end();
			}
		});
	});

	reqq.write(post_data);
	reqq.end();
};
router.updateUsertoks = function(req, res){
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
    if (username == '' || token == ''){
        return res.status(400).end();
    }

    var dat = req.body;
    if (dat == null || dat.act == null || dat.tokid == null) {
        return res.status(400).end();
    }
	
	var post_data = '{"act": "'+dat.act+'", "tokid": "'+dat.tokid+'"}';	
	
	var options = {
		host: '127.0.0.1',
		path: '/user/ontoks',
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
			if(str == "Unauthorized" || str == "Bad Request" || str == "Internal Server Error"){
				return res.status(400).end();
			}else{
				return res.status(200).end();
			}
		});
	});

	reqq.write(post_data);
	reqq.end();
};
router.get_info_from_ip = function(req, res){
var getIP = require('external-ip')();
 
	getIP(function (err, add) {
		if (err) {
			console.log(err);
			return res.status(401).end();
		}

		var options = {
		  host: 'freegeoip.net',
		  path: '/json/'+add,
		  method: 'GET',
		  headers: {
				'Content-Type': 'application/json'
		  }
		};

		var reqq = http.request(options, function(response) {
		  var str = '';
		  var programson = [];
		  var mainprogram = {};
		  var pic = '';
		  response.on('data', function (data) {
		  if(data == "Unauthorized"){
				str += data;
		  }else{
				str = JSON.parse(data);
			}
		  });

		  response.on('end', function () {
			if(str == "Unauthorized" || str == "Bad Request" || str == "Internal Server Error"){
				return res.status(401).end();
			}else{
				return res.json(str);
			}
		  });

		});

		reqq.on('error', function(e) { console.log('problem with request: ' + e.message); });
		reqq.end();
	  
	  
	});
	
};
function uploadImageUser(imageBuffer, username) {
  const form = new FormData();
  form.append('file', imageBuffer, {
    contentType: 'image/png',
    filename: username
  });
  form.append("username",username);
  return fetch(filesurl+`/uploaduserphoto`, { method: 'POST', body: form })
};
router.update = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}
	var rawBody = new Buffer('');

    var fstream;
    var program = [];

    req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
       program[fieldname] = val;
    });

    req.busboy.on('file',function(fieldname, file, filename, encoding, mimetype){
	program['pic'] = username+".jpg"; 
        file.on('data',function(data){
		rawBody = Buffer.concat([rawBody, data]);
        });

        file.on('end', function(){
			
    	});
     });

    req.busboy.on('finish', function() {

			uploadImageUser(rawBody,username).then(() => {
				
program['pic'] = username+".jpg"; 

	var updateUssr = '{"user":{"email":"'+username+'"';
	
	if (program['pic'] != null && program['pic'] != "") {
		updateUssr += ', "pic":"'+program['pic']+'"';
		res.cookie('pic', program['pic']);
	}



/*--------------------*/
	updateUssr += '}}';


	var post_data = updateUssr;

var options = {
  host: '127.0.0.1',
  path: '/user/update',
  port: '3002',
  method: 'PUT',
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
/*--------------------*/

});
    });

req.pipe(req.busboy);
};

module.exports = router;
