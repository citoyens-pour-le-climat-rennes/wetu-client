// Generated by CoffeeScript 1.10.0
(function() {
  define(['R', 'Utils/Utils', 'Loader', 'Socket', 'City', 'Rasterizers/RasterizerManager', 'UI/Sidebar', 'UI/Toolbar', 'UI/DrawingPanel', 'UI/Modal', 'UI/Button', 'UI/AlertManager', 'Commands/CommandManager', 'View/View', 'View/Timelapse', 'Tools/ToolManager', 'RasterizerBot', 'i18next', 'i18nextXHRBackendID', 'i18nextBrowserLanguageDetectorID', 'jqueryI18next', 'moment'], function(R, Utils, Loader, Socket, CityManager, RasterizerManager, Sidebar, Toolbar, DrawingPanel, Modal, Button, AlertManager, CommandManager, View, Timelapse, ToolManager, RasterizerBot, i18next, i18nextXHRBackend, i18nextBrowserLanguageDetector, jqueryI18next, moment) {
    var showEndModal;
    showEndModal = function() {
      var endTextJ, modal;
      endTextJ = $('#end-text');
      modal = Modal.createModal({
        title: 'Comme un Dessein is over',
        submit: ((function(_this) {
          return function() {
            R.timelapse.activate();
          };
        })(this)),
        submitButtonText: 'Watch timelapse',
        submitButtonIcon: 'glyphicon-film',
        cancelButtonText: 'Just visit',
        cancelButtonIcon: 'glyphicon-sunglasses',
        postSubmit: 'hide'
      });
      modal.addCustomContent({
        divJ: endTextJ,
        name: 'end-text'
      });
      modal.show();
    };
    $(document).ready(function() {
      var canvasJ, isPM, meridiem, ordinal, updateContent, userAuthenticated, userWhoClosedLastTime, username;
      canvasJ = $('#canvas');
      R.administrator = canvasJ.attr('data-is-admin') === 'True';
      R.city = {
        owner: null,
        site: null,
        finished: false
      };
      if (window.location.pathname === '/festival-maintenant' || window.location.pathname === '/debug-festival-maintenant') {
        R.city.name = 'Maintenant';
        R.city.finished = true;
      }
      updateContent = function() {
        $("body").localize();
      };
      i18next.use(i18nextXHRBackend).use(i18nextBrowserLanguageDetector).init({
        fallbackLng: 'en',
        debug: true,
        ns: ['special', 'common'],
        defaultNS: 'common',
        backend: {
          loadPath: 'static/locales/{{lng}}/{{ns}}.json',
          crossDomain: true
        }
      }, function(err, t) {
        updateContent();
      });
      i18next.on('languageChanged', (function(_this) {
        return function() {
          return updateContent();
        };
      })(this));
      jqueryI18next.init(i18next, $, {
        tName: 't',
        i18nName: 'i18n',
        handleName: 'localize',
        selectorAttr: 'data-i18n',
        targetAttr: 'i18n-target',
        optionsAttr: 'i18n-options',
        useOptionsAttr: false,
        parseDefaultValueFromContent: true
      });
      i18next.changeLanguage('fr');
      ordinal = function(number) {
        return number + (number === 1 ? 'er' : 'e');
      };
      isPM = function(input) {
        return input.charAt(0) === 'M';
      };
      meridiem = function(hours, minutes, isLower) {
        if (hours < 12) {
          return 'PD';
        } else {
          return 'MD';
        }
      };
      moment.locale('fr', {
        months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
        monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
        monthsParseExact: true,
        weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
        weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
        weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: 'HH:mm',
          LTS: 'HH:mm:ss',
          L: 'DD/MM/YYYY',
          LL: 'D MMMM YYYY',
          LLL: 'D MMMM YYYY HH:mm',
          LLLL: 'dddd D MMMM YYYY HH:mm'
        },
        calendar: {
          sameDay: '[Aujourd’hui à] LT',
          nextDay: '[Demain à] LT',
          nextWeek: 'dddd [à] LT',
          lastDay: '[Hier à] LT',
          lastWeek: 'dddd [dernier à] LT',
          sameElse: 'L'
        },
        relativeTime: {
          future: 'dans %s',
          past: 'il y a %s',
          s: 'quelques secondes',
          m: 'une minute',
          mm: '%d minutes',
          h: 'une heure',
          hh: '%d heures',
          d: 'un jour',
          dd: '%d jours',
          M: 'un mois',
          MM: '%d mois',
          y: 'un an',
          yy: '%d ans'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
        ordinal: ordinal,
        meridiemParse: /PD|MD/,
        isPM: isPM,
        meridiem: meridiem,
        week: {
          dow: 1,
          doy: 4
        }
      });
      moment.locale('fr');
      username = canvasJ.attr("data-username");
      R.me = username.length > 0 ? username : null;
      userAuthenticated = canvasJ.attr("data-is-authenticated");
      R.userAuthenticated = userAuthenticated === 'True';
      if (R.style != null) {
        $('body').addClass(R.style);
      }
      R.catchErrors = false;
      R.ignoreSockets = false;
      R.currentPaths = {};
      R.paths = new Object();
      R.items = new Object();
      R.drawings = [];
      R.locks = [];
      R.divs = [];
      R.sortedPaths = [];
      R.sortedDivs = [];
      R.animatedItems = [];
      R.cars = {};
      R.currentDiv = null;
      R.selectedItems = [];
      if (location.pathname === '/rasterizer/') {
        R.rasterizerBot = new RasterizerBot(this);
        R.loader = new Loader.RasterizerLoader();
      } else {
        R.loader = new Loader();
      }
      R.socket = new Socket();
      R.sidebar = new Sidebar();
      R.cityManager = new CityManager();
      R.view = new View();
      R.alertManager = new AlertManager();
      R.toolbar = new Toolbar();
      if (R.CommeUnDesseinIsNotOver) {
        userWhoClosedLastTime = localStorage.getItem('showWelcomMessage');
        if ((!R.me) || userWhoClosedLastTime !== R.me) {
          setTimeout(((function(_this) {
            return function() {
              R.alertManager.alert('Welcome to Comme un Dessein', 'info');
            };
          })(this)), 1000);
          setTimeout(((function(_this) {
            return function() {
              if (R.ignoreNextAlert) {
                R.ignoreNextAlert = null;
                return;
              }
              R.alertManager.alert('You can discuss about drawings', 'info', null, {
                html: 'Venez discuter sur <a style="color: #2196f3;text-decoration: underline;" href="http://discussion.commeundessein.co/">http://discussion.commeundessein.co/</a> pour que l\'on crée ensemble une oeuvre collective !'
              });
            };
          })(this)), 4000);
        }
      }
      R.rasterizerManager = new RasterizerManager();
      R.rasterizerManager.initializeRasterizers();
      R.view.createBackground();
      R.commandManager = new CommandManager();
      R.toolManager = new ToolManager();
      R.drawingPanel = new DrawingPanel();
      R.view.initializePosition();
      R.sidebar.initialize();
      R.toolManager.createDeleteButton();
      R.toolManager.createSubmitButton();
      if (R.city.name === 'world') {
        R.loader.hideLoadingBar();
        R.tools.select.btn.cloneJ.hide();
        $('[data-name="Precise path"]').hide();
        $('#timeline').hide();
        $('#drawingPanel').hide();
      }
      if (R.city.finished) {
        R.timelapse = new Timelapse();
      } else {
        $('#timeline').hide();
      }
      R.commandManager.updateButtons();
      if (typeof window !== "undefined" && window !== null) {
        if (typeof window.setPageFullyLoaded === "function") {
          window.setPageFullyLoaded(true);
        }
      }
      if (R.initialZoom == null) {
        R.view.fitRectangle(R.view.grid.limitCD.bounds.expand(0), true);
      }
      if (R.city.name !== 'world') {
        require(['Items/Paths/PrecisePaths/PrecisePath'], function() {
          return R.loader.loadSVG();
        });
      }
      $('#about-link').click(function(event) {
        var divJ, modal;
        modal = Modal.createModal({
          title: 'About Comme Un Dessein',
          postSubmit: 'hide',
          submitButtonText: 'Close',
          submitButtonIcon: 'glyphicon-remove'
        });
        divJ = $('<iframe>');
        divJ.attr('style', 'width: 100%; border: none;');
        divJ.attr('src', 'about.html');
        divJ.html(i18next.t('welcome message 1', {
          interpolation: {
            escapeValue: false
          }
        }));
        divJ.html(i18next.t('welcome message 2', {
          interpolation: {
            escapeValue: false
          }
        }));
        divJ.html(i18next.t('welcome message 3', {
          interpolation: {
            escapeValue: false
          }
        }));
        modal.addCustomContent({
          divJ: divJ,
          name: 'about-page'
        });
        modal.modalJ.find('[name="cancel"]').hide();
        modal.show();
        event.preventDefault();
        event.stopPropagation();
        return -1;
      });
      if (R.city.name === 'world') {
        loadCitySVGs();
      }
    });
    R.debugDatabase = function() {
      return $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            "function": 'debugDatabase',
            args: {}
          })
        }
      });
    };
    R.fsi = function() {
      var ref;
      return (ref = R.selectedItems) != null ? ref[0] : void 0;
    };
    R.fi = function() {
      var itemId;
      if (R.items == null) {
        return null;
      }
      for (itemId in R.items) {
        return R.items[itemId];
      }
    };
  });

}).call(this);
