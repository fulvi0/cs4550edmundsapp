app.controller("SearchCtrl", function($q, $timeout, $location, $rootScope, $scope, $http){
    
    // initially display default make and year and no category
    $scope.currentMake = "bmw";
    $scope.currentYear = "2015";
    $scope.currentCategory = "";
    $scope.currentUserFavorites = [];

    // if a user is logged in, retrieve a list of their favorite cars
    if ($rootScope.currentUser)
    {
        console.log("current user in search is " + $rootScope.currentUser);
        $http.get('/getUsersFavoritesIDs/' + $rootScope.currentUser.username)
        .success(function(response){
            console.log("setting current user favorites to " + response);
            $scope.currentUserFavorites = response;
        });
    }

    // retrieve list of cars to display
    /*$http.jsonp("https://api.edmunds.com/api/vehicle/v2/" + $scope.currentMake + "/models?" + yearJson + $scope.currentCategory + "view=basic&fmt=json&api_key=vwp9323cjna6pjxg5jqtc3qc&callback=JSON_CALLBACK")
    //$http.jsonp("https://api.edmunds.com/api/vehicle/v2/bmw/models?state=new&year=2015&category=Sedan&view=basic&fmt=json&api_key=vwp9323cjna6pjxg5jqtc3qc&callback=JSON_CALLBACK")
        .success(function (response) {
            $scope.models = response.models
            console.log("object is ");
            console.log(response.models);
        });
    */

    //retrieve list of makes to filter from (this does not change so we will only do it once)
    $http.jsonp("https://api.edmunds.com/api/vehicle/v2/makes?view=basic&fmt=json&api_key=vwp9323cjna6pjxg5jqtc3qc&callback=JSON_CALLBACK")
        .success(function (response) {
            $scope.makes = response.makes
            console.log("list of makes is");
            console.log(response.makes);
        });

    // refresh the table of cars
    $scope.updateSearchResults = function()
    {
        console.log("attempting to update, current model is: ")
        console.log($scope.currentMake);
        console.log("current year is: ")
        console.log($scope.currentYear);

        yearJson = "year=" + $scope.currentYear + "&";

        // category json might be empty, if not it should be formatted properly
        var categoryJson = ""
        if ($scope.currentCategory !== "")
        {
            categoryJson = "category=" + $scope.currentCategory + "&";
        }

        // insert the make (required), year (required) and category (optional) to make API query
        $http.jsonp("https://api.edmunds.com/api/vehicle/v2/" + $scope.currentMake + "/models?" + yearJson + categoryJson + "view=basic&fmt=json&api_key=vwp9323cjna6pjxg5jqtc3qc&callback=JSON_CALLBACK")
        .success(function (response) {
            $scope.models = response.models
            console.log("object is ");
            console.log(response.models);
        });
    }

    $scope.goToDetailsPage = function(vehicleID)
    {
        // set rootScope to contain vehicle ID we will view
        $rootScope.currentDetailID = vehicleID;
        $location.url("/details");
    }

    $scope.favoriteCar = function(username, vehicleID, vehicleName, vehicleYear)
    {
        console.log("favoriting car: username" + username + " " + "vehicleID " + vehicleID);
        $http.post('/favoriteCar/' + username + '/' + vehicleID + '/' + vehicleName.replace(/\//g, '') + '/' + vehicleYear)
        .success(function(response){
            $scope.currentUserFavorites.push(vehicleID);
        });
    }


    $scope.unFavoriteCar = function(username, vehicleID)
    {
        console.log("deleting car: username" + username + " " + "vehicleID " + vehicleID);
        $http.post('/deleteFavoriteCar/' + username + '/' + vehicleID)
        .success(function(response){
            var index = $scope.currentUserFavorites.indexOf(vehicleID);
            $scope.currentUserFavorites.splice(index, 1);
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

    // load search results upon page load
    $scope.updateSearchResults();
});
