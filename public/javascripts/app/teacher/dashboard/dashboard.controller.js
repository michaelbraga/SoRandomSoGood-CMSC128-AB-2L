'use strict';

(function () {
	// Teacher App
	angular
	.module("TeacherApp", [])
	// Teacher Dashboard Controller
	.controller("DashboardCtrl", DashboardCtrl);

	// Inject dependencies to controller --------------------
	// $scope - for manipulating data in view
	// $window - for page redirection
	// TeacherService - for asynchronous functions
	DashboardCtrl.$inject = ["$scope", "$window", "TeacherService"];

	function DashboardCtrl($scope, $window, TeacherService) {
		$scope.username = "";
		$scope.number = [];
		var prevcourse="";
		var toggled=false;

		/**************************************
		      Retrieve Classes from DB
		**************************************/

		// store username
		$scope.username = TeacherService.GetUsername();
		function LoadClasses() {
			$scope.rows = [];
			// get all classes in username
			TeacherService.GetAllClasses($scope.username)
			.then(function (response) {
				var subjects = response;
				for (var i = 0; i < subjects.length; i++) {
					GetNumberOfStudents(subjects[i].courseno, subjects[i].lecturesection);
				}
				for (var i = 0; i < Math.ceil(subjects.length / 3)+1; i++) {
					var list = [];
					for (var j = 0; j < 3; j++) {
						list = subjects.splice(0, 3);
						$scope.rows.push(list);
					}
				}

				if(subjects.length == 0){
					Materialize.toast("No classes yet. Click Add a Class button below! ", 9000, 'rounded');
				}
			})
			.catch(function (response) {
				Materialize.toast('Unable to get classes from ' + $scope.username, 3000, 'rounded');
			});
		}
		LoadClasses();

		function GetNumberOfStudents(courseno, lecturesection) {
			TeacherService.GetAllStudentsInClass(courseno, lecturesection)
				.then(function (res) {
					$scope.number[courseno+lecturesection] = res.length.toString();
				})
				.catch(function (res) {
					console.log("Something went wrong!");
				});
		}
		/**************************************
		      functions
		**************************************/
		$scope.AddClass = function () {
			// check if there no_lrsections is entered
			if (!$scope.class.no_lrsections) {
				Materialize.toast("Please enter the number of sections.", 3000, 'rounded');
				return;
			}

			// try adding the class
			TeacherService.AddClass($scope.class, $scope.username)
				.then(function (res) {
					// if successfull
					$('#addClassForm').trigger('reset'); // reset form for adding more class
					// inform user that the class was successfully added
					Materialize.toast('Successfully added class "'+res.courseno +" "+ res.lecturesection+'"', 4000, 'rounded');
					LoadClasses();
				})
				.catch(function (res) {
					// inform error
					Materialize.toast('Class "'+$scope.class.courseno +" "+ $scope.class.lecturesection+'" is already been taken!', 4000, 'rounded');
				});
		}

		function transition(course){
			//$(this).children('i').toggleClass('fa-pencil');
			//$(".form-module .form:nth-child(3)").attr("display", "none")
			if (toggled==true && prevcourse != course){
				$("[id='"+prevcourse.courseno+"/"+prevcourse.lecturesection+"']").next().animate({
					height: "toggle",
					'padding-top': 'toggle',
					'padding-bottom': 'toggle',
					opacity: "toggle"
				}, "slow");

				$("[id='"+prevcourse.courseno+"/"+prevcourse.lecturesection+"']").next().next().animate({
					height: "toggle",
					'padding-top': 'toggle',
					'padding-bottom': 'toggle',
					opacity: "toggle"
				}, "slow");
			} else {
				toggled = (toggled) ? false : true;
			}

			$("[id='"+course.courseno+"/"+course.lecturesection+"']").next().animate({
				height: "toggle",
				'padding-top': 'toggle',
				'padding-bottom': 'toggle',
				opacity: "toggle"
			}, "slow");

			$("[id='"+course.courseno+"/"+course.lecturesection+"']").next().next().animate({
				height: "toggle",
				'padding-top': 'toggle',
				'padding-bottom': 'toggle',
				opacity: "toggle"
			}, "slow");

			prevcourse = course;

		}

		$scope.InitEditClassModal = function (course) {
			// put old info of class to form for editing

			$scope.edit = {
				coursename: course.coursename,
				room: course.room,
				no_lrsections: course.no_lrsections,
				old_courseno: course.courseno,
				old_lecturesection: course.lecturesection,
				courseno: course.courseno,
				lecturesection: course.lecturesection,
				tusername: course.tusername
			};

			transition(course);
		}

		$scope.EditClass = function (course) {
			// check if no_lrsections is entered
			if (!$scope.edit.no_lrsections) {
				Materialize.toast("Please enter the number of sections.", 3000, 'toast');
				return;
			}

			// try editing the class
			TeacherService.EditClass($scope.edit, $scope.edit.old_courseno, $scope.edit.old_lecturesection, $scope.username)
				.then(function (res) {
					// inform if successful
					Materialize.toast('Updated successfully!', 4000, 'rounded');
					LoadClasses();
				})
				.catch(function (res) {
					// inform if error
					console.log(res);
					Materialize.toast("Error updating class '"+$scope.edit.old_courseno+" "+$scope.edit.old_lecturesection+"'!", 3000, 'rounded');
				});

			transition(course);
		}

		$scope.DeleteClass = function (course) {
			// ask user if certain about deleting the class
			if (confirm('Are you sure?')) {

				// Remove all HISTORY
				TeacherService.RemoveAllHistory(course.courseno, course.lecturesection)
					.then(function (res) {
						Materialize.toast('Removed all logs in ['+course.courseno+" " +course.lecturesection+']', 4000, 'rounded');
						// Remove all STUDENTS
						TeacherService.RemoveAllStudents(course.courseno, course.lecturesection)
							.then(function (res) {
								// Try removing the class
								Materialize.toast('Removed all students in ['+course.courseno+" " +course.lecturesection+']', 4000, 'rounded');
								// Remove CLASS
								TeacherService.RemoveClass(course.courseno, course.lecturesection, course.tusername)
									.then(function (res) {
										// inform if successful
										Materialize.toast('Deleted successfully!', 4000, 'rounded');
										// wait for 1.250 seconds for reloading to reload the classes
										setTimeout(function(){
										    $window.location.reload();
										}, 1200);
									})
									.catch(function (res) {
										// inform if error
										Materialize.toast("Cannot delete class, something's wrong!", 3000, 'rounded');
									});
							})
							.catch(function (res) {
								// inform if error
								Materialize.toast("Cannot delete students in "+"["+course.courseno+" " +course.lecturesection+']'+", something's wrong!", 3000, 'rounded');
							});
					})
					.catch(function (res) {
						// inform if error
						Materialize.toast("Cannot delete logs in "+"["+course.courseno+" " +course.lecturesection+']'+", something's wrong!", 3000, 'rounded');
					});

			}
		}
	}
})();
