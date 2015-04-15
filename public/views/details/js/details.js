app.controller("DetailsCtrl", function($location, $rootScope, $scope, $http){

	console.log("Current car ID is \n");
    console.log($rootScope.currentDetailID);
   
    // retrieve car info from edmunds to display details
    $http.jsonp("https://api.edmunds.com/api/vehicle/v2/styles/" + $rootScope.currentDetailID + "?view=full&fmt=json&api_key=vwp9323cjna6pjxg5jqtc3qc&callback=JSON_CALLBACK")
        .success(function (response) {
            $scope.detailsVehicleInfo = response;
            console.log("current vehicle info is");
            console.log(response);
        });

});
