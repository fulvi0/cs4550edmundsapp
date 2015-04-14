app.controller("RegisterCtrl", function($rootScope, $scope, $http){
    $scope.register = function(user)
    {
        console.log(user);

        if(user.password == user.password2)
        {
	        // put it here for now, can move into service?
	        $http.post('/register', user)
	        .success(function(response){
	        	$rootScope.currentUser = user;
                $location.url("/profile");
	        	console.log(response);
	        });
    	}
    };
});
