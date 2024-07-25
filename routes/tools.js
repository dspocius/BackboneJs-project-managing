var http = require('http');
exports.setUserReadCookies = function(req, res) {
	res.cookie('cookie_read', 'true', { maxAge: 5400000000, httpOnly: true });
	return res.status(200).end();
};
exports.check_if_cookie_read = function(req, res) {
	if(typeof req.cookies.cookie_read === "undefined"){
		return res.json({success:false});
	}else{
		return res.json({success:true});
	}
};
exports.checkifuserloggedin = function(req, res) {
	if(typeof req.cookies.username === "undefined" || typeof req.cookies.token === "undefined"){
		return res.status(401).end();
	}else{

var options = {
  host: '127.0.0.1',
  path: '/checkifloggedin',
  port: '3002',
  method: 'GET',
  headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+req.cookies.token
  }
};


var reqq = http.request(options, function(response) {
  var str = '';
  response.on('data', function (data) {
		str += data;
  });

  response.on('end', function () {
		if(str != "OK"){
			return res.status(401).end();
		}else{
			return res.json({username:req.cookies.username,token:req.cookies.token,mainprogram:req.cookies.mainprogram,programs:req.cookies.programs,pic:req.cookies.pic,friends:req.cookies.friends});
		}

  });
});

reqq.end();

	}
};
