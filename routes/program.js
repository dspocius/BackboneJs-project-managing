var http = require('http');
var fs = require('fs');

exports.users = function(req, res) {
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
	
	var city = req.params.city || '';
	var gender = req.params.gender || '';
	var yearsfrom = req.params.yearsfrom || 16;
	var yearsto = req.params.yearsto || 99;
	var search = req.params.search || '';
	var skip = req.params.skip || 0;
	
	if (city == "-") { city = ""; }
	var country = "";
	if (city != "" && city != "-" && city.indexOf("___COUNTRY___") > -1) {
		 country = city.split("___COUNTRY___")[0];
		 city = city.split("___COUNTRY___")[1];
	}
	if (gender == "-") { gender = ""; }
	if (search == "-") { search = ""; }
	if (yearsfrom == "-") { yearsfrom = 16; }
	if (yearsto == "-") { yearsto = 99; }
	
    if (username == '' || token == ''){
        return res.status(400).end();
    }
	
	var post_data = '{"skip": '+skip+', "search": "'+search+'", "country": "'+country+'", "city": "'+city+'", "gender": "'+gender+'", "yearsfrom": "'+yearsfrom+'", "yearsto": "'+yearsto+'"}';

var options = {
  host: '127.0.0.1',
  path: '/userssearch',
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
			return res.status(200).json(str);
		}

  });
});

reqq.write(post_data);
reqq.end();
};

exports.friendssearch = function(req, res) {
    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
	
	var search = req.params.search || '';
	if (search == '') {
		return res.status(400).end();
	}
	
    if (username == '' || token == ''){
        return res.status(400).end();
    }

    var options = {
        host: '127.0.0.1',
        path: '/friends/'+search,
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

exports.getUser = function(req, res) {
	var username = req.params.username || '';
	var calling = req.params.calling || '';
	if (username == '') {
		return res.status(400).end();
	}
	
	var myusername = "";
	if (typeof req.cookies != "undefined" && typeof req.cookies.username != "undefined" && 
	username != req.cookies.username) {
		myusername = "/"+req.cookies.username;
	}
	if (calling != '') {
		myusername = "/__ASDASDASDASDASDASDASDASDZZ__"+calling;
	}
	
    var options = {
        host: '127.0.0.1',
        path: '/user/'+username+myusername,
        port: '3002',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
            //'Authorization': 'Bearer '+token
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

exports.getCountforfriends = function(req, res) {
	var username = req.params.username || '';
	if (username == '') {
		return res.status(400).end();
	}
	
    var options = {
        host: '127.0.0.1',
        path: '/countfriends/'+username,
        port: '3002',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
            //'Authorization': 'Bearer '+token
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

exports.loadmorefriends = function(req, res) {
/*    var username = req.cookies.username || '';
    var token = req.cookies.token || '';
    if (username == '' || token == ''){
        return res.status(400).end();
    }*/
	var skip = req.params.skip || 0;
	var which = req.params.which || "friends";
	var username = req.params.username || '';
	if (username == '') {
		return res.status(400).end();
	}
	
    var options = {
        host: '127.0.0.1',
        path: '/morefriends/'+username+"/"+skip+"/"+which,
        port: '3002',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
            //'Authorization': 'Bearer '+token
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

function createDirFiles(program, req, res){
	var token = req.cookies.token || '';
	
try {
    fs.mkdirSync('../client/public/files/'+program._id);
  } catch(e) {
    //if ( e.code != 'EEXIST' ) throw e;
  }

var direct2 = "";
if(program.directory != null && program.directory != ""){
direct2 = program.directory+"/";

try {
    fs.mkdirSync('../client/public/files/'+program._id+"/"+program.directory);
  } catch(e) {
    //if ( e.code != 'EEXIST' ) throw e;
  }

}

        fs.writeFile('../client/public/files/'+program._id+"/"+direct2+program.file, "", 'binary', function(err){
            if(err) {
                res.status(500).end();
            } else {
		res.status(200).end();
            }
        });
program.file = direct2+program.file;
sendUpdateFilePutReq(program, token, true,'program', res);

}

function sendUpdateFilePutReq(program, token, sendResponse, path_to, res){
	
	var updateProgram = '{"program":{"_id":"'+program._id+'"';
	updateProgram += ', "files":"'+program.file+'"';
	updateProgram += '}}';


	var post_data = updateProgram;

var options = {
  host: '127.0.0.1',
  path: '/'+path_to,
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
	  if(sendResponse){
		if(str != "OK"){
			return res.status(400).end();
		}else{
			return res.status(200).end();
		}
	  }
  });
});

reqq.write(post_data);
reqq.end();
	
}

exports.updateNewFileContent = function(req, res){
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}

	var program = req.body.program;
	if (program == null || program._id == null || program.file == null) {
		return res.status(400).end();
	}


	createDirFiles(program, req, res);

};

exports.updateFileContent = function(req, res){
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}

	var program = req.body.program;
	if (program == null || program._id == null || program.file == null || program.content == null) {
		return res.status(400).end();
	}

        fs.writeFile('../client/public/files/'+program._id+"/"+program.file, program.content, 'binary', function(err){
            if(err) {
                res.status(500).end();
            } else {
		res.status(200).end();
            }
        });
};

exports.uploadfile = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}

    var fstream;
    var program = [];

    req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
       program[fieldname] = val;
    });

    req.busboy.on('file',function(fieldname, file, filename, encoding, mimetype){
	var rawBody = new Buffer('');
	program['pic'] = filename; 
        file.on('data',function(data){
		rawBody = Buffer.concat([rawBody, data]);
        });

        file.on('end', function(){

program['rawBody'] = rawBody;
program['filename'] = filename;

    	});
     });

    req.busboy.on('finish', function() {

try {
    fs.mkdirSync('../client/public/files/'+program['_id']);
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
  var dirtocreate = "";
  if(program['directory'] != "" && program['directory'] == null){
 try {
    fs.mkdirSync('../client/public/files/'+program['_id']+"/"+program['directory']);
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
  dirtocreate = program['directory']+"/";
  }
        fs.writeFile('../client/public/files/'+program['_id']+'/'+dirtocreate+program['filename'], program['rawBody'], 'binary', function(err){
            if(err) {
                res.status(500).end();
            } else {
		program['pic'] = dirtocreate+program['filename'];
            }
        });

	if (program['_id'] == null || program['_id'] == undefined || program['_id'] == "" || program['pic'] == null || program['pic'] == "") {
		res.status(400).end();
	}

	var updateProgram = '{"program":{"_id":"'+program['_id']+'"';
	updateProgram += ', "files":"'+program['pic']+'"';
	updateProgram += '}}';


	var post_data = updateProgram;

var options = {
  host: '127.0.0.1',
  path: '/program',
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


    });

req.pipe(req.busboy);



};
exports.updateProgramsFiles = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}
	var id = req.params.id || '';
	var zipFile = req.params.zip || '';
	if (id == '') {
		return res.status(400).end();
	}
	
var walk    = require('walk');


/*var requestt = require('request'),
    zlibb = require('zlib'),
    fss = require('fs'),
    outt = fs.createWriteStream('C:\Users\ramunas\Desktop\nodeSistema\client\public\files\5572ae002efcbfdc12c862ee');
	
request('http://127.0.0.1/files/5572ae002efcbfdc12c862ee/index.html.gz').pipe(zlib.createGunzip()).pipe(out);
*/


if(zipFile != ''){
	var AdmZip = require('adm-zip');

		try { 
		var zippp = new AdmZip(__dirname+'/../public/files/'+id+'/'+zipFile);
		zippp.extractAllTo(__dirname+'/../public/files/'+id+'/');
	} catch ( e ) { 
		console.log( 'Caught exception: ', e );
	}
}
    
    //var zipEntries = zip.getEntries(); // an array of ZipEntry records

    /*zipEntries.forEach(function(zipEntry) {
        console.log(zipEntry.toString()); // outputs zip entries information
        if (zipEntry.entryName == "my_file.txt") {
             console.log(zipEntry.data.toString('utf8')); 
        }
    });*/
    // outputs the content of some_folder/my_file.txt
    //console.log(zip.readAsText("some_folder/my_file.txt")); 
    // extracts the specified file to the specified location
    //zip.extractEntryTo(/*entry name*/"some_folder/my_file.txt", /*target path*/"/home/me/tempfolder", /*maintainEntryPath*/false, /*overwrite*/true);
    // extracts everything
    //zip.extractAllTo(/*target path*/"C:\Users\ramunas\Desktop\nodeSistema\client\public\files\5572ae002efcbfdc12c862ee", /*overwrite*/true);

// Walker options
    var window = {};
var walker  = walk.walk(__dirname+'/../public/files/'+id, { followLinks: false });
    window.fileszzai   = [];
walker.on('file', function(root, stat, next) {
    // Add this file to the list of files
	var dir_good = root.replace(/\//g,'/').replace(/\\/g,'/').replace('\\','/').split(id+'/')[1];
	var directoryIn = '';
	if(typeof dir_good != 'undefined' && dir_good != ''){
		directoryIn = dir_good+'/';
	}
	//var program = {file:directoryIn+stat.name};
		//var fileObject = {program:program};
    //directoryIn+
    window.fileszzai.push(directoryIn+stat.name);
	//var programUpdate = {program:{ _id:'', directory:'', file:'' }};
    next();
});

walker.on('end', function() {
	var program = {_id:id};
	program.file = [];
	for(var i=0; i < window.fileszzai.length; i++){
		program.file.push(window.fileszzai[i]);
	}
		sendUpdateFilePutReq(program, token, false,'program_update_all', res);
	return res.status(200).end();
});

};
exports.upload = function(req, res) {

	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}


    var fstream;
	var program = [];
    req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
       program[fieldname] = val;
	console.log(program['name']);
    });

    req.busboy.on('file',function(fieldname, file, filename, encoding, mimetype){
	var rawBody = new Buffer('');
        file.on('data',function(data){
		rawBody = Buffer.concat([rawBody, data]);
        });

        file.on('end', function(){
        fs.writeFile('/public/files/'+filename, rawBody, 'binary', function(err){
            if(err) {
                res.status(500).end();
            } else {
                //res.status(200).end();
            }
        });
    	});
     });

req.busboy.on('finish', function() {
      res.status(200).end();
      //res.writeHead(303, { Connection: 'close', Location: '/' });
      //res.end();
    });

req.pipe(req.busboy);

};

exports.programs = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}

var options = {
  host: '127.0.0.1',
  path: '/programs/'+username,
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

exports.allprograms = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}

var options = {
  host: '127.0.0.1',
  path: '/allprograms/',
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

exports.program = function(req, res) {
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
  path: '/program/'+id,
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

	var program = req.body;
	if (program == null || program.name == null || program.desc == null) {
		return res.status(400).end();
	}

	var post_data = '{"program":{"name": "'+program.name+'", "desc": "'+program.desc+'", "users": "'+username+'"}}';

var options = {
  host: '127.0.0.1',
  path: '/program',
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


exports.createProgramOn = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}

	var program = req.body;
	if (program == null || program.name == null || program.file == null || program.pid == null) {
		return res.status(400).end();
	}

	var post_data = '{"program":{"name": "'+program.name+'", "desc": "'+program.desc+'", "pic": "'+program.pic+'", "file": "'+program.file+'", "pid": "'+program.pid+'", "users": "'+username+'"}}';

var options = {
  host: '127.0.0.1',
  path: '/createprogramon',
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

if (req.body.program == null || req.body.program == "" || req.body.program == undefined) {

    var fstream;
    var program = [];

    req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
       program[fieldname] = val;
    });

    req.busboy.on('file',function(fieldname, file, filename, encoding, mimetype){
	var rawBody = new Buffer('');
	program['pic'] = filename; 
        file.on('data',function(data){
		rawBody = Buffer.concat([rawBody, data]);
        });

        file.on('end', function(){
        fs.writeFile('../client/public/files/'+filename, rawBody, 'binary', function(err){
            if(err) {
                res.status(500).end();
            } else {
		program['pic'] = filename;
            }
        });
    	});
     });

    req.busboy.on('finish', function() {

	if (program['_id'] == null || program['_id'] == undefined || program['_id'] == "") {
		res.status(400).end();
	}

	var updateProgram = '{"program":{"_id":"'+program['_id']+'"';

	if (program['name'] != null && program['name'] != "") {
		updateProgram += ', "name":"'+program['name']+'"';
	}

	if (program['desc'] != null && program['desc'] != "") {
		updateProgram += ', "desc":"'+program['desc']+'"';
	}
	
	if (program['pic'] != null && program['pic'] != "") {
		updateProgram += ', "pic":"'+program['pic']+'"';
	}
	
	updateProgram += '}}';


	var post_data = updateProgram;

var options = {
  host: '127.0.0.1',
  path: '/program',
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


    });

req.pipe(req.busboy);


}else{

	var program = req.body.program;


	if (program == null || program._id == null) {
		res.status(400).end();
	} 

	var updateProgram = '{"program":{"_id":"'+program._id+'"';

	if (program.name != null && program.name != "") {
		updateProgram += ', "name":"'+program.name+'"';
	}

	if (program.desc != null && program.desc != "") {
		updateProgram += ', "desc":"'+program.desc+'"';
	}
	
	if (program.pic != null && program.pic != "") {
		updateProgram += ', "pic":"'+program.pic+'"';
	}

	if (program.deletefile != null && program.deletefile != "") {
fs.unlink('../client/public/files/'+program._id+'/'+program.deletefile, function (err) {
  //if (err) throw err;
});
		updateProgram += ', "deletefile":"'+program.deletefile+'"';
	}
	
	updateProgram += '}}';


	var post_data = updateProgram;

var options = {
  host: '127.0.0.1',
  path: '/program',
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

}




};

exports.updateUser = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}
	
	var userr = req.body;

	if (userr == null) {
		res.status(400).end();
	} 
	var emaill = username;
	//if (userr.email != null && userr.email != "") {
		//emaill = userr.email;
	//}
	var updateUssr = '{"user":{"email":"'+emaill+'"';
	if (userr.pic != null && userr.pic != "") {
		updateUssr += ', "pic":"'+userr.pic+'"';
	}
	if (userr.real_email != null && userr.real_email != "") {
		updateUssr += ', "real_email":"'+userr.real_email+'"';
	}
	if (userr.friendApprove != null && userr.friendApprove != "") {
		updateUssr += ', "friendApprove":"'+userr.friendApprove+'"';
		if (userr.approvehim != null && userr.approvehim != "") {
			updateUssr += ', "approvehim":'+userr.approvehim+'';
		}
	}
	if (userr.friendsAdd != null && userr.friendsAdd != "" && 
	userr.addMeToThat != null && userr.addMeToThat != "" && 
	typeof userr.friendemail != null && userr.friendemail != "") {
		updateUssr += ', "friendemail":"'+userr.friendemail+'"';

		var friendsObj = '';
		var i=0;
		var jsonTObj = '{"_id":"'+ userr.friendsAdd[i]._id+'","real_email":"'+userr.friendsAdd[i].real_email+'","email":"'+userr.friendemail+'","following":"'+ userr.friendsAdd[i].following+'","request_sent":"'+ userr.friendsAdd[i].request_sent+'","firstname":"'+ userr.friendsAdd[i].firstname+'","lastname":"'+ userr.friendsAdd[i].lastname+'","approved":false,"pic":"'+ userr.friendsAdd[i].pic+'","pending":true,"onlyupdate":'+userr.friendsAdd[i].onlyupdate+',"which":"'+userr.friendsAdd[i].which+'","show":'+ userr.friendsAdd[i].show+',"follower":'+ userr.friendsAdd[i].follower+',"blocked":false, "remove":false, "blockedBy":false}';
		var addMeToThat = '{"_id":"'+ userr.addMeToThat._id+'","real_email":"'+userr.addMeToThat.real_email+'","email":"'+ username+'","following":"'+ userr.addMeToThat.following+'","request_sent":"'+ userr.addMeToThat.request_sent+'","firstname":"'+ userr.addMeToThat.firstname+'","lastname":"'+ userr.addMeToThat.lastname+'","approved":false,"pic":"'+ userr.addMeToThat.pic+'","pending":true,"onlyupdate":'+userr.addMeToThat.onlyupdate+',"which":"'+userr.addMeToThat.which+'","show":'+ userr.addMeToThat.show+',"follower":'+ userr.addMeToThat.follower+',"blocked":false, "remove":false, "blockedBy":false}';
		if(i==0){
			friendsObj += jsonTObj;
		}else{
			friendsObj += ','+jsonTObj;
		}
		updateUssr += ', "friends":['+friendsObj+']';
		updateUssr += ', "addMeToThat":'+addMeToThat+'';
	}
	if (userr.removeFriends != null && userr.removeFriends != "") {
		var friendsObj = '';
		for(var i=0; i < userr.removeFriends.length; i++){
			var removeIt = '';
			var onlyhide = '';
			var blockIt = '';
			var blockedBy = '';
			if(typeof userr.removeFriends[i].remove != 'undefined'){
				removeIt = ',"remove":'+userr.removeFriends[i].remove;
			}
			if(typeof userr.removeFriends[i].onlyhide != 'undefined'){
				onlyhide = ',"onlyhide":'+userr.removeFriends[i].onlyhide;
			}
			if(typeof userr.removeFriends[i].block != 'undefined'){
				blockIt = ',"block":'+userr.removeFriends[i].block;
			}
			
			var jsonTObj = '{"_id":"'+ userr.removeFriends[i]._id+'"'+blockedBy+onlyhide+blockIt+removeIt+'}';
			if(i==0){
				friendsObj += jsonTObj;
			}else{
				friendsObj += ','+jsonTObj;
				}
		}
		updateUssr += ', "removeFriends":['+friendsObj+']';
	}
	if (userr.mainprogram != null && userr.mainprogram != "") {
		var mainObj = '{"_id":"'+ userr.mainprogram._id+'","name":"'+ userr.mainprogram.name+'","pic":"'+ userr.mainprogram.pic+'"}';
		updateUssr += ', "mainprogram":'+mainObj+'';
		/*res.cookie('mainprogram', userr.mainprogram);*/
	}
	if (userr.programs != null && userr.programs != "") {
		var programsObj = '';
		for(var i=0; i < userr.programs.length; i++){
			var programJson = '{"_id":"'+ userr.programs[i]._id+'","name":"'+ userr.programs[i].name+'","pic":"'+ userr.programs[i].pic+'"}';
			if(i==0){
				programsObj += programJson;
			}else{
				programsObj += ','+programJson;
			}
		}
		
		updateUssr += ', "programs":['+programsObj+']';
		/*updateUssr += ', "programs":"'+userr.programs+'"';
		var progcookie = [];
		if(typeof req.cookies.programs != undefined && req.cookies.programs != ""){
			if(req.cookies.programs.constructor === Array){
				progcookie = req.cookies.programs;
			}else{
				progcookie = [req.cookies.programs];
			}
		}
		progcookie.push(userr.programs);
		res.cookie('programs', progcookie);*/
	}
	if (userr.address != null && userr.address != "") {
		updateUssr += ', "address":'+userr.address+'';
	}	
	if (userr.additional_data != null && userr.additional_data != "") {
		var adddata = '{"vatnumb":"'+ userr.additional_data.vatnumb+'","ycode":"'+ userr.additional_data.ycode+'","yaddress":"'+ userr.additional_data.yaddress+'","firstname_acc":"'+ userr.additional_data.firstname_acc+'","gender":"'+ userr.additional_data.gender+'","lastname_acc":"'+ userr.additional_data.lastname_acc+'","city_acc":"'+ userr.additional_data.city_acc+'","birthday":'+ userr.additional_data.birthday+',"birthmonth":'+ userr.additional_data.birthmonth+',"birthyear":'+ userr.additional_data.birthyear+',"about_name":"'+ userr.additional_data.about_name.replace(/(?:\r\n|\r|\n)/g, '<br>')+'"}';
		updateUssr += ', "additional_data":'+adddata+'';
	}
	if (userr.programdelete != null && userr.programdelete != "") {
		updateUssr += ', "programdelete":"'+userr.programdelete+'"';
		
		/*var progcookie = req.cookies.programs;

			var programzzz = progcookie;

			var programzs = [];
			for(var ii=0; ii < programzzz.length; ii++){
			    var programFilez = programzzz[ii];
				//for(var jj=0; jj < programFilez.length; jj++){
					if(programFilez != userr.programdelete && programzs.indexOf(programFilez) == -1) programzs.push(programFilez);
				//}
			}
		
		res.cookie('programs', programzs);*/		
	}
	
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
			console.log("AAA"+str);
			return res.status(400).end();
		}else{
			return res.status(200).end();
		}

  });
});

reqq.write(post_data);
reqq.end();

};

exports.delete = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}
	var id = req.params.id || '';
	if (id == '') {
		return res.status(400).end();
	}
var bodyProgram = '{}';
var options = {
  host: '127.0.0.1',
  path: '/program/'+id,
  port: '3002',
  method: 'DELETE',
  headers: {
        'Content-Type': 'application/json',
	'Content-Length': Buffer.byteLength(bodyProgram),
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
reqq.write(bodyProgram);
reqq.end();

};

exports.deleteprogramon = function(req, res) {
	var username = req.cookies.username || '';
	var token = req.cookies.token || '';
	if (username == '' || token == ''){
		return res.status(400).end();
	}
	var id = req.params.id || '';
	if (id == '') {
		return res.status(400).end();
	}
var bodyProgram = '{}';
var options = {
  host: '127.0.0.1',
  path: '/deleteprogramon/'+id,
  port: '3002',
  method: 'DELETE',
  headers: {
        'Content-Type': 'application/json',
	'Content-Length': Buffer.byteLength(bodyProgram),
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
reqq.write(bodyProgram);
reqq.end();

};

