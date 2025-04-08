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
        user.init({
          
        });

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
    '$scope', 
    '$rootScope',
    
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
                first_name: "",
                last_name: "",
                born: "",
                countryCode: "",
                phone: "",
                gender: "",
                email: "",
                emailConfirm: "",
                password: "",
                passwordConfirm: ""
            }
        };

        // Email validációs függvény
        $scope.isValidEmail = function (email) {
            let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailPattern.test(email);
        };

        // Jelszó validációs függvény (legalább 5 és max 20 karakter)
        $scope.isPasswordValid = function (password) {
          if (!password) return false;
        
          let hasMinLength = password.length >= 5;
          let hasMaxLength = password.length <= 20;
          let hasUpperCase = /[A-Z]/.test(password);
          let hasLowerCase = /[a-z]/.test(password);
          let hasNumber    = /[0-9]/.test(password);
        
          return hasMinLength && hasMaxLength && hasUpperCase && hasLowerCase && hasNumber;
        };
        

        // Teljes validációs függvény
        $scope.isRegisterValid = function () {
            return (
                $scope.registerForm.$valid &&
                $scope.model.register.email === $scope.model.register.emailConfirm &&
                $scope.model.register.password === $scope.model.register.passwordConfirm &&
                $scope.isValidEmail($scope.model.register.email) &&
                $scope.isPasswordValid($scope.model.register.password)
            );
        };

        $scope.registerUser = function () {
            let requestData = angular.copy($scope.model.register);
            $scope.sendRegistrationData(requestData);
        };

        $scope.sendRegistrationData = function (requestData) {
            $http.post('./php/register.php', requestData)
                .then(response => {
                    if (response.data && response.data.data) {
                        alert(response.data.data);  // Sikeres regisztráció
                        $state.go('login');
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
        };

        // Átirányítás a bejelentkezési oldalra
        $scope.methods = {
            goToLogin: function () {
                $state.go('login');
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
            'user.country_code',
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
                            alert($rootScope.lang.data[response.data.data]);  // "Sikeres frissítés!"
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
                  }
              })
              .catch(error => {
                  console.error("Hiba történt a foglalások lekérésekor:", error);
              });
        };
      
          //Betöltéskor automatikusan futtatjuk
          $scope.loadBookings();

          $scope.deleteBooking = function (bookingId, rowId) {
            if (!confirm($rootScope.lang.data.confirm_delete_booking)) return;
        
            $http.post('./php/delete_booking.php', { booking_id: bookingId, id: rowId })
                .then(response => {
                    if (response.data && response.data.data) {
                        alert(
                          $rootScope.lang.data[response.data.data]
                        ); // Sikeres törlés
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
            address: "wash_address",
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
      $scope.mapUrl = $sce.trustAsResourceUrl(
        'https://www.google.com/maps/embed?pb=' +
        '!1m18!1m12!1m3!1d2760.836396232944' +
        '!2d20.473138775978818' +
        '!3d46.21370948311983' +
        '!2m3!1f0!2f0!3f0' +
        '!3m2!1i1024!2i768!4f13.1' +
        '!3m3!1m2!1s0x4744f602b445c0b9%3A0x6ecc2b88ac500ef' +
        '!2sHSZC%20Mak%C3%B3i%20N%C3%A1vay%20Lajos%20Technikum%20%C3%A9s%20Koll%C3%A9gium' +
        '!5e0!3m2!1shu!2shu!4v1734100844394!5m2!1shu!2shu'
      );
    

  
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
        $timeout(function() {
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
        }, 100); // 100 ms késleltetés
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
    '$timeout',
    function (
      $rootScope, 
      $scope, 
      $http, 
      $state, 
      appointmentFactory, 
      $timeout) {
  
      // Alapértelmezett változók
      $scope.videoUrl = "./media/video/services_video.mp4";
      $scope.services = [];
      $scope.searchText = '';
      $scope.selectedPriceCategory = '';
      $scope.groupedServices = [];
      $scope.arrowLeft = 'media/image/next-icon-left.png';
      $scope.arrowRight = 'media/image/next-icon-right.png';
  
      $scope.priceCategories = [
        { label: "all_price_categories", value: '' },
        { label: '0 Ft - 20 000 Ft', value: [0, 20000] },
        { label: '20 000 Ft - 40 000 Ft', value: [20001, 40000] },
        { label: "above_40000", value: [40001, Infinity] }
      ];
  
      // Szolgáltatások betöltése
      $http.get("./php/services.php").then(
        function (response) {
            if (response.data && Array.isArray(response.data.data)) {
                $scope.services = response.data.data.map(function (service) {
                    service.image = service.image || (
                        "./media/image/services/" + 
                        service.services_name
                            .toLowerCase()
                            .replace(/\s+/g, "_") + 
                        ".jpg"
                    );
                    service.isSelected = false;
                    return service;
                });
    
                $scope.updateGroupedServices();
                $scope.checkSelectedServices();
            } else {
                alert("Nem sikerült betölteni a szolgáltatásokat.");
            }
        }, 
        function (error) {
            console.error("Hiba történt:", error);
            alert("Hiba történt a szolgáltatások betöltésekor.");
        }
      );
    
      // Carousel újrainicializálása
      $scope.initCarousel = function() {
        $timeout(function() {
          let carouselElement = document.getElementById('serviceCarousel');
          if (carouselElement) {
            // Meglévő carousel megszüntetése
            let existingCarousel = bootstrap.Carousel.getInstance(carouselElement);
            if (existingCarousel) {
              existingCarousel.dispose();
            }
  
            // Új carousel inicializálása
            new bootstrap.Carousel(carouselElement, {
              interval: false, // Kézi lapozás
              wrap: true,      // Végtelen ciklus
              ride: false      // Ne induljon automatikusan
            });
          }
        }, 100); // Várakozás a DOM frissülésére
      };
  
      // Szolgáltatások csoportosítása
      $scope.updateGroupedServices = function () {
        let filteredServices = $scope.services.filter(service => {
            if ($scope.searchText) {
                let searchLower = $scope.searchText.toLowerCase();
                let translatedName = $scope.lang.data[service.services_name] || '';
                if (!translatedName.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }
    
            if ($scope.selectedPriceCategory && Array.isArray($scope.selectedPriceCategory)) {
                let [min, max] = $scope.selectedPriceCategory;
                return service.price >= min && service.price <= max;
            }
    
            return true;
        });
    
        $scope.groupedServices = [];
        for (let i = 0; i < filteredServices.length; i += 3) {
            $scope.groupedServices.push(filteredServices.slice(i, i + 3));
        }
    
        // **Győződjünk meg róla, hogy az első slide mindig aktív!**
        $timeout(function () {
            let carouselItems = document.querySelectorAll('.carousel-item');
            if (carouselItems.length > 0) {
                carouselItems.forEach((item, index) => {
                    if (index === 0) {
                        item.classList.add('active'); // Csak az első legyen aktív
                    } else {
                        item.classList.remove('active'); // Az összes többi NE legyen aktív
                    }
                });
            }
        }, 50); // Várunk egy picit a DOM frissülésére
    
        // Carousel újrainicializálása
        $scope.initCarousel();
      };
    
  
      // Keresés és árkategória figyelése
      $scope.$watchGroup(['searchText', 'selectedPriceCategory'], function () {
        $scope.updateGroupedServices();
      });
  
      // Egyéb függvények
      $scope.checkSelectedServices = function () {
        let selectedServices = appointmentFactory.get();
        selectedServices.forEach(service => {
          let serviceInList = $scope.services.find(s => s.id === service.id);
          if (serviceInList) {
            serviceInList.isSelected = true;
          }
        });
      };
  
      $scope.addPackage = function(service) {
        if (!$rootScope.user || !$rootScope.user.id) {
          alert($rootScope.lang.data.please_login);
          $state.go('login');
          return;
        }
  
        if (service.isSelected) {
          appointmentFactory.remove(service);
          service.isSelected = false;
        } else {
          appointmentFactory.add(service);
          service.isSelected = true;
        }
        $rootScope.cartItemCount = appointmentFactory.get().length;
      };
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

        //Carousel nyilak képei
        $scope.feedbackArrowLeft = 'media/image/next-icon-left.png';
        $scope.feedbackArrowRight = 'media/image/next-icon-right.png';


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

        // Ellenőrzés, hogy be vagyunk-e jelentkezve
        if (!$rootScope.user || !$rootScope.user.id) {
            alert("Nem vagy bejelentkezve. Jelentkezz be újra!");
            $state.go('login');
            return;
        }

        // Alapértelmezett értékek
        $scope.booking_pic = './media/image/booking_pic1.png';
        $scope.availableTimes = [];
        $scope.vehiclePlate = "";
        $scope.today = moment().format("YYYY-MM-DD"); // Moment.js használata
        $scope.isServiceSelected = false;
        $scope.selectedTimes = [];
        $scope.bookingForm = {}; // Inicializáljuk a bookingForm-ot

        // Az elérhető időpontok generálása (08:00 - 18:00)
        $scope.getAvailableTimes = function() {
          let times = [];
          let startHour = 8; // Alapértelmezett kezdő óra
          let endHour = 18;  // Alapértelmezett záró óra
      
          // Ellenőrizzük, hogy a kiválasztott dátum szombat-e
          let selectedDay = moment($scope.selectedDate).day(); // 6 = szombat
          if (selectedDay === 6) { // Ha szombat
              endHour = 11; // Szombatonként csak 11-ig
          }
      
          // Időpontok generálása
          for (let i = startHour; i <= endHour; i++) {
              let time = (i < 10 ? '0' + i : i) + ':00';
              times.push({ time: time, status: 'available' });
          }
      
          $scope.availableTimes = times;
        };

        // Ellenőrzés: múltbeli időpontok letiltása
        $scope.isPastTime = function(time) {
            let now = moment();
            let selectedDate = moment($scope.selectedDate);

            if (selectedDate.isSame(now, 'day')) {
                let [hours, minutes] = time.split(':').map(Number);
                return hours < now.hour() || (hours === now.hour() && minutes <= now.minute());
            }
            return false;
        };


        // Ellenőrizzük, hogy minden mező ki van-e töltve a mentéshez
        $scope.isFormValid = function() {
            if (!$scope.bookingForm || !$scope.bookingForm.vehiclePlate) {
                return false; // Ha a form vagy a mező nem létezik, akkor a form nem érvényes
            }
            return $scope.vehiclePlate && 
                   $scope.selectedDate &&
                   $scope.isSelected && 
                   !$scope.bookingForm.vehiclePlate.$invalid &&
                   $scope.selectedTimes.length === $scope.cartItems.length;
        };

        // Figyeljük, hogy van-e kiválasztott szolgáltatás
        $scope.$watch(() => $scope.getSelectedServices().length, function(newVal) {
            $scope.isServiceSelected = newVal > 0; // Ha van csomag, aktiváljuk a rendszám mezőt
        });

        // Figyeljük, hogy a rendszám kitöltött-e és helyes-e
        $scope.$watch('vehiclePlate', function(newVal) {
            if ($scope.bookingForm && $scope.bookingForm.vehiclePlate) {
                $scope.isVehiclePlateValid = !!newVal && !$scope.bookingForm.vehiclePlate.$invalid;
            }
        });

        // Figyeljük, hogy a dátumot kiválasztották-e
        $scope.$watch('selectedDate', function(newVal) {
            $scope.isDateSelected = !!newVal;
        });

        // Dátum kiválasztása → Frissítjük a foglalt időpontokat
        $scope.onDateSelect = function() {
          if (!$scope.selectedDate) {
              return;
          }
      
          // Ellenőrizzük, hogy a kiválasztott dátum vasárnap-e
          let selectedDay = moment($scope.selectedDate).day(); // 0 = vasárnap, 1 = hétfő, ..., 6 = szombat
      
          if (selectedDay === 0) { // Ha vasárnap
              alert("Vasárnap zárva tartunk! Kérem, válasszon másik dátumot!");
              $scope.selectedDate = ""; // Töröljük a kiválasztott dátumot
              return; // Kilépünk a függvényből, ne frissítsük a foglalt időpontokat
          }
      
          // Frissítjük az elérhető időpontokat
          $scope.getAvailableTimes();
      
          // Dátum formázása moment js-el (helyi időzóna használatával)
          let formattedDate = moment($scope.selectedDate).format("YYYY-MM-DD");
      
          // Foglalt időpontok frissítése
          $http.post('./php/booked_times.php', { selectedDate: formattedDate })
              .then(response => { 
                $scope.updateAvailableTimes(response.data.data);
                $scope.selectedTimes = [];
              })
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
                    button.classList.toggle('bg-success', timeObj.status === 'available' && !$scope.isPastTime(timeObj.time));
                    button.classList.toggle('bg-warning', timeObj.status === 'selected');
                    button.disabled = !$scope.isServiceSelected || timeObj.status === 'booked' || $scope.isPastTime(timeObj.time);
                }
            });
        };

        // Időpont kiválasztása (toggle)
        $scope.bookingTimeToggleSelect = function(time) {
            if (!$scope.isServiceSelected) return;

            let index = util.indexByKeyValue($scope.availableTimes, 'time', time);
            if ($scope.availableTimes[index].status === 'available' && 
                $scope.selectedTimes.length < $scope.cartItems.length) {
                $scope.availableTimes[index].status = 'selected';
                $scope.selectedTimes.push(time + ":00");
            } else if ($scope.availableTimes[index].status === 'selected') {
                $scope.availableTimes[index].status = 'available';
                $scope.selectedTimes = $scope.selectedTimes.filter(t => t !== time + ":00");
            }

            $scope.isSelected = $scope.selectedTimes.length > 0;
            $scope.$applyAsync();
        };

        // Kosár kezelése
        $scope.$watch(() => appointmentFactory.get(), newCartItems => {
            $scope.cartItems = newCartItems;
            $rootScope.cartItemCount = newCartItems.length;
            $scope.isServiceSelected = newCartItems.length > 0;
            $scope.updateButtonColors();
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
          // Dátum formázása moment.js-el
          let formattedDate = moment($scope.selectedDate).format("YYYY-MM-DD");
      
          if (!$scope.vehiclePlate || !formattedDate || $scope.selectedTimes.length !== $scope.cartItems.length) {
              alert("Kérlek, töltsd ki az összes mezőt, és válassz időpontot minden szolgáltatáshoz!");
              return;
          }
      
          // Összegyűjtjük az összes szolgáltatást és időpontot egy objektumba
          let requestData = {
              user_id: $rootScope.user.id,
              booking_date: formattedDate,
              vehicle_plate: $scope.vehiclePlate,
              services: []
          };
      
          // Szolgáltatások és időpontok összekapcsolása
          $scope.cartItems.forEach((service, index) => {
              requestData.services.push({
                  time: $scope.selectedTimes[index],
                  service_id: service.id
              });
          });
      
          // Egyetlen POST kérésben küldjük el
          $http.post('./php/save_booking.php', requestData)
              .then(response => {
                  if (response.data && response.data.data) {
                      alert($rootScope.lang.data[response.data.data]);
                  } else if (response.data && response.data.error) {
                      alert("Hiba: " + response.data.error);
                  } else {
                      alert("Ismeretlen hiba történt!");
                  }
              })
              .catch(error => {
                  console.error("Hiba történt:", error);
                  alert("Hiba történt a mentés során!");
              });
      
          // Kosár és időpontok törlése mentés után
          appointmentFactory.clear();
          $scope.vehiclePlate = "";
          $scope.selectedDate = "";  
          $scope.selectedTimes = [];
          $scope.isSelected = false;
          $scope.getAvailableTimes();
        };
      

        // Betöltéskor inicializáljuk az időpontokat
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