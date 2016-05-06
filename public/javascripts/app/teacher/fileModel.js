(function(){
	angular.module('TeacherApp')
		.directive('fileModel', ['$parse', function ($parse) {
		return {
	        restrict: 'A',
	        link: function(scope, element, attrs) {
	            var model = $parse(attrs.fileModel);
	            var modelSetter = model.assign;

	            element.bind('change', function(){
	            //	console.log("fileModel");
	                scope.$apply(function(){
	                    modelSetter(scope, element[0].files[0]);
	                });
	            });
	        }
	    };
	}]);

}());