app.service("getBatchInfoService", function ($http) {
    this.getBatch = function (email, successCallback, errorCallback) {
        $http.get("http://ec2-54-215-138-178.us-west-1.compute.amazonaws.com/UserBuffetService/api/batches/GetBatches?email=" + email)
            .then(function (data) {
                successCallback(data);
            }, function (err) {
                errorCallback(err);
            });
    }
});

app.service("examService", function ($http) {
    this.getExams = function (successCallback, errorCallback) {
        $http.get("http://ec2-54-215-138-178.us-west-1.compute.amazonaws.com/ExamAssessmentWebAPI/api/ExamTemplate/GetIdList")
            .then(function (data) {
                successCallback(data);
            }, function (err) {
                errorCallback(err);
            });
    };
});

app.service("ExamTemplateService", function ($http) {
    var domain = "http://ec2-54-215-138-178.us-west-1.compute.amazonaws.com/ExamAssessmentWebAPI/api/ExamTemplate/GetExam/"

    var getExamTemplate = function (examTemplateID, successCallback, errorCallback) {
        $http.get((domain + examTemplateID))
            .then(function (data) {
                successCallback(data);
            }, function (err) {
                errorCallback(err);
            });
    }

    return {
        getExamTemplate: getExamTemplate
    }
});

app.service("examQuestionService", function ($http) {
    this.getExamQuestions = function (examid, successCallback, errorCallback) {
        $http.get("http://ec2-54-215-138-178.us-west-1.compute.amazonaws.com/ExamAssessmentWebAPI/api/ExamTemplate/GetExam/" + examid)
            .then(function (data) {
                successCallback(data);
            }, function (err) {
                errorCallback(err);
            });
    };

    this.getAllQuestions = function (successCallback, errorCallback) {
        $http.get("http://ec2-54-215-138-178.us-west-1.compute.amazonaws.com/ExamAssessmentWebAPI/api/ExamQuestion/GetAllExamQuestions")
            .then(function (data) {
                successCallback(data);
            }, function (err) {
                errorCallback(err);
            });
    };

    this.addQ = function (examTemplateID, question, successCallback, errorCallback) {
        $http.put("http://ec2-54-215-138-178.us-west-1.compute.amazonaws.com/ExamAssessmentWebAPI/api/ExamTemplate/AddQuestionToExam/?extid=" + examTemplateID + "&weight=1", JSON.stringify(question))
            .then(function (data) {
                successCallback(data);
            }, function (err) {
                console.log(err);
                errorCallback(err);

            });
    };

});

app.service("ExamData", function () {
    var exam = {};

    var batchExamSettingsData = {};

    var examTemplateData = {};

    var setBatchExamSettings = function (data) {
        batchExamSettingsData = data;
    }

    var getBatchExamSettings = function () {
        return batchExamSettingsData;
    }

    var setExamTemplateData = function (data) {
        examTemplateData = data;
    }

    var getExamTemplateData = function () {
        return examTemplateData;
    }

    return {
        setBatchExamSettings: setBatchExamSettings,
        getBatchExamSettings: getBatchExamSettings,
        setExamTemplateData: setExamTemplateData,
        getExamTemplateData: getExamTemplateData,
        exam: exam
    };
});

// service for timer
// features:
// -- reset timer
// -- start timer
// -- timer toString

app.service('timerService', function ($rootScope) {
    var timerWorker = undefined; // if not undefined then web worker is running
    this.hasStarted = false;

    // start timer web worker
    this.StartTimer = function (timeInSeconds) {
        this.hasStarted = true;
        // if worker exist, then reset
        if (timerWorker) {
            TimerReset(timerWorker);
        }
        // create & start new timer web worker
        timerWorker = new Worker('timerWorker.js');
        // console.log(timerWorker);
        // send timer value to web worker
        timerWorker.postMessage(timeInSeconds);
    };

    // terminate timer web worker and 'delete' it
    this.ResetTimer = TimerReset(timerWorker);

    // convert time in seconds to string format mm:ss
    this.ConvertTimerToString = function (timerInSeconds) {
        return TimeToString(timerInSeconds);
    };

    // function to return the current timer value
    this.GetCurrentTime = function () {
        var result = 0; // time in seconds

        // get time from timer web worker
        if (timerWorker) {
            // listen to web worker
            timerWorker.onmessage = function (workerEvent) {
                result = workerEvent.data;
                // if timer is done, i.e. at zero
                if (result === 0) {
                    TimerReset(timerWorker); // reset timer
                }
                $rootScope.$emit('timer', result); // emit event with result value
            };
        }

        return result;
    };
});

/**********************
   HELPER FUNCTIONS
**********************/

// convert seconds to string format mm:ss
function TimeToString(timeInSeconds) {
    var result = '';
    var s = timeInSeconds % 60; // use modulus to get seconds
    var m = Math.floor(timeInSeconds / 60 % 60); // get minutes
    var h = Math.floor(timeInSeconds / 60 / 60); // get hours

    // build the timer as string in format hh:mm:ss
    result += (h < 10) ? '0' + h : h;
    result += ':';
    result += (m < 10) ? '0' + m : m; // ternary operator
    result += ':';
    result += (s < 10) ? '0' + s : s;

    return result;
};

// reset the timer
function TimerReset(timerworker) {
    // if worker exist, then reset
    if (timerworker) {
        timerworker.terminate(); // stop
        timerworker = undefined; // delete
    }
};

//factory service to get data from our Login Web API
app.service("APIService", function ($http) {
    this.getUsers = function (successCallback, errorCallback) {
        $http.get("http://ec2-54-215-138-178.us-west-1.compute.amazonaws.com/LMS-1701LoginAPI/api/login")
            .then(function (data) {
                successCallback(data);
            }, function (err) {
                errorCallback(err);
            });
    };
});

app.service("UserData", function () {
    var User = {
        status: '',
        batchName: '',
        batchTrainer: '',
        userName: '',
        userType: ''
    };
    return User;
});


(function () {
    'use strict';

    app.service('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$rootScope', '$timeout', 'UserService'];
    function AuthenticationService($http, $rootScope, $timeout, UserService) {
        var service = {};

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;

        function Login(email, password, callback) {

            /* Dummy authentication for testing, uses $timeout to simulate api call
             ----------------------------------------------*/
            $timeout(function () {
                var response;
                UserService.GetByEmail(email)
                    .then(function (user) {
                        if (user !== null && user.Password === password) {
                            response = { success: true, userType: user.UserType };
                        } else {
                            response = { success: false, message: 'Email or password is incorrect. Please try again.' };
                        }
                        callback(response);
                    });
            }, 1000);

            /* Use this for real authentication
             ----------------------------------------------*/
            //$http.post('/api/authenticate', { email: email, password: password })
            //    .success(function (response) {
            //        callback(response);
            //    });

        }

        function SetCredentials(email, password) {
            var authdata = Base64.encode(email + ':' + password);

            $rootScope.globals = {
                currentUser: {
                    email: email,
                    authdata: authdata
                }
            };

            // set default auth header for http requests
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $http.defaults.headers.common.Authorization = 'Basic';
        }
    }

    // Base64 encoding service used by AuthenticationService
    var Base64 = {

        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

})();

// Authentication vs. Flash Service separation line

(function () {
    'use strict';

    app.factory('FlashService', FlashService);

    FlashService.$inject = ['$rootScope'];
    function FlashService($rootScope) {
        var service = {};

        service.Success = Success;
        service.Error = Error;

        initService();

        return service;

        function initService() {
            $rootScope.$on('$locationChangeStart', function () {
                clearFlashMessage();
            });

            function clearFlashMessage() {
                var flash = $rootScope.flash;
                if (flash) {
                    if (!flash.keepAfterLocationChange) {
                        delete $rootScope.flash;
                    } else {
                        // only keep for a single location change
                        flash.keepAfterLocationChange = false;
                    }
                }
            }
        }

        function Success(message, keepAfterLocationChange) {
            $rootScope.flash = {
                message: message,
                type: 'success',
                keepAfterLocationChange: keepAfterLocationChange
            };
        }

        function Error(message, keepAfterLocationChange) {
            $rootScope.flash = {
                message: message,
                type: 'error',
                keepAfterLocationChange: keepAfterLocationChange
            };
        }
    }

})();

// Flash vs. User separation zone

(function () {
    'use strict';

    app.factory('UserService', UserService);

    UserService.$inject = ['$http'];
    function UserService($http) {
        var service = {};

        service.GetAll = GetAll;
        service.GetByEmail = GetByEmail;
        service.GetByEmail2 = GetByEmail2;

        return service;

        function GetAll() {
            return $http.get("http://ec2-54-215-138-178.us-west-1.compute.amazonaws.com/LMS-1701LoginAPI/api/login").then(handleSuccess, handleError('Error getting all users'));
        }

        // gets user by email from the Login API
        function GetByEmail(email) {
            return $http.get("http://ec2-54-215-138-178.us-west-1.compute.amazonaws.com/LMS-1701LoginAPI/api/users/getuser?email=" + email).then(handleSuccess, handleError('Error getting user by username'));
        }

        // // gets user by email from the User Buffet API
        function GetByEmail2(email) {
            return $http.get("http://ec2-54-215-138-178.us-west-1.compute.amazonaws.com/UserBuffetService/api/users/GetUser?email=" + email).then(handleSuccess, handleError('Error creating user'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
