var http = require('http');
var fs = require('fs');

exports.getMyChannels = function(req, res) {
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
    if (username == '' || token == ''){
        return res.status(400).end();
    }
	
	var id = req.params.what || '';
	var skip = req.params.skip || 0;
    if (id == ''){
        return res.status(400).end();
    }

    var options = {
        host: '127.0.0.1',
        path: '/channels/'+id+'/'+skip,
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
exports.channelsOpen = function(req, res) {
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
    if (username == '' || token == ''){
        return res.status(400).end();
    }
	
	var id = req.params.what || '';
	var skip = req.params.skip || 0;
    if (id == ''){
        return res.status(400).end();
    }

    var options = {
        host: '127.0.0.1',
        path: '/channelsOpen/'+id+'/'+skip,
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
exports.addPeopleToChannel = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}
	
	var id = req.body.id || '';
	var people = req.body.people || '';
	var deleteId = req.body.deleteId || '';

	if (id == '' || (people == '' && deleteId == '')) {
		return res.status(400).end();
	}
	
	var jsonTObj = '{}';
	if(people != ''){
		jsonTObj = '{"email":"'+ people.email+'","show":"'+ people.show+'","_id":"'+ people.id+'","firstname":"'+people.firstname+'","lastname":"'+people.lastname+'"}';
	}
	
	var removeDt = '';
	if(deleteId != ''){
		removeDt = '"deleteId":"'+deleteId+'",';
	}
	
	var post_data = '{'+removeDt+'"id": "'+id+'", "people": '+jsonTObj+'}';
var options = {
  host: '127.0.0.1',
  path: '/addPeopleToChannel',
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
exports.createChannel = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}
	
	var name = req.body.name || '';
	var about = req.body.about || '';
	var type = req.body.type || '';
	var people = req.body.people || '';

	if (name == '' || about == '' || type == '' || people == '') {
		return res.status(400).end();
	}
	
	var jsonTObj = '[';
	if(people != ''){
		for(var ii=0; ii < people.length; ii++){
			if(ii == 0){
			jsonTObj += '{"email":"'+ people[ii].email+'","show":'+ people[ii].show+',"_id":"'+ people[ii].id+'","firstname":"'+people[ii].firstname+'","lastname":"'+people[ii].lastname+'"}';
			}else{
			jsonTObj += ',{"email":"'+ people[ii].email+'","show":'+ people[ii].show+',"_id":"'+ people[ii].id+'","firstname":"'+people[ii].firstname+'","lastname":"'+people[ii].lastname+'"}';
			}
		}
	}
	jsonTObj += ']';
	
	var post_data = '{"type": "'+type+'", "name": "'+name+'", "about": "'+about+'", "people": '+jsonTObj+'}';

var options = {
  host: '127.0.0.1',
  path: '/createChannel',
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
                return res.status(200).json(JSON.parse(str));
            }
  });
});

reqq.write(post_data);
reqq.end();

};

exports.ChangeChannelsView = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}
	
	var id = req.body.id || '';
	var show = req.body.show;
	var people = req.body.people || '';
	if (id == '' ||  people == '') {
		return res.status(400).end();
	}
	
	var post_data = '{"id": "'+id+'", "show": '+show+', "people": "'+people+'"}';
var options = {
  host: '127.0.0.1',
  path: '/ChangeChannelsView',
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