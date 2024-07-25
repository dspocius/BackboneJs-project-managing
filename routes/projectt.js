var http = require('http');
var fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');
const filesurl = "http://192.168.1.234:8005";

var customProperties = ["assignedID", "fromTimeline", "files_show", "filesurl", "view_main", "comments_count", "routes_data", "statsdats_data", "is_old", "what_to_show", "forms_data", "photobook_data", "submitted_data", "submitted_data_can_answer_more", "read_it_count"];
/*
TODO: Create custom data that would be easily to use (add, change, remove)
var customProperties = ["route"];
*/

exports.notifybyemail = function(req, res) {
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
    if (username == '' || token == ''){
        return res.status(400).end();
    }

    var project = req.body;
    
    if (project == null || project.email == null || project.ticketid == null
     || project.type == null) {
        return res.status(400).end();
    }
    var post_data = '{"email": "'+project.email+'", "ticketid": "'+project.ticketid+'", "type": "'+project.type+'"}';
        var options = {
            host: '127.0.0.1',
            path: '/notifybyemail',
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
                str = data;
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

exports.projectsfriend = function(req, res) {
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
    if (username == '' || token == ''){
        return res.status(400).end();
    }
    var id = req.params.id || '';
    var usermy = req.params.username || '';
	if (usermy != "") {
		username = usermy;
	}
    if (id == ''){
        return res.status(400).end();
    }

    var options = {
        host: '127.0.0.1',
        path: '/projectsfriend/'+id,
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

exports.projectsFind = function(req, res) {
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
	var search = req.body.search || '';//:search/:idd/:type/:skip/:assigned/:infriends
	var idd = req.body.idd || '';
	var skip = req.body.skip || 0;
	var type = req.body.type || '-';
	var assigned = req.body.assigned || '-';
	var infriends = req.body.infriends || 'true';
	
    if (username == '' || token == '' || search == ''){
        return res.status(400).end();
    }
	
	var username = username || ''; ///:username/:search/:id/:type/:skip/:assigned/:infriends
	var search = req.body.search || ''; 
	var skip = req.body.skip || 0;
	var assigned = req.body.assigned || '';
	var infriends = req.body.infriends || 'true';
	

			var post_data = '{"username": "'+username+'", ' +
					'"search": "'+search+'", ' +
					'"skip": '+skip+', ' +
					'"assigned": "'+assigned+'", ' +
					'"infriends": '+infriends+'}';
			console.log("post_data",post_data);
			
			var options = {
				host: '127.0.0.1',
				path: '/projectsFind',
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

exports.projects = function(req, res) {
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
    if (username == '' || token == ''){
        return res.status(400).end();
    }

    var options = {
        host: '127.0.0.1',
        path: '/projects/'+username,
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
exports.projectstimeline = function(req, res) {
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
	var skip = req.params.skip || 0;
	if (skip != 0) {
		skip = parseInt(req.params.skip);
	}
	
    if (username == '' || token == ''){
        return res.status(400).end();
    }

    var options = {
        host: '127.0.0.1',
        path: '/projectstimeline/'+username+"/"+skip,
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
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
    if (username == '' || token == ''){
        return res.status(400).end();
    }
    var skipCnt = req.params.skip || '';
    var id = req.params.id || '';
    if (id == '' || skipCnt == ''){
        return res.status(400).end();
    }
	skipCnt = parseInt(skipCnt);
    var options = {
        host: '127.0.0.1',
        path: '/projectsinlist_old/'+id+"/"+skipCnt,
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
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
    if (username == '' || token == ''){
        return res.status(400).end();
    }
    var id = req.params.id || '';
    if (id == ''){
        return res.status(400).end();
    }

    var options = {
        host: '127.0.0.1',
        path: '/projectsinlist_old_count/'+id,
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
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
    if (username == '' || token == ''){
        return res.status(400).end();
    }
    var id = req.params.id || '';
    if (id == ''){
        return res.status(400).end();
    }

    var options = {
        host: '127.0.0.1',
        path: '/projectsinlist/'+id,
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
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
    if (username == '' || token == ''){
        return res.status(400).end();
    }
    var id = req.params.id || '';
    if (id == ''){
        return res.status(400).end();
    }

    var options = {
        host: '127.0.0.1',
        path: '/projectentry/'+id,
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
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
    if (username == '' || token == ''){
        return res.status(400).end();
    }
    var id = req.params.id || '';
    if (id == ''){
        return res.status(400).end();
   }

    var options = {
        host: '127.0.0.1',
        path: '/project/'+id,
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
exports.cdescription = function(req, res) {
    var desc = req.query.desc || '';
	return res.status(200).json({data:'Description: '+desc});
}
exports.cproject = function(req, res) {
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
    if (username == '' || token == ''){
        return res.status(400).end();
    }

    var project = req.body;
    if (project == null || project.name == null || project.text == null) {
        return res.status(400).end();
    }

    var inP = [];
    var objectP = "";
    var view_main = "";
    var visibility = "private";
    var objectinHeader = "";
    var color = "#80BCF0";
    var files_show = "";
    var files = "";
    var belongs_to = "";
    var what_to_show = "all";
    var fromTimeline = false;
    if(typeof project.what_to_show != 'undefined'){
		what_to_show = project.what_to_show;
	}
    if(typeof project.belongs_to != 'undefined' && project.belongs_to != ""){
		belongs_to = project.belongs_to;
	}
    if(typeof project.files_show != 'undefined'){
        files_show = project.files_show;
    }
    if(typeof project.files != 'undefined'){
        files = project.files;
    }
    if(typeof project.inProjects != 'undefined'){
        inP = project.inProjects;
    }
    if(typeof project.view_main != 'undefined'){
        view_main = project.view_main;
    }
    if(typeof project.isHeader != 'undefined'){
        objectP = project.isHeader;
    }  
	if(typeof project.fromTimeline != 'undefined'){
        fromTimeline = project.fromTimeline;
    }
    if(typeof project.inHeader != 'undefined'){
        objectinHeader = project.inHeader;
    }
    if(typeof project.color != 'undefined'){
        color = project.color;
    }
    if(typeof project.visibility != 'undefined'){
        visibility = project.visibility;
    }
	var firstlastname = username;
	if(typeof project.firstlastname != 'undefined'){
        firstlastname = project.firstlastname;
    }
/*?project.text = project.text.replace(/(\r\n|\n|\r)/gm, '<br/>')*/
    var post_data = '{"project":{"name": "'+encodeURIComponent(project.name)+'", ' +
        '"email": "'+username+'", ' +
        '"isProject": '+project.isProject+', ' +
        '"fromTimeline": '+fromTimeline+', ' +
        '"files": "'+files+'", ' +
        '"files_show": "'+files_show+'", ' +
        '"inProjects": "'+inP+'", ' +
        '"isHeader": "'+objectP+'", ' +
        '"view_main": "'+view_main+'", ' +
        '"firstlastname": "'+firstlastname+'", ' +
        '"color": "'+color+'", ' +
        '"belongs_to": "'+belongs_to+'", ' +
        '"visibility": "'+visibility+'", ' +
        '"what_to_show": "'+what_to_show+'", ' +
        '"inHeader": "'+objectinHeader+'", ' +
        '"text": "'+encodeURIComponent(project.text)+'"}}';

    var options = {
        host: '127.0.0.1',
        path: '/project'+"/"+username,
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


exports.cupdateTasks = function(req, res) {
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
    if (username == '' || token == ''){
        return res.status(400).end();
    }
    var id = req.params.id || '';
    if (id == ''){
        return res.status(400).end();
    }
    var project = req.body;

    if (project == null){
        res.status(400).end();
    }
	var updatePrj = '{"project":{"_id":"'+id+'"';
    if (project.TaskAdd != null && project.TaskAdd != ""){
		var notify = false;
		var textarea_notify = '';
		var estimate = '';
		var reccurence = '';
		var edit_it = '';
		if(typeof project.TaskAdd.estimate != 'undefined' && project.TaskAdd.estimate != ''){
			estimate = project.TaskAdd.estimate;
		}
		if(typeof project.TaskAdd.edit_it != 'undefined' && project.TaskAdd.edit_it != ''){
			edit_it = project.TaskAdd.edit_it;
		}
		if(typeof project.TaskAdd.textarea_notify != 'undefined' && project.TaskAdd.textarea_notify != ''){
			textarea_notify = encodeURIComponent(project.TaskAdd.textarea_notify);
		}
		if(typeof project.TaskAdd.reccurence != 'undefined' && project.TaskAdd.reccurence != ''){
			reccurence = project.TaskAdd.reccurence;
		}
		if(typeof project.TaskAdd.notify != 'undefined' && project.TaskAdd.notify != ''){
			notify = project.TaskAdd.notify;
		}
        updatePrj += ', "TaskAdd":{"edit_it":"'+edit_it+'","textarea_notify":"'+textarea_notify+'","reccurence":"'+reccurence+'","estimate":"'+estimate+'","notify":"'+notify+'","date":"'+project.TaskAdd.date+'","about":"'+encodeURIComponent(project.TaskAdd.about)+'","from":"'+project.TaskAdd.from+'","to":"'+project.TaskAdd.to+'","fromTime":"'+project.TaskAdd.fromTime+'","toTime":"'+project.TaskAdd.toTime+'"}';
    }
    if (project.TaskRemove != null && project.TaskRemove != ""){
        updatePrj += ', "TaskRemove":"'+project.TaskRemove+'"';
    }
    updatePrj += '}}';

    var post_data = updatePrj;

    var options = {
        host: '127.0.0.1',
        path: '/projectTask'+"/"+username,
        port: '3002',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(post_data),
            'Authorization': 'Bearer '+token
        }
    };


    var reqq = http.request(options, function(response){
        var str = '';
        response.on('data', function (data){
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
exports.remove_shared = function(req, res) {
	
};
exports.cupdate = function(req, res) {
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
    if (username == '' || token == ''){
        return res.status(400).end();
    }
    var id = req.params.id || '';
    if (id == ''){
        return res.status(400).end();
    }

    var project = req.body;

    if (project == null){
        res.status(400).end();
    }

    var updatePrj = '{"project":{"_id":"'+id+'"';
	/*TODO: Custom data here */
	for(var i=0; i < customProperties.length; i++){
		if (project[customProperties[i]] != null){
			updatePrj += ', "'+[customProperties[i]]+'":"'+encodeURIComponent(project[customProperties[i]])+'"';
		}
	}
    if (project.name != null && project.name != ""){
        updatePrj += ', "name":"'+encodeURIComponent(project.name)+'"';
    }
    if (project.inProjects != null){
        updatePrj += ', "inProjects":"'+project.inProjects+'"';
    }
    if (project.text != null && project.text != ""){
        updatePrj += ', "text":"'+encodeURIComponent(project.text)+'"';
    }
    if (project.addlike != null && project.addlike != "" && project.addlike != "false"){
        updatePrj += ', "addlike":'+true;
		updatePrj += ', "addliker":{"em":"'+username+'","nm":"'+project.addlike+'"}';
    }
    if (project.isProject != null && project.isProject != ""){
        updatePrj += ', "isProject":'+project.isProject+'';
    }
    if (project.visibility != null && project.visibility != ""){
		updatePrj += ', "visibility":"'+project.visibility+'"';
	}
    if (project.position != null && project.position != ""){
        updatePrj += ', "position":"'+project.position+'"';
    }
    if (project.info != null && project.info != ""){
        updatePrj += ', "info":'+project.info+'';
    }
    if (project.files != null){
        updatePrj += ', "files":"'+project.files+'"';
    }
    if (project.friendAddToEntry != null && project.friendAddToEntry != ""){
		updatePrj += ', "friendAddToEntry":{"_id":"'+project.friendAddToEntry+'", "email":"'+project.friendAddToEntryEmail+'"}';
	}
	if (project.friendDeleteEntry != null && project.friendDeleteEntry != ""){
		updatePrj += ', "friendDeleteEntry":{"_id":"'+project.friendDeleteEntry+'"}';
	}
    if (project.color != null && project.color != ""){
        updatePrj += ', "color":"'+project.color+'"';
    }
    if (project.friendsThere != null){
        updatePrj += ', "friendsThere":"'+project.friendsThere+'"';
    }
    if (project.isHeader != null && project.isHeader != ""){
        updatePrj += ', "isHeader":'+project.isHeader+'';
    }       
	if (project.fromTimeline != null && project.fromTimeline != ""){
        updatePrj += ', "fromTimeline":'+project.fromTimeline+'';
    }
    if (project.inHeader != null && project.inHeader != "" && (project.fromTimeline == null || project.fromTimeline == "" || !project.fromTimeline)) {
        updatePrj += ', "inHeader":"'+project.inHeader+'"';
    }

	var post_url_upd = "project";
	if (project.remove_shared_from_project != null && project.remove_shared_from_project != ""){
		post_url_upd = "remove_shared";
	}
    updatePrj += '}}';

    var post_data = updatePrj;

    var options = {
        host: '127.0.0.1',
        path: '/'+post_url_upd+''+"/"+username,
        port: '3002',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(post_data),
            'Authorization': 'Bearer '+token
        }
    };


    var reqq = http.request(options, function(response){
        var str = '';
        response.on('data', function (data){
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

exports.cdelete = function(req, res) {
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
    if (username == '' || token == ''){
        return res.status(400).end();
    }
    var id = req.params.id || '';
    if (id == ''){
        return res.status(400).end();
    }
    var bodyProgram = '{}';
    var options = {
        host: '127.0.0.1',
        path: '/project/'+id+"/"+username,
        port: '3002',
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(bodyProgram),
            'Authorization': 'Bearer '+token
        }
    };

    var reqq = http.request(options, function(response){
        var str = '';
        response.on('data', function (data){
            str += data;
        });

        response.on('end', function (){
            if(str != "OK"){
                return res.status(400).end();
            }else{
                return res.status(200).end();
            }

        });
    });
    reqq.write(bodyProgram);
    reqq.end();

};
function uploadImage(imageBuffer, fileName, project) {
  const form = new FormData();
  form.append('file', imageBuffer, {
    contentType: 'image/png',
    filename: fileName
  });
  form.append("project",project);
  form.append("uploadedFileName",fileName);
  return fetch(filesurl+`/project_upload`, { method: 'POST', body: form })
};

exports.project_fileupload = function(req, res) {

	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}
    var returnit = req.params.returnit || '';

    var fstream;
	var project = [];
	var files = [];
	var mainFileIn = "";
    req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
		if (val && val != "undefined" && val!="item") {
		project[fieldname] = val;
		}
	});

    req.busboy.on('file',function(fieldname, file, filename, encoding, mimetype){
	var rawBody = Buffer.from('');
        file.on('data',function(data){
			rawBody = Buffer.concat([rawBody, data]);
        });

        file.on('end', function(){
try {
    fs.mkdirSync(__dirname+'/../public/files/project_managing_files/'+project['project']);
  } catch(e) {
    //if ( e.code != 'EEXIST' ) throw e;
  }
  var exfilename = "generatedname.png";
  if (project['uploadedFileName']) {
	  exfilename = project['uploadedFileName'];
  }
  var extfile = exfilename.split(".");
  var useext = extfile[extfile.length-1];
  var files_name_write = exfilename.replace(/[^a-z0-9_]+/gi, '-').replace(/^-|-$/g, '').replace("-"+useext,"").toLowerCase()+"."+useext;
  var i_n_file = 0;
	while (fs.existsSync(__dirname+'/../public/files/project_managing_files/'+project['project']+'/'+files_name_write)) {
		files_name_write = i_n_file+files_name_write;
		i_n_file++;
	}
			uploadImage(rawBody,files_name_write,project['project']);
			/*
			fs.writeFile(__dirname+'/../public/files/project_managing_files/'+project['project']+'/'+files_name_write, rawBody, 'binary', function(err){
				console.log(err);
				if(err) {
					res.status(500).end();
				} else {
					//res.status(200).end();
				}
			});*/
			mainFileIn = files_name_write;
			files.push(files_name_write);
			
    	});
     });

req.busboy.on('finish', function() {
	if(project['pfiles'] != ''){
		files = project['pfiles']+','+files;
	}
	if(project['pfiles'] != 'do_not_update'){
		updateProject(project['project'], files, token, res);
	}
	if(returnit !== ""){
		res.status(200).json([mainFileIn]);
	}else{
		res.status(200).json(files);
	}
      //res.writeHead(303, { Connection: 'close', Location: '/' });
      //res.end();
    });

req.pipe(req.busboy);

};

function updateProject(pid, files, token, res){
    var id = pid;

    var updatePrj = '{"project":{"_id":"'+id+'"';

    if (files != null && files != ""){
        updatePrj += ', "files":"'+files+'"';
    }
	
    updatePrj += '}}';


    var post_data = updatePrj;

    var options = {
        host: '127.0.0.1',
        path: '/project',
        port: '3002',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(post_data),
            'Authorization': 'Bearer '+token
        }
    };


    var reqq = http.request(options, function(response){
        var str = '';
        response.on('data', function (data){
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
}