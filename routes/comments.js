var http = require('http');
var fs = require('fs');
exports.countByUsername = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}
	var what = req.params.what || '';
	if(what == ''){
		return res.status(400).end();
	}
    var options = {
        host: '127.0.0.1',
        path: '/countByUsername/'+what,
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
exports.comment_is_username = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}
	var what = req.params.what || '';
	if(what == ''){
		return res.status(400).end();
	}
    var options = {
        host: '127.0.0.1',
        path: '/comment_is_username/'+username+"/"+what,
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
exports.get = function(req, res) {
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
    //if (username == '' || token == ''){
    //    return res.status(400).end();
   // }
	
	var u = req.params.u || '';
	var id = req.params.what || '';
	var skip = req.params.skip || 0;
	var msgid = req.params.msgid || '';
	var skipcomments = req.params.skipcomments || 0;
	var addpath = "";
	if (msgid != "") {
		addpath = "/"+msgid+"/"+parseInt(skipcomments);
	}
    if (id == ''){
        return res.status(400).end();
    }
	var send_to = "comments";
	if(u != ''){
		if(username == ''){
			return res.status(400).end();
		}
		id = id+username;
		send_to = "commentsuser";
	} else {
		if(token == ""){
			send_to = "comments_nlogged";
		}
	}
    var options = {
        host: '127.0.0.1',
        path: '/'+send_to+'/'+id+'/'+skip+addpath,
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
exports.updateCommentReset = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}
	
	var id = req.body.idd || '';
	var taskid = req.body.taskid || '';
	var message = req.body.message || '';
	
	if (id == '' || (message == '')) {
		return res.status(400).end();
	}
	
	var jsonTObj = '';
	for(var ii=0; ii < message.length; ii++){
		var regex = /(<([^>]+)>)/ig;
		jsonTObj += '{"from":"'+ message[ii].from+'","message":"'+ message[ii].message+'","date":"'+message[ii].date+'"}'.replace(regex, "");
		if(ii+1 !== message.length){
			jsonTObj += ",";
		}
	}
	var jsonArr = '['+jsonTObj+']';
	var post_data = '{"id": "'+id+'", "taskid": "'+taskid+'", "message": '+jsonArr+'}';

var options = {
  host: '127.0.0.1',
  path: '/commentReset',
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
exports.update = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}
	
	var id = req.body.id || '';
	var taskid = req.body.taskid || '';
	var message = req.body.message || '';
	var dateRemove = req.body.date || '';
	var datelike = req.body.datelike || '';
	var datereply = req.body.datereply || '';
	var friend_notify = req.body.friend_notify || '';
	var model_id = req.body.model_id || '';

	if (id == '' || (message == '' && dateRemove == '' && datelike == '')) {
		return res.status(400).end();
	}
	var jsonTObj = '{}';
	if(message != ''){
		jsonTObj = '{"from":"'+ message.from+'","message":"'+ encodeURIComponent(message.message)+'","date":"'+message.date+'","files":"'+message.files+'", "likes":[], "reply":"'+datereply+'"}';
	}
	
	var removeDt = '';
	if(dateRemove != ''){
		removeDt = '"date":"'+dateRemove+'",';
	}	
	var updateLike = '';
	if(datelike != ''){
		var liker = '"liker":"'+username+'",';
		updateLike = '"datelike":"'+datelike+'",'+liker;
	}

	var friend_notify_what = '';
	if(friend_notify != ''){
		friend_notify_what = '"friend_notify":"'+friend_notify+'",';
		friend_notify_what += '"model_id":"'+model_id+'",';
	}
	
	var post_data = '{'+updateLike+removeDt+friend_notify_what+'"id": "'+id+'", "taskid": "'+taskid+'", "message": '+jsonTObj+'}';

var options = {
  host: '127.0.0.1',
  path: '/comment',
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

exports.updateByUser = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}
	
	var id = req.body.id || '';
	var taskid = req.body.taskid || '';
	var message = req.body.message || '';
	var dateRemove = req.body.date || '';
	var fromRemove = req.body.rFrom || '';

	if (id == '' || (message == '' && dateRemove == '' && fromRemove == '')) {
		return res.status(400).end();
	}
	

	var jsonTObj = '{}';
	if(message != ''){
		jsonTObj = '{"from":"'+ message.from+'","message":"'+ encodeURIComponent(message.message)+'","date":"'+message.date+'","files":"'+message.files+'"}';
	}
	
	var removeDt = '';
	if(dateRemove != ''){
		removeDt = '"date":"'+dateRemove+'",';
	}
	var removeFrom = '';
	if(fromRemove != ''){
		removeFrom = '"rFrom":"'+fromRemove+'",';
	}
	
	var post_data = '{'+removeFrom+removeDt+'"id": "'+id+'", "taskid": "'+taskid+'", "message": '+jsonTObj+'}';

var options = {
  host: '127.0.0.1',
  path: '/commentAddByUser',
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