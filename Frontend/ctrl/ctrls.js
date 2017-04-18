(function () {
    'use strict';
    app.controller('loginCtrl', LoginInject, SignUpInject);
    // app.controller('signupCtrl');
    app.controller('associateWelcomeCtrl', HomeInject); // associatefirst window controller
    app.controller('collapseCtrl', CollapseInject);
    app.controller('profileCtrl', ProfileInject);
})();