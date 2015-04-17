app.controller("ProfileCtrl", function($location, $rootScope, $scope, $http, $window){
    $scope.go = function (path) {
        $location.path(path);
    };
});