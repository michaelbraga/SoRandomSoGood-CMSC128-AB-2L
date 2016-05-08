'use strict';

(function () {
	// Teacher App
	angular
	.module("TeacherApp", [])
	// Teacher Dashboard Controller
	.controller("TeacherCtrl", TeacherCtrl);

	// Inject dependencies to controller --------------------
	// $scope - for manipulating data in view
	// $window - for page redirection
	// TeacherService - for asynchronous functions
	TeacherCtrl.$inject = ["$scope", "TeacherService"];

	function TeacherCtrl($scope, TeacherService) {
		$scope.teacher = {};

		// get all details of a username
		TeacherService.FindTeacher(TeacherService.GetUsername())
			.then(function (response) {
				$scope.teacher = response;
			})
			.catch(function (response) {
				Materialize.toast("Problem loading the teacher :(", 3000, 'rounded');
			});

		$scope.EditTeacher = function (teacher){
			if (confirm('Are you sure you want to make changes in your profile?')) {
				$scope.editedTeacher = {
					username: teacher.username,
					password: teacher.password,
					fname: teacher.fname,
					mname: teacher.mname,
					lname: teacher.lname,
				};

				TeacherService.EditTeacher($scope.editedTeacher)
					.then(function (res) {
						TeacherService.UpdateTeacherPassword($scope.editedTeacher.password, $scope.editedTeacher.username)
							.then(function (response) {
								// inform if successful
								Materialize.toast('Profile edited successfully!', 4000, 'rounded');
							})
							.catch(function (response) {
								// inform if error
								Materialize.toast("Something went wrong while updating password!", 3000, 'rounded');
							});
					})
					.catch(function (res) {
						// inform if error
						Materialize.toast("Something went wrong!", 3000, 'rounded');
					});
			}
		}

	}
})();
