app.controller("SearchCtrl", function($location, $rootScope, $scope, $http){
    
    $scope.currentMake = "bmw";
    $scope.currentYear = ""
    //"year=" + 2013 + "&";

    // retrieve list of cars
    $http.jsonp("https://api.edmunds.com/api/vehicle/v2/" + $scope.currentMake + "/models?" + $scope.currentYear + "view=basic&fmt=json&api_key=vwp9323cjna6pjxg5jqtc3qc&callback=JSON_CALLBACK")
    //$http.jsonp("https://api.edmunds.com/api/vehicle/v2/bmw/models?state=new&year=2015&category=Sedan&view=basic&fmt=json&api_key=vwp9323cjna6pjxg5jqtc3qc&callback=JSON_CALLBACK")
        .success(function (response) {
            $scope.models = response.models
            console.log("object is ");
            console.log(response.models);
        });

    //retrieve
    $http.jsonp("https://api.edmunds.com/api/vehicle/v2/makes?view=basic&fmt=json&api_key=vwp9323cjna6pjxg5jqtc3qc&callback=JSON_CALLBACK")
            .success(function (response) {
            $scope.makes = response.makes
            console.log("list of makes is");
            console.log(response.makes);
        });

    $scope.updateSearchResults = function()
    {
        console.log("attempting to update, current model is: ")
        console.log($scope.currentMake);
        console.log("current year is: ")
        console.log($scope.currentYear);

        // year is an optional parameter, so we need to format it properly if it exists
        var yearJson = ""
        if ($scope.currentYear !== "")
        {
            yearJson = "year=" + $scope.currentYear + "&";
        }

        $http.jsonp("https://api.edmunds.com/api/vehicle/v2/" + $scope.currentMake + "/models?" + yearJson + "view=basic&fmt=json&api_key=vwp9323cjna6pjxg5jqtc3qc&callback=JSON_CALLBACK")
        .success(function (response) {
            $scope.models = response.models
            console.log("object is ");
            console.log(response.models);
        });

    }


    /*$scope.populateList = function()
    {
        $scope.cars = [];

        $http.jsonp("https://api.edmunds.com/api/vehicle/v2/bmw/models?state=new&year=2015&category=Sedan&view=basic&fmt=json&api_key=vwp9323cjna6pjxg5jqtc3qc")
        .success(function (response) {
            $scope.cars = response[0];
            log("object is ");
            log(response[0]);
        });

    };*/

});
