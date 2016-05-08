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
	// $window - for page redirection
	// TeacherService - for asynchronous functions
	AddStudentCtrl.$inject = ["$scope", "TeacherService"];

	function AddStudentCtrl($scope, TeacherService) {
		// get all classes in username
		TeacherService.GetClass($('#courseno').html().trim(), $('#lecturesection').html().trim(), TeacherService.GetUsername())
			.then(function (response) {
				$scope.sectionslimit = response.no_lrsections;
			})
			.catch(function (response) {
				Materialize.toast('Unable to get class ['+$('#courseno').html().trim()+" "+ $('#lecturesection').html().trim() +"]");
			});


		$scope.AddStudent = function () {
			if(!$scope.student.sex) {
				Materialize.toast("Plese select a sex!", 3000, 'rounded');
				return;
			}
			
			if($scope.student.seatno.substring(1,$scope.student.seatno.length) > 15){
				Materialize.toast("Invalid seat number. Choose from 1-15 only.", 3000, 'rounded');
				return;
			}

			// add lecturesection and course no
			// nakatago sa hidden div ng add-student.ejs
			$scope.student.lecturesection = $('#lecturesection').html().trim();
			$scope.student.courseno = $('#courseno').html().trim();

			// sex
			$scope.student.sex = ($scope.student.sex == 'Male')? "m":"f";
			$scope.student.degcourse = $scope.student.degcourse.toUpperCase();
			$scope.student.college = $scope.student.college.toUpperCase();

			if(document.getElementById("uploadPicBtn").files.length == 0){
				$scope.student.picture = "/uploads/default.png";
			}

			TeacherService.AddStudent($scope.student)
				.then(function (res) {
					Materialize.toast("Student ["+$scope.student.studentno+"] was added successfully!", 3000, 'rounded');

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

		$scope.readFile = function(){

			document.getElementById('fileReadBtn').addEventListener('change', readFile, false);

			function readFile (evt) {
				var files = evt.target.files;
				var file = files[0];
				var reader = new FileReader();
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
							obj[attrib] = currentline[j];
						}
						obj["courseno"] = $('#courseno').html().trim();
						obj["lecturesection"] = $('#lecturesection').html().trim();
						result.push(obj);
					}

					for(i=0;i<result.length;i++){
						var studentno = result[i].studentno;
						TeacherService.AddStudent(result[i])
							.then(function (res) {
								Materialize.toast("Student [" + studentno + "] was added successfully!", 3000, 'rounded');
								$('#readFileForm')[0].reset();
							})
							.catch(function (res) {
								Materialize.toast("FAILED TO ADD Student [" + studentno + "]! Something's wrong :(", 3000, 'rounded');
							});
					}

				}
				reader.readAsText(file);
			}

		}

	}
})();
