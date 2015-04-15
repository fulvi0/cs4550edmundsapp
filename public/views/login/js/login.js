app.controller("LoginCtrl", function($location, $rootScope, $scope, $http, $window){
    $scope.login = function(user)
    {
        console.log(user);

        // put it here for now, can move into service?
        $http.post('/login', user)
        .success(function(response){
        	$rootScope.currentUser = user;
        	console.log(response);
        	$location.url("/profile");
        })
        .error(function(data, status, headers, config) {
            $window.alert("Error logging in: " + data + " " + status );
        });

    };
});
