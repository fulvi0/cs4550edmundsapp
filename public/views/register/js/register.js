app.controller("RegisterCtrl", function($location, $rootScope, $scope, $http, $window){
    $scope.register = function(user)
    {
        console.log(user);

        if(user.password == user.password2)
        {
	        // put it here for now, can move into service?
	        $http.post('/register', user)
	        .success(function(response){
	        	if (response == null){
                    $window.alert("User already exists, please try a different username");
                } else {
                    $rootScope.currentUser = user;
                    $window.alert("Successfully registered! Redirecting to your new profile page...");
                    $location.url("/profile");
    	        	console.log(response);
                }
	        });
    	} else {
            $window.alert("Passwords do not match, please try again");
        }
    };
});
