(function () {
    'use strict';
    app.factory('FlashFactory', FlashFactory);
    app.factory('UserFactory', UserFactory);
})();

app.factory('storeExamSettings', function ($http) {
    var domain = "http://localhost:56991/api/ExamSettings/";

    // function returns the promise
    var SaveSettings = function (settingsData, successCallback, errorCallback) {
        $http.post((domain + "StoreSettings"), settingsData)
            .then(function (data) {
                successCallback(data);
            }, function (err) {
                errorCallback(err);
            });
    };

    var assignToUser = function (settingsData, successCallback, errorCallback) {
        $http.post((domain + "AssignExamToUser"), settingsData)
            .then(function (data) {
                successCallback(data);
            }, function (err) {
                errorCallback(err);
            });
    };

    var assignToBatch = function (settingBatchObj, successCallback, errorCallback) {
        $http.post((domain + "AssignExamToBatch?batchId=" + settingBatchObj.bID + "&examSettingID=" + settingBatchObj.sID))
            .then(function (data) {
                successCallback(data);
            }, function (err) {
                errorCallback(err);
            });
    };

    return {
        saveSettings: SaveSettings,
        assignToBatch: assignToBatch
    };
});

FlashFactory.$inject = ['$rootScope'];
function FlashFactory($rootScope) {
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

// Flash vs. User separation zone

UserFactory.$inject = ['$http'];
function UserFactory($http) {
    var service = {};

    service.GetAll = GetAll;
    service.GetByEmail = GetByEmail;
    service.RegisterNewUser = RegisterNewUser;

    return service;

    function GetAll() {
        return $http.get("http://ec2-54-215-138-178.us-west-1.compute.amazonaws.com/LMS-1701LoginAPI/api/login").then(handleSuccess, handleError('Error getting all users'));
    }

    // gets user by email from the Login API
    function GetByEmail(email) {
        return $http.get("http://localhost:57371/api/Users/GetUserByEmail?email=" + email).then(handleSuccess, handleError('Error getting user by email'));
        // http://ec2-54-215-138-178.us-west-1.compute.amazonaws.com/LMS-1701LoginAPI/api/users/getuser?email=
    }

    function RegisterNewUser(user) {
        return $htpp.post("http://localhost:57371/api/Users/RegisterNewUser/" + user);
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