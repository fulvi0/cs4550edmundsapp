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

    // go to the detail page of the given vehicle ID
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
    		$scope.getProfileComments(username2);
    		console.log("Added comment " + response);
    	});
    }

    $scope.getProfileComments = function(username)
    {
    	$http.get("/getProfileComments/" + username)
    	.success(function(response){
    		$scope.profileComments = response;
    		console.log("Retrieved comments " + response);
    	});
    }

    $scope.getUserCarComments = function(username)
    {
    	$http.get("/getAllUserVehicleComments/" + username)
    	.success(function(response){
    		$scope.userCarComments = response;
    	})
    }

    $scope.getUserProfileComments = function(username)
    {
    	$http.get("/getAllUserProfileComments/" + username)
    	.success(function(response){
    		$scope.userProfileComments = response;
    	})
    }

    $scope.getProfileComments($rootScope.currentUser.username);
    $scope.getUserCarComments($rootScope.currentUser.username);
    $scope.getUserProfileComments($rootScope.currentUser.username);

});