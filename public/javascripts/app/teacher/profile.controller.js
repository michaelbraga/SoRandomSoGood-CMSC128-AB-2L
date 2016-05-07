'use strict';

(function () {
	// Teacher App
	angular
	.module("TeacherApp", [])
	// Teacher Dashboard Controller
	.controller("ProfileCtrl", ProfileCtrl);

	// Inject dependencies to controller --------------------
	// $scope - for manipulating data in view
	// $window - for page redirection
	// TeacherService - for asynchronous functions
	ProfileCtrl.$inject = ["$scope", "TeacherService", "$window"];

	function ProfileCtrl($scope, TeacherService, $window) {
		$scope.UpdateProfile = function (teacher) {
			teacher.username = TeacherService.GetUsername();
			TeacherService.EditTeacher(teacher)
				.then(function (res) {
					if (res.changedRows === 1) {
						Materialize.toast("Saved changes.", 4000, 'rounded');
						$('form#up')[0].reset();
					}
					else{
						Materialize.toast("Saved was not applied.", 4000, 'rounded');
					}
				})
				.catch(function (res) {
					Materialize.toast("Saved was not applied. Database error.", 4000, 'rounded');
				});
		}
		$scope.UpdatePassword = function (p1, p2) {
			if (p1 !== p2) {
				Materialize.toast("Password entered does not match!", 4000, 'rounded');
				$('#pass1').addClass('invalid');
				$('#pass2').addClass('invalid');
				return;
			}
			TeacherService.UpdateTeacherPassword(p1, TeacherService.GetUsername())
				.then(function (res) {
					if (res.changedRows === 1) {
						Materialize.toast("Password updated.", 4000, 'rounded');
						$('form#upw')[0].reset();
					}
					else{
						Materialize.toast("Saved was not applied.", 4000, 'rounded');
					}
				})
				.catch(function (res) {
					Materialize.toast("Saved was not applied. Database error.", 4000, 'rounded');
				});
		}
		$scope.UpdateUsername = function (username) {
			TeacherService.UpdateTeacherUsername (username, TeacherService.GetUsername())
				.then(function (res) {
					if (res.changedRows === 1) {
						Materialize.toast("Username updated.", 4000, 'rounded');
						$window.location.href = '/-u-p/'+username;
					}
					else{
						Materialize.toast("Saved was not applied.", 4000, 'rounded');
					}
				})
				.catch(function (res) {
					Materialize.toast("Saved was not applied. Database error.", 4000, 'rounded');
				});
		}
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
