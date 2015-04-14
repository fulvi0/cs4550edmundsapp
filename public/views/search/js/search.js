app.controller("SearchCtrl", function($location, $rootScope, $scope, $http){
    
    $scope.currentMake = "bmw"

    // retrieve list of cars
    $http.jsonp("https://api.edmunds.com/api/vehicle/v2/" + $scope.currentMake + "/models?year=2013&view=basic&fmt=json&api_key=vwp9323cjna6pjxg5jqtc3qc&callback=JSON_CALLBACK")
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

    $scope.OnItemClick = function(event) {
        $scope.currentMake = event;
        console.log("current make is now");
        console.log(event);
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
