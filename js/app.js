; (function (window, angular) {

  'use strict';

  // Application module
  angular.module('app', [
    'ui.router',
    'app.common',
    'app.form',
  ])
  // Application config
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

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
              controller: 'footerController'
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
        .state('services', {
          url: '/services',
          parent: 'root',
          templateUrl: './html/services.html',
          controller: 'servicesController'
        })
        .state('about_us', {
          url: '/about_us',
          parent: 'root',
          templateUrl: './html/aboutUs.html',
          controller: 'aboutUsController',
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
          templateUrl: './html/register.html',
          controller: 'registerController'
        })
        .state('profile', {
          url: '/profile',
          parent: 'root',
          templateUrl: './html/profile.html',
          controller: "profileController"
        });

      $urlRouterProvider.otherwise('/');
    }
  ])
  //----------Application run----------------->
  .run([
      '$rootScope',
      '$timeout',
      'user',
      function ($rootScope, $timeout, user) {

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
  //----------Cart application---------------->
  // app.service('CartService', 
  //   function() {
  //   let cart = [];  // Lokális kosár

  //   // Kosárhoz hozzáadás
  //   this.addToCart = function(service) {
  //       if (!cart.some(item => item.id === service.id)) {
  //           cart.push(service);
  //       }
  //   };

  //   // Kosárból eltávolítás
  //   this.removeFromCart = function(serviceId) {
  //       cart = cart.filter(item => item.id !== serviceId);
  //   };

  //   // Kosár lekérése
  //   this.getCart = function() {
  //       return cart;
  //   };
  // })
  //---------Http request factory------------->
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
              const methods = {
                // Initialize
                init: () => {
                  // Check options url property
                  if (util.isString(options)) options = { url: options };
                  if (!util.isObject(options) ||
                    !util.isObjectHasKey(options, 'url') ||
                    !(options.url = options.url.trim()).length) {
                    reject('Missing url HTTP request!');
                    return;
                  }
    
                  // Check method property
                  if (!util.isString(method)) method = 'ajax';
                  method = method.trim().toLowerCase();
                  if (!['ajax', 'fetch', 'http', 'xml'].includes(method)) method = 'ajax';
                  if (method === 'ajax' && !util.isJQuery()) method = 'fetch';
    
                  // Check options method
                  if (util.isObjectHasKey(options, 'method')) {
                    if (!util.isString(options.method)) options.method = 'GET';
                    options.method = options.method.trim().toUpperCase();
                    if (!['GET', 'POST'].includes(options.method)) options.method = 'GET';
                  } else {
                    options.method = 'GET';
                  }
    
                  // Check/Set options data
                  if (util.isObjectHasKey(options, 'data')) {
                    if (!util.isUndefined(options.data)) {
                      if (method !== 'ajax') {
                        options.method = 'POST';
                        options.data = JSON.stringify(options.data);
                      } else {
                        options.data = { data: JSON.stringify(options.data) };
                      }
                    }
                  } else {
                    options.data = undefined;
                  }
    
                  // Call request
                  methods[method]();
                },
    
                // Ajax jQuery
                ajax: () => {
                  $.ajax({
                    url: options.url,
                    type: options.method,
                    data: options.data,
                    success: response => methods.check(response),
                    error: e => reject(e.statusText || 'AJAX request failed')
                  });
                },
    
                // Fetch
                fetch: () => {
                  // Separate url from options
                  const url = options.url;
                  delete options.url;
    
                  // Replace the data key with body
                  options.body = options.data;
                  delete options.data;
    
                  fetch(url, options)
                    .then(response => {
                      if (response.status >= 200 && response.status < 300) {
                        return response.text();
                      } else {
                        reject(response.statusText || 'Fetch request failed');
                      }
                    })
                    .then(response => {
                      if (!util.isUndefined(response)) {
                        methods.check(response);
                      }
                    })
                    .catch(e => reject(e.message || 'Fetch request error'));
                },
    
                // Http angular
                http: () => {
                  $http({
                    url: options.url,
                    method: options.method,
                    data: options.data
                  })
                    .then(response => {
                      if (response.status >= 200 && response.status < 300) {
                        methods.check(response.data);
                      } else {
                        reject(response.statusText || 'HTTP request failed');
                      }
                    })
                    .catch(e => reject(e.statusText || 'HTTP request error'));
                },
    
                // XML Http
                xml: () => {
                  const xhr = new XMLHttpRequest();
                  xhr.open(options.method, options.url, true);
                  xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                      methods.check(xhr.response);
                    } else {
                      reject(xhr.statusText || 'XMLHttpRequest failed');
                    }
                  };
                  xhr.onerror = () => reject(xhr.statusText || 'XMLHttpRequest error');
                  xhr.responseType = "text";
                  xhr.send(options.data);
                },
    
                // Check response
                check: response => {
                  if (util.isUndefined(response)) return;
                  try {
                    if (util.isJson(response)) response = JSON.parse(response);
                    if (util.isObjectHasKey(response, "error") && !util.isNull(response.error)) {
                      reject(response.error);
                    } else if (util.isObjectHasKey(response, "data")) {
                      if (util.isJson(response.data)) {
                        resolve(JSON.parse(response.data));
                      } else {
                        resolve(response.data);
                      }
                    } else {
                      resolve(response);
                    }
                  } catch (e) {
                    reject('Invalid JSON response');
                  }
                }
              };
    
              // Initialize
              methods.init();
            });
          }
        };
      }
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
  ])
  //----------Login-controller---------------->
  .controller('loginController', [
      '$rootScope',
      '$scope',
      '$state',
      'user',
      'util',
      'http',

      function ($rootScope, $scope, $state, user, util, http) {
    
        // Set local methods
        let methods = {
    
          // Initialize
          init: () => {
            // Set email address from local storage if exists
            $scope.model = { email: util.localStorage('get', 'email') };
    
            // Set the background image URL
            $scope.login_bg = './media/image/login_img/login_angeleye.jpg';
    
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
            http.request({
              url: "./php/login.php",
              data: util.objFilterByKeys($scope.model, 'showPassword', false)
            })
            .then(response => {
              response.email = $scope.model.email;
              user.set(response);  // Beállítja a felhasználó adatait, beleértve az id-t is
              util.localStorage('set', 'email', response.email);
              $state.go('home');
            })
            .catch(e => {
              $scope.model.password = null;
              user.error(e);
            });
          },
    
          // Regisztrációra átirányítás
          redirectToRegister: () => {
            $state.go('register'); // Átirányítás a regisztrációs oldalra
          }
        };
    
        // Initialize
        methods.init();
      }
  ])
  //----------Register-controller------------->
  .controller('registerController', [
      '$scope',
      '$http',
      '$state',
  
      function ($scope, $http) {
          $scope.registration_bg = './media/image/login_img/login_angeleye.jpg';
  
          $scope.toggleShowPassword = function () {
              $scope.model.register.showPassword = !$scope.model.register.showPassword;
          };
  
          $scope.model = {
              register: {
                  showPassword: false,
                  password: '',
                  passwordConfirm: '',
                  countryCode: '',
                  phone: ''
              }
          };
  
          $scope.methods = {
              registerUser: function () {
                  let requestData = {
                      first_name: $scope.model.register.first_name,
                      last_name: $scope.model.register.last_name,
                      born: $scope.model.register.born,
                      country_code: $scope.model.register.countryCode,
                      phone: $scope.model.register.phone,
                      gender: $scope.model.register.gender,
                      email: $scope.model.register.email,
                      emailConfirm: $scope.model.register.emailConfirm,
                      password: $scope.model.register.password,
                      passwordConfirm: $scope.model.register.passwordConfirm
                  };
  
                  $http.post('./php/register.php', requestData)
                      .then(response => {
                          if (response.data && response.data.data) {
                              alert(response.data.data);  // Sikeres regisztráció esetén
                          } else if (response.data && response.data.error) {
                              alert("Hiba: " + response.data.error);  // Hibás regisztráció
                          } else {
                              alert("Ismeretlen hiba történt!");
                          }
                      })
                      .catch(error => {
                          console.error("Hiba történt:", error);
                          alert("Hiba történt a mentés során!");
                      });
              }
          };
      }
  ])
  //----------Profile-controller-------------->
  .controller('profileController', [
      '$rootScope', 
      '$state', 
      '$scope', 
      '$http',
  
      function ($rootScope, $state, $scope, $http) {
          if (!$rootScope.user || !$rootScope.user.id) {
              alert("Nem vagy bejelentkezve. Jelentkezz be újra!");
              $state.go('login');
              return;
          }
  
          $scope.user = {
              id: '',
              email: '',
              first_name: '',
              last_name: '',
              born: '',
              gender: '',
              country: '',
              country_code: '',
              phone: '',
              city: '',
              postcode: '',
              address: ''
          };
  
          // Felhasználói adatok betöltése
          $http.post('./php/profile.php', { id: $rootScope.user.id })
              .then(response => {
                  if (response.data && response.data.data) {
                      $scope.user = response.data.data;
                  } else {
                      alert(response.data.error || "Ismeretlen hiba történt az adatok betöltésekor.");
                  }
              })
              .catch(error => {
                  alert("Nem sikerült betölteni az adatokat!");
                  console.error("Hiba történt:", error);
              });
  
          $scope.isModified = false;
  
          $scope.$watchGroup([
              'user.first_name',
              'user.last_name',
              'user.born',
              'user.gender',
              'user.country',
              'user.countryCode',
              'user.phone',
              'user.city',
              'user.postcode',
              'user.address'
          ], function (newValues, oldValues) {
              $scope.isModified = !angular.equals(newValues, oldValues);
          });
  
          $scope.methods = {
              httpRequest: function () {
                  if (!$scope.isModified) {
                      alert("Nincs módosított adat, nincs mit menteni.");
                      return;
                  }
  
                  let requestData = angular.copy($scope.user);
  
                  $http.post('./php/update_user.php', requestData)
                      .then(response => {
                          if (response.data.data) {
                              alert(response.data.data);  // "Sikeres frissítés!"
                              $scope.isModified = false;
                          } else {
                              alert("Hiba: " + response.data.error);
                          }
                      })
                      .catch(error => {
                          alert("Nem sikerült frissíteni az adatokat!");
                          console.error("Hiba történt a frissítés során:", error);
                      });
              }
          };
  
          // Foglalás adatok és időpontok
          $scope.booking = {
              services: '',
              car_plate: '',
              date: '',
              time: ''
          };
  
          $scope.timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
          
          $scope.selectedServices = [];
  
          // Kosár tartalmának betöltése szerveroldalról
          $scope.loadCart = function () {
            $http.post('./php/cart_handler.php', { action: 'get' }).then(response => {
                if (response.data && Array.isArray(response.data.data)) {
                    $scope.selectedServices = response.data.data;
                    console.log($scope.selectedServices)
                } else {
                    $scope.selectedServices = [];  // Üres tömb, ha nincs adat vagy nem megfelelő
                }
            }).catch(error => {
                console.error("Hiba a kosár betöltésekor:", error);
                $scope.selectedServices = [];  // Biztonsági mentés üres tömbbel
            });
          };
        
  
          // Lefoglalt időpontok betöltése adott dátumra
          $scope.loadBookedTimes = function () {
              if (!$scope.booking.date) return;
  
              $http.post('./php/load_booked_times.php', { date: $scope.booking.date })
                  .then(response => {
                      if (response.data.data) {
                          $scope.bookedTimes = response.data.data.map(booking => booking.booking_time);
                      } else {
                          $scope.bookedTimes = [];
                      }
                  });
          };
  
          // Ellenőrizzük, hogy az adott időpont foglalt-e
          $scope.isBooked = function (time) {
              return $scope.bookedTimes && $scope.bookedTimes.includes(time);
          };
  
          // Időpont kiválasztása
          $scope.selectTime = function (time) {
              $scope.booking.time = time;
          };
  
          // Foglalás mentése
          $scope.submitBooking = function () {
              if ($scope.selectedServices.length === 0) {
                  alert("Nincs kiválasztott csomag a foglaláshoz.");
                  return;
              }
  
              const bookingData = {
                  user_id: $rootScope.user.id,
                  car_plate: $scope.booking.car_plate,
                  booking_date: $scope.booking.date,
                  booking_time: $scope.booking.time,
                  selectedServices: $scope.selectedServices
              };
  
              $http.post('./php/submit_booking.php', bookingData)
                  .then(response => {
                      if (response.data.data) {
                          alert("Foglalás sikeresen mentve!");
                          $scope.selectedServices = [];  // Kosár ürítése
                          $scope.loadCart();  // Frissítjük a kosár tartalmát
                      } else {
                          alert("Hiba: " + response.data.error);
                      }
                  })
                  .catch(error => {
                      alert("Nem sikerült a foglalás mentése.");
                      console.error("Hiba történt a foglalás mentése során:", error);
                  });
          };
  
          // Az oldal betöltésekor a kosár tartalmát betöltjük
          $scope.loadCart();
      }
  ])    
  //----------Footer-controller--------------->
  .controller('footerController', [
      '$scope', 
      '$sce',

      function ($scope, $sce) {
      $scope.about = {
        title: 'Keress minket',
        description: 'Autómosónkban a legjobb minőségű szolgáltatásokkal várjuk ügyfeleinket.',
        icons: [
                {class:'bi-facebook', url: 'https://www.facebook.com'},
                {class:'bi-instagram', url: 'https://www.instagram.com'},
                {class:'bi-tiktok', url: 'https://www.tiktok.com'}
                
              ]
      };

      $scope.links = [
        { icon: 'fa-solid fa-house', label: 'Kezdőlap', state: 'home' },
        { icon: 'bi bi-car-front', label: 'Szolgáltatások', state: 'page1' },
        { icon: 'bi bi-info-circle-fill', label: 'Rólunk', state: 'page2' }
      ];

      $scope.contact = {
        title: 'Kapcsolat',
        address: 'Makó, Habfürdő utca 6.',
        phone: '+36 30 610 0666',
        email: 'info@supercarwash.hu'
      }

      $scope.mapUrl = $sce.trustAsResourceUrl('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2760.836396232944!2d20.473138775978818!3d46.21370948311983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4744f602b445c0b9%3A0x6ecc2b88ac500ef!2sHSZC%20Mak%C3%B3i%20N%C3%A1vay%20Lajos%20Technikum%20%C3%A9s%20Koll%C3%A9gium!5e0!3m2!1shu!2shu!4v1734100844394!5m2!1shu!2shu');

  }])
  //---------Home-controller------------------>
  .controller('homeController', [
      '$scope', 
      '$state', 
      '$rootScope',

      function ($scope, $state, $rootScope) {

      $scope.videoUrl = "./media/video/spwc_video.mp4";
    
      // Felsorolás adatok
      $scope.cards = [
        {
          title: 'Professzionális',
          text: 'Szakképzett kollégáink több éves autókozmetikai tapasztalattal foglalkoznak autójával.',
          icon: 'fa-solid fa-user-tie text-primary'
        },
        {
          title: 'Környezetbarát',
          text: 'Minden tisztítószerünk környezetbarát, így a lehető legkisebb terheléssel varázsoljuk tisztává autóját.',
          icon: 'fa-solid fa-leaf text-success'
        },
        {
          title: 'Megfizethető',
          text: 'Tegyen minket próbára, kérjen ajánlatot! Minden szolgáltatásunkat versenyképes árazással tudja igénybevenni.',
          icon: 'fa-solid fa-wallet text-warning'
        }
      ];
    
      // Átirányítás függvény
      $scope.redirectToAppointment = function () {
        if ($rootScope.user && $rootScope.user.id) {
          // Ha be van jelentkezve, navigálj az időpontfoglalásra
          $state.go('profile', { section: 'schedule' });
        } else {
          // Ha nincs bejelentkezve, navigálj a bejelentkezési oldalra
          $state.go('login');
        }
      };
    
      $scope.cardStyle = {
        'background-image': 'url(./media/image/)',
        'background-size': 'cover',
        'background-position': 'center',
        'background-repeat': 'no-repeat'
      };
    
      // A VIP kép a home-page -en
      $scope.homepg_vip_pic = './media/image/vip_pic.png';
  }])
  //--------Services controller--------------->
  .controller('servicesController', [
      '$rootScope',
      '$scope',
      '$http',
      '$state',
      function ($rootScope, $scope, $http, $state) {
  
          $scope.videoUrl = "./media/video/services_video.mp4";
          $scope.services = [];
          $scope.selectedServices = [];
          $scope.searchText = '';
          $scope.priceFilter = '';
          $scope.groupedServices = [];
  
          // Ár kategóriák definiálása
          $scope.priceCategories = [
              { label: 'Összes árkategória', value: '' },
              { label: '0 Ft - 20 000 Ft', value: [0, 20000] },
              { label: '20 000 Ft - 40 000 Ft', value: [20001, 40000] },
              { label: '40 000 Ft felett', value: [40001, Infinity] }
          ];
  
          // Szolgáltatások betöltése
          $http.get("./php/services.php").then(response => {
              if (response.data && response.data.data) {
                  $scope.services = response.data.data.map(service => {
                      if (!service.image || service.image === '') {
                          service.image = "./media/image/services/" + service.services_name.toLowerCase().replace(/\s+/g, "_") + ".jpg";
                      }
                      return service;
                  });
                  $scope.updateGroupedServices();
              } else {
                  alert("Nem sikerült betölteni a szolgáltatásokat.");
              }
          });
  
          // Kosár tartalmának betöltése
          $scope.loadCart = function () {
              $http.post('./php/cart_handler.php', { action: 'get' }).then(response => {
                  if (response.data && response.data.data) {
                      $scope.selectedServices = response.data.data;
                  }
              });
          };
  
          // Csomag hozzáadása a kosárhoz
          $scope.addToCart = function (service) {
            $http({
                method: 'POST',
                url: './php/cart_handler.php',
                data: {
                    action: 'add',
                    package: service
                },
                headers: { 'Content-Type': 'application/json' }
            }).then(response => {
                console.log("Response from server:", response.data);
                if (response.data.success) {
                    $scope.loadCart();  // Frissítjük a kosár tartalmát
                    alert(response.data.data.message);  // Sikeres üzenet
                } else {
                    alert(response.data.error || "Nem sikerült a csomag hozzáadása.");
                }
            }).catch(error => {
                console.error("Hiba történt az API hívás során:", error);
                alert("Nem sikerült a csomag hozzáadása a kiszolgálóval való kapcsolat miatt.");
            });
          };
        
  
          // Csomag eltávolítása a kosárból
          $scope.removeFromCart = function (service) {
              $http({
                  method: 'POST',
                  url: './php/cart_handler.php',
                  data: {
                      action: 'remove',
                      package_id: service.id
                  },
                  headers: { 'Content-Type': 'application/json' }
              }).then(response => {
                  if (response.data.success) {
                      $scope.loadCart();  // Frissítjük a kosár tartalmát
                  } else {
                      alert(response.data.error || "Nem sikerült a csomag eltávolítása.");
                  }
              });
          };
  
          // Ellenőrizzük, hogy egy szolgáltatás ki van-e választva
          $scope.isSelected = function (service) {
              return Array.isArray($scope.selectedServices) && 
                     $scope.selectedServices.some(selected => selected.id === service.id);
          };
  
          // Gomb állapotának kezelése: ha nincs bejelentkezve, irány a login
          $scope.toggleSelection = function (service) {
              if (!$rootScope.user || !$rootScope.user.id) {
                  $state.go('login');  // Ha nincs bejelentkezve, átirányítunk a login oldalra
                  return;
              }
  
              // Ha még nincs benne a kosárban, hozzáadjuk, különben eltávolítjuk
              if (!$scope.isSelected(service)) {
                  $scope.addToCart(service);
              } else {
                  $scope.removeFromCart(service);
              }
          };
  
          // Szolgáltatások szűrése és csoportosítása
          $scope.updateGroupedServices = function () {
              const filteredServices = $scope.services.filter($scope.filterServices);
  
              $scope.groupedServices = [];
              for (let i = 0; i < filteredServices.length; i += 3) {
                  $scope.groupedServices.push(filteredServices.slice(i, i + 3));
              }
          };
  
          // Szűrés név és ár alapján
          $scope.filterServices = function (service) {
              if ($scope.searchText && !service.services_name.toLowerCase().includes($scope.searchText.toLowerCase())) {
                  return false;
              }
              if ($scope.priceFilter && $scope.priceFilter.length) {
                  let [min, max] = $scope.priceFilter;
                  if (service.price < min || service.price > max) {
                      return false;
                  }
              }
              return true;
          };
  
          // Kosár tartalmának betöltése az oldal betöltésekor
          $scope.loadCart();
      }
  ])  
  //--------About_us-controller--------------->
  .controller('aboutUsController', [
      '$scope', 
      '$http', 

      function ($scope, $http) {

      //oldal képei
      $scope.ourTeam_img = './media/image/spwash_crew.jpg';
      $scope.satisfied_img='./media/image/satisfied_man.jpg';

      $scope.feedbacks = [];
  
      // Vélemények betöltése
      $scope.loadFeedbacks = function () {
          $http.get('./php/load_feedback.php')
              .then(response => {
                  if (response.data.success || response.data.data) {
                      $scope.feedbacks = response.data.data;
                  } else {
                      console.error("Hiba:", response.data.message);
                  }
              })
              .catch(e => console.error("Adatbetöltési hiba:", e));
      };

      // 3-as csoportokra bontó függvény
      $scope.chunkArray = function (array, size) {
          let results = [];
          for (let i = 0; i < array.length; i += size) {
              results.push(array.slice(i, i + size));
          }
          return results;
      };
  
      // Csillagok generálása értékelés alapján
      $scope.getStars = function (rating) {
        return Array.from({ length: rating }, (_, i) => i + 1);
    };
  
      // Vélemények betöltése az oldal betöltésekor
      $scope.loadFeedbacks();


      // Vélemény beküldése
      $scope.submitFeedback = function () {
        // Ellenőrizzük, hogy az űrlap validált-e
        if ($scope.feedbackForm.$valid) {
            
            // Feedback adatok összegyűjtése
            let feedbackData = {
                name: $scope.feedback.name,  // Név
                gender: $scope.feedback.gender,  // Nem
                age: $scope.feedback.age,  // Kor
                rating: $scope.feedback.rating,  // Értékelés
                comment: $scope.feedback.comment  // Vélemény szövege
            };
    
            // POST kérés küldése
            $http.post('./php/submit_feedback.php', feedbackData)
                .then(response => {
                    if (response.data && response.data.data) {
                        alert(response.data.data);  // Sikeres mentés
                        // Mezők alaphelyzetbe állítása
                        $scope.feedback.name = '';
                        $scope.feedback.gender = '';
                        $scope.feedback.age = '';
                        $scope.feedback.rating = 0;
                        $scope.feedback.comment = '';
                        $scope.loadFeedbacks();  // Új vélemények betöltése
                    } else if (response.data && response.data.error) {
                        alert("Hiba: " + response.data.error);  // Hibás mentés
                    } else {
                        alert("Ismeretlen hiba történt!");
                    }
                })
                .catch(error => {
                    console.error("Hiba történt:", error);
                    alert("Hiba történt a mentés során!");
                });
    
        } else {
            alert("Kérjük, töltsön ki minden mezőt!");
        }
      };
    
      $scope.feedback = {
        rating: 0
      };
    
      $scope.hoverRating = 0;
      
      // Hover esemény - ha az egér a csillagon van
      $scope.setHover = function(star) {
          $scope.hoverRating = star;
      };
      
      // Hover elhagyása - visszaáll az érték
      $scope.clearHover = function() {
          $scope.hoverRating = 0;
      };
      
      // Kattintás - értékelés rögzítése
      $scope.setRating = function(star) {
          $scope.feedback.rating = star;
      };
  }]);
})(window, angular);