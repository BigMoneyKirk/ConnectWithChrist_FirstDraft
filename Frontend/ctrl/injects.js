/// Login Inject
LoginInject.$inject = ['$location', 'AuthenticationService', 'FlashService'];
function LoginInject($location, AuthenticationService, FlashService) {

    // got this code from http://jasonwatmore.com/post/2015/03/10/angularjs-user-registration-and-login-example-tutorial#projectstructure
    var vm = this;

    vm.login = login;

    (function initController() {
        // reset login status
        AuthenticationService.ClearCredentials();
    })();

    function login() {
        vm.dataLoading = true;
        AuthenticationService.Login(vm.email, vm.password, function (response) {
            if (response.success) {
                AuthenticationService.SetCredentials(vm.email, vm.password);
                if (response.userType == 1) {
                    $location.path('/associateHome');
                }
                if (response.userType == 3) {
                    $location.path('/trainerwelcome');
                }
            } else {
                FlashService.Error(response.message);
                vm.dataLoading = false;
            }
        });
    };
}


/// Home Inject
HomeInject.$inject = ['UserService', 'getBatchInfoService', '$rootScope', '$scope', '$location', '$state', 'ExamData', 'ExamTemplateService'];
function HomeInject(UserService, getBatchInfoService, $rootScope, $scope, $location, $state, ExamData, ExamTemplateService) {
    $scope.user;
    $scope.userType;
    $scope.userEmail;
    $scope.status;
    $scope.batchName;
    $scope.batchTrainer;
    $scope.exams;

    $scope.aBatch;

    initController();

    function initController() {
        loadCurrentUser();
    }

    function loadCurrentUser() {
        // doesn't work: if user isn't signed in, will reroute automatically to login screen
        if ($rootScope.globals.currentUser == undefined) {
            $location.path('/login');
        }
        UserService.GetByEmail2($rootScope.globals.currentUser.email)
            .then(function (user) {
                $scope.user = user;
                $scope.userType = user.UserType1.Role;
                $scope.userEmail = user.email;
            });
    }
    var successFunction = function (batch) {
        var noa = 0; // noa stands for number of associates in a batch

        // only retreives the associates from a batch
        // could actually put this function in the service, but running low on time of completion
        for (var i = 0; i < batch.data[0].Rosters.length; i++) {
            if (batch.data[0].Rosters[i].User.UserType1.Role == "Associate") {
                noa++;
            }
        }

        // returns the correct trainer of a particular batch
        for (var i = 0; i < batch.data[0].Rosters.length; i++) {
            if (batch.data[0].Rosters[i].User.UserType1.Role == "Trainer") {
                $scope.batchTrainer = batch.data[0].Rosters[i].User.fname + " " + batch.data[0].Rosters[i].User.lname;
            }
        }


        for (var i = 0; i < batch.data[0].Rosters.length; i++) {
            if (batch.data[0].Rosters[i].User.email == $rootScope.globals.currentUser.email) {
                $scope.status = batch.data[0].Rosters[i].StatusType.Description;
            }
        }

        for (var i = 0; i < batch.data[0].ExamSettings.length; i++) {
            $scope.exams = batch.data[0].ExamSettings[i].ExamTemplateID;
        }

        $scope.batchName = batch.data[0].BatchID; // returns the batches name
        $scope.fullname = batch.data[0].Rosters; // returns the names of all the associates in a batch
        $scope.numOfAssociates = noa; // return the number of associates in a batch

        $scope.routeToExams = function () {
            $state.go('trainerChangeExistingExam');
        };

        ExamData.setBatchExamSettings(batch.data[0].ExamSettings);

        ExamTemplateService.getExamTemplate(batch.data[0].ExamSettings[0].ExamTemplateID, examTemplateSucess, errorFunction);

    }
    var errorFunction = function (err) {
        $scope.batchName = err;
    }
    var examTemplateSucess = function (data) {
        ExamData.setExamTemplateData(data.data);
    }

    // getBatchInfoService.getBatch(successFunction, errorFunction);
    getBatchInfoService.getBatch($rootScope.globals.currentUser.email, successFunction, errorFunction);

}