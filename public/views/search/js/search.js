app.controller("SearchCtrl", function($location, $rootScope, $scope, $http){
    
    $http.jsonp("https://api.edmunds.com/api/vehicle/v2/bmw/models?state=new&year=2015&category=Sedan&view=basic&fmt=json&api_key=vwp9323cjna6pjxg5jqtc3qc&callback=JSON_CALLBACK")
        .success(function (response) {
            $scope.models = response.models
            console.log("object is ");
            console.log(response.models);
        });

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
