'use strict';

(function () {
	// Teacher App
	angular
	.module("TeacherApp", [])
	// Teacher Dashboard Controller
	.controller("StudentCtrl", StudentCtrl)
	.directive('fileModel', ['$parse', function ($parse) {
		return {
	        restrict: 'A',
	        link: function(scope, element, attrs) {
	            var model = $parse(attrs.fileModel);
	            var modelSetter = model.assign;

	            element.bind('change', function(){
	                scope.$apply(function(){
	                    modelSetter(scope, element[0].files[0]);
	                });
	            });
	        }
	    };
	}]);

	// Inject dependencies to controller --------------------
	// $scope - for manipulating data in view
	// $window - for page redirection
	// TeacherService - for asynchronous functions
	StudentCtrl.$inject = ["$scope", "TeacherService"];

	function StudentCtrl($scope, TeacherService) {
		$scope.students = [];

		TeacherService.GetAllStudentsInClass($('#courseno').html().trim(), $('#lecturesection').html().trim())
			.then(function (res) {
				$scope.students = res;
			})
			.catch(function (res) {
				Materialize.toast("Problem loading the students :(", 4000, 'rounded');
			});


		// get all classes in username
		TeacherService.GetClass($('#courseno').html().trim(), $('#lecturesection').html().trim(), TeacherService.GetUsername())
			.then(function (response) {
				$scope.sectionslimit = response.no_lrsections;
			})
			.catch(function (response) {
				Materialize.toast('Unable to get class ['+$('#courseno').html().trim()+" "+ $('#lecturesection').html().trim() +"]", 3000, 'rounded');
			});


		$scope.ToggleEdit = function (student, index) {
			$('#EditModal').openModal();
			$scope.student = {
				college: student.college,
				courseno: student.courseno,
				degcourse: student.degcourse,
				fname: student.fname,
				lecturesection: student.lecturesection,
				lname: student.lname,
				lrsection: student.lrsection,
				mname: student.mname,
				picture: student.picture,
				seatno: student.seatno,
				studentno: student.studentno,
			};
			$scope.i = index;
		}

		$scope.EditStudent = function () {
			if (!$scope.student.sex) {
				Materialize.toast("Plese select a sex!", 3000, 'rounded');
				return;
			}
			if($scope.student.seatno.substring(1,$scope.student.seatno.length) > 15){
				Materialize.toast("Invalid seat number. Choose from 1-15 only.", 3000, 'rounded');
				return;
			}

			TeacherService.EditStudent($scope.student, $scope.student.courseno, $scope.student.lecturesection, $scope.student.studentno)
				.then(function (res) {
					$scope.students[$scope.i] = $scope.student;
					// $('#EditModal').closeModal();

					Materialize.toast("Student ["+$scope.student.studentno+"] was edited successfully!", 3000, 'rounded');

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
				})
				.catch(function (res) {
					Materialize.toast("EDIT Student FAILED!", 3000, 'rounded');
					
				});

		}

		$scope.DeleteStudent = function (student, index) {
			if (confirm('Are you sure you want to delete ' + student.fname + " " + student.mname + " " + student.lname + "?")) {
				// Try removing the student
				TeacherService.RemoveStudent(student.courseno, student.lecturesection, student.studentno)
					.then(function (res) {
						// inform if successful
						Materialize.toast('Deleted successfully!', 4000, 'rounded');
						// remove the student from collapsible
						$scope.students.splice(index, 1);
					})
					.catch(function (res) {
						// inform if error
						Materialize.toast("Something went wrong!", 3000, 'rounded');
					});
			}
		}

		// RANDOMIZER FUNCTION (Team Hopper)
		// INITIAL ROWS AND COLS FOR ICSMH
		$scope.rows = 7;
		$scope.cols = 8;
		$scope.rows2 = 7;
		$scope.cols2 = 7;
		$scope.countah = 0;
		$scope.stud = [];
		var randomized = [];
		var ctr = 0;

		$scope.submitData = function() {
			if( $scope.vol <= 0  || $scope.vol.match(/[^0-9]/) || $scope.vol > 105){
				Materialize.toast("Invalid input for number of volunteer/s!", 4000, 'rounded');
				$scope.vol = '';
			}else{
				TeacherService.randomizeSeat($scope.vol, $('#courseno').html().trim(), $('#lecturesection').html().trim())
				.then(function (res) {
					randomized = res;
					var studCount = randomized.length;
					if($scope.vol > studCount){
						Materialize.toast("Not enough students to randomize. Available students: "+ studCount, 4000, 'rounded');
						$scope.vol = '';
					} else{
						Materialize.toast("No. of volunteer/s: "+ $scope.vol, 4000, 'rounded');
						$scope.vol = '';
						initRowCol();
						genRowCol();
					}
				})
				.catch(function (res) {
					Materialize.toast("Problem randomizing students!", 4000, 'rounded');
				});
			}
		}

		var initRowCol = function(){
			document.getElementById("seats").innerHTML = "";
			document.getElementById("seats2").innerHTML = "";
		}

		var genRowCol = function(){
  			$scope.rowNum = 1;
			$scope.countah = 0;

			for(var i=0; i<$scope.rows; i++){
				for(var j=0; j<$scope.cols; j++){

					if($scope.rowNum > $scope.cols) $scope.rowNum = 1;
					var flag = false;

					for(var k = 0;  k < $scope.students.length; k++){
						if(($scope.students[k].seatno.charAt(0) == String.fromCharCode(i + 65)) && (parseInt($scope.students[k].seatno.substring(1,$scope.students[k].length))  == j + 1)) {

							document.getElementById("seats").innerHTML += "<div style='height:75px;width:85px;display:inline-block;'><div id="+$scope.countah+" class='card-panel red darken-1'><span class='white-text'>"+$scope.students[k].lname + ',<br/>' + $scope.students[k].fname.charAt(0)+". </span></div></div>&nbsp;&nbsp;";
							flag = true;
							$scope.rowNum++;

							for(var a=0; a<randomized.length; a++){
								if(randomized[a].studentno == $scope.students[k].studentno){
									document.getElementById($scope.countah).className = "card-panel blue darken-1";
								}
							}
						}
					}

					if(!flag){
						document.getElementById("seats").innerHTML += "<div style='height:75px;width:85px;display:inline-block;'><div id="+$scope.countah+" class='card-panel red darken-1'><span class='white-text'>"+String.fromCharCode(i + 65)+"<br/>"+$scope.rowNum+"</span></div></div>&nbsp;&nbsp;";
						$scope.rowNum++;
					}
					$scope.countah++;
				}
				document.getElementById("seats").innerHTML += "<br/><br/>";
			}

			$scope.rowNum = parseInt($scope.cols) + 1;
			var total = parseInt($scope.cols) + parseInt($scope.cols2);

			for(var i=0; i<$scope.rows2; i++){
				for(var j=(parseInt($scope.cols)+1); j<=total; j++){

					if($scope.rowNum > total) $scope.rowNum = parseInt($scope.cols) + 1;
				 	var flag = false;

					for(var k=0; k<$scope.students.length; k++){
						if(($scope.students[k].seatno.charAt(0) == String.fromCharCode(i + 65)) && (parseInt($scope.students[k].seatno.substring(1,$scope.students[k].length))  == j)) {

							document.getElementById("seats2").innerHTML += "<div style='height:75px;width:85px;display:inline-block;'><div id="+$scope.countah+" class='card-panel red darken-1'><span class='white-text'>"+$scope.students[k].lname + ',<br/>' + $scope.students[k].fname.charAt(0)+". </span></div></div>&nbsp;&nbsp;";
							flag = true;
							$scope.rowNum++;

							for(var a=0; a<randomized.length; a++){
								if($scope.students[k].studentno == randomized[a].studentno){
									document.getElementById($scope.countah).className = "card-panel blue darken-1";
								}
							}
						}
					}

					if(!flag){
						document.getElementById("seats2").innerHTML += "<div style='height:75px;width:85px;display:inline-block;'><div id="+$scope.countah+" class='card-panel red darken-1'><span class='white-text'>"+String.fromCharCode(i + 65)+"<br/>"+$scope.rowNum+"</span></div></div>&nbsp;&nbsp;";
						$scope.rowNum++;
					}
					$scope.countah++;
				}
			document.getElementById("seats2").innerHTML += "<br/><br/>";
			}
		}
	}
})();
