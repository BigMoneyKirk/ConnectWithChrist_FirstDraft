/// Login Inject
LoginInject.$inject = ['$location', 'AuthenticationService', 'FlashFactory'];
function LoginInject($location, AuthenticationService, FlashFactory) {

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
                FlashFactory.Error(response.message);
                vm.dataLoading = false;
            }
        });
    };
}

/// SignUp Inject
SignUpInject.$inject = ['$location', 'AuthenticationService'];
function SignUpInject($location, AuthenticationService) {

    // got this code from http://jasonwatmore.com/post/2015/03/10/angularjs-user-registration-and-login-example-tutorial#projectstructure
    var vm = this;

    vm.signup = signup;

    (function initController() {
        // reset login status
        AuthenticationService.ClearCredentials();
    })();

    function signup() {
        vm.dataLoading = true;
        AuthenticationService.Login(vm.firstname, vm. lastname, vm.email, vm.password, vm.phonenumber, vm.dateandtime, vm.passion, function (response) {
            if (response.success) {
                AuthenticationService.SetCredentials(vm.email, vm.password);
                if (response.userType == 1) {
                    $location.path('/associateHome');
                }
                if (response.userType == 3) {
                    $location.path('/trainerwelcome');
                }
            } else {
                FlashFactory.Error(response.message);
                vm.dataLoading = false;
            }
        });
    };
}

/// Home Inject
HomeInject.$inject = ['UserFactory', 'AuthenticationService', 'getBatchInfoService', '$rootScope', '$scope', '$location', '$state', 'ExamData', 'ExamTemplateService'];
function HomeInject(UserFactory, AuthenticationService, getBatchInfoService, $rootScope, $scope, $location, $state, ExamData, ExamTemplateService) {
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
        UserFactory.GetByEmail($rootScope.globals.currentUser.email)
            .then(function (user) {
                $scope.user = user;
                $scope.userType = user.UserType1.Role;
                $scope.userEmail = user.email;
            });
    }
    var successFunction = function (batch) {
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


/// Collapse NavBar Inject
CollapseInject.$inject = ['$scope', '$location'];
function CollapseInject($scope, $location) {
        $scope.isNavCollapsed = true;
        $scope.isCollapsed = false;
        $scope.isCollapsedHorizontal = false;
};

/// Profile Inject
ProfileInject.$inject = ['$scope', '$location'];
function ProfileInject($scope, $location){

};