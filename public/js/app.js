var app = angular.module('PassportApp', ['ngRoute']);

// route provider says what view to display
app.config(function($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'views/home/home.html',
			controller: 'HomeCtrl',
			css: 'views/home/css/home.css'
		})
		.when('/login', {
			templateUrl: 'views/login/login.html',
			controller: 'LoginCtrl',
			css: 'views/login/css/login.css'
		})
		.when('/profile', {
			templateUrl: 'views/profile/profile.html',
			controller: 'ProfileCtrl',
			css: 'views/profile/css/profile.css',
			resolve: {
				logincheck: checkLoggedin
			}
		})
		.when('/publicProfile', {
			templateUrl: 'views/publicProfile/publicProfile.html',
			controller: 'PublicProfileCtrl',
			css: 'views/publicProfile/css/PublicProfile.css'
		})
		.when('/register', {
			templateUrl: 'views/register/register.html',
			controller: 'RegisterCtrl',
			css: 'views/register/css/register.css'
		})
		.when('/search', {
			templateUrl: 'views/search/search.html',
			controller: 'SearchCtrl',
			css: 'views/search/css/search.css'
		})
		.when('/details', {
			templateUrl: 'views/details/details.html',
			controller: 'DetailsCtrl',
			css: 'views/details/css/details.css'
		})
		.otherwise({
			redirectTo: '/home'
		})
});

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
	var deferred = $q.defer()

	$http.get('loggedin').success(function(user)
	{
		$rootScope.errorMessage = null;
		// User is Authenticated
		if (user !== '0')
		{
			$rootScope.currentUser = user;
			deferred.resolve();
		}
		// User is Not Authenticated
		else
		{
			$rootScope.errorMessage = 'You need to log in.';
			deferred.reject();
			$location.url('/login');
		}
	});
}

app.controller("NavCtrl", function($rootScope, $scope, $http, $location){
	$scope.logout = function()
	{
		$http.post("/logout")
		.success(function(){
			$rootScope.currentUser = null;
			$location.url("/home");
		});
	}

	$scope.searchTitle = function()
    {        
        $http.jsonp("https://api.edmunds.com/api/vehicle/v2/audi/models?state=used&year=2013&category=Sedan&view=basic&fmt=json&api_key=vwp9323cjna6pjxg5jqtc3qc")
        .success(function (response) {
            log(response[0]);
        });
    }
});