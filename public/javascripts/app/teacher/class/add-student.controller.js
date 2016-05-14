'use strict';

$(document).ready(function () {

});
(function () {
	// Teacher App
	angular
	.module("TeacherApp", [])
	// Teacher Dashboard Controller
	.controller("AddStudentCtrl", AddStudentCtrl);

	// Inject dependencies to controller --------------------
	// $scope - for manipulating data in view
	// TeacherService - for asynchronous functions
	AddStudentCtrl.$inject = ["$scope", "TeacherService"];

	function AddStudentCtrl($scope, TeacherService) {
		// get all classes in username
		TeacherService.GetClass($('#courseno').html().trim(), $('#lecturesection').html().trim(), TeacherService.GetUsername())
			.then(function (response) {
				$scope.sectionslimit = response.no_lrsections;
			})
			.catch(function (response) {
				Materialize.toast('Unable to get class ['+$('#courseno').html().trim()+" "+ $('#lecturesection').html().trim() +"]", 4000);
			});

		var stud = [];
		TeacherService.GetAllStudentsInClass($('#courseno').html().trim(), $('#lecturesection').html().trim())
			.then(function (response) {
				stud = response;
			})
			.catch(function (response) {
				Materialize.toast("Error in checking available seats/student number! :( ", 4000, 'rounded');
			});

		// AddStudent()
		// - adds student with specified details.
		$scope.AddStudent = function () {
			// verifies sex
			if(!$scope.student.sex) {
				Materialize.toast("Plese select a sex!", 3000, 'rounded');
				return;
			}

			// verifies seat number
			if($scope.student.seatno.substring(1,$scope.student.seatno.length) > 15){
				Materialize.toast("Invalid seat number. Choose from 1-15 only.", 4000, 'rounded');
				return;
			}

			for(var i=0; i<stud.length; i++){
				if(stud[i].seatno == $scope.student.seatno){
					console.log(stud[i].seatno + " == " + $scope.student.seatno);
					Materialize.toast("Seat number is already taken! Try again.", 4000, 'rounded');
					return;
				} else if(stud[i].studentno == $scope.student.studentno){
					console.log(stud[i].studentno + " == " + $scope.student.studentno);
					Materialize.toast("Student number is already taken! Try again.", 4000, 'rounded');
					return;
				}
			}

			// add lecturesection, courseno, and edit sex, degcourse, college
			$scope.student.lecturesection = $('#lecturesection').html().trim();
			$scope.student.courseno = $('#courseno').html().trim();
			$scope.student.sex = ($scope.student.sex == 'Male')? "m":"f";
			$scope.student.degcourse = $scope.student.degcourse.toUpperCase();
			$scope.student.college = $scope.student.college.toUpperCase();

			//check if there is a file upload, sets to default if no file upload
			if(document.getElementById("uploadPicBtn").files.length == 0){
				$scope.student.picture = "/uploads/default.png";
			}

			// Call TeacherService.AddStudent()
			TeacherService.AddStudent($scope.student)
				.then(function (res) {
					Materialize.toast("Student ["+$scope.student.studentno+"] was added successfully!", 3000, 'rounded');

					// Once student is added and there is a file upload, call TeacherService.UploadToUrl() for file upload.
					if(document.getElementById("uploadPicBtn").files.length != 0){
						var file = $scope.student.pictureFile;
						$scope.student.picture = file.name;

						TeacherService.UploadToUrl($scope.student.pictureFile, $scope.student.studentno, $scope.student.courseno, $scope.student.lecturesection)
							.then(function (res){
								Materialize.toast("Student ["+$scope.student.studentno+"] Picture was added successfully!", 3000, 'rounded');
							})
							.catch(function (res){
								Materialize.toast("FAIL! Something's wrong with file upload:(", 3000, 'rounded');
							});
					}

					$('#addForm')[0].reset();
				})
				.catch(function (res) {
					Materialize.toast("FAIL! Something's wrong :(", 3000, 'rounded');
				});
		}

		// readFile()
		// for reading CSV files with multiple students
		$scope.readFile = function(){
			document.getElementById('fileReadBtn').addEventListener('change', readFile, false);

			function readFile (evt) {
				var files = evt.target.files;
				var file = files[0];
				var reader = new FileReader();

				//load file.
				reader.onload = function() {
					var lines = this.result.split('\n');
					var result = [];
					var headers = lines[0].split(",");
					var i=1;

					for(i=1;i<(lines.length);i++){
						var currentline = lines[i].split(",");
						var attrib;
						var j;

						// check if empty
						if(/^\s*$/.test(lines[i]) || currentline[i] == ""){
							continue;
						}

						var obj = {};
						for(j=0; j<headers.length; j++){
							attrib = headers[j];
							if(attrib=="degcourse" || attrib=="college"){
								obj[attrib] = currentline[j].toUpperCase();
							} else if(attrib=='sex'){
								obj[attrib] = (currentline[j].toUpperCase() == "MALE")? "m":"f";
							} else {
								obj[attrib] = currentline[j];	
							}
						}
						obj["picture"] = "/uploads/default.png";
						obj["courseno"] = $('#courseno').html().trim().toUpperCase();
						obj["lecturesection"] = $('#lecturesection').html().trim().toUpperCase();
						result.push(obj);
					}

					// Add each object individually to student
					for(i=0;i<result.length;i++){
						TeacherService.AddStudent(result[i])
							.then(function (res) {
								Materialize.toast("Student [" + res.studentno + "] was added successfully!", 3000, 'rounded');
								$('#readFileForm')[0].reset();
							})
							.catch(function (res) {
								Materialize.toast("FAILED TO ADD Student [" + res.studentno + "]! Something's wrong :(", 3000, 'rounded');
							});
					}

				}
				reader.readAsText(file);
			}

		}

	}
})();
