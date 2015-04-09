app.controller("LoginCtrl", function($location, $rootScope, $scope, $http){
    $scope.login = function(user)
    {
        console.log(user);

        // put it here for now, can move into service?
        $http.post('/login', user)
        .success(function(response){
        	$rootScope.currentUser = user;
        	console.log(response);
        	$location.url("/profile");
        });

    };
});
