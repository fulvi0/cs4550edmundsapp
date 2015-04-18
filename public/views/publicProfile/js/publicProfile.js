app.controller("PublicProfileCtrl", function($location, $rootScope, $scope, $http, $window){
	
	$http.get('/getUsersFavorites/' + $rootScope.publicUserUsername )
    .success(function(response){
        $scope.publicUserFavorites = response;
    });

   	$http.get('/getFollowers/' + $rootScope.publicUserUsername )
    .success(function(response){
        $scope.publicUserFollowers = response;
    });

    $http.get('/getFollowing/' + $rootScope.publicUserUsername )
    .success(function(response){
        $scope.publicUserFollowings = response;
    });

	$http.get("/getProfileComments/" + $rootScope.publicUserUsername)
		.success(function(response){
			$scope.profileComments = response;
	});

	$http.get("/getAllUserVehicleComments/" + $rootScope.publicUserUsername)
		.success(function(response){
			$scope.userCarComments = response;
	})

	$http.get("/getAllUserProfileComments/" + $rootScope.publicUserUsername)
		.success(function(response){
			$scope.userProfileComments = response;
	})

    $scope.routeToProfilePage = function(username)
    {
    	// if we are going from a public profile to a public profile so we need to refresh all of the information
    	$rootScope.publicUserUsername = username;
    	$scope.refreshUserFavorites(username);
    	$scope.getFollowers(username);
    	$scope.getFollowing(username);
    	$scope.getProfileComments(username);
    	$scope.getUserCarComments(username);
    	$scope.getUserProfileComments(username);



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

    $scope.goToDetailsPage = function(vehicleID)
    {
        // set rootScope to contain vehicle ID we will view
        $rootScope.currentDetailID = vehicleID;
        $location.url("/details");
    }

    $scope.go = function (path) {
        $location.path(path);
    };

	$scope.refreshUserFavorites = function(username)
	{
		$http.get('/getUsersFavorites/' + $rootScope.publicUserUsername )
	    .success(function(response){
	        $scope.publicUserFavorites = response;
	    });
	}

	$scope.followUser = function(username1, username2)
	{
		$http.post('/follow/' + username1 + '/' + username2)
		.success(function (response){
			// refresh followers after adding new
			$scope.getFollowers()
		});
	}

	$scope.unfollowUser = function(username1, username2)
	{
		$http.post('/unfollow/' + username1 + '/' + username2)
		.success(function (response){
			// refresh followers after adding new
			$scope.getFollowers()
		});
	}

	$scope.getFollowers = function(username)
	{
	   	$http.get('/getFollowers/' + $rootScope.publicUserUsername )
	    .success(function(response){
	        $scope.publicUserFollowers = response;
	    });
	}

	$scope.getFollowing = function(username)
	{
	    $http.get('/getFollowing/' + $rootScope.publicUserUsername )
	    .success(function(response){
	        $scope.publicUserFollowings = response;
	    });
	}

	$scope.listContainsUser= function(list, username)
	{
		var result = 0;
		if (list){
			for (var i = 0; i < list.length; i++)
			{
				if (list[i].username == username)
				{
					result = 1;
					break;
				}
			}
		}

		return result;
	}

	$scope.submitUserComment = function(username1, username2, comment)
    {
    	$http.post("/submitUserComment/" + username1 + '/' + username2 + '/' + comment)
    	.success(function(response){
    		$scope.getProfileComments(username2);
    		console.log("Added comment " + response);
    	});
    }

    // retrieve comments that have been made on this profile
    $scope.getProfileComments = function(username)
    {
    	$http.get("/getProfileComments/" + username)
    	.success(function(response){
    		$scope.profileComments = response;
    		//$scope.publicUserFollowings = response;
    		console.log("Retrieved comments " + response);
    	});
    }

    // retrieve all comments the current user has made on cars
    $scope.getUserCarComments = function(username)
    {
    	$http.get("/getAllUserVehicleComments/" + username)
    	.success(function(response){
    		$scope.userCarComments = response;
    	})
    }

    //
    $scope.getUserProfileComments = function(username)
    {
    	$http.get("/getAllUserProfileComments/" + username)
    	.success(function(response){
    		$scope.userProfileComments = response;
    	})
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

});