app.controller("HomeCtrl", function($location, $rootScope, $scope, $http, $window){

    $scope.go = function ( path ) {
  $location.path( path );
};

});