var appControllers = angular.module('appControllers', []);

appControllers.controller('ProgramsPageCtrl', ['$scope', 'UserService', '$location', '$window', '$sce','ProgramService','AuthenticationService','globalMenuService',
function ProgramsPageCtrl($scope, UserService, $location, $window, $sce,ProgramService,AuthenticationService, globalMenuService) {

	  //if(!AuthenticationService.UserIsAuthenticated(AuthenticationService)){
		//$location.path("/login");
	  var contrFunction = function(){
		  
		  var mainprogram = AuthenticationService.mainprogram;
		  var programsmine = AuthenticationService.programs;
		  var mainsProgramsPid = "";
		  
	$scope.programs = [];
	UserService.getUserInfo(AuthenticationService.username).success(function(infoAboutUserr){
            		ProgramService.allprograms().success(function(data) {
	var infoAboutUser = JSON.parse(infoAboutUserr);
	var obj = JSON.parse(data);
	if(obj.length != 0){
		for(var ii=0; ii < obj.length; ii++){
			obj[ii].inmyprogramslist = false;
			obj[ii].notmain = false;
			var inProgramsList = false;
			if(typeof infoAboutUser.programs != 'undefined'){
				for(var i=0; i < infoAboutUser.programs.length; i++){
					if(infoAboutUser.programs[i]._id == obj[ii].pid){
						inProgramsList = true;
					}
				}
			}
			if(inProgramsList){
				obj[ii].inmyprogramslist = true;
			}
			if(typeof infoAboutUser.mainprogram != 'undefined' && obj[ii].pid == infoAboutUser.mainprogram._id){
				mainsProgramsPid = obj[ii].pid;
				obj[ii].notmain = true;
			}
		}
		$scope.programs = obj;
	}
            		}).error(function(status, data) {
                		$scope.status = "";
            			console.log(status);
                		console.log(data);
            		});			  
	});
		  
    $scope.addToMyList = function(model) {
		var pid = model.pid;
		model._id = model.pid;
            		UserService.updateProgramsList(model).success(function() {
			//$scope.status = "Updated";
			//$timeout(function(){ $scope.status = ""; }, 2000);
			$("#addToMyProgramsList"+pid).hide();
			$("#deleteFList"+pid).show();
					$("#addToMyProgramsList"+pid).attr("class","");
					$("#deleteFList"+pid).attr("class","");
            		}).error(function(status, data) {
                		//$scope.status = "Program not found";
            			console.log(status);
                		console.log(data);
            		});
	}
    $scope.updateProgramMainList = function(model) {
		var pid = model.pid;
		model._id = model.pid;
            		UserService.updateProgramMainList(model).success(function() {
			//$scope.status = "Updated";
			//$timeout(function(){ $scope.status = ""; }, 2000);
			$("#makeMain"+mainsProgramsPid).show();
			$("#makeMain"+pid).hide();
					$("#makeMain"+mainsProgramsPid).attr("class","");
					$("#makeMain"+pid).attr("class","");
			mainsProgramsPid = pid;
            		}).error(function(status, data) {
                		//$scope.status = "Program not found";
            			console.log(status);
                		console.log(data);
            		});
	}
    $scope.deleteFromList = function(model) {
		var pid = model.pid;
		model._id = model.pid;
            		UserService.updateDeleteProgramsList(model._id).success(function() {
			//$scope.status = "Updated";
			//$timeout(function(){ $scope.status = ""; }, 2000);
			$("#addToMyProgramsList"+pid).show();
			$("#deleteFList"+pid).hide();
					$("#addToMyProgramsList"+pid).attr("class","");
					$("#deleteFList"+pid).attr("class","");
            		}).error(function(status, data) {
                		//$scope.status = "Program not found";
            			console.log(status);
                		console.log(data);
            		});
	}
		  globalMenuService.initializeScopeListening($scope, $location, AuthenticationService);
	  }

var authent = AuthenticationService.UserIsAuthenticated(AuthenticationService);
if(typeof authent == "boolean" && authent){
	contrFunction();
}else{
	//it is a promise
	authent.then(function(isAuthent) {
		if(isAuthent){
			contrFunction();
		}else{
			$location.path("/login");
		}
		
	}).catch(function() {
		$location.path("/login");
	});
}  
	  
}
]);

appControllers.controller('FirstPageCtrl', ['$sce','$scope', '$http', '$location', '$window', 'ExternalTools','ProgramService','AuthenticationService','UserService','globalMenuService',
function FirstPageCtrl($sce, $scope, $http, $location, $window, ExternalTools,ProgramService,AuthenticationService, UserService, globalMenuService) {
	  var contrFunction = function(){
		  this.allPrograms = '';
		  this.programsIn = [];
			ExternalTools.clickMenu();
			UserService.getUserInfo(AuthenticationService.username).success(function(infoAboutUserr){
				var infoAboutUser = JSON.parse(infoAboutUserr);
				var obj = infoAboutUser.programs;
				var mainsProgramsPid = '';
				var isNotInProgramsList = false;
				for(var ii=0; ii < obj.length; ii++){
					obj[ii].notmain = false;
					var inProgramsList = false;
					obj[ii].inmyprogramslist = true;
					if(typeof infoAboutUser.mainprogram != 'undefined' && obj[ii]._id == infoAboutUser.mainprogram._id){
						obj[ii].notmain = true;
						mainsProgramsPid = infoAboutUser.mainprogram._id;
					}
				}
				if(mainsProgramsPid == ''){
					if(typeof infoAboutUser.mainprogram != 'undefined' && '' != infoAboutUser.mainprogram._id){
						infoAboutUser.mainprogram.notmain = true;
						infoAboutUser.mainprogram.inmyprogramslist = false;
						infoAboutUser.programs.push(infoAboutUser.mainprogram);
						mainsProgramsPid = infoAboutUser.mainprogram._id;
						isNotInProgramsList = true;
					}
				}
				$scope.mainProgram = infoAboutUser.mainprogram;
				$scope.programs = infoAboutUser.programs;
				$scope.updateProgramMainList = function(model) {
					var pid = model._id;
					model._id = model._id;
					UserService.updateProgramMainList(model).success(function() {
						//$scope.status = "Updated";
						//$timeout(function(){ $scope.status = ""; }, 2000);
						$("#makeMain"+mainsProgramsPid).show();
						$("#makeMain"+pid).hide();
						$("#makeMain"+mainsProgramsPid).attr("class","");
						$("#makeMain"+pid).attr("class","");
						if(isNotInProgramsList){
							$("#my_prog"+mainsProgramsPid).remove();
							isNotInProgramsList = false;
						}
						mainsProgramsPid = pid;
					}).error(function(status, data) {
						//$scope.status = "Program not found";
						console.log(status);
						console.log(data);
					});
				}
				$scope.deleteFromList = function(model) {
					var pid = model._id;
					model._id = model._id;
					UserService.updateDeleteProgramsList(model._id).success(function() {
						//$scope.status = "Updated";
						//$timeout(function(){ $scope.status = ""; }, 2000);
						$("#my_prog"+pid).remove();

					}).error(function(status, data) {
						//$scope.status = "Program not found";
						console.log(status);
						console.log(data);
					});
				}
				/*for (index = 0; index < infoAboutUser.programs.length; ++index) {
					var dat = infoAboutUser.programs[index];
					var ppic = '';
					var desc = dat.name;
					if(typeof dat.pic != 'undefined' && dat.pic != ''){
						ppic = '<img style="max-height:140px; max-width:174px; " src="/files/'+dat.pic+'" alt="" />';
					}else{
						ppic = '<h1>'+dat.name+'</h1>';
						desc = '';
					}
					  //var dt = '<div class="project_one program_one"><a href="/files/'+dat._id+'/index.html">'+ppic+'<div class="programdesc">'+desc+'</div></a></div>';
					  //if(this.programsIn.indexOf(dt) == -1){
						  //this.allPrograms += dt;
						  //var htmlD = $sce.trustAsHtml(this.allPrograms);
						  //this.programsIn.push(dt);
						  //$scope.allPrograms = htmlD;
					  //}
				}*/
			});
		  globalMenuService.initializeScopeListening($scope, $location, AuthenticationService);
	  }

var authent = AuthenticationService.UserIsAuthenticated(AuthenticationService);
if(typeof authent == "boolean" && authent){
	contrFunction();
}else{
	//it is a promise
	authent.then(function(isAuthent) {
		if(isAuthent){
			contrFunction();
		}else{
			$location.path("/login");
		}
		
	}).catch(function() {
		$location.path("/login");
	});
}	  
	  
}
]);

appControllers.controller('IndexCtrl', ['$scope', 'ExternalTools', '$location', '$window', '$sce','ProgramService','AuthenticationService','globalMenuService',
function IndexCtrl($scope, ExternalTools, $location, $window, $sce,ProgramService,AuthenticationService,  globalMenuService) {
  if(!AuthenticationService.UserIsAuthenticated(AuthenticationService)){
		$location.path("/login");
  }else{

	$scope.username = AuthenticationService.username;
	$scope.programs = [];
            		ProgramService.programs().success(function(data) {
	var obj = JSON.parse(data);
	if(obj.length != 0){
		$scope.programs = obj;
	}
            		}).error(function(status, data) {
                		$scope.status = "";
            			console.log(status);
                		console.log(data);
            		});	

    $scope.Add = function Add() {
        if (AuthenticationService.UserIsAuthenticated(AuthenticationService)) {
        	$location.path("/create/program");
        }
        else {
            $location.path("/login");
        }
    }

    $scope.deleteProgram = function deleteProgram(id) {
        if (AuthenticationService.UserIsAuthenticated(AuthenticationService)) {
				ProgramService.delete(id).success(function(data) {
					ProgramService.programs().success(function(data) {
					var obj = JSON.parse(data);
						if(obj.length != 0){
							$scope.programs = obj;
						}else{
							$scope.programs = {};
						}
					}).error(function(status, data) {
						$scope.status = "You have no programs";
						console.log(status);
						console.log(data);
					});	
				}).error(function(status, data) {
					$scope.status = status;
					console.log(status);
					console.log(data);
				});
        }
        else {
            $location.path("/login");
        }
    }
	  globalMenuService.initializeScopeListening($scope, $location, AuthenticationService);
  }
}
]);

appControllers.controller('ProgramFileEditCtrl', ['$timeout', '$http', '$scope', '$q', '$document', '$timeout', 'ExternalTools', '$location', '$routeParams', '$sce','ProgramService','AuthenticationService',
function ProgramFileEditCtrl($timeout, $http, $scope, $q, $document, $timeout, ExternalTools, $location, $routeParams, $sce,ProgramService,AuthenticationService) {
  if(!AuthenticationService.UserIsAuthenticated(AuthenticationService)){
		$location.path("/login");
  }else{
var editor = null;
$scope.program_id = $routeParams.id;
var fileName = $routeParams.file.split("..");
var myfile = fileName[fileName.length-1];

var wholefile = $routeParams.file;
for(var ii=0; ii < fileName.length; ii++)
	wholefile = wholefile.replace('..','/');

        loadScript = function (src) {
            var deferred = $q.defer();
            var script = $document[0].createElement('script');
            script.onload = script.onreadystatechange = function (e) {
                $timeout(function () {
                    deferred.resolve(e);
                });
            };
            script.onerror = function (e) {
                $timeout(function () {
                    deferred.reject(e);
                });
            };
            script.src = src;
            $document[0].body.appendChild(script);
            return deferred.promise;
        };

loadScript('/src-noconflict/ace.js').then(function() {
    editor = ace.edit("editor");

	var fileExt = myfile.split(".");
    editor.setTheme("ace/theme/chrome");
	var mode = "text";
	if(fileExt[1] != null && fileExt[1] != ""){
		if(fileExt[1] == "js"){
		mode = "javascript";
		}
		if(fileExt[1] == "html"){
		mode = "html";
		}
		if(fileExt[1] == "css"){
		mode = "css";
		}
	}
    editor.getSession().setMode("ace/mode/"+mode);

editor.commands.addCommand({
    name: 'myCommand',
    bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
    exec: function(editor) {
		var program = {};
		program._id = $routeParams.id;
		program.file = wholefile;
		program.content = editor.getSession().getValue();
            		ProgramService.updatefilecontent(program).success(function() {
			$scope.status = "Updated";
			$timeout(function(){ $scope.status = ""; }, 2000);
            		}).error(function(status, data) {
                		$scope.status = "Program not found";
            			console.log(status);
                		console.log(data);
            		});
    },
    readOnly: true
});

editor.getSession().on('change', function(e) {
    var checkboxtextchange = document.getElementById('updateWhenTextChanges').checked;
	if(checkboxtextchange){
		var program = {};
		program._id = $routeParams.id;
		program.file = wholefile;
		program.content = editor.getSession().getValue();
            		ProgramService.updatefilecontent(program).success(function() {
			//$scope.status = "Updated";
			//$timeout(function(){ $scope.status = ""; }, 2000);
            		}).error(function(status, data) {
                		$scope.status = "Program not found";
            			console.log(status);
                		console.log(data);
            		});
	}
});

$http.get('/files/'+$routeParams.id+'/'+wholefile).success (function(data){
			//var code = editor.getSession().getValue();
			editor.getSession().setValue(data);
		}).error(function(status, data) {
                		$scope.status = "File cannot be read";
            			console.log(status);
                		console.log(data);
            		});


}).catch(function() {
    $scope.status = "File cannot be read";
});

$scope.setTheme = function setTheme(them) {
if(them == ""){
them = document.getElementById("themeDown").value;
}
editor.setTheme("ace/theme/"+them);
}

	$scope.updateFile = function updateFile() {
		var program = {};
		program._id = $routeParams.id;
		program.file = wholefile;
		program.content = editor.getSession().getValue();

            		ProgramService.updatefilecontent(program).success(function() {
			$scope.status = "Updated";
			$timeout(function(){ $scope.status = ""; }, 2000);
            		}).error(function(status, data) {
                		$scope.status = "Program not found";
            			console.log(status);
                		console.log(data);
            		});
 	}


}


}
]);

appControllers.controller('ProgramCtrl', ['$timeout', '$scope', 'ExternalTools', '$location', '$routeParams', '$sce','ProgramService','AuthenticationService','globalMenuService',
function ProgramCtrl($timeout, $scope, ExternalTools, $location, $routeParams, $sce,ProgramService,AuthenticationService, globalMenuService) {
  var contrFunction = function(){
	$scope.username = AuthenticationService.username;
	$scope.program = {};
        var id = $routeParams.id;
	ProgramService.uploadfiles($scope);
	
	var updateProgram = function(){

            		ProgramService.program(id).success(function(data) {
			var obj = JSON.parse(data);
			if(obj.inprograms){
				$("#addtoprogramson").hide();
			}else{
				$("#deletefromprogramson").hide();
			}
			obj.filez = [];
			for(var ii=0; ii < obj.files.length; ii++){
				var objfile = {};
				objfile.filepath = obj.files[ii].replace(new RegExp('/','g'),"..");
				objfile.file = obj.files[ii];
				var objext = obj.files[ii].split('.');
				objfile.fileExtension = objext[objext.length-1];
				obj.filez.push(objfile);
			}
						$scope.program = obj;
            		}).error(function(status, data) {
                		$scope.status = "Program not found";
            			console.log(status);
                		console.log(data);
            		});
	}
	updateProgram();
					
					
$scope.updateFileList = function(zip) {

            		ProgramService.updateProgramsFilesList($routeParams.id,zip).success(function(data) {
					updateProgram();
            		}).error(function(status, data) {
                		//$scope.status = "Program not found";
            			console.log(status);
                		console.log(data);
            		});

};
$scope.deletefromprogramlist = function() {
            		ProgramService.deleteprogramon($routeParams.id).success(function(data) {
					$("#deletefromprogramson").hide();
					$("#addtoprogramson").show();
            		}).error(function(status, data) {
                		//$scope.status = "Program not found";
            			console.log(status);
                		console.log(data);
            		});
}
$scope.addtoprogramslist = function() {
var mainfile = "index.html";//document.getElementById("mainfile").value;
            		ProgramService.createprogramon($scope.program.name,mainfile,$routeParams.id,$scope.program.pic,$scope.program.desc).success(function(data) {
					$("#deletefromprogramson").show();
					$("#addtoprogramson").hide();
            		}).error(function(status, data) {
                		//$scope.status = "Program not found";
            			console.log(status);
                		console.log(data);
            		});
}

$scope.deleteProgramsFile = function deleteProgramsFile(program_id,file) {
	
	ProgramService.deleteprogramsfile(program_id,file).success(function() {
		    		updateProgram();
            		}).error(function(status, data) {
            			console.log(status);
                		console.log(data);
            		});
}

var scope = $scope;

$scope.createFile = function createFile() {
var dirname = document.getElementById("dirtocreate").value;
var filename = document.getElementById("filetocreate").value;

		var program = {};
		program._id = $routeParams.id;
		program.file = filename;
		var filesLoc = filename;
		if(dirname != ""){ program.directory = dirname; filesLoc = dirname+"/"+filename; }
					if($scope.program.files.indexOf(filesLoc) == -1){
						ProgramService.updatenewfilecontent(program).success(function() {
				//$scope.status = "Updated";
				//$timeout(function(){ $scope.status = ""; }, 2000);

	document.getElementById("dirtocreate").value = "";
	document.getElementById("filetocreate").value = "";

						updateProgram();

						}).error(function(status, data) {
							//$scope.status = "Program not found";
							console.log(status);
							console.log(data);
						});
					}else{
				$scope.status = "File exists with that name";
			    $timeout(function(){ $scope.status = ""; }, 2000);
					}


}

	$scope.save = function save() { 
		if( $scope.files.length > 0){
			var goodFiles = 0;
		var fd = new FormData();
		fd.append("_id", id);
		var dirname = document.getElementById("dirtocreate").value;
		fd.append("directory", dirname);
		for (var i in $scope.files) {
			if($scope.program.files.indexOf($scope.files[i].name) == -1){
				fd.append("uploadedFile", $scope.files[i]);
				goodFiles++;
			}
		} 
		if(goodFiles > 0){
		var xhr = new XMLHttpRequest();
		//xhr.upload.addEventListener("progress", uploadProgress, false);
		xhr.addEventListener("load", function(evt){  var loc = window.location.href; window.location.href = "/#/"; window.location.href = loc; }, false);
		//xhr.addEventListener("error", uploadFailed, false);
		//xhr.addEventListener("abort", uploadCanceled, false);
		xhr.open("POST", "/uploadfileprogram"); 
		//scope.progressVisible = true;
		xhr.send(fd);
		}else{
				$scope.status = "File exists with that name";
			    $timeout(function(){ $scope.status = ""; }, 2000);
		}}
		}
	  globalMenuService.initializeScopeListening($scope, $location, AuthenticationService);
  }
  
var authent = AuthenticationService.UserIsAuthenticated(AuthenticationService);
if(typeof authent == "boolean" && authent){
	contrFunction();
}else{
	//it is a promise
	authent.then(function(isAuthent) {
		if(isAuthent){
			contrFunction();
		}else{
			$location.path("/login");
		}
		
	}).catch(function() {
		$location.path("/login");
	});
}
  
}
]);

appControllers.controller('ProgramEditCtrl', ['$scope', 'ExternalTools', '$location', '$routeParams', '$sce','ProgramService','AuthenticationService','globalMenuService',
function ProgramEditCtrl($scope, ExternalTools, $location, $routeParams, $sce,ProgramService,AuthenticationService, globalMenuService) {
  if(!AuthenticationService.UserIsAuthenticated(AuthenticationService)){
		$location.path("/login");
  }else{
	$scope.username = AuthenticationService.username;
	$scope.program = {};
        var id = $routeParams.id;
            		ProgramService.program(id).success(function(data) {
			var obj = JSON.parse(data);
			$scope.program = obj;
            		}).error(function(status, data) {
                		$scope.status = "Program not found";
            			console.log(status);
                		console.log(data);
            		});	
				
					
//---------------------------------------------------------------
var scope = $scope;

ProgramService.upload($scope);

    $scope.save = function save(program) {
        if (AuthenticationService.UserIsAuthenticated(AuthenticationService)) {
		if (program != undefined && program.name != undefined && program.desc != undefined && program.name != "" && program.desc != "" && $routeParams.id != "") {
			program._id = $routeParams.id;

	if($scope.files == undefined || $scope.files == "" || $scope.files.length < 1){

				ProgramService.update(program).success(function(data) {
					$location.path("/");
				}).error(function(status, data) {
					$scope.status = "Cannot update program";
					console.log(status);
					console.log(data);
				});
	}else{

        var fd = new FormData();
	fd.append("_id", program._id);
	fd.append("name", program.name);
	fd.append("desc", program.desc);
        for (var i in scope.files) {
            fd.append("uploadedFile", scope.files[i]);
        } 
        var xhr = new XMLHttpRequest();
        //xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("load", function(evt){  window.location.href = "/#/";}, false);
        //xhr.addEventListener("error", uploadFailed, false);
        //xhr.addEventListener("abort", uploadCanceled, false);
        xhr.open("POST", "/updateprogram"); 
        //scope.progressVisible = true;
        xhr.send(fd);
	}

		}else{
			$scope.status = "Wrong data";
		}
 
        }
        else {
            $location.path("/login");
        }
    }
	  globalMenuService.initializeScopeListening($scope, $location, AuthenticationService);
  }
}
]);

appControllers.controller('ProgramCreateCtrl', ['$scope', 'ExternalTools', '$location', '$window', '$sce','ProgramService','AuthenticationService', 'globalMenuService',
function ProgramCreateCtrl($scope, ExternalTools, $location, $window, $sce,ProgramService,AuthenticationService, globalMenuService) {
  if(!AuthenticationService.UserIsAuthenticated(AuthenticationService)){
		$location.path("/login");
  }else{

	$scope.username = AuthenticationService.username;

	  globalMenuService.initializeScopeListening($scope, $location, AuthenticationService);
    $scope.createProgram = function createProgram(name,description) {
        if (AuthenticationService.UserIsAuthenticated(AuthenticationService)) {
        	
        	if (name != null && description != null) {

            		ProgramService.create(name, description).success(function(data) {
                	$location.path("/");
            		}).error(function(status, data) {
                		$scope.status = "Program with that name already exists";
            			console.log(status);
                		console.log(data);
            		});
			
        	}else{
			$scope.status = "Enter name and description";
		}
        }
        else {
            $location.path("/login");
        }
    }
  }
}
]);

appControllers.controller('UserCtrl', ['$scope', 'ExternalTools', '$location', '$window', '$sce','RoutesService','UserService','AuthenticationService',
function UserCtrl($scope, ExternalTools, $location, $window,  $sce, RoutesService, UserService, AuthenticationService) {
  var contrFunction = function(){
	$scope.signIn = function signIn(email, password, red) {
        if (email != null && password != null) {
            UserService.signIn(email, password).success(function(dataa, dt) {
				if(red && typeof dataa.mainprogram != 'undefined' && typeof dataa.mainprogram._id == 'undefined'
				&& dataa.mainprogram._id != ''){
					window.location.href = '/files/'+dataa.mainprogram._id+'/index.html';
				}
                AuthenticationService.AuthenticateUser(email,dataa.programs,dataa.mainprogram,dataa.pic);
                $location.path("/");
            }).error(function(status, data) {
                $scope.status = "Wrong username or password";
            	console.log(status);
                console.log(data);
            });
			
        }else{
		$scope.status = "Enter username and password";
	}
    }

    $scope.register = function register(email, username, lastname, password, passwordConfirm) {
        //if (AuthenticationService.UserIsAuthenticated(AuthenticationService)) {
        //    $location.path("/");
        //}
        //else {
            UserService.register(email, username, lastname, password, passwordConfirm).success(function(data) {
                $location.path("/login");
            }).error(function(status, data) {
            	$scope.status = "Passwords do not match or user with username already exists";
                console.log(status);
                console.log(data);
            });
        //}
    }
  }
  
var authent = AuthenticationService.UserIsAuthenticated(AuthenticationService);
if(typeof authent == "boolean" && authent){
	//contrFunction();
}else{
	//it is a promise
	authent.then(function(isAuthent) {
		if(isAuthent){
			//contrFunction();
			if(window.location.href.indexOf('login') > -1 ){
				$location.path("/");
			}
		}else{
			contrFunction();
		}
		
	}).catch(function() {
		contrFunction();
	});
}  
  
}
]);

appControllers.controller('RouteCreateCtrl', ['$scope', 'ExternalTools', '$location', 'RoutesService','AuthenticationService',
function RouteCreateCtrl($scope, ExternalTools, $location, RoutesService, AuthenticationService) {
if(!AuthenticationService.UserIsAuthenticated(AuthenticationService)){
	$location.path("/login");
}else{
	$scope.save = function save(route) {
		if (route != undefined && route.from != undefined && route.to != undefined) {
			//var content = $('#textareaContent').val();
			var content = route.content;
			if (content != undefined) {
			route.content = content;
			route.username = AuthenticationService.username;
				RoutesService.createRoute(route).success(function(data) {
					$location.path("/");
				}).error(function(status, data) {
					$scope.status = status;
					console.log(status);
					console.log(data);
				});
			}else{ 
				$scope.status = "Content field is required";
				$('#textareaContent').css('border','1px solid red');
			}
		}else{
			$scope.status = "Wrong data";
		}
	}
}
}
]);

appControllers.controller('RouteUpdateCtrl', ['$scope', 'ExternalTools', '$location', '$routeParams', 'RoutesService','AuthenticationService',
function RouteUpdateCtrl($scope, ExternalTools, $location, $routeParams, RoutesService, AuthenticationService) {
	if(!AuthenticationService.UserIsAuthenticated(AuthenticationService)){
		$location.path("/login");
	}else{
	
        $scope.route = {};
        var id = $routeParams.id;

        RoutesService.getRoute(id).success(function(data) {
            $scope.route = JSON.parse(data);
        }).error(function(status, data) {
            $location.path("/");
        });
	
	$scope.save = function save(route) {
		if (route != undefined && route.from != undefined && route.to != undefined && route.to != "") {
			var content = route.content;
			if (content != undefined) {
			route.content = content;
			route.username = AuthenticationService.username;
				RoutesService.updateRoute(route).success(function(data) {
					$location.path("/");
				}).error(function(status, data) {
					$scope.status = status;
					console.log(status);
					console.log(data);
				});
			}else{ 
				$scope.status = "Content field is required";
				$('#textareaContent').css('border','1px solid red');
			}
		}else{
			$scope.status = "Wrong data";
		}
	}
	}
}
]);

appControllers.controller('GoogleMapRouteCtrl', ['$scope', 'ExternalTools', '$location', '$routeParams', 'RoutesService','AuthenticationService',
function GoogleMapRouteCtrl($scope, ExternalTools, $location, $routeParams, RoutesService, AuthenticationService) {
	if(!AuthenticationService.UserIsAuthenticated(AuthenticationService)){
		$location.path("/login");
	}else{
	
        $scope.route = {};
        var id = $routeParams.id;

        RoutesService.getRoute(id).success(function(data) {
	var obj = JSON.parse(data)
			initialize();
calcRoute(obj.from, obj.to); calcRoute(obj.from, obj.to);
			calcRoute(obj.from, obj.to);
            $scope.googlemapinfo = "From: "+obj.from+" To: "+obj.to+" About: "+obj.content;
        }).error(function(status, data) {
            $location.path("/");
        });
	
	}
}
]);
