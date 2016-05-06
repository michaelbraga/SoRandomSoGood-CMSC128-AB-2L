'use strict';
(function () {
	/* Guest App */
	angular
	.module("GuestApp")
	/* Guest Service Provider */
	.factory("GuestService", GuestService);

	/* Inject dependencies on Guest Service */
	// $http - for http requests
	// $q - for asynchronous functions
	GuestService.$inject = ["$http", "$q"];

	function GuestService($http, $q) {
		var url = document.location.origin + "/api-guest";
		var service = {};

		/* SERVICES */
		function ValidateUser(username, password) {
			var deferred = $q.defer();
			var completeUrl = [url, "login", username, password];

			$http.get(completeUrl.join('/'))
			.success(function (data) {
				deferred.resolve(data);
			})
			.error(function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}
		function CreateAnAccount(teacher) {
			var deferred = $q.defer();
			var completeUrl = [url, "signup"];

			$http.post(completeUrl.join('/'), teacher)
			.success(function(data) {
				deferred.resolve(data);
			})
			.error(function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}

		/* PUT THE SERVICES IN THE ARRAY */
		service.ValidateUser = ValidateUser;
		service.CreateAnAccount = CreateAnAccount;

		/* RETURN SERVICE */
		return service;
	}


})();
