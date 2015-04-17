app.controller("DetailsCtrl", function($location, $rootScope, $scope, $http){

	$scope.currentUserFavorites = [];
	$scope.usersWhoFavoritedCar = "";


	if ($rootScope.currentUser)
    {
        console.log("current user in search is " + $rootScope.currentUser);
        $http.get('/getUsersFavoritesIDs/' + $rootScope.currentUser.username)
        .success(function(response){
            console.log("setting current user favorites to " + response);
            $scope.currentUserFavorites = response;
        });
    }
   
    // retrieve car info from edmunds to display details
    $http.jsonp("https://api.edmunds.com/api/vehicle/v2/styles/" + $rootScope.currentDetailID + "?view=full&fmt=json&api_key=vwp9323cjna6pjxg5jqtc3qc&callback=JSON_CALLBACK")
        .success(function (response) {
            $scope.detailsVehicleInfo = response;
            console.log("current vehicle info is");
            console.log(response);
     });

    $http.get("/getCarFavorites/" + $rootScope.currentDetailID)
    	.success(function (response) {
    		$scope.usersWhoFavoritedCar = response;
   	});

    $scope.favoriteCar = function(username, vehicleID)
    {
        console.log("favoriting car: username" + username + " " + "vehicleID " + vehicleID);
        $http.post('/favoriteCar/' + username + '/' + vehicleID)
        .success(function(response){
            $scope.currentUserFavorites.push(vehicleID);
            $scope.usersWhoFavoritedCar.push($rootScope.currentUser);
        });
    }

    $scope.unFavoriteCar = function(username, vehicleID)
    {
        console.log("deleting car: username" + username + " " + "vehicleID " + vehicleID);
        $http.post('/deleteFavoriteCar/' + username + '/' + vehicleID)
        .success(function(response){
            var index = $scope.currentUserFavorites.indexOf(vehicleID);
            $scope.currentUserFavorites.splice(index, 1);

            // find index of current user and remove it from list
            for (i = 0; i < $scope.usersWhoFavoritedCar.length; i++)
            {
            	if ($scope.usersWhoFavoritedCar[i].username == username)
            	{
            		break;
            	}
            }
            $scope.usersWhoFavoritedCar.splice(i, 1);
        });
    }

    // return car objects that represent the users favorites
    $scope.getUsersFavorites = function(username)
    {
        $http.get('/getUsersFavorites/' + username)
        .success(function(response){
            //$scope.currentUserFavorites = response;
        });
    }

    // return a list of IDs that represent the users favorites
    $scope.getUsersFavoritesIDs = function(username)
    {
        $http.get('/getUsersFavoritesIDs/' + username)
        .sucess(function(response){
            $scope.currentUserFavorites = response;
        });
    }

    // we want to reuse the user profile page, so we will set a rootScope variable to maintain the user to show in this case
    $scope.routeToProfilePage = function(username)
    {
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

});
