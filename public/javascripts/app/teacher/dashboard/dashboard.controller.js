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
				for (var i = 0; i < Math.ceil(subjects.length / 3)+1; i++) {
					var list = [];
					for (var j = 0; j < 3; j++) {
						list = subjects.splice(0, 3);
						$scope.rows.push(list);
					}
				}
			})
			.catch(function (response) {
				console.log(response);
				alert('Unable to get classes from ' + $scope.username);
			});
		}
		LoadClasses();

		/**************************************
		      functions
		**************************************/
		$scope.AddClass = function () {
			// check if there no_lrsections is entered
			if (!$scope.class.no_lrsections) {
				alert("Please enter the number of sections.");
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
					alert('Unable to add class!');
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
				alert("Please enter the number of sections.");
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
					alert("Something went wrong!");
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
									    	}, 1250);
									})
									.catch(function (res) {
										// inform if error
										console.log(res);
										alert("Cannot delete class, something's wrong!");
									});
							})
							.catch(function (res) {
								// inform if error
								console.log(res);
								alert("Cannot delete students in "+"["+course.courseno+" " +course.lecturesection+']'+", something's wrong!");
							});
					})
					.catch(function (res) {
						// inform if error
						console.log(res);
						alert("Cannot delete logs in "+"["+course.courseno+" " +course.lecturesection+']'+", something's wrong!");
					});

			}
		}
	}
})();
