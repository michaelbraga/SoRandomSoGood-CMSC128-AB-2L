'use strict';
(function () {
	// Guest App
	angular
	.module("GuestApp", [])
	// Guest Controller
	.controller("GuestCtrl", GuestCtrl);

	// Inject dependencies to controller --------------------
	// $scope - for manipulating data in view
	// $window - for page redirection
	// GuestService - for asynchronous functions
	GuestCtrl.$inject = ["$scope", "$window", "GuestService"];

	/**************************
		GUEST CONTROLLER
	**************************/
	function GuestCtrl($scope, $window, GuestService){
		// initialize objects
		var teacher = {
			username:'',
			password:'',
			fname:'',
			mname:'',
			lname:''
		};
		var su = {
			username:'',
			password:'',
			fname:'',
			mname:'',
			lname:''
		};
		var l = {
			username:'',
			password:''
		};

		// function that will handle login
		$scope.login = function () {
			GuestService.ValidateUser($scope.l.username, $scope.l.password)
			// if successful or status code == 200
			.then(function (res) {
				if (res.status === 'success') {
					Materialize.toast("Logging you in!", 2000, 'rounded');
					$window.location.href = '/login/'+JSON.stringify(res.data);
				}
			})
			// if failure or status code = 404, 401, etc.
			.catch(function (res) {
				Materialize.toast(res.message, 2000, 'rounded');
			});
		}
		// function that will handle login
		$scope.signup = function () {
			if ($scope.password != $scope.su.password) {
				Materialize.toast("Password entered does not match!", 2000, 'rounded');
				$("#passwords").addClass("invalid");
				$("#password2").addClass("invalid");
				return;
			}

			GuestService.CreateAnAccount($scope.su)
			// if successful or status code == 200
			.then(function (res) {
				Materialize.toast("Registration successful! Redirecting to login.", 3000, 'rounded');
				$("form#s")[0].reset();
				setTimeout(function(){
				    $window.location.reload();
				}, 1200);
			})
			// if failure or status code = 404, 401, etc.
			.catch(function (res) {
				Materialize.toast("Username ( "+$scope.su.username+" ) already exists", 2000, 'rounded');
				$("#usernames").addClass("invalid");
			});
		}
	}


})();
