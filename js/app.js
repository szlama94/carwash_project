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
          controller: 'page2Controller',
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
        })
        .state('users', {
          url: '/users',
          parent: 'root',
          templateUrl: './html/users.html',
          controller: "usersController"
        });

      $urlRouterProvider.otherwise('/');
    }
  ])

    // Application run
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

    //----------Login-controller----------------------------->
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
    
    //----------Register-controller-------------------------->
    .controller('registerController', [
      '$scope',
      '$http',
      '$state',
    
      function ($scope, $http) {
        // Regisztrációs felület háttere
        $scope.registration_bg = './media/image/login_img/login_angeleye.jpg';
    
        // Toggle Show Password metódus
        $scope.toggleShowPassword = function () {
          $scope.model.register.showPassword = !$scope.model.register.showPassword;
        };
    
        // Model inicializálása
        $scope.model = {
          register: {
            showPassword: false,
            password: '',
            passwordConfirm: '',
            countryCode: '+36',
            phone: ''
          }
        };
    
        // Regisztráció metódus
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
                if (response.data && response.data.success) {
                  alert(response.data.message);
                } else {
                  alert("Hiba: " + (response.data.message || "Ismeretlen hiba történt!"));
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
    
    //----------Profile-controller--------------------------->
    .controller('profileController', [
      '$rootScope', 
      '$state', 
      '$scope', 
      '$http',

      function ($rootScope, $state, $scope, $http) {
      // Ellenőrizzük, hogy a felhasználó be van-e jelentkezve
      if (!$rootScope.user || !$rootScope.user.id) {
          $state.go('login'); // Ha nincs bejelentkezve, átirányítás a bejelentkezési oldalra
          return;
      }
  
      // Alapértelmezett user objektum inicializálása (üres értékekkel)
      $scope.user = {
          id: '',
          email: '',
          first_name: '',
          last_name: '',
          born: '',
          gender: '',
          country: '',
          country_code:'',
          phone: '',
          city: '',
          postcode: '',
          address: ''
      };
  
      // Adatok betöltése a profile.php-ről
      $http.post('./php/profile.php', { id: $rootScope.user.id })
        .then(response => {
            if (response.data.success) {

                // Töltsük fel a $scope.user objektumot a lekért adatokkal
                $scope.user = {
                    id: response.data.data.id || '',
                    type: response.data.data.type || '',
                    first_name: response.data.data.first_name || '',
                    last_name: response.data.data.last_name || '',
                    born: response.data.data.born || '',
                    gender: response.data.data.gender || '',
                    img: response.data.data.img || '',
                    img_type: response.data.data.img_type || '',
                    email: response.data.data.email || '',
                    country: response.data.data.country || '',
                    country_code: response.data.data.country_code || '',
                    phone: response.data.data.phone || '',
                    city: response.data.data.city || '',
                    postcode: response.data.data.postcode || '',
                    address: response.data.data.address || ''
                };
            } else {
                console.error("Hiba történt az adatok lekérésekor:", response.data.message);
                alert("Hiba történt az adatok betöltésekor.");
            }
        })
        .catch(error => {
            console.error("Hiba történt a profile.php hívása során:", error);
            alert("Nem sikerült betölteni az adatokat!");
        });


  
        $scope.isModified = false;

        // Figyeljük a felhasználói adatok változását
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
                // Kötelező mezők ellenőrzése eltávolítva

                // Ha nincs módosítás, ne küldjük el a kérést
                if (!$scope.isModified) {
                    alert("Nincs módosított adat, nincs mit menteni.");
                    return;
                }

                // Másolat az adatok küldéséhez
                let requestData = angular.copy($scope.user);

                // HTTP kérés küldése a szervernek
                $http.post('./php/update_user.php', requestData)
                    .then(response => {
                        if (response.data.success) {
                            alert(response.data.message); // "Sikeres frissítés!"
                            $scope.isModified = false; // Mentés után visszaállítjuk
                        } else {
                            alert("Hiba: " + response.data.message);
                        }
                    })
                    .catch(error => {
                        console.error("Hiba történt a frissítés során:", error);
                        alert("Nem sikerült frissíteni az adatokat!");
                    });
            }
        };
    

      // Inicializálás
      $scope.selectedSection = 'schedule'; // Alapértelmezett szekció
      $scope.selectedDate = null; // Kiválasztott dátum
      $scope.selectedTime = null; // Kiválasztott időpont
      $scope.timeSlots = []; // Elérhető időpontok
      $scope.selectedPackage = null; // Kiválasztott csomag
      $scope.myBookings = []; // Felhasználó foglalásai
    
      // Ideiglenes adatok: Foglalt időpontok dátum szerint
      $scope.bookedSlotsByDate = {
        '2025-01-21': ['09:00', '12:00', '14:00'],
        '2025-01-22': ['10:00', '13:00', '15:00'],
      };
    
      // Ideiglenes adatok: Csomagok
      $scope.packages = [
        { id: 1, name: 'Alap csomag', price: 5000 },
        { id: 2, name: 'Prémium csomag', price: 10000 },
        { id: 3, name: 'Deluxe csomag', price: 15000 },
      ];
    
      // Időpontok generálása a kiválasztott dátum alapján
      $scope.generateTimeSlots = function () {
        if (!$scope.selectedDate) {
          console.warn('Nincs dátum kiválasztva!');
          $scope.timeSlots = [];
          return;
        }
    
        // Konvertálás helyi időzónához
        const localDate = new Date($scope.selectedDate);
        const adjustedDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
        const formattedDate = adjustedDate.toISOString().split('T')[0]; // YYYY-MM-DD formátum
    
        console.log('Kiválasztott dátum helyi idő szerint:', formattedDate);
    
        // Időpontok és foglalt időpontok kezelése
        const allSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
        $scope.timeSlots = allSlots; // Az összes időpont
        $scope.bookedSlots = $scope.bookedSlotsByDate[formattedDate] || []; // Foglalt időpontok az adott dátumhoz
    
        console.log('Foglalások a dátumhoz:', $scope.bookedSlots);
      };
    
      // Időpont kiválasztása
      $scope.selectTimeSlot = function (time) {
        if ($scope.bookedSlots.includes(time)) {
          console.warn('Ez az időpont foglalt:', time);
          return;
        }
        $scope.selectedTime = time;
        console.log('Kiválasztott időpont:', $scope.selectedTime);
      };
    
      // Foglalás megerősítése
      $scope.confirmAppointment = function () {
        if (!$scope.selectedDate || !$scope.selectedTime || !$scope.selectedPackage) {
          alert('Kérjük, válassz ki egy dátumot, egy időpontot és egy csomagot!');
          return;
        }
    
        const selectedPackage = $scope.packages.find(p => p.id == $scope.selectedPackage);
    
        alert(`Foglalás sikeresen rögzítve:
          Dátum: ${$scope.selectedDate}
          Időpont: ${$scope.selectedTime}
          Csomag: ${selectedPackage.name}`);
    
        // Foglalások betöltése
        $scope.loadBookings();
      };
    
      // Foglalások betöltése
      $scope.loadBookings = function () {
        // Ideiglenes adatok: Foglalások betöltése
        $scope.myBookings = [
          { id: 1, date: '2025-01-21', time: '09:00', package: 'Alap csomag' },
          { id: 2, date: '2025-01-22', time: '13:00', package: 'Prémium csomag' }
        ];
      };
    
      // Foglalások betöltése az oldal betöltésekor
      $scope.loadBookings();
    }])    
    
    //----------Users-controller----------------------------->
    .controller('usersController', [
      '$rootScope',
      '$state',
      '$scope',
      'user',
      'http',

      function ($rootScope, $state, $scope, user, http) {

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

    //----------Footer-controller---------------------------->
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

    //---------Home-controller-------------------------------->
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

    .controller('page1Controller', [
      '$rootScope',
      '$scope',
      '$http',
      '$state',
      function ($rootScope, $scope, $http, $state) {
    
        $scope.videoUrl = "./media/video/services_video.mp4";
        $scope.services = [];
        $scope.searchText = '';
        $scope.priceFilter = '';
        $scope.groupedServices = [];
        $scope.selectedServices = [];  // Kosárba rakott elemek listája
    
        $scope.priceCategories = [
          { label: 'Összes árkategória', value: '' },
          { label: '0 Ft - 20 000 Ft', value: [0, 20000] },
          { label: '20 000 Ft - 40 000 Ft', value: [20001, 40000] },
          { label: '40 000 Ft felett', value: [40001, Infinity] }
        ];
    
        $http.get("./php/services.php")
          .then(response => {
            if (response.data && response.data.data) {
              $scope.services = response.data.data.map(service => {
                if (!service.image || service.image === '') {
                  service.image = "./media/image/services/" + service.services_name.toLowerCase().replace(/\s+/g, "_") + ".jpg";
                }
                return service;
              });
              $scope.updateGroupedServices();
            } else {
              console.error("Nem érkezett adat az API-ból.");
              alert("Nem sikerült betölteni a szolgáltatásokat.");
            }
          })
          .catch(e => {
            console.error("Adatbetöltési hiba:", e);
            alert("Hiba történt az adatok betöltése közben.");
          });
    
        $scope.$watchGroup(['searchText', 'priceFilter'], function () {
          $scope.updateGroupedServices();
        });
    
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
    
        $scope.updateGroupedServices = function () {
          const filteredServices = $scope.services.filter($scope.filterServices);
    
          $scope.groupedServices = [];
          for (let i = 0; i < filteredServices.length; i += 3) {
            $scope.groupedServices.push(filteredServices.slice(i, i + 3));
          }
          resetCarousel();
        };
    
        // Gomb kattintás: kosárba rakás vagy eltávolítás (bejelentkezés ellenőrzéssel)
        $scope.toggleSelection = function (service) {
          if (!$rootScope.user || !$rootScope.user.id) {
            $state.go('login');  // Ha nincs bejelentkezve, átirányítás a login oldalra
            return;
          }
    
          const index = $scope.selectedServices.findIndex(selected => selected.id === service.id);
          if (index === -1) {
            $scope.selectedServices.push(service);  // Hozzáadás
          } else {
            $scope.selectedServices.splice(index, 1);  // Eltávolítás
          }
        };
    
        // Ellenőrizzük, hogy egy szolgáltatás kiválasztott-e
        $scope.isSelected = function (service) {
          return $scope.selectedServices.some(selected => selected.id === service.id);
        };
    
        function resetCarousel() {
          setTimeout(() => {
            const carousel = document.querySelector('#serviceCarousel');
            if (carousel) {
              const bootstrapCarousel = bootstrap.Carousel.getInstance(carousel);
              if (bootstrapCarousel) {
                bootstrapCarousel.to(0);
              }
            }
          }, 100);
        }
      }
    ])
    //-----------About_us-controller-------------------------->
    .controller('page2Controller', [
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
                  console.log("Szerver válasz:", response.data);
                  if (response.data.success || response.data.data) {
                      $scope.feedbacks = response.data.data;
                      //$scope.chunkedFeedbacks = $scope.chunkArray($scope.feedbacks, 3);
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
        if ($scope.feedbackForm.$valid) {
            $http.post('./php/submit_feedback.php', $scope.feedback)
                .then(response => {
                    if (response.data.success) {
                        alert("Köszönjük a véleményét!");

                        // Űrlap ürítése
                        $scope.feedback = {};

                        // Vélemények frissítése
                        $scope.loadFeedbacks();

                        
                    } else {
                        alert("Hiba: " + response.data.message);
                    }
                })
                .catch(error => {
                    console.error("Beküldési hiba:", error);
                    alert("Váratlan hiba történt!");
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