var options = {};
options.api = {};
options.api.base_url = "";
var appServices = angular.module('appServices', []);
appServices.factory('RoutesService', function($http) {
    return {
    	findAllRoutes: function() {
            return $http.get(options.api.base_url + '/routes');
        },
        createRoute: function(route) {
            return $http.post(options.api.base_url + '/route', {'route': route});
        },
        deleteRoute: function(id) {
            return $http.delete(options.api.base_url + '/route/'+id);
        },
        getRoute: function(id) {
            return $http.get(options.api.base_url + '/route/'+id);
        },
        updateRoute: function(route) {
            return $http.put(options.api.base_url + '/route', {'route': route});
        }
    };
});
appServices.factory('ProgramService', function($http) {
    return {
    	createprogramon: function(name,file,pid, pic, desc) {
			return $http.post(options.api.base_url + '/createprogramon', {'name': name,'file':file,'pid':pid,'pic':pic,'desc':desc});
		},
    	programs: function() {
            return $http.get(options.api.base_url + '/programs');
        },
    	allprograms: function() {
            return $http.get(options.api.base_url + '/allprograms');
        },
        create: function(name,desc) {
            return $http.post(options.api.base_url + '/program', {'name': name,'desc':desc});
        },
        delete: function(id) {
            return $http.delete(options.api.base_url + '/program/'+id);
        },
		deleteprogramon: function(id) {
            return $http.delete(options.api.base_url + '/deleteprogramon/'+id);
        },
		updateProgramsFilesList: function(id, zip) {
            return $http.get(options.api.base_url + '/updateprogramsfiles/'+id+'/'+zip);
        },
        deleteprogramsfile: function(program_id,file) {
	    var program = {};
		program._id = program_id;
		program.deletefile = file;
            return $http.post(options.api.base_url + '/updateprogram/', {'program': program});
        },
        updatefilecontent: function(program) {
            return $http.put(options.api.base_url + '/updatefilecontent', {'program': program});
        },
        updatenewfilecontent: function(program) {
            return $http.put(options.api.base_url + '/updatenewfilecontent', {'program': program});
        },
        program: function(id) {
            return $http.get(options.api.base_url + '/program/'+id);
        },
        update: function(program) {
            return $http.post(options.api.base_url + '/updateprogram', {'program': program});
        },
        upload: function(scope) {

    //============== DRAG & DROP =============

    scope.setFiles = function(element) {
    scope.$apply(function(scope) {
      console.log('files:', element.files);
      // Turn the FileList object into an Array
        scope.files = []
        for (var i = 0; i < element.files.length; i++) {
          scope.files.push(element.files[i])
        }
      //scope.progressVisible = false
      });
    };

    scope.uploadFile = function() {
        var fd = new FormData();
        for (var i in scope.files) {
            fd.append("uploadedFile", scope.files[i]);
        }
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("load", uploadComplete, false);
        xhr.addEventListener("error", uploadFailed, false);
        xhr.addEventListener("abort", uploadCanceled, false);
        xhr.open("POST", "/upload");
        scope.progressVisible = true;
        xhr.send(fd);
    }

    function uploadProgress(evt) {
        scope.$apply(function(){
            if (evt.lengthComputable) {
                scope.progress = Math.round(evt.loaded * 100 / evt.total)
            } else {
                scope.progress = 'unable to compute'
            }
        })
    }

    function uploadComplete(evt) {
        /* This event is raised when the server send back a response */
        alert(evt.target.responseText)
    }

    function uploadFailed(evt) {
        alert("There was an error attempting to upload the file.")
    }

    function uploadCanceled(evt) {
        scope.$apply(function(){
            scope.progressVisible = false
        })
        alert("The upload has been canceled by the user or the browser dropped the connection.")
    }

//---------------------------------------------------------------


        },
        uploadfiles: function(scope) {

    //============== DRAG & DROP =============
    // source for drag&drop: http://www.webappers.com/2011/09/28/drag-drop-file-upload-with-html5-javascript/
    var dropbox = document.getElementById("dropbox")
    scope.dropText = 'Drop files here...'

    // init event handlers
    function dragEnterLeave(evt) {
        evt.stopPropagation()
        evt.preventDefault()
        scope.$apply(function(){
            scope.dropText = 'Drop files here...'
            scope.dropClass = ''
        })
    }
    dropbox.addEventListener("dragenter", dragEnterLeave, false)
    dropbox.addEventListener("dragleave", dragEnterLeave, false)
    dropbox.addEventListener("dragover", function(evt) {
        evt.stopPropagation()
        evt.preventDefault()
        var clazz = 'not-available'
        var ok = evt.dataTransfer && evt.dataTransfer.types && evt.dataTransfer.types.indexOf('Files') >= 0
        scope.$apply(function(){
            scope.dropText = ok ? 'Drop files here...' : 'Only files are allowed!'
            scope.dropClass = ok ? 'over' : 'not-available'
        })
    }, false)
    dropbox.addEventListener("drop", function(evt) {
        console.log('drop evt:', JSON.parse(JSON.stringify(evt.dataTransfer)))
        evt.stopPropagation()
        evt.preventDefault()
        scope.$apply(function(){
            scope.dropText = 'Drop files here...'
            scope.dropClass = ''
        })
        var files = evt.dataTransfer.files
        if (files.length > 0) {
            scope.$apply(function(){
                scope.files = []
                for (var i = 0; i < files.length; i++) {
                    scope.files.push(files[i])
                }
            })
        }
    }, false)
    //============== DRAG & DROP =============

    scope.setFiles = function(element) {
    scope.$apply(function(scope) {
      console.log('files:', element.files);
      // Turn the FileList object into an Array
        scope.files = []
        for (var i = 0; i < element.files.length; i++) {
          scope.files.push(element.files[i])
        }
      //scope.progressVisible = false
      });
    };

    scope.uploadFile = function() {
        var fd = new FormData();
        for (var i in scope.files) {
            fd.append("uploadedFile", scope.files[i]);
        }
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("load", uploadComplete, false);
        xhr.addEventListener("error", uploadFailed, false);
        xhr.addEventListener("abort", uploadCanceled, false);
        xhr.open("POST", "/upload");
        scope.progressVisible = true;
        xhr.send(fd);
    }

    function uploadProgress(evt) {
        scope.$apply(function(){
            if (evt.lengthComputable) {
                scope.progress = Math.round(evt.loaded * 100 / evt.total)
            } else {
                scope.progress = 'unable to compute'
            }
        })
    }

    function uploadComplete(evt) {
        /* This event is raised when the server send back a response */
        alert(evt.target.responseText)
    }

    function uploadFailed(evt) {
        alert("There was an error attempting to upload the file.")
    }

    function uploadCanceled(evt) {
        scope.$apply(function(){
            scope.progressVisible = false
        })
        alert("The upload has been canceled by the user or the browser dropped the connection.")
    }

//---------------------------------------------------------------


        }
    };
});
appServices.factory('ExternalTools', function ($http) {
    return {
        checkifuserloggedin: function() {
            return $http.get(options.api.base_url + '/checkifuserloggedin');
        },
		clickMenu: function(){
		$( "#menu_open" ).click(function() {
			if($( "#menu_open_header" ).is(":visible")){
				$( "#menu_open_header" ).hide();
			}else{
				$( "#menu_open_header" ).show();
			}
		});
		}
	}
});
appServices.factory('UserService', function ($http) {
    return {
        signIn: function(email, password) {
            return $http.post(options.api.base_url + '/login', {email: email, password: password});
        },
        updateProgramsList: function(programs) {
            return $http.put(options.api.base_url + '/updateuser', {programs:[programs]});
        },
        updateProgramMainList: function(mainprogram) {
            return $http.put(options.api.base_url + '/updateuser', {mainprogram: mainprogram});
        },
        updateDeleteProgramsList: function(program) {
            return $http.put(options.api.base_url + '/updateuser', {programdelete:program});
        },
        getUserInfo: function(email) {
            return $http.get(options.api.base_url + '/user/'+email);
        },
        logout: function() {
            return $http.delete(options.api.base_url + '/logout');
        },
        register: function(email, firstname, lastname, password, passwordConfirm) {
            return $http.post(options.api.base_url + '/register', {email: email, firstname: firstname, lastname:lastname, password: password, passwordConfirmation: passwordConfirm });
        }
    }
});
appServices.factory('AuthenticationService', function(ExternalTools,UserService,$location,$q) {
    var auth = {
        isAuthenticated: false,
        username: "",
        mainprogram: "",
        pic: "",
        programs: [],
        isAdmin: false,
		UserIsAuthenticated: function(auth){
			if(!auth.isAuthenticated){
				var deferred = $q.defer();
					ExternalTools.checkifuserloggedin().success(function(data) {
						if(typeof data.username === "undefined" || typeof data.token === "undefined"){
							deferred.resolve(false);
						}else{
							auth.username = data.username;
							auth.mainprogram = data.mainprogram;
							auth.pic = data.pic;
							auth.programs = data.programs;
							auth.isAuthenticated = true;
							deferred.resolve(true);
						}
					}).error(function(status, data) {
						deferred.resolve(false);
						console.log(status);
						console.log(data);
					});
					return deferred.promise;
			}else {
				return true;
			}
		},
		AuthenticateUser: function(usernamelocal, programss, mainprogramm,pic){
			this.isAuthenticated = true;
			this.username = usernamelocal;
			this.mainprogram = mainprogramm;
			this.programs = programss;
			this.pic = pic;
		},
		LogOutUser: function(auth){
			UserService.logout().success(function(data) {
				$location.path("/login");
			}).error(function(status, data) {
						console.log(status);
						console.log(data);
					});
			auth.isAuthenticated = false;
			auth.username = "";
		}
    }
	
    return auth;
});
appServices.factory('TokenInterceptor', function ($q, $window, $location) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            //if (AuthenticationService.sessionStorage) {
            //    config.headers.Authorization = 'Bearer ' + AuthenticationService.sessionStorage;
            //}
            return config;
        },

        requestError: function(rejection) {
            return $q.reject(rejection);
        },

        response: function (response) {
            if (response != null && response.status == 401) {
                $location.path("/logout");
            }
            return response || $q.when(response);
        },

        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401) {
                $location.path("/logout");
            }

            return $q.reject(rejection);
        }
    };
});