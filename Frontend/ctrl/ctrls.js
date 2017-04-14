(function () {
    'use strict';

    app.controller('loginCtrl', LoginInject);
    app.controller('associateWelcomeCtrl', HomeInject); // associatefirst window controller
    app.controller('collapseCtrl', CollapseInject);

})();

app.controller('trainerWelcomeCtrl', HomeInject, function ($scope, getBatchInfoService) {
    var gradebookClicked = false; // variable that determines if Gradebook is clicked 
    var createexamClicked = false; // variable that determines if Create New Exam is clicked 

    var successFunction = function (batch) {
        var noa = 0; // noa stands for number of associates in a batch

        // only retreives the associates from a batch
        // could actually put this function in the service, but running low on time of completion
        for (var i = 0; i < batch.data.Rosters.length; i++) {
            if (batch.data.Rosters[i].User.UserType1.Role == "Associate") {
                noa++;
            }
        }
        $scope.batchName = batch.data.BatchID;
        $scope.fullname = batch.data.Rosters;
        $scope.numOfAssociates = noa;
    }
    var errorFunction = function (err) {
        $scope.batchName = err;
    }

    getBatchInfoService.getBatch(successFunction, errorFunction);

    $scope.userType = "Trainer";

});

app.controller('associateExamSettingsCtrl', function ($scope, storeExamSettings, ExamData, ExamTemplateService) {
    $scope.BatchExams = ExamData.getBatchExamSettings();
    $scope.returnedData = ExamData.getExamTemplateData();


    $scope.examname = "Test: ";
    $scope.startdate = $scope.BatchExams[0];//$scope.BatchExams[0].StartTime.getDate();//"Monday, April 3, 2017";
    $scope.starttime = 0;//BatchExams[0].StartTime.getHours() + ":" + BatchExams[0].StartTime.getMinutes();
    $scope.endtime = 0;//BatchExams[0].EndTime.getHours() + ":" + BatchExams[0].EndTime.getMinutes();
    $scope.lengthofexam = 0;//BatchExams[0].LengthOfExamInMinutes;
    //$scope.numberofquestions = 23;


    $scope.myDate = new Date();

    $scope.examSettings =
        {
            ExamSettingsID: 0,
            StartTime: new Date(),
            LengthOfExamInMinutes: 0,
            EndTime: new Date(),
            AllowedAttempts: 0,
            ExamTemplateID: "something_1",
            Editable: false,

        }

    $scope.minDate = new Date(
        $scope.myDate.getFullYear(),
        $scope.myDate.getMonth(),
        $scope.myDate.getDate()
    );

    $scope.maxDate = new Date(
        $scope.myDate.getFullYear(),
        $scope.myDate.getMonth() + 6,
        $scope.myDate.getDate()
    );

    $scope.startTime2;

    $scope.isOpen = false;

    $scope.finalDate = new Date();

    $scope.timeLimitInMinutes = 60;

    $scope.timeOpenInHours = 2;

    $scope.examTemplates = [
        { examId: "Training_2" },
        { examId: "Training_1" },
        { examId: "Training_3" }
    ];

    $scope.selectedTemplate = "none"

    $scope.editableTest = false;

    $scope.allowedAttempts = 0;

    $scope.endTime2 = 0;

    $scope.batchId = "WeTheBest";

    $scope.returnedData = {};

    $scope.submitExamSetting = function () {
        //do stuff in here when submit

        $scope.endTime = parseInt($scope.startTime) + parseInt($scope.timeOpenInHours);
        $scope.examSettings.StartTime = new Date(
            $scope.myDate.getFullYear(),
            $scope.myDate.getMonth(),
            $scope.myDate.getDate()
        );

        $scope.examSettings.EndTime = new Date(
            $scope.myDate.getFullYear(),
            $scope.myDate.getMonth(),
            $scope.myDate.getDate()
        );

        $scope.examSettings.StartTime.setHours(parseInt($scope.startTime) - 4);
        $scope.examSettings.EndTime.setHours($scope.endTime - 4);

        $scope.examSettings.LengthOfExamInMinutes = $scope.timeLimitInMinutes;

        $scope.examSettings.AllowedAttempts = $scope.allowedAttempts;
        $scope.examSettings.ExamTemplateID = $scope.selectedTemplate;
        $scope.examSettings.Editable = $scope.editableTest;

        storeExamSettings.saveSettings($scope.examSettings, saveExamSuccessFunction, errorFunction);
    };

    var saveExamSuccessFunction = function (data) {
        storeExamSettings.assignToBatch(
            {
                sID: data.data.ExamSettingsID,
                bID: $scope.batchId
            },
            assignToBatchSuccess,
            errorFunction);
    }
    var assignToBatchSuccess = function (data) {
        $scope.returnedData = data.data;
    }
    var assignToUserSuccess = function (data) {
        $scope.returnedData = data.data;
    }
    var examTemplateSucess = function (data) {
        $scope.returnedData = data;
    }
    var errorFunction = function (err) {
        $scope.returnedData = err;
    };
});