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
		$scope.logs = [];
		var stringArray = window.location.pathname.split("/");

		var courseno = stringArray[3];
		var lecturesection = stringArray[4];

		function getWord(month) {
			switch (month) {
				case 0: return 'January';
				break;
				case 1: return 'February';
				break;
				case 2: return 'March';
				break;
				case 3: return 'April';
				break;
				case 4: return 'May';
				break;
				case 5: return 'June';
				break;
				case 6: return 'July';
				break;
				case 7: return 'August';
				break;
				case 8: return 'September';
				break;
				case 9: return 'October';
				break;
				case 10: return 'November';
				break;
				case 11: return 'December';
				break;
				default: return null;
			}
		}


		TeacherService.GetHistory(courseno, lecturesection)
		.then(function (res) {
			$scope.hist = res;
			for (var i = 0; i < $scope.hist.length; i++) {
			 	$scope.logs[i] = {
					date: GetDate($scope.hist[i].logdate),
					time: GetTime($scope.hist[i].logdate),
					student_info: ($scope.hist[i].fname+" "+$scope.hist[i].lname+" ("+$scope.hist[i].studentno+")"),
					section: ($scope.hist[i].lrsection)
				};
			}
		})
		.catch(function (res) {
			console.log(res);
			alert("Problem loading the history :(");
		});

		var GetDate = function (date) {
			console.log(date);
			var d = new Date(date);
			var year = d.getFullYear().toString();
			var month = d.getMonth();
			var day = d.getDate().toString();

			return (getWord(month)+" "+day+", " + year);
		};
		var GetTime = function (date) {
			var t = new Date(date)
			// formats a javascript Date object into a 12h AM/PM time string
			var hours = (t.getHours() < 10 ? "0" + t.getHours() : t.getHours());
			var am_pm = (hours > 12)? 'pm':'am'
			hours = (hours > 12)? (hours-12):hours;
			var minutes = t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes();
			var seconds = t.getSeconds() < 10 ? "0" + t.getSeconds() : t.getSeconds();
			return hours + ":" + minutes + ":"+seconds +" "+ am_pm;
		};
	}
})();
