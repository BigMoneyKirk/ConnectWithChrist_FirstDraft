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