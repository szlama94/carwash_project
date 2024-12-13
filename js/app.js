;(function(window, angular) {

  'use strict';

  // Application module
	angular.module('app', [
		'ui.router',
    'app.common',
		'app.form',
    'ngSanitize'
	])

	// Application config
	.config([
    '$stateProvider', 
    '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider) {

      $stateProvider
      .state('root', {
        views: {
          '': {
            templateUrl: './html/root.html'
          },
          'header@root': {
            templateUrl: './html/header.html'
          },
          'footer@root': {
            templateUrl: './html/footer.html',
            controller:'footerController'
          },
          'modal@root': {
            templateUrl: './html/modal.html'
          }
        }
      })
			.state('home', {
				url: '/',
        parent: 'root',
				templateUrl: './html/home.html',
				controller: 'homeController'
			})
      .state('page1', {
				url: '/page1',
        parent: 'root',
				templateUrl: './html/page1.html',
        controller: 'page1Controller'
			})
      .state('page2', {
				url: '/page2',
        parent: 'root',
				templateUrl: './html/page2.html',
			})
      .state('login', {
				url: '/login',
        parent: 'root',
				templateUrl: './html/login.html',
        controller: 'loginController'
			})
      .state('register', {
				url: '/register',
        parent: 'root',
				templateUrl: './html/register.html'
			})
      .state('profile', {
				url: '/profile',
        parent: 'root',
				templateUrl: './html/profile.html',
        controller: "profileController"
			})
      .state('users', {
				url: '/users',
        parent: 'root',
				templateUrl: './html/users.html',
        controller: "usersController"
			})
      .state('cart', {
				url: '/cart',
        parent: 'root',
				templateUrl: './html/cart.html',
        controller: "cartController"
			});
      
      $urlRouterProvider.otherwise('/');
    }
  ])

	// Application run
  .run([
    '$rootScope',
    '$timeout',
    'user',
    function($rootScope, $timeout, user) {

      // Initialize user
      user.init();

      // Initalize tooltips
      $rootScope.tooltipsInit = () => {
        $timeout(() => {
          let tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
          if (tooltips.length) {
            [...tooltips].map(e => new bootstrap.Tooltip(e));
          }
        }, 100);
      }
    }
  ])

  // Http request factory
	.factory('http', [
    '$http',
		'util', 
    ($http, util) => {

      return {

        // Request
				request: (options, method) => {

					// Create promise
					return new Promise((resolve, reject) => {

            // Set methods
            let methods = {

              // Initialize
              init: () => {

                // Check options url property
                if (util.isString(options))  options = {url: options};
                if (!util.isObject(options) ||
                    !util.isObjectHasKey(options, 'url') ||
                    !(options.url = options.url.trim()).length)
                  reject('Missing url HTTP request!');

                // Check method property
                if (!util.isString(method)) method = 'ajax';
                method = method.trim().toLowerCase();
                if (!['ajax', 'fetch', 'http', 'xml'].includes(method)) method = 'ajax';
                if (method === 'ajax' && !util.isJQuery()) method = 'fetch';

                // Check options method
                if (util.isObjectHasKey(options, 'method')) {
                  if (!util.isString(options.method)) 
                        options.method = 'GET';
                  options.method.trim().toUpperCase();
                  if (!['GET','POST'].includes(options.method)) 
                        options.method = 'GET';
                } else  options.method = 'GET';

                // Check/Set options data
                if (util.isObjectHasKey(options, 'data')) {
                  
                  // Check has property
                  if (!util.isUndefined(options.data)) {

                    // Check method
                    if (method !== 'ajax') {
                            options.method = 'POST';
                            options.data = JSON.stringify(options.data);
                    } else  options.data = {data: JSON.stringify(options.data)};
                  }
                } else options.data = undefined;

                // Call request
                methods[method]();
              },

              // Ajax jQuery
              ajax: () => {
                $.ajax({
                  url     : options.url,
                  type    : options.method,	                	
                  data    : options.data,
                  success : response => methods.check(response),
                  error   : e => reject(e.statusText)
                });
              },

              // Fetch
              fetch: () => {

                // Separate url from options
                let url = options.url;
                delete options.url;

                // Replace the data key with body
                options.body = options.data;
                delete options.data;

                fetch(url, options)
                .then(response => {
                  if (response.status >= 200 && response.status < 300)
                        return response.text();
                  else  reject(response.statusText);
                })
                .then(response => {
                  if (!util.isUndefined(response))
                    methods.check(response);
                })
                .catch(e => reject(e));
              },

              // Http angular
              http: () => {
                $http({ 
                  url   : options.url, 
                  method: options.method,
                  data  : options.data
                })
                .then(response => {
                  if (response.status >= 200 && response.status < 300)
                        methods.check(response.data);
                  else  reject(response.statusText);
                })
                .catch(e => reject(e.statusText));
              },

              // XML Http
              xml: () => {
                let xhr = new XMLHttpRequest();
                xhr.open(options.method, options.url, true);
                xhr.onload = () => {
                  if (xhr.status >= 200 && xhr.status < 300)
                        methods.check(xhr.response);
                  else  reject(xhr.statusText);
                };
                xhr.onerror = () => reject(xhr.statusText);
                xhr.responseType = "text";
                xhr.send(options.data);
              },

              // Check response
              check: response => {
                if (util.isUndefined(response)) return;
                if (util.isJson(response)) response = JSON.parse(response);
                if (util.isObjectHasKey(response, "error") && 
                   !util.isNull(response.error))
                        reject(response.error);
                else if (util.isObjectHasKey(response, "data")) {
                  if (util.isJson(response.data))
                        resolve(JSON.parse(response.data));
                  else  resolve(response.data);
                } else	resolve(response);
              }
            };

            // Initialize
            methods.init();
          });
        }
      };
    }
  ])

  // User factory
  .factory('user', [
    '$rootScope',
    '$state',
    '$timeout',
    'util',
    ($rootScope, $state, $timeout, util) => {

      // Set local methods
      let methods = {

        // Show message/confirm
        showMessage: (options) => {
          let messageDialog = document.querySelector('#messageDialog');
          if (messageDialog) {
            $rootScope.message = options;
            $rootScope.$applyAsync();
            if (options.isAudio) {
              let audioElement = messageDialog.querySelector('audio');
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
      let service = {

        // Initialize
        init: () => {

          // Set user default properties
          $rootScope.user = {
            id          : null,
            type        : null,
            first_name  : null,
            middle_name : null,
            last_name   : null,
            gender      : null,
            email       : null 
          };
        },

        // Set
        set: (data) => {
          Object.keys(data).forEach(k => $rootScope.user[k] = data[k]);
          $rootScope.$applyAsync();
        },

        // Reset
        reset: (filter=null) => {
          if (util.isString(filter)) filter = filter.split(',');
          if (!util.isArray(filter)) filter = [];
          Object.keys($rootScope.user).forEach(k => {
            if (!filter.includes(k)) $rootScope.user[k] = null;
          });
          $rootScope.$applyAsync();
        },

        // Clone
        clone: () => {
          let result = {};
          Object.keys($rootScope.user).forEach(k => {
            result = $rootScope.user[k];
          });
          return result;
        },

        // Focus
				focus: () => {
					$timeout(() => {
						let firstInvalidInput = document.querySelector(`form input.ng-invalid`),
								firstEmptyInput   = document.querySelector(`form input.ng-empty`);
						if 		  (firstInvalidInput) firstInvalidInput.focus();
						else if (firstEmptyInput)   firstEmptyInput.focus();
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
        },
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
        if (['profile','cart','users'].includes($state.current.name) ||
           ($state.current.name === 'users' && $rootScope.user.type !== 'A'))
          $state.go('home');
      };

      // Return service
      return service;
    }
  ])

  // Home controller
  .controller('homeController', [
    function() {
      console.log('Home controller...');
    }
  ])

  // Login controller
  .controller('loginController', [
    '$rootScope',
    '$scope',
    '$state',
    'user',
    'util',
    'http',
    function($rootScope, $scope, $state, user, util, http) {

      // Set local methods
      let methods = {

        // Initialize
        init: () => {

          // Set email address from local storige if exist
          $scope.model = {email: util.localStorage('get', 'email')};

          // Set focus
					user.focus();

          // Initialize tooltips
          $rootScope.tooltipsInit();
        }
      };

      // Set scope methods
      $scope.methods = {

        // Login
        login: () => {

          // Set request
          http.request({
            url: "./php/login.php",
            data: util.objFilterByKeys($scope.model, 'showPassword', false)
          })
          .then(response => {
            response.email = $scope.model.email;
            user.set(response);
            util.localStorage('set', 'email', response.email);
            $state.go('home');
          })
          .catch(e => {
            $scope.model.password = null;
            user.error(e);
          });
        }
      };

      // Initialize
      methods.init();
    }
  ])

  

  // Profile controller
  .controller('profileController', [
    '$rootScope',
    '$state',
    '$scope',
    function($rootScope, $state, $scope) {
      if (!$rootScope.user.id) {
        $state.go('home');
        return;
      }
      $scope.model = {};
    }
  ])

  // Users controller
  .controller('usersController', [
    '$rootScope',
    '$state',
    '$scope',
    'user',
    'http',
    function($rootScope, $state, $scope, user, http) {

      if ($rootScope.user.type !== 'A') {
        $state.go('home');
        return;
      }

      $scope.header = {
        id: "azon.",
        type: "típus",
        name: "név",
        born: "született",
        gender: "neme",
        country: "ország",
        phone: "telefon",
        city: "település",
        postcode: "irányítószám",
        address: "cím",
        email: "email",
        year: "év",
        profession: "szakma",
        class: "osztály",
        valid: "érvényes"
      };
      $scope.headerLength = Object.keys($scope.header).length;

      // Set request
      http.request("./php/users.php")
      .then(response => {
        $scope.data = response;
        $scope.$applyAsync();
      })
      .catch(e => user.error(e));
    }
  ])

  // Cart controller
  .controller('cartController', [
    '$rootScope',
    '$state',
    function($rootScope, $state) {
      if (!$rootScope.user.id) {
        $state.go('home');
        return;
      }
    }
  ])


  //----------Footer controller--------
  .controller('footerController',['$scope',function($scope){
    $scope.about={
      title:'Keress minket',
      description: 'Autómosónkban a legjobb minőségű szolgáltatásokkal várjuk ügyfeleinket.',
      icons: ['bi-facebook','bi-instagram','bi-tiktok']
    };

    $scope.links=[
      {icon: 'fa-solid fa-house', label: 'Kezdőlap',url:'#'},
      {icon: 'bi bi-car-front', label: 'Szolgáltatások',url:'#'},
      {icon: 'bi bi-info-circle-fill', label: 'Rólunk',url:'#'}
    ];

    $scope.contact={
      title:'Kapcsolat',
      address: 'Makó, Habfürdő utca 6.',
      phone:'+36 30 610 0666',
      email:'info@supercarwash.hu'
    }

  }])

  //Carousel controller
  .controller('homeController',['$scope', function($scope){
    $scope.carouselImages = [
      './media/image/carousel1_home.png',
      './media/image/carousel2_home.png'
    ];

  
  // Felsorolás adatok
  $scope.cards = [
    {
      title: 'Professzionális',
      text: 'Szakképzett kollégáink több éves autókozmetikai tapasztalattal foglalkoznak az autóddal.',
      icon: 'fa-solid fa-user-tie text-primary'
    },
    {
      title: 'Környezetbarát',
      text: 'Minden tisztítószerünk környezetbarát, így a lehető legkisebb terheléssel varázsoljuk tisztává autódat.',
      icon: 'fa-solid fa-leaf text-success'
    },
    {
      title: 'Megfizethető',
      text: 'Tegyél minket próbára, kérj ajánlatot! Minden szolgáltatásunkat versenyképes árazással tudod igénybevenni.',
      icon: 'fa-solid fa-wallet text-warning'
    }
  ];
  }])

  //Page1 Controller
  .controller('page1Controller', ['$scope', function($scope) {
    $scope.packages = [
      { name: 'Külső mosás', description: 'Külső mosás prémium tisztítószerekkel.', price: 5000  },
      { name: 'Belső takarítás', description: 'Belső takarítás, porszívózás és kárpittisztítás.', price: 8000 },
      { name: 'Extra fényezés', description: 'Fényezés polírozással a csillogó megjelenésért.', price: 10000  },
      { name: 'Kárpittisztítás', description: 'Mélytisztítás a kárpitok és szőnyegek újjá varázsolásához.', price: 15000},
      { name: 'Kerámia bevonat', description: 'Kerámia bevonat az autó tartós védelme és csillogása érdekében.', price: 25000 },
      { name: 'Motor mosás', description: 'A motor és motortér alapos tisztítása és karbantartása.', price: 12000},
      { name: 'Gyorsmosás', description: 'Gyors, mégis alapos mosás 30 perc alatt.', price: 4000 },
      { name: 'Viaszos bevonat', description: 'Tartós viaszos védelem a karosszériának.', price: 7000},
      { name: 'Felni tisztítás', description: 'Felnitisztítás és ápolás a maximális csillogásért.', price: 5000 },
      { name: 'Teljes belső és külső tisztítás', description: 'A teljes autó kívül-belül tisztítva.', price: 20000 },
      { name: 'Szélvédő polírozás', description: 'Szélvédő polírozás és karcmentesítés.', price: 6000 },
      { name: 'Matrica eltávolítás', description: 'Régi matricák szakszerű eltávolítása a karosszériáról.', price: 8000 }
    ]

    $scope.pricefilterFn = function(item) {
      if (!$scope.priceFilter) return true;
      if ($scope.priceFilter === "low") return item.price <=10000;
      if ($scope.priceFilter ==="medium") return item.price <=10000 && item.price <=20000;
      if ($scope.priceFilter =="high") return item.price <=20000;
      return false;}
    
  }]);

})(window, angular);