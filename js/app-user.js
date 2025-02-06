;(function (window, angular) {

  'use strict';

  // Application module
  angular.module('app.user', [
    'app.common'
  ])

	//---------factory-------------------------->
	.factory('user', [
		'$rootScope',
		'$state',
		'$timeout',
		'util',

		($rootScope, $state, $timeout, util) => {
			
			// Set local methods
			const methods = {
				// Show message/confirm
				showMessage: (options) => {
					const messageDialog = document.querySelector('#messageDialog');
					if (messageDialog) {
						$rootScope.message = options;
						$rootScope.$applyAsync();
						if (options.isAudio) {
							const audioElement = messageDialog.querySelector('audio');
							if (audioElement) {
								audioElement.volume = 0.1;
								audioElement.play();
							}
						}
						(new bootstrap.Modal(messageDialog)).show();
					}
				}
			};
	
			// Set service
			const service = {
				// Initialize
				init: () => {
					// Set user default properties
					$rootScope.user = {
						id: null,
						type: null,
						first_name: null,
						middle_name: null,
						last_name: null,
						gender: null,
						email: null
					};
				},
	
				// Set
				set: (data) => {
					Object.keys(data).forEach(k => $rootScope.user[k] = data[k]);
					$rootScope.$applyAsync();
				},
	
				// Reset
				reset: (filter = null) => {
					if (util.isString(filter)) filter = filter.split(',');
					if (!util.isArray(filter)) filter = [];
					Object.keys($rootScope.user).forEach(k => {
						if (!filter.includes(k)) $rootScope.user[k] = null;
					});
					$rootScope.$applyAsync();
				},
	
				// Clone
				clone: () => {
					const result = {};
					Object.keys($rootScope.user).forEach(k => {
						result[k] = $rootScope.user[k];
					});
					return result;
				},
	
				// Focus
				focus: () => {
					$timeout(() => {
						const firstInvalidInput = document.querySelector('form input.ng-invalid');
						const firstEmptyInput = document.querySelector('form input.ng-empty');
						if (firstInvalidInput) firstInvalidInput.focus();
						else if (firstEmptyInput) firstEmptyInput.focus();
					}, 200);
				},
	
				// Error
				error: (msg) => {
					methods.showMessage({
						icon: "text-danger fa-solid fa-circle-exclamation",
						content: msg,
						isAudio: true,
						event: null
					});
				}
			};
	
			// Logout
			$rootScope.logout = () => {
				methods.showMessage({
					icon: "text-primary fa-solid fa-circle-question",
					content: "Biztosan kijelentkezik?",
					isAudio: true,
					event: "logoutConfirmed"
				});
			};
	
			// Logout confirmed
			$rootScope.logoutConfirmed = () => {
				service.reset('email');
				if (['profile', 'cart', 'users'].includes($state.current.name) ||
					($state.current.name === 'users' && $rootScope.user.type !== 'A')) {
					$state.go('home');
				}
			};
	
			// Initialize user
			service.init();
	
			// Return service
			return service;
		}
	]);
})(window, angular);