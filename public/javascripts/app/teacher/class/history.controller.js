'use strict';

(function () {
	// Teacher App
	angular
	.module("TeacherApp", [])
	// Teacher Dashboard Controller
	.controller("HistoryCtrl", HistoryCtrl);

	// Inject dependencies to controller --------------------
	// $scope - for manipulating data in view
	// TeacherService - for asynchronous functions
	HistoryCtrl.$inject = ["$scope", "TeacherService"];

	function HistoryCtrl($scope, TeacherService) {
		$scope.hist = [];
		var stringArray = window.location.pathname.split("/");

		var courseno = stringArray[3];
		var lecturesection = stringArray[4];


		TeacherService.GetHistory(courseno, lecturesection)
		.then(function (res) {
			$scope.hist = res;
		})
		.catch(function (res) {
			alert("Problem loading the history :(");
		});
	}
})();
