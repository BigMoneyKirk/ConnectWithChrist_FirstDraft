(function () {
    'use strict';

    app.controller('loginCtrl', LoginInject);
    app.controller('associateWelcomeCtrl', HomeInject); // associatefirst window controller
})();

app.controller('examViewController', function ($scope, examQuestionService, ExamData, $state) {
    var exam = ExamData.exam;
    var successFunction = function (ship) {
        exam = ship.data;
        $scope.exam = exam;
        console.log(exam.ExamQuestions[0].quest);
        console.log(exam);
    };
    var errorFunction = function (err) {
        $scope.ship = err;
    };
    examQuestionService.getExamQuestions(exam, successFunction, errorFunction);

    $scope.addQuestionToExam = function () {
        var questions;
        var successFunction = function (ship) {
            questions = ship.data;
            $scope.questions = questions;
            console.log(questions);
        };
        var errorFunction = function (err) {
            $scope.ship = err;
        };
        examQuestionService.getAllQuestions(successFunction, errorFunction);
    };

    $scope.addQ = function (eq) {
        var question = eq;
        var successFunction = function (ship) {
            console.log(ship.data);
            $state.reload();
        };
        var errorFunction = function (err) {
            $scope.ship = err;
        };
        examQuestionService.addQ(exam.ExamTemplateID, question.ExamQuestionID, successFunction, errorFunction);
    }

});

app.controller('trainerChangeExistingExam', function ($scope, examService, ExamData, $state) {
    var exams;
    var successFunction = function (ship) {
        exams = ship.data;
        $scope.exams = exams;
        console.log(exams);
    };
    var errorFunction = function (err) {
        $scope.ship = err;
    };
    examService.getExams(successFunction, errorFunction);
    $scope.getExamQuestions = function (e) {
        console.log(e);
        ExamData.exam = e;
        $state.go('examQuestionView');
    };
});

app.controller('associateInExamCtrl', function ($scope, $rootScope, $timeout, timerService, ExamData) {
    $scope.BatchExams = ExamData.getBatchExamSettings();
    $scope.examTemplate = ExamData.getExamTemplateData();

    $scope.lengthofexam = $scope.BatchExams[0].LengthOfExamInMinutes;
    $scope.questions = $scope.examTemplate.ExamQuestions;
    $scope.answeroptions = "A. This answer B. This answer C. This answer D. This answer";
    $scope.isEditable = false;
    $scope.testStarted = false;

    //timer info
    $rootScope.timer = $scope.lengthofexam;
    // function to start the cooking timer, use the timer service
    this.StartTimer = function () {
        // use timer service to start timer web worker
        $scope.testStarted = true;
        timerService.StartTimer($rootScope.timer);
        timerService.GetCurrentTime();
    };
    // listen to timer event, emitted by timer service
    $rootScope.$on('timer', function (event, data) {
        $rootScope.timer = timerService.ConvertTimerToString(data);
        // $scope.$apply will listen for value changes and update screen bindings
        $scope.$apply(function () {
            $rootScope.timer = timerService.ConvertTimerToString(data);
            if (data === 0) {
                console.log("Your test is now over. Add submit test functionality here.");
            }
        });
    });
    if (timerService.hasStarted === false) {
        this.StartTimer();
    }

}); //controller

app.controller('collapseCtrl', function ($scope, $location) {
    $scope.isNavCollapsed = true;
    $scope.isCollapsed = false;
    $scope.isCollapsedHorizontal = false;

    $scope.inExam = function () {
        if (location.href == "http://localhost:3000/#!/examinprogress") {
            return true;
        }
        else {
            return false;
        }
    }

});

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