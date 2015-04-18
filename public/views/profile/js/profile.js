app.controller("ProfileCtrl", function($location, $rootScope, $scope, $http, $window){

	$http.get('/getUsersFavorites/' + $rootScope.currentUser.username)
    .success(function(response){
        $scope.currentUserFavorites = response;
    });

   	$http.get('/getFollowers/' + $rootScope.currentUser.username)
    .success(function(response){
        $scope.currentUserFollowers = response;
    });

    $http.get('/getFollowing/' + $rootScope.currentUser.username)
    .success(function(response){
        $scope.currentUserFollowings = response;
    });

    $scope.goToDetailsPage = function(vehicleID)
    {
        // set rootScope to contain vehicle ID we will view
        $rootScope.currentDetailID = vehicleID;
        $location.url("/details");
    }

    $scope.go = function (path) {
        $location.path(path);
    };

    $scope.routeToProfilePage = function(username)
    {
    	$rootScope.publicUserUsername = username;

    	// go to profile page if logged in user is clicked on
    	if ($rootScope.currentUser && (username == $rootScope.currentUser.username)){
    		$location.url("/profile");
    	} else {
    		// otherwise, get the user info and set it to be the current public user
			$http.get('/getUser/' + username)
			.success(function(response){
				$rootScope.publicUser = response;
        	});

        	$location.url("/publicProfile");
    	}
    }

   	$scope.submitUserComment = function(username1, username2, comment)
    {
    	$http.post("/submitUserComment/" + username1 + '/' + username2 + '/' + comment)
    	.success(function(response){
    		console.log("Added comment " + response);
    	});
    }
});