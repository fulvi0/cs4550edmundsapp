app.controller("SearchCtrl", function($location, $rootScope, $scope, $http){
    
    // initially display default make and year and no category
    $scope.currentMake = "bmw";
    $scope.currentYear = "2015";
    $scope.currentCategory = "";

    yearJson = "year=" + $scope.currentYear + "&";

    // retrieve list of cars to display
    $http.jsonp("https://api.edmunds.com/api/vehicle/v2/" + $scope.currentMake + "/models?" + yearJson + $scope.currentCategory + "view=basic&fmt=json&api_key=vwp9323cjna6pjxg5jqtc3qc&callback=JSON_CALLBACK")
    //$http.jsonp("https://api.edmunds.com/api/vehicle/v2/bmw/models?state=new&year=2015&category=Sedan&view=basic&fmt=json&api_key=vwp9323cjna6pjxg5jqtc3qc&callback=JSON_CALLBACK")
        .success(function (response) {
            $scope.models = response.models
            console.log("object is ");
            console.log(response.models);
        });

    //retrieve list of makes to filter from
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

        $http.jsonp("https://api.edmunds.com/api/vehicle/v2/" + $scope.currentMake + "/models?" + yearJson + categoryJson + "view=basic&fmt=json&api_key=vwp9323cjna6pjxg5jqtc3qc&callback=JSON_CALLBACK")
        .success(function (response) {
            $scope.models = response.models
            console.log("object is ");
            console.log(response.models);
        });
    }

    $scope.goToDetailsPage = function(vehicleID)
    {
        console.log("Navigating to details page for vehicle " + vehicleID);

        // set rootScope to contain vehicle ID we will view
        $rootScope.currentDetailID = vehicleID;
        $location.url("/details");
    }
});
