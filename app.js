/*jshint node:true*/
var compression = require('compression')
var express = require('express');
var routes = require('./routes/index');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
var busboy = require('connect-busboy');

var pdf = require('./routes/pdf');
var channel = require('./routes/channel');
var comments = require('./routes/comments');
var messages = require('./routes/messages');
var users = require('./routes/users');
var tools = require('./routes/tools.js');
var program = require('./routes/program.js');
var project = require('./routes/projectt.js');
var project_legal = require('./routes/project_legal.js');
var routeshttp = require('./routes/routes.js');
var app = express();
app.use(compression())

app.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});
app.use(express.static(__dirname, { dotfiles: 'allow' } ));

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(busboy({limits: {
    fileSize: 25 * 1024 * 1024//25mb
  }}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));//{fallthrough: false}

app.get('/', routes.index);
app.delete('/logout', routes.logout);
app.post('/remember_password', routes.remember_password);
app.post('/login_google', routes.login_google);
app.post('/login', routes.login);
app.post('/register_google', routes.register_google);
app.post('/register', routes.register);
app.get('/setUserReadCookies', tools.setUserReadCookies);
app.get('/check_if_cookie_read', tools.check_if_cookie_read);
app.get('/checkifuserloggedin', tools.checkifuserloggedin);

app.get('/routes', routeshttp.getAllroutes);
app.get('/route/:id',routeshttp.getroute);
app.delete('/route/:id',routeshttp.deleteroute);
app.post('/route', routeshttp.create); 
app.put('/route', routeshttp.update); 


app.get('/projectss/:username', project_legal.projects);
app.get('/projectt/:id', project_legal.project);
app.get('/projectt/:id/:username', project_legal.project);
app.get('/projectentryy/:id', project_legal.projectentry);
app.get('/projectentryy/:id/:skip', project_legal.projectentry);
app.get('/projectentryy/:id/:skip/:username', project_legal.projectentry);
app.get('/projectsinlistt_old/:id/:skip', project_legal.projectsinlist_old);
app.get('/projectsinlistt_old/:id/:skip/:username', project_legal.projectsinlist_old);
app.get('/projectsinlistt_old_count/:id', project_legal.projectsinlist_old_count);
app.get('/projectsinlistt_old_count/:id/:username', project_legal.projectsinlist_old_count);
app.get('/projectsinlistt/:id', project_legal.projectsinlist);
app.get('/projectsinlistt/:id/:username', project_legal.projectsinlist);

app.post('/projectt', project.cproject);
app.post('/project_uploadd', project.project_fileupload);
app.put('/projectt/:id', project.cupdate);
app.delete('/projectt/:id', project.cdelete);

app.post('/notifybyemail', project.notifybyemail);

app.post('/projectsFind', project.projectsFind);
app.get('/projects', project.projects);
app.get('/projectstimeline', project.projectstimeline);
app.get('/projectstimeline/:skip', project.projectstimeline);
app.get('/projectsfriend/:id', project.projectsfriend);
app.get('/projectsfriend/:id/:username', project.projectsfriend);

/*Just for safe - used old API but safe new functions*/
app.get('/project/:id', project_legal.project);
app.get('/projectentry/:id', project_legal.projectentry);
app.get('/projectsinlist_old/:id/:skip', project_legal.projectsinlist_old);
app.get('/projectsinlist_old_count/:id', project_legal.projectsinlist_old_count);
app.get('/projectsinlist/:id', project_legal.projectsinlist);
/* OLD - not safe
app.get('/project/:id', project.project);
app.get('/projectentry/:id', project.projectentry);
app.get('/projectsinlist_old/:id/:skip', project.projectsinlist_old);
app.get('/projectsinlist_old_count/:id', project.projectsinlist_old_count);
app.get('/projectsinlist/:id', project.projectsinlist);
*/
app.post('/project', project.cproject);
app.get('/description_in', project.cdescription);
app.post('/project_upload', project.project_fileupload);
app.post('/project_upload_customer/:returnit', project.project_fileupload);
app.put('/project/:id', project.cupdate);
app.put('/projectTasks/:id', project.cupdateTasks);
app.delete('/project/:id', project.cdelete);

app.get('/getMyChannels/:what/:skip', channel.getMyChannels);
app.get('/channelsOpen/:what/:skip', channel.channelsOpen);
app.post('/addPeopleToChannel/', channel.addPeopleToChannel);
app.post('/ChangeChannelsView/', channel.ChangeChannelsView);
app.post('/createChannel/', channel.createChannel);

app.get('/comment_is_username/:what', comments.comment_is_username);
app.get('/countByUsername/:what', comments.countByUsername);
app.get('/commentsU/:what/:skip/:u', comments.get);
app.get('/comments/:what/:skip', comments.get);
app.get('/commentsU/:what/:skip/:u/:msgid/:skipcomments', comments.get);
app.get('/comments/:what/:skip/:msgid/:skipcomments', comments.get);
app.post('/commentAddByUser/', comments.updateByUser);
app.post('/comment/', comments.update);
app.post('/commentReset/', comments.updateCommentReset);

app.get('/analyse_pdf/:pdf_file', pdf.index);
app.post('/createhtmlfileapigo', pdf.createhtmlfileapigo);
app.put('/createhtmlfile', pdf.createhtmlfile);
app.post('/createhtml', pdf.createhtmlfile);
app.put('/download_pdf', pdf.download_pdf);
app.post('/downloadpdfpigo', pdf.downloadpdfapigo);

app.get('/messages/:id/:s_id', messages.messages);
app.get('/messages/:id/:s_id/:skip', messages.messages);
app.post('/message/', messages.message);
app.post('/messages_file_upload/', messages.message_fileupload);

app.post('/addmoneytomyxacc', users.addmoneytomyxacc);
app.post('/payfrommyaccount', users.payfrommyaccount);
app.post('/updateUsertoks', users.updateUsertoks);
app.get('/get_info_from_ip', users.get_info_from_ip);
app.put('/uploaduserphoto/', users.update);
app.put('/updateuser/', program.updateUser);
app.get('/allprograms/', program.allprograms);
app.get('/programs/', program.programs);
app.get('/program/:id',program.program);
app.get('/updateprogramsfiles/:id',program.updateProgramsFiles);
app.get('/updateprogramsfiles/:id/:zip',program.updateProgramsFiles);
app.delete('/program/:id',program.delete);
app.delete('/deleteprogramon/:id', program.deleteprogramon); 
app.post('/createprogramon', program.createProgramOn); 
app.post('/program', program.create); 
app.post('/updateprogram', program.update); 
app.post('/uploadfileprogram', program.uploadfile);
app.get('/users/:search', program.users);
app.get('/users/:search/:city', program.users);
app.get('/users/:search/:city/:gender', program.users);
app.get('/users/:search/:city/:gender/:yearsfrom/:yearsto', program.users);
app.get('/users/:search/:city/:gender/:yearsfrom/:yearsto/:skip', program.users);
app.get('/friends/:search', program.friendssearch);
app.get('/user/:username', program.getUser);
app.get('/user/:username/:calling', program.getUser);
app.get('/countforfriends/:username', program.getCountforfriends);
app.get('/loadmorefriends/:username/:skip/:which', program.loadmorefriends);

app.put('/updatenewfilecontent', program.updateNewFileContent); 
app.put('/updatefilecontent', program.updateFileContent); 
app.post('/upload', program.upload); 

  app.get(/(.*\.pdf)\/([0-9]+).png$/i, function (req, res) {
    var pdfPath = __dirname + '/public/'+req.params[0];
    var pageNumber = req.params[1];
 
    var PDFImage = require("pdf-image").PDFImage;
    var pdfImage = new PDFImage(pdfPath);
 
    pdfImage.convertPage(pageNumber).then(function (imagePath) {
      res.sendFile(imagePath);
    }, function (err) {
      res.send(err, 500);
    });
  });

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
   //res.sendFile("./files/brand/logo.png");
    next(err);
});

/*
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}
*/
function isSecure(req) {
  if (req.headers['x-forwarded-proto']) {
    return req.headers['x-forwarded-proto'] === 'https';
  }
  return req.secure;
};
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test'/* && !isSecure(req)*/) {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  } else {
    next();
  }
});


app.use(function(err, req, res, next) {
    if (req.path.indexOf("/files") > -1) {
		let uselogo = "logo.png";
		if (req.headers.host.indexOf("bendrauju") > -1) {
			uselogo = "be.png";
		}
		if (req.headers.host.indexOf("doingtalk") > -1) {
			uselogo = "talk.png";
		}
		if (req.headers.host.indexOf("ronaldocom") > -1) {
			uselogo = "rnotfound.png";
		}
        res.sendFile(__dirname + "/public/files/brand/"+uselogo);
    }else{
		res.status(err.status || 500);
		var err = new Error('Not Found');
		res.render('error', {
			message: err,
			error: {}
		});
	}
});


module.exports = app;
