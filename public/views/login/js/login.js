app.controller("LoginCtrl", function($scope, $http){
    $scope.login = function(user)
    {
        console.log(user);

        // put it here for now, can move into service?
        $http.post('/login', user)
        .success(function(response){
        	console.log(response);
        });

    }
});
