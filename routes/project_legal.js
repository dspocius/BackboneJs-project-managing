var http = require('http');
var fs = require('fs');


exports.projects = function(req, res) {
	var token = req.cookies.token || '';
	var username = req.params.username || '';
    if (username == ''){
        return res.status(400).end();
    }
	var usernameEmail = req.cookies.username || '';
	var urlToSend = '/projectss/'+username;
	if(usernameEmail !== ''){
		urlToSend = '/projectssuser/'+username+'/'+usernameEmail;
	}
    var options = {
        host: '127.0.0.1',
        path: urlToSend,
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
exports.projectsinlist_old = function(req, res) {
	var token = req.cookies.token || '';
    var id = req.params.id || '';
    var skipCnt = req.params.skip || '';
	var usermy = req.params.username || '';
    if (id == '' || skipCnt == ''){
        return res.status(400).end();
    }
	skipCnt = parseInt(skipCnt);
	var username = req.cookies.username || '';
	if (usermy != "") {
		username = usermy;
	}
	var urlToSend = '/projectsinlistt_old/'+id+'/'+skipCnt;
	if(username !== ''){
		urlToSend = '/projectsinlist_old_user/'+id+'/'+username+'/'+skipCnt;
	}
	
    var options = {
        host: '127.0.0.1',
        path: urlToSend,
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

exports.projectsinlist_old_count = function(req, res) {
	var token = req.cookies.token || '';
    var id = req.params.id || '';
    var usermy = req.params.username || '';
    if (id == ''){
        return res.status(400).end();
    }
	var username = req.cookies.username || '';
	if (usermy != "") {
		username = usermy;
	}
	var urlToSend = '/projectsinlistt_old_count/'+id;
	if(username !== ''){
		urlToSend = '/projectsinlist_old_user_count/'+id+'/'+username;
	}
	
    var options = {
        host: '127.0.0.1',
        path: urlToSend,
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

exports.projectsinlist = function(req, res) {
	var token = req.cookies.token || '';
    var id = req.params.id || '';
    var usermy = req.params.username || '';
    if (id == ''){
        return res.status(400).end();
    }
	var username = req.cookies.username || '';
	if (usermy != "") {
		username = usermy;
	}
	
	var urlToSend = '/projectsinlistt/'+id;
	if(username !== ''){
		urlToSend = '/projectsinlisttuser/'+id+'/'+username;
	}
	
    var options = {
        host: '127.0.0.1',
        path: urlToSend,
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
exports.projectentry = function(req, res) {
	var token = req.cookies.token || '';
    var id = req.params.id || '';
	var skip = 0;
	if (typeof req.params.skip != "undefined" && req.params.skip != "") {
		skip = parseInt(req.params.skip);
	}
	var username = req.cookies.username || '';
	if (typeof req.params.username != "undefined" && req.params.username != "") {
		username = req.params.username;
	}
	
    if (id == ''){
        return res.status(400).end();
    }
	var urlToSend = '/projectentryy/'+id+"/"+skip;
	if(username !== ''){
		urlToSend = '/projectentryyuser/'+id+'/'+username+"/"+skip;
	}
	if (token == "") {
		urlToSend = '/projectentryy/'+id+"/"+skip+"/"+username;
	}

    var options = {
        host: '127.0.0.1',
        path: urlToSend,
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
exports.project = function(req, res) {
	var token = req.cookies.token || '';
    var id = req.params.id || '';
	var username = req.cookies.username || '';
	
	if (typeof req.params.username != "undefined" && req.params.username != "") {
		username = req.params.username;
	}
	
    if (id == ''){
        return res.status(400).end();
    }
	var urlToSend = '/projectt/'+id;
	if(username !== ''){
		urlToSend = '/projecttuser/'+id+'/'+username;
	}
	if (token == "") { urlToSend = '/projectt/'+id+'/'+username;  }

    var options = {
        host: '127.0.0.1',
        path: urlToSend,
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



