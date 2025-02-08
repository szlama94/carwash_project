;(function (window, angular) {

  'use strict';

  // Application module
  angular.module('app', [
    'ui.router',
    'app.common',
    'app.form',
    'app.user'
  ])

  //---------Application config--------------->
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

      $stateProvider
        .state('root', {
          views: {
            '': {
              templateUrl: './html/root.html',
              controller: 'languageController'
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
        })
        .state('booking', {
          url: '/booking',
          parent: 'root',
          templateUrl: './html/booking_maker.html',
          controller: "bookingController"
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
  
  //----------Language controller------------->
  .controller('languageController', [
    '$scope', '$rootScope',
    function($scope, $rootScope) {
  
      // Set local methods
      let methods = {
  
        // Initialize
        init: () => {
  
          // Get available languages
          fetch('./lang/available.json')
            .then(response => response.json())
            .then(response => {
  
              // Set language in rootScope
              $rootScope.lang = {
                available: response
              };
  
              // Get last language identifier from localStorage or default to 'hu'
              let langID = localStorage.getItem('languageID') || 'hu';
  
              // Set HTML lang attribute
              document.documentElement.lang = langID;
  
              // Set selected language identifier in rootScope
              $rootScope.lang.id = langID;
  
              // Get actual language index
              $rootScope.lang.index = methods.indexByKeyValue(
                $rootScope.lang.available, 'id', $rootScope.lang.id
              );
  
              // Get the selected language's data
              methods.getLanguage().then(() => {
                // Change the HTML title to the loaded language's title
                document.title = methods.capitalizeSentences($rootScope.lang.data.page_title);
  
                // Broadcast the event that the language has loaded
                $rootScope.$broadcast('languageLoaded');
              });
            })
            .catch(error => console.log(error));
        },
  
        // Get language and store in $rootScope
        getLanguage: () => {
          return fetch(`./lang/${$rootScope.lang.id}.json`)
            .then(response => response.json())
            .then(response => {
  
              // Capitalize sentences in all string fields
              for (let key in response) {
                if (typeof response[key] === 'string') {
                  response[key] = methods.capitalizeSentences(response[key]);
                }
              }
  
              // Store all language data globally in $rootScope
              $rootScope.lang.data = response;
  
              // Optionally set specific sections globally (e.g., home_cards)
              $rootScope.home_cards = $rootScope.lang.data.home_cards;
  
              $scope.$applyAsync();
            })
            .catch(error => console.log(error));
        },
  
        // Index array of object key value
        indexByKeyValue: (a, k, v) => a.findIndex(o => o[k] === v),
  
        // Capitalize first letter of string
        capitalize: (s) => s[0].toUpperCase() + s.slice(1),
  
        // Capitalize the first letter after sentence-ending punctuation
        capitalizeSentences: (text) => {
          return text.replace(/(?:^|[.!?]\s+)([a-z])/g, (match, firstLetter) => {
            return match.replace(firstLetter, firstLetter.toUpperCase());
          });
        }
      };
  
      // Set scope methods
      $scope.methods = {
  
        // Language change handler
        languageChanged: (langID) => {
  
          // Set selected language identifier
          $rootScope.lang.id = langID;
  
          // Save selected language identifier to local storage
          localStorage.setItem('languageID', langID);
  
          // Change HTML lang attribute value
          document.documentElement.lang = langID;
  
          // Get selected language index
          $rootScope.lang.index = methods.indexByKeyValue(
            $rootScope.lang.available, 'id', $rootScope.lang.id
          );
  
          // Get the newly selected language and update content
          methods.getLanguage().then(() => {
            // Update HTML title
            document.title = methods.capitalizeSentences($rootScope.lang.data.page_title);
  
            // Broadcast the event that the language has been updated
            $rootScope.$broadcast('languageLoaded');
          });
        }
      };
  
      // Initialize the language controller
      methods.init();
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
    '$timeout', // Hozzáadva a $timeout szolgáltatás
    'appointmentFactory',

    function ($rootScope, $state, $scope, $http, $timeout, appointmentFactory) {
        // Ellenőrizzük, hogy a felhasználó be van-e jelentkezve
        if (!$rootScope.user || !$rootScope.user.id) {
            alert("Nem vagy bejelentkezve. Jelentkezz be újra!");
            $state.go('login');
            return;
        }

        // Felhasználói adatok inicializálása
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

        // User adatainak figyelése
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

        // Mentés metódus
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
    }
  ])

  //----------Footer-controller--------------->
  .controller('footerController', [
    '$scope', 
    '$rootScope',
    '$sce',    
    function ($scope, $rootScope,$sce) {
  
      // Footer szekciók statikus adatai
      $scope.footerSections = [
        {
          section: "find_us",
          icons: [
            { class: "fa-brands fa-facebook-f", url: "https://www.facebook.com" },
            { class: "fa-brands fa-instagram", url: "https://www.instagram.com" },
            { class: "fa-brands fa-tiktok", url: "https://www.tiktok.com" }
          ]
        },
        {
          section: "links",
          items: [
            { icon: "fa-solid fa-house", label: "home", state: "home" },
            { icon: "fa-solid fa-car", label: "services", state: "services" },
            { icon: "fa-solid fa-circle-info", label: "about_us", state: "about_us" }
          ]
        },
        {
          section: "contact",
          details: {
            address: "Makó, Habfürdő utca 6.",
            phone: "+36 30 610 0666",
            email: "info@supercarwash.hu"
          }
        },
        {
          section: "opening_hours",
          hours: [
            { day: "monday_to_friday", time: "8:00 - 19:00" },
            { day: "saturday_label", time: "8:00 - 12:00" }
          ]
        }
      ];
  
      // Térkép URL beágyazása
      $scope.mapUrl = $sce.trustAsResourceUrl('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2760.836396232944!2d20.473138775978818!3d46.21370948311983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4744f602b445c0b9%3A0x6ecc2b88ac500ef!2sHSZC%20Mak%C3%B3i%20N%C3%A1vay%20Lajos%20Technikum%20%C3%A9s%20Koll%C3%A9gium!5e0!3m2!1shu!2shu!4v1734100844394!5m2!1shu!2shu');

  
      //Nyelv betöltése
      $rootScope.$on('languageLoaded', function() {
        $scope.lang = $rootScope.lang.data;  // Aktuális nyelvi adatok
      });
    }
  ])  
  
  //---------Home-controller------------------>
  .controller('homeController', [
    '$scope', 
    '$state', 
    '$rootScope',
    '$timeout',
  
    function ($scope, $state, $rootScope, $timeout) {
  
      $scope.videoUrl = "./media/video/spwc_video.mp4";
  
      // Kártyákhoz tartozó ikonok
      $scope.cardIcons = [
        'fa-solid fa-user-tie text-primary',   // Card 1
        'fa-solid fa-leaf text-success',       // Card 2
        'fa-solid fa-wallet text-warning'      // Card 3
      ];
  
      // Kártyák adatainak betöltése
      function loadCards() {
        if ($rootScope.lang && $rootScope.lang.data) {
          $scope.cards = [
            {
              title: $rootScope.lang.data.card1_title,
              text: $rootScope.lang.data.card1_text,
              icon: $scope.cardIcons[0]
            },
            {
              title: $rootScope.lang.data.card2_title,
              text: $rootScope.lang.data.card2_text,
              icon: $scope.cardIcons[1]
            },
            {
              title: $rootScope.lang.data.card3_title,
              text: $rootScope.lang.data.card3_text,
              icon: $scope.cardIcons[2]
            }
          ];
        }
      }
  
      // Ha az alkalmazás indulásakor már betöltődött a nyelv, azonnal töltse be a kártyákat
      if ($rootScope.lang && $rootScope.lang.data) {
        loadCards();
      }
  
      // nyelv betöltésére
      $rootScope.$on('languageLoaded', function() {
        loadCards();  // Ha nyelvi adat érkezik, töltsük be újra a kártyákat
      });
  
      // Átirányítás függvény
      $scope.redirectToAppointment = function () {
        if ($rootScope.user && $rootScope.user.id) {
          $state.go('profile', { section: 'schedule' });
        } else {
          $state.go('login');
        }
      };
  
      $scope.cardStyle = {
        'background-image': 'url(./media/image/card_background.jpg)',
        'background-size': 'cover',
        'background-position': 'center',
        'background-repeat': 'no-repeat'
      };
  
      // A VIP kép a home-page-en
      $scope.homepg_vip_pic = './media/image/vip_pic.png';
    }
  ])
  
  //--------Services controller--------------->
  .controller('servicesController', [
    '$rootScope',
    '$scope',
    '$http',
    '$state',
    'appointmentFactory',

    function ($rootScope, $scope, $http, $state, appointmentFactory) {

        // Alapértelmezett változók
        $scope.videoUrl = "./media/video/services_video.mp4";
        $scope.services = [];
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

        // Szolgáltatások betöltése az API-ból
        $http.get("./php/services.php").then(function (response) {
            if (response.data && Array.isArray(response.data.data)) {
                $scope.services = response.data.data.map(function (service) {
                    service.image = service.image || "./media/image/services/" + service.services_name.toLowerCase().replace(/\s+/g, "_") + ".jpg";
                    service.isSelected = false; // Minden szolgáltatás alapból nincs kiválasztva
                    return service;
                });
                $scope.updateGroupedServices();  // Első frissítés betöltéskor
                // Ellenőrizzük, hogy mely csomagok szerepelnek már a foglalásban
                $scope.checkSelectedServices();
            } else {
                alert("Nem sikerült betölteni a szolgáltatásokat.");
            }
        }, function (error) {
            console.error("Hiba történt a szolgáltatások betöltésekor:", error);
            alert("Hiba történt a szolgáltatások betöltésekor.");
        });

        // Ellenőrizzük, hogy a szolgáltatás már szerepel-e a foglalásban
        $scope.checkSelectedServices = function () {
            const selectedServices = appointmentFactory.get();
            selectedServices.forEach(service => {
                const serviceInList = $scope.services.find(s => s.id === service.id);
                if (serviceInList) {
                    serviceInList.isSelected = true; // Ha már hozzá van adva, akkor kékké tesszük
                }
            });
        };

        // Szolgáltatások csoportosítása 3-as csoportokba
        $scope.updateGroupedServices = function () {
            let filteredServices = $scope.services.filter(service => {
                if ($scope.searchText && 
                    !service.services_name.toLowerCase()
                        .includes($scope.searchText.toLowerCase())) {
                    return false;
                }
                if ($scope.priceFilter && $scope.priceFilter.length) {
                    let [min, max] = $scope.priceFilter;
                    return service.price >= min && service.price <= max;
                }
                return true;
            });

            $scope.groupedServices = [];

            for (let i = 0; i < filteredServices.length; i += 3) {
                $scope.groupedServices.push(filteredServices.slice(i, i + 3));
            }
        };

        // Az árkategóriaváltás figyelése és a frissítés
        $scope.$watch('selectedPriceCategory', function (newValue) {
            if (newValue && newValue.length) {
                $scope.priceFilter = newValue;
            } else {
                $scope.priceFilter = '';
            }
            $scope.updateGroupedServices();
        });

        // Az árkategóriaváltás vagy keresési szöveg változását figyelni és frissíteni a Carousel-t
        $scope.$watchGroup(['searchText'], function () {
            $scope.updateGroupedServices();  // Mindig frissítjük a szűrt eredményeket
        });

        // Új metódus a csomag kiválasztásához
        $scope.addPackage = function(service) {
            if (!$rootScope.user || !$rootScope.user.id) {
                alert("Kérlek, jelentkezz be, hogy csomagot választhass!");
                $state.go('login');  // Bejelentkezéshez irányítja a felhasználót
                return;
            }

            // Ha már kiválasztottuk a csomagot, akkor visszaváltoztatjuk sárgára
            if (service.isSelected) {
                appointmentFactory.remove(service);  // Eltávolítjuk a csomagot
                service.isSelected = false;  // Visszaállítjuk sárgára
            } else {
                appointmentFactory.add(service);  // Hozzáadjuk az ideiglenes csomaglistához
                service.isSelected = true;  // Kékre változtatjuk
            }
        };

        // Kijelentkezéskor visszaállítjuk az összes szolgáltatás státuszát
        $scope.resetSelectedServices = function () {
            $scope.services.forEach(service => {
                service.isSelected = false; // Mindent sárgára állítunk
            });
        };

        // Ha a felhasználó kijelentkezik
        $scope.$watch('rootScope.user', function (newValue) {
            if (!newValue || !newValue.id) {
                // Kijelentkezés esetén visszaállítjuk a gombokat sárgára
                $scope.resetSelectedServices();
            }
        });

        // Kezdeti frissítés a betöltéskor
        $scope.updateGroupedServices();
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
  }])

  //---------BookingController---------------->
  .controller('bookingController', [
    '$scope',
    '$http',
    '$rootScope',
    '$state',
    'appointmentFactory',
    function ($scope, $http, $rootScope, $state, appointmentFactory) {

        // Ellenőrzés, hogy be vagyunk-e jelentkezve
        if (!$rootScope.user || !$rootScope.user.id) {
            alert("Nem vagy bejelentkezve. Jelentkezz be újra!");
            $state.go('login');
            return;
        }

        // Foglalások oldalon kép
        $scope.booking_pic = './media/image/booking_pic1.png';

        // Az időpontok listája
        $scope.availableTimes = [];

        // Az elérhető időpontok generálása
        $scope.getAvailableTimes = function() {
            let times = [];
            for (let i = 8; i <= 18; i++) {
                let time = i < 10 ? '0' + i + ':00' : i + ':00';  // Formázott időpont
                times.push({
                    time: time,
                    status: 'available'  // Kezdetben minden szabad
                });
            }
            $scope.availableTimes = times;
        };

        // Időpont kiválasztása
        $scope.selectTime = function(timeObj) {
            console.log("Kiválasztott időpont:", timeObj.time);
            // Itt tárolhatod a kiválasztott időpontot vagy egyéb műveleteket végezhetsz
        };

        // Hozzáadjuk a szolgáltatást a foglaláshoz
        $scope.addService = function(service) {
            appointmentFactory.add(service);
            $scope.$applyAsync();  // Az új változtatások aszinkron frissítése
        };

        // Megjelenítjük az összes kiválasztott szolgáltatást
        $scope.getSelectedServices = function() {
            return appointmentFactory.get();
        };

        // Törlés funkció: Eltávolítja a szolgáltatást
        $scope.removeService = function(service) {
            appointmentFactory.remove(service);  // Eltávolítjuk a szolgáltatást
            $scope.$applyAsync();  // Frissítjük a nézetet, hogy az AngularJS érzékelje a változást
        };

        // Az időpontok listája
        $scope.availableTimes = [];

        // Dátum kiválasztása (küldjük a dátumot a backend-nek és frissítjük a gombokat)
        $scope.selectDate = function(date) {
          $scope.selectedDate = date;
          console.log("Kiválasztott dátum:", $scope.selectedDate);
      
          // Lekérjük a foglalt időpontokat a PHP-tól az aktuális dátum alapján
          $http.post('./php/booked_times.php', { date: $scope.selectedDate })  // A POST kérésben a dátumot küldjük
              .then(function(response) {
                  $scope.updateAvailableTimes(response);  // Ha válasz érkezik, frissítjük a gombokat
              }, function(error) {
                  console.error("Hiba a foglalt időpontok lekérésekor:", error);
                  alert("Nem sikerült lekérni a foglalt időpontokat!");
              });
      };


        // Frissítjük az időpontok státuszát
        $scope.updateAvailableTimes = function(response) {
          if (!response.data || !response.data.data) {
              console.error("Nincs foglalt időpont a választott dátumhoz.");
              alert("Nincs foglalt időpont a választott dátumhoz.");
              return;
          }

          // Foglalt időpontok
          let bookedTimes = response.data.data.map(item => item.time);  // Csak az időpontokat vesszük ki
          console.log("Foglalt időpontok:", bookedTimes);

          // Frissítjük az időpontok státuszát
          $scope.availableTimes.forEach(function(timeObj) {
              let isBooked = bookedTimes.includes(timeObj.time);  // Ellenőrizzük, hogy a foglalt időpontok között van-e
              if (isBooked) {
                  timeObj.status = 'booked';  // Foglalt státusz
              } else {
                  timeObj.status = 'available';  // Elérhető státusz
              }
          });

          console.log("Frissített időpontok státusza:", $scope.availableTimes);

          // Frissítjük a gombok színét a státusznak megfelelően
          $scope.updateButtonColors();
        };


        // Frissítjük a gombok színét a státusz alapján
        $scope.updateButtonColors = function() {
          $scope.availableTimes.forEach(function(timeObj) {
              let button = document.getElementById('btn-' + timeObj.time);  // Az időpontok alapján generálunk egyedi ID-t a gomboknak
              if (button) {
                  if (timeObj.status === 'booked') {
                      button.classList.remove('bg-success');
                      button.classList.add('bg-danger');
                  } else {
                      button.classList.remove('bg-danger');
                      button.classList.add('bg-success');
                  }
              }
          });
        };

        // Betöltéskor meghívjuk a getAvailableTimes-t
        $scope.getAvailableTimes();
    }
  ])

  //--------Csomag választó kezelő------------>
  .factory('appointmentFactory', [
    function() {
    let selectedServices = [];

    return {
      add: function(service) {
        selectedServices.push(service);
      },
      get: function() {
        return selectedServices;
      },
      remove: function(service) {
        let index = selectedServices.indexOf(service);
        if (index !== -1) { 
            selectedServices.splice(index, 1);
        }
      }
    }
  }]);
})(window, angular);