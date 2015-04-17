app.controller("PublicProfileCtrl", function($location, $rootScope, $scope, $http, $window){
    $scope.go = function (path) {
        $location.path(path);
    };
});