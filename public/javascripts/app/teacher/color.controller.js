'use strict';

(function () {
	// Teacher App
	angular
	.module("TeacherApp", [])
	// Teacher Dashboard Controller
	.controller("ColorCtrl", ColorCtrl);

	// Inject dependencies to controller --------------------
	// $scope - for manipulating data in view
	// $window - for page redirection
	// TeacherService - for asynchronous functions
	ColorCtrl.$inject = ["$scope", "TeacherService", "$window"];

	function ColorCtrl($scope, TeacherService, $window) {
		$scope.changeColor = function () {
			if (!$scope.colorScheme) {
				Materialize.toast("Pick a color!", 4000, 'rounded');
				return;
			}

			TeacherService.ChangeColorScheme(TeacherService.GetUsername(), $scope.colorScheme)
				.then(function (response) {
					Materialize.toast("Applying changes, please wait.", 4000, 'rounded');
					setTimeout(function(){
					    $window.location.reload();
					}, 1250);
				})
				.catch(function (response) {
					alert("Problem changing color :(");
				});
		}
	}
})();
