/// Login Inject
LoginInject.$inject = ['$scope', '$location', '$state', 'AuthenticationService', 'FlashFactory', 'UserTypeService'];
function LoginInject($scope, $location, $state, AuthenticationService, FlashFactory, UserTypeService) {

    // I really need to keep working on this function (last place I left off 05202017)
    function successFunction(userTypes){
        for (var i = 0; i < userTypes.data[0].length; i++) {
            $scope.userTypes = userTypes.data[i];
        }
    }

    function errorFunction(err){
        $scope.userTypes = err;
    }

    // got this code from http://jasonwatmore.com/post/2015/03/10/angularjs-user-registration-and-login-example-tutorial#projectstructure
    var vm = this;

    vm.login = login;
    vm.signup = signup;

    function login() {
        // reset login status
        AuthenticationService.ClearCredentials();

        vm.dataLoading = true;
        AuthenticationService.Login(vm.email, vm.password, function (response) {
            if (response.success) {
                AuthenticationService.SetCredentials(vm.email, vm.password);
                $state.go('profile');
            }
            else {
                FlashFactory.Error(response.message);
                vm.dataLoading = false;
            }
        });
    }

// This once was its own signup class, but I learned a route cannot share more than one controller; I even tried
// to import the controller using ng-controller in the respectable div tag, but alas, I decided to put this functionality
// into the "login" inject.

    function signup() {
        vm.dataLoading = true;
        var user = {
            Firstname: vm.firstname, 
            Lastname: vm.lastname, 
            Email: vm.email,
            Password: vm.password,
            Phonenumber: vm.phonenumber,
            Passion: vm.passion,
            UserType: vm.usertype
        }

        // everything below this line (only in the signup function) needs refactoring
        $http.post("http://localhost:57371/api/Users/RegisterNewUser/", user);

        AuthenticationService.SignUp(vm.firstname, vm.lastname, vm.email, vm.password, vm.phonenumber, vm.passion, vm.usertype)
            .then(function(response){
                if(response.success){
                    console.log("Success user: " + user); //here
                    RegisterNewUser(user)
                    FlashFactory.Success('Thank you for being apart of the Connect With Christ Family!', true);
                    // $location.path('/login');
                }
                else{
                    console.log("What user is if it fails: " + user); //here
                    FlashFactory.Error(response.message);
                    vm.dataLoading = false;
                }
            });
    }

    UserTypeService.getUserTypes(successFunction, errorFunction);
}

/// Profile Inject
ProfileInject.$inject = ['UserFactory', 'AuthenticationService', '$rootScope', '$scope', '$location', '$state'];
function ProfileInject(UserFactory, AuthenticationService, $rootScope, $scope, $location, $state){
    //declaring the variables used in this inject/controller
    $scope.user;
    $scope.usertype;
    $scope.userEmail;
    
    loadCurrentUser();

    function loadCurrentUser() {
        // doesn't work: if user isn't signed in, will reroute automatically to login screen
        if ($rootScope.globals.currentUser == undefined) {
            $location.path('/login');
        }
        // if($scope.user != null){
        //     //don't throw an error
        //     console.log("lalalala!!");
        //     // console.log($scope.user.FirstName + " " + $scope.user.LastName  + "is already logged in.");
        // }
        UserFactory.GetByEmail($rootScope.globals.currentUser.email)
            .then(function (user) {
                $scope.user = user;
                $scope.usertype = user.UserType.UserTypeName;
                $scope.userEmail = user.email;
            });
    }
};

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