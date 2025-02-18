;(function (window, angular) {

  'use strict';

  // Application module
  angular.module('app', [
    'ui.router',
    'app.common',
    'app.form',
    'app.user',
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
    '$window',
    'user',
    function ($rootScope, $timeout, $window, user) {

        // Initialize user
        user.init();

        // Initialize tooltips
        $rootScope.tooltipsInit = () => {
            $timeout(() => {
                let tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
                if (tooltips.length) {
                    [...tooltips].forEach(e => new bootstrap.Tooltip(e));
                }
          }, 100);
        };

         // Ellenőrzés: Megfelel-e a jelszó a mintának?
        $rootScope.isPasswordValid = function(password) {
          let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,}$/;
          return regex.test(password);
        };


         // Ellenőrzés: Megfelel-e az email a mintának?
        $rootScope.isValidEmail = function(email) {
          return email && email.includes("@") && email.includes(".") && email.length > 5;
        };
      
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
      
      function ($scope, $http, $state) {
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

          // E-mail mező törlése
          $scope.clearEmail = function() {
            $scope.model.email = '';
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

          // Átirányítás a bejelentkezési oldalra
          $scope.methods = {
            goToLogin: function() {
                $state.go('login'); 
            }
          }

          
      }
  ])

  //----------Profile-controller-------------->
  .controller('profileController', [
    '$rootScope', 
    '$state', 
    '$scope', 
    '$http', 
    '$timeout',
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

        //Foglalások megjelenítése
        $scope.loadBookings = function() {
          let requestData = {
              user_id: $rootScope.user.id //A bejelentkezett felhasználó ID-je
          };
      
          $http.post('./php/load_bookings.php', requestData)
              .then(response => {
                  if (response.data && response.data.data) {
                      $scope.bookings = response.data.data;
                  } else {
                      $scope.bookings = [];
                      console.warn("Nincsenek foglalások.");
                  }
              })
              .catch(error => {
                  console.error("Hiba történt a foglalások lekérésekor:", error);
              });
        };
      
          //Betöltéskor automatikusan futtatjuk
          $scope.loadBookings();

          $scope.deleteBooking = function (bookingId) {
            if (!confirm("Biztosan törölni szeretnéd ezt a foglalást?")) return;
        
            $http.post('./php/delete_booking.php', { booking_id: bookingId })
                .then(response => {
                    if (response.data && response.data.data) {
                        alert(response.data.data); // Sikeres törlés
                        $scope.loadBookings(); // Frissítjük a listát
                    } else if (response.data && response.data.error) {
                        alert("Hiba: " + response.data.error);
                    } else {
                        alert("Ismeretlen hiba történt!");
                    }
                })
                .catch(error => {
                    console.error("Hiba történt:", error);
                    alert("Hiba történt a törlés során!");
                });
          };
          
          // Betöltéskor automatikusan futtatjuk
          $scope.loadBookings();
      
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
          $state.go('services');
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
            let selectedServices = appointmentFactory.get();
            selectedServices.forEach(service => {
                let serviceInList = $scope.services.find(s => s.id === service.id);
                if (serviceInList) {
                    serviceInList.isSelected = true; // Ha már hozzá van adva, akkor kékké tesszük
                }
            });
        };

        $scope.addPackage = function(service) {
          if (!$rootScope.user || !$rootScope.user.id) {
              alert("Kérlek, jelentkezz be, hogy csomagot választhass!");
              $state.go('login');  // Bejelentkezéshez irányítja a felhasználót
              return;
          }
      
          if (service.isSelected) {
              appointmentFactory.remove(service);  // Eltávolítás a kosárból
              service.isSelected = false;  // Visszaállítjuk az állapotot
          } else {
              appointmentFactory.add(service);  // Hozzáadás a kosárhoz
              service.isSelected = true;  // Kékre változtatjuk
          }
      
          // 🔥 Navbar frissítése azonnal
          $rootScope.cartItemCount = appointmentFactory.get().length;
        };
      

        // Szolgáltatásokat csoportosítjuk, hogy 3 elem legyen egyszerre
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

        // Figyeljük a keresési szöveget és frissítjük a szolgáltatásokat
        $scope.$watchGroup(['searchText'], function () {
            $scope.updateGroupedServices();  // Mindig frissítjük a szűrt eredményeket
        });

        // Árkategória váltás figyelése
        $scope.$watch('selectedPriceCategory', function (newValue) {
            if (newValue && newValue.length) {
                $scope.priceFilter = newValue;
            } else {
                $scope.priceFilter = '';
            }
            $scope.updateGroupedServices();
        });

    }
  ])

  //--------About_us-controller--------------->
  .controller('aboutUsController', [
    '$scope', 
    '$http',
    '$rootScope',
    '$state',

    function ($scope, $http, $rootScope, $state) {

        // Oldal képei
        $scope.ourTeam_img = './media/image/spwash_crew.jpg';
        $scope.satisfied_img = './media/image/satisfied_man.jpg';

        // Vélemények tárolása
        $scope.feedbacks = [];

        //Életkor számítása születési dátumból
        function calculateAge(birthDate) {
            if (!birthDate) return null;
            let today = new Date();
            let birth = new Date(birthDate);
            let age = today.getFullYear() - birth.getFullYear();
            let monthDiff = today.getMonth() - birth.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            return age;
        }

        //Felhasználói adatok frissítése
        $scope.setUserData = function () {
          if (!$rootScope.user || !$rootScope.user.id) {
              return; // Ha nincs bejelentkezve, kilépünk
          }
      
          if ($rootScope.user.born) {
              $rootScope.user.age = calculateAge($rootScope.user.born);
          }
        };
      

        //Vélemények betöltése az adatbázisból
        $scope.loadFeedbacks = function () {
            $http.post('./php/load_feedback.php')
                .then(response => {
                    if (response.data && response.data.data) {
                        $scope.feedbacks = response.data.data;
                    } else {
                        console.error("Hiba:", response.data.message);
                    }
                })
                .catch(e => console.error("Adatbetöltési hiba:", e));
        };

        //Átirányítás login oldalra
        $scope.redirectToLogin = function () {
            $state.go('login');
        };

        //Vélemény beküldése
        $scope.submitFeedback = function () {
            if (!$rootScope.user || !$rootScope.user.id) {
                alert("Be kell jelentkezned, hogy véleményt írhass!");
                $state.go('login');
                return;
            }

            if ($scope.feedbackForm.$valid) {
                let feedbackData = {
                    user_id: $rootScope.user.id,  
                    first_name: $rootScope.user.first_name,
                    last_name: $rootScope.user.last_name,
                    gender: $rootScope.user.gender,
                    age: $rootScope.user.age, 
                    rating: $scope.feedback.rating,
                    comment: $scope.feedback.comment
                };

                $http.post('./php/submit_feedback.php', feedbackData)
                    .then(response => {
                        if (response.data.data) {
                            alert("Vélemény sikeresen elküldve!");
                            $scope.feedback.rating = 0;
                            $scope.feedback.comment = '';
                            $scope.loadFeedbacks();
                        } else {
                            alert("Hiba: " + response.data.error);
                        }
                    })
                    .catch(error => {
                        console.error("Vélemény mentési hiba:", error);
                        alert("Hiba történt a mentés során!");
                    });
            }
        };

        // Csillagok generálása értékelés alapján
        $scope.getStars = function (rating) {
          return Array.from({ length: rating }, (_, i) => i + 1);
        };


        //Csillagok kezelése
        $scope.feedback = { rating: 0 };
        $scope.hoverRating = 0;

        $scope.setHover = function (star) {
            $scope.hoverRating = star;
        };

        $scope.clearHover = function () {
            $scope.hoverRating = 0;
        };

        $scope.setRating = function (star) {
            $scope.feedback.rating = star;
        };

        //Az oldal betöltésekor
        $scope.init = function () {
            $scope.setUserData();  // Először az adatok frissítése
            $scope.loadFeedbacks(); // Utána a vélemények betöltése
        };

        $scope.init(); //Azonnal futtatjuk az inicializálást
    }
  ])

  //---------BookingController---------------->
  .controller('bookingController', [
    '$scope', 
    '$http', 
    '$rootScope', 
    '$state', 
    'appointmentFactory', 
    'util',
    
    function ($scope, $http, $rootScope, $state, appointmentFactory, util) {

        //  Ellenőrzés, hogy be vagyunk-e jelentkezve
        if (!$rootScope.user || !$rootScope.user.id) {
            alert("Nem vagy bejelentkezve. Jelentkezz be újra!");
            $state.go('login');
            return;
        }

        // Alapértelmezett értékek
        $scope.booking_pic = './media/image/booking_pic1.png';
        $scope.availableTimes = [];
        $scope.vehiclePlate = "";
        $scope.today = new Date().toISOString().split('T')[0];

        // Az elérhető időpontok generálása (08:00 - 18:00)
        $scope.getAvailableTimes = function() {
            let times = [];
            for (let i = 8; i <= 18; i++) {
                let time = (i < 10 ? '0' + i : i) + ':00';
                times.push({ time: time, status: 'available' });
            }
            $scope.availableTimes = times;
        };

        // Ellenőrzés: múltbeli időpontok letiltása
        $scope.isPastTime = function(time) {
            let now = new Date();
            let selectedDate = new Date($scope.selectedDate);

            if (selectedDate.toDateString() === now.toDateString()) {
                let [hours, minutes] = time.split(':').map(Number);
                return hours < now.getHours() || (hours === now.getHours() && minutes <= now.getMinutes());
            }
            return false;
        };

        //  Dátum kiválasztása → Elküldjük a backendnek, hogy a foglalt időpontokat frissítsük
        $scope.onDateSelect = function() {
            if (!$scope.selectedDate) {
                console.error("Nincs kiválasztott dátum!");
                return;
            }

            let selectedDateObj = new Date($scope.selectedDate);
            selectedDateObj.setMinutes(selectedDateObj.getMinutes() - selectedDateObj.getTimezoneOffset());
            let formattedDate = selectedDateObj.toISOString().split('T')[0];

            $http.post('./php/booked_times.php', { selectedDate: formattedDate })
                .then(response => { $scope.updateAvailableTimes(response.data.data); })
                .catch(error => { console.error("Hiba történt:", error); });
        };

        // Frissítjük az időpontok státuszát (backend válasza alapján)
        $scope.updateAvailableTimes = function(response) {
            let bookedTimes = response ? response.map(item => item.booking_time.substr(0, 5)) : [];
            $scope.availableTimes.forEach(timeObj => {
                timeObj.status = bookedTimes.includes(timeObj.time) ? 'booked' : 'available';
            });
        };

        // Frissítjük a gombok színét a státusz alapján
        $scope.updateButtonColors = function() {
            $scope.availableTimes.forEach(timeObj => {
                let button = document.getElementById('btn-' + timeObj.time);
                if (button) {
                    button.classList.toggle('bg-danger', timeObj.status === 'booked');
                    button.classList.toggle('bg-success', timeObj.status !== 'booked');
                }
            });
        };

        // Időpont kiválasztása (toggle)
        $scope.bookingTimeToggleSelect = function(time) {
            let index = util.indexByKeyValue($scope.availableTimes, 'time', time);
            $scope.availableTimes[index].status = ($scope.availableTimes[index].status === 'available') ? 'selected' : 'available';
            
            index = util.indexByKeyValue($scope.availableTimes, 'status', 'selected');
            $scope.isSelected = index !== -1;

            $scope.selectedTime = $scope.isSelected ? time + ":00" : null;
            $scope.$applyAsync();
        };

        // Kosár kezelése
        $scope.$watch(() => appointmentFactory.get(), newCartItems => {
            $scope.cartItems = newCartItems;
            $rootScope.cartItemCount = newCartItems.length;
        }, true);

        $scope.addService = function(service) {
            appointmentFactory.add(service);
            $scope.cartItems = appointmentFactory.get();
            $scope.$applyAsync();
        };

        $scope.getSelectedServices = function() {
            return appointmentFactory.get();
        };

        $scope.removeService = function(service) {
            appointmentFactory.remove(service);
            $scope.cartItems = appointmentFactory.get();
            $scope.$applyAsync();
        };

        $scope.allServicePrice = function() {
            return $scope.getSelectedServices().reduce((total, service) => total + service.price, 0);
        };

        // Foglalás mentése
        $scope.saveBooking = function() {      
            let selectedDateObj = new Date($scope.selectedDate);
            let formattedDate = selectedDateObj.getFullYear() + "-" +
                                String(selectedDateObj.getMonth() + 1).padStart(2, '0') + "-" +
                                String(selectedDateObj.getDate()).padStart(2, '0');

            if (!$scope.vehiclePlate || !formattedDate || !$scope.selectedTime) {
                alert("Kérlek, töltsd ki az összes mezőt!");
                return;
            }

            let requestData = {
                user_id: $rootScope.user.id,
                service_ids: $scope.getSelectedServices().map(s => s.id), // Több szolgáltatás ID tömbként
                booking_date: formattedDate,
                booking_time: $scope.selectedTime,
                vehicle_plate: $scope.vehiclePlate
            };

            //POST kérés foglalás mentésére
            $http.post('./php/save_booking.php', requestData)
                .then(response => {
                    if (response.data && response.data.data) { 
                        alert(response.data.data);
                        appointmentFactory.clear();
                        $scope.vehiclePlate = "";
                        $scope.selectedDate = "";  
                        $scope.isSelected = false;
                        $scope.getAvailableTimes();
                    } 
                    else if (response.data && response.data.error) {
                        alert("Hiba: " + response.data.error);
                    } 
                    else {
                        alert("Ismeretlen hiba történt!");
                    }
                })
                .catch(error => {
                    console.error("Hiba történt:", error);
                    alert("Hiba történt a mentés során!");
                });
        };
        
        //  Betöltéskor inicializáljuk az időpontokat
        $scope.getAvailableTimes();     
        
        
        // Átirányítás függvény
        $scope.redirectToMyAppointments = function () {
          if ($rootScope.user && $rootScope.user.id) {
              $state.go('profile', { section: 'myBookings' });
          }
        };
      

    }
  ])

  //--------Csomag választó kezelő------------>
  .factory('appointmentFactory', [
    '$rootScope', 
    function($rootScope) {

      let selectedServices = [];

      return {
        add: function(service) {
            selectedServices.push(service);
            $rootScope.cartItemCount = selectedServices.length;
        },

        get: function() {
            return selectedServices;
        },

        remove: function(service) {
            let index = selectedServices.findIndex(item => item.id === service.id);
            if (index !== -1) {
                selectedServices.splice(index, 1);
            }
            $rootScope.cartItemCount = selectedServices.length;
        },

        clear: function() {
          selectedServices = [];
          $rootScope.cartItemCount = 0;
        }
      };
    }
  ]);
})(window, angular);