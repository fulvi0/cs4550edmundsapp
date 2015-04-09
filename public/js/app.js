var app = angular.module('PassportApp', ['ngRoute']);

// route provider says what view to display
app.config(function($routeProvider) {
	$routeProvider
		.when('/home', {
			//if you see the above, display profile.
			templateUrl: 'views/home.html',
		})
		.when('/login', {
			templateUrl: 'views/login/login.html',
			controller: 'LoginCtrl'
		})
		.when('/profile', {
			templateUrl: 'views/profile.html',
		})
		.when('/register', {
			templateUrl: 'views/registration.html',
		})
		.otherwise({
			redirectTo: '/home'
		})

});

/*app.controller('LoginCtrl', function($scope, $http, $location, SecurityService)
{
	$scope.login = function(user)
	{
		console.log(user);
		SecuritService.login(user, function(usuario)
		{
			console.log(usuario);
			$location.url('/profile');
		});
	}
});

app.controller('NavCtrl',)*/