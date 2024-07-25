var http = require('http');
exports.getAllroutes = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}

var options = {
  host: '127.0.0.1',
  path: '/routes/'+username,
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
			return res.status(200).json(str);
		}

  });
});

reqq.end();

};

exports.getroute = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}
	var id = req.params.id || '';
	if (id == '') {
		return res.status(400).end();
	}

var options = {
  host: '127.0.0.1',
  path: '/route/'+id,
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
			return res.status(200).json(str);
		}

  });
});

reqq.end();

};

exports.create = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}

	var route = req.body.route;
	if (route == null || route.from == null || route.to == null || route.content == null) {
		return res.status(400).end();
	}
	
	var routeDrivingTime = route.driving_time || "";
	var leavingTime = route.leave || "";
	var arriveTime = route.arrive || "";

	var post_data = '{"route":{"from": "'+route.from+'", "to": "'+route.to+'","content":"'+route.content+'","username":"'+route.username+'","driving_time":"'+routeDrivingTime+'","leave":"'+leavingTime+'","arrive":"'+arriveTime+'","content":"'+route.content+'"}}';

var options = {
  host: '127.0.0.1',
  path: '/route',
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


exports.update = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}

	var route = req.body.route;

	if (route == null || route._id == null) {
		res.status(400).end();
	}

	var updateRoute = '{"route":{"_id":"'+route._id+'"';

	if (route.to != null && route.to != "") {
		updateRoute += ', "to":"'+route.to+'"';
	}
	
	if (route.leave != null && route.leave != "") {
		updateRoute += ', "leave":"'+route.leave+'"';
	}
	if (route.arrive != null && route.arrive != "") {		
		updateRoute += ', "arrive":"'+route.arrive+'"';
	}
	
	if (route.from != null && route.from != "") {
		updateRoute += ', "from":"'+route.from+'"';
	}

	if (route.content != null && route.content != "") {
		updateRoute += ', "content":"'+route.content+'"';
	}
	updateRoute += '}}';


	var post_data = updateRoute;

var options = {
  host: '127.0.0.1',
  path: '/route',
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

exports.deleteroute = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}
	var id = req.params.id || '';
	if (id == '') {
		return res.status(400).end();
	}

var options = {
  host: '127.0.0.1',
  path: '/route/'+id,
  port: '3002',
  method: 'DELETE',
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
			return res.status(200).end();
		}

  });
});

reqq.end();

};
