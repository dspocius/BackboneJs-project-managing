var http = require('http');
var https = require('https');
exports.index = function(req, res) {
	res.render('index');
};

exports.logout = function(req, res) {
	res.clearCookie('token');
	res.clearCookie('username');
	res.status(200).end();
};

exports.remember_password = function(req, res) {
	var user = req.body.user || '';
	if (user == '') {
		return res.status(400).end();
	}

  var post_data = '{"user": "'+user+'"}';

var options = {
  host: '127.0.0.1',
  path: '/user/remember_password',
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
exports.register = function(req, res) {
	var email = req.body.email || '';
	var real_email = req.body.real_email || '';
	var firstname = req.body.firstname || '';
	var lastname = req.body.lastname || '';
	var password = req.body.password || '';
	var passwordConfirmation = req.body.passwordConfirmation || '';
	var is_google = req.body.is_google || 'false';

	if (email == '' || lastname == '' || firstname == '' || password == '' || password != passwordConfirmation) {
		return res.status(400).end();
	}

  var post_data = '{"is_google": "'+is_google+'","real_email": "'+real_email+'","email": "'+email+'", "firstname": "'+firstname+'", "lastname": "'+lastname+'", "password": "'+password+'", "passwordConfirmation": "'+passwordConfirmation+'"}';

var options = {
  host: '127.0.0.1',
  path: '/user/register',
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


exports.register_google = function(req, res) {
	var id_token = req.body.id_token || '';
	var email = req.body.email || '';

	if (id_token == '' || email == '') { 
		return res.status(400).end();
	}

var options = {
  host: 'www.googleapis.com',
  path: '/oauth2/v3/tokeninfo?id_token='+id_token,
  port: '80',
  method: 'GET',
  headers: {
        'Content-Type': 'application/json'
  }
};

var reqq = https.get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='+id_token, function(response) {
  var str = '';
  response.on('data', function (data) {
		str += data;
  });

  response.on('end', function () {
	  var id_token = "";
	  if(str.indexOf("373958717742-ve8vr9hg9sb27jmjv5nn1kieopqqaks4.apps.googleusercontent.com") >  -1){
		  var parseStr = JSON.parse(str);
		  if(parseStr.aud.indexOf("373958717742-ve8vr9hg9sb27jmjv5nn1kieopqqaks4.apps.googleusercontent.com") >  -1){
			  id_token = "GOve8vr9hg9sb27jmjv5nn1kieopqqa"+parseStr.sub+"ve8vr9hg9sb27jmjv5nn1kieopqqaFFFF_GooGo";
		  }
	  }
	  retData = {data:str};
	  if(id_token !== ""){
		  req.body.password = id_token;
		  req.body.passwordConfirmation = id_token;
		  exports.register(req, res);
	  }else{
		  return res.json(retData);
	  }
  });

});

reqq.on('error', function(e) { console.log('problem with request: ' + e.message); });
reqq.end();

};
exports.login_google = function(req, res) {
	
	
	var id_token = req.body.id_token || '';
	var email = req.body.email || '';

	if (id_token == '' || email == '') { 
		return res.status(400).end();
	}

var options = {
  host: 'www.googleapis.com',
  path: '/oauth2/v3/tokeninfo?id_token='+id_token,
  port: '80',
  method: 'GET',
  headers: {
        'Content-Type': 'application/json'
  }
};

var reqq = https.get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='+id_token, function(response) {
  var str = '';
  response.on('data', function (data) {
		str += data;
  });

  response.on('end', function () {
	  var id_token = "";
	  if(str.indexOf("373958717742-ve8vr9hg9sb27jmjv5nn1kieopqqaks4.apps.googleusercontent.com") >  -1){
		  var parseStr = JSON.parse(str);
		  if(parseStr.aud.indexOf("373958717742-ve8vr9hg9sb27jmjv5nn1kieopqqaks4.apps.googleusercontent.com") >  -1){
			  id_token = "GOve8vr9hg9sb27jmjv5nn1kieopqqa"+parseStr.sub+"ve8vr9hg9sb27jmjv5nn1kieopqqaFFFF_GooGo";
		  }
	  }
	  retData = {data:str};
	  if(id_token !== ""){
		  req.body.password = id_token;
		  exports.login(req, res);
	  }else{
		  return res.json(retData);
	  }
  });

});

reqq.on('error', function(e) { console.log('problem with request: ' + e.message); });
reqq.end();

	
	
};
exports.login = function(req, res) {
	var email = req.body.email || '';
	var password = req.body.password || '';

	if (email == '' || password == '') { 
		return res.status(400).end();
	}

  var post_data = '{"email": "'+email+'", "password": "'+password+'"}';

var options = {
  host: '127.0.0.1',
  path: '/user/signin',
  port: '3002',
  method: 'POST',
  headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(post_data)
  }
};

var reqq = http.request(options, function(response) {
  var str = '';
  var ret_email = '';
  var programson = [];
  var mainprogram = {};
  var pic = '';
  response.on('data', function (data) {
  if(data == "Unauthorized"){
		str += data;
  }else{
		var obj = JSON.parse(data);
		str += obj.token;
		ret_email = obj.email;
		programson = obj.programs;
		mainprogram = obj.mainprogram;
		pic += obj.pic;
	}
  });

  response.on('end', function () {
	if(str == "Unauthorized" || str == "Bad Request" || str == "Internal Server Error"){
		return res.status(401).end();
	}else{
		res.cookie('token', str, { maxAge: 5400000000, httpOnly: true });
		res.cookie('username', ret_email, { maxAge: 5400000000, httpOnly: true });
		res.cookie('pic', pic, { maxAge: 5400000000, httpOnly: true });
		var user = {};
		user.programson = programson;
		user.mainprogram = mainprogram;
		user.pic = pic;
		return res.json(user);
	}
  });

});

reqq.on('error', function(e) { console.log('problem with request: ' + e.message); });
reqq.write(post_data);
reqq.end();

}; 
