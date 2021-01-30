// Generated by CoffeeScript 1.10.0
(function() {
  define(['R', 'Utils/Utils', 'Loader', 'Socket', 'City', 'Rasterizers/RasterizerManager', 'UI/Sidebar', 'UI/Toolbar', 'UI/DrawingPanel', 'UI/Modal', 'UI/Button', 'UI/AlertManager', 'Commands/CommandManager', 'View/View', 'View/Timelapse', 'Tools/ToolManager', 'RasterizerBot', 'i18next', 'i18nextXHRBackendID', 'i18nextBrowserLanguageDetectorID', 'jqueryI18next', 'moment'], function(R, Utils, Loader, Socket, CityManager, RasterizerManager, Sidebar, Toolbar, DrawingPanel, Modal, Button, AlertManager, CommandManager, View, Timelapse, ToolManager, RasterizerBot, i18next, i18nextXHRBackend, i18nextBrowserLanguageDetector, jqueryI18next, moment) {
    var showEndModal;
    showEndModal = function(message, cityName) {
      var args, modal;
      args = {
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
      };
      if (cityName === 'tech-inn-vitre') {
        args.submitButtonText = 'Just visit';
        args.submitButtonIcon = 'glyphicon-sunglasses';
        args.submit = (function(_this) {
          return function() {};
        })(this);
      }
      modal = Modal.createModal(args);
      modal.addCustomContent({
        divJ: $(message),
        name: 'end-text'
      });
      if (cityName === 'tech-inn-vitre') {
        modal.modalJ.find('[name="cancel"]').hide();
      }
      modal.show();
    };
    R.loadActiveDrawings = true;
    $(document).ready(function() {
      var canvasJ, cityName, deleteAccountWarning, isPM, meridiem, ordinal, updateContent, userAuthenticated, userWhoClosedLastTime, username;
      canvasJ = $('#canvas');
      R.administrator = canvasJ.attr('data-is-admin') === 'True';
      R.application = canvasJ.attr('data-application');
      R.isCommeUnDessein = R.application === 'COMME_UN_DESSEIN';
      if (R.city == null) {
        R.city = {};
      }
      R.city.owner = null;
      R.city.site = null;
      R.city.mode = canvasJ.attr('data-city-mode');
      cityName = canvasJ.attr('data-city');
      R.useSVG = R.isCommeUnDessein && canvasJ.attr('data-city-use-svg') === 'True';
      if (cityName.length > 0) {
        R.city.name = cityName;
      }
      R.city.finished = canvasJ.attr('data-city-finished') === 'True';
      if (R.city.finished) {
        showEndModal(canvasJ.attr('data-city-message'), R.city.name);
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
      if (!R.city.finished) {
        userWhoClosedLastTime = localStorage.getItem('showWelcomMessage');
        if ((!R.me) || userWhoClosedLastTime !== R.me) {
          setTimeout(((function(_this) {
            return function() {
              R.alertManager.alert('Welcome to Comme un Dessein', 'info');
            };
          })(this)), 1000);
        }
      }
      R.rasterizerManager = new RasterizerManager();
      R.rasterizerManager.initializeRasterizers();
      R.view.createBackground();
      R.commandManager = new CommandManager();
      R.toolManager = new ToolManager();
      R.drawingPanel = new DrawingPanel();
      R.toolManager.createChangeImageButton();
      R.toolManager.createAutoTraceButton();
      R.toolManager.createDeleteButton();
      R.toolManager.createSubmitButton();
      R.view.initializePosition();
      R.sidebar.initialize();
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
      if (R.city.name !== 'world') {
        require(['Items/Paths/PrecisePaths/PrecisePath'], function() {
          R.loader.loadDraft();
          R.loader.loadVotes();
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
      $('#user-login-group').click(function(event) {
        var modal;
        modal = Modal.createModal({
          title: 'Sign in / up',
          postSubmit: 'hide'
        });
        modal.addText('Loading');
        $.get("accounts/login/", (function(_this) {
          return function(data) {
            var doc, parser;
            parser = new DOMParser();
            doc = parser.parseFromString(data.html, "text/html");
            modal.modalBodyJ.html(doc.getElementById('login_form'));
            $('#id_login').attr('placeholder', "Nom d'utilisateur ou email");
            $('#id_username').attr('placeholder', "Nom d'utilisateur");
            $('label[for="id_remember"]').text('se souvenir de moi').css({
              'margin-left': '10px'
            }).parent().css({
              'display': 'flex',
              'flex-direction': 'row-reverse'
            });
            modal.modalJ.find(".modal-footer").hide();
            localStorage.setItem('just-logged-in', 'true');
            localStorage.setItem('selected-edition', location.pathname);
          };
        })(this));
        modal.show();
        event.preventDefault();
        event.stopPropagation();
        return -1;
      });
      deleteAccountWarning = (function(_this) {
        return function(previousModal) {
          var deleteAccount, deleteAccountCallback;
          deleteAccountCallback = function(result) {
            if (!R.loader.checkError(result)) {
              return;
            }
            R.alertManager.alert('Your account has successfully been deleted', 'info');
            setTimeout((function() {
              return location.pathname = "/accounts/logout/";
            }), 2500);
          };
          deleteAccount = function() {
            $.ajax({
              method: "POST",
              url: "ajaxCall/",
              data: {
                data: JSON.stringify({
                  "function": 'deleteUser',
                  args: {}
                })
              }
            }).done(deleteAccountCallback);
          };
          previousModal.modalJ.on('hidden.bs.modal', function() {
            var modal;
            modal = Modal.createModal({
              title: 'Delete account',
              submitButtonText: 'Delete account',
              submitButtonIcon: 'glyphicon-trash',
              submit: deleteAccount
            });
            modal.addText('Are you sure you want to delete your account?', 'Are you sure you want to delete your account');
            modal.addText('Your drawings will not be deleted', 'Your drawings will not be deleted', false, {
              email: 'idlv.contact@gmail.com'
            });
            modal.modalJ.find('[name="submit"]').removeClass('btn-primary').addClass('btn-danger');
            return modal.show();
          });
        };
      })(this);
      $('#modify-user-profile').click(function(event) {
        var changeUserCallback, confirmedText, dailyText, emailConfirmed, emailFrequencyLabel, emailFrequencyLabelJ, emailFrequencyPJ, emailFrequencySelectJ, emailFrequencySelectorJ, emailJ, manageEmails, modal, monthlyText, neverText, onlyIfRelevant, resetPassword, submitChangeProfile, userEmail, usernameJ, weeklyText;
        event.preventDefault();
        event.stopPropagation();
        changeUserCallback = function(result) {
          if (!R.loader.checkError(result)) {
            return;
          }
          R.alertManager.alert('Your profile has successfully been updated', 'info');
          R.me = result.username;
        };
        submitChangeProfile = function() {
          var args;
          username = $('#modal-Username').find('input').val();
          args = {
            username: username
          };
          $.ajax({
            method: "POST",
            url: "ajaxCall/",
            data: {
              data: JSON.stringify({
                "function": 'changeUser',
                args: args
              })
            }
          }).done(changeUserCallback);
        };
        modal = Modal.createModal({
          title: 'Profile',
          submitButtonText: 'Modify username',
          submitButtonIcon: 'glyphicon-user',
          submit: submitChangeProfile
        });
        usernameJ = modal.addTextInput({
          name: 'Username',
          id: 'profile-username',
          placeholder: i18next.t('Username'),
          className: '',
          label: 'Username',
          type: 'text'
        });
        usernameJ.find('input').val(R.me);
        emailConfirmed = R.canvasJ.attr('data-email-confirmed');
        confirmedText = '(' + i18next.t(emailConfirmed ? 'Confirmed' : 'Not confirmed') + ')';
        emailJ = modal.addTextInput({
          name: 'Email',
          id: 'profile-email',
          placeholder: 'Email',
          className: '',
          label: 'Email ' + confirmedText,
          type: 'email'
        });
        userEmail = R.canvasJ.attr('data-user-email');
        emailJ.find('input').val(userEmail).attr('disabled', 'true');
        emailFrequencyLabel = i18next.t('Email notification frequency');
        dailyText = i18next.t('Daily');
        weeklyText = i18next.t('Weekly');
        monthlyText = i18next.t('Monthly');
        neverText = i18next.t('Never');
        onlyIfRelevant = i18next.t('You will only receive email if you have new notifications');
        emailFrequencySelectorJ = $('<div id="email-frequency-container"></div>');
        emailFrequencyLabelJ = $('<label for="mail-frequency">' + emailFrequencyLabel + ':</label>');
        emailFrequencySelectJ = $("<select id=\"mail-frequency\" style=\"margin-left: 10px;\">\n\n	<option value=\"daily\">" + dailyText + "</option>\n<option value=\"weekly\">" + weeklyText + "</option>\n<option value=\"monthly\">" + monthlyText + "</option>\n<option value=\"never\">" + neverText + "</option>\n\n</select>");
        emailFrequencyPJ = $('<p>' + onlyIfRelevant + '.</p>');
        emailFrequencySelectorJ.append(emailFrequencyLabelJ);
        emailFrequencySelectorJ.append(emailFrequencySelectJ);
        emailFrequencySelectorJ.append(emailFrequencyPJ);
        emailFrequencySelectJ.on('change', (function(_this) {
          return function() {
            var args;
            args = {
              emailFrequency: emailFrequencySelectJ.val()
            };
            $.ajax({
              method: "POST",
              url: "ajaxCall/",
              data: {
                data: JSON.stringify({
                  "function": 'changeUserEmailFrequency',
                  args: args
                })
              }
            }).done(function(result) {
              if (!R.loader.checkError(result)) {
                return;
              }
              R.alertManager.alert('Your profile has successfully been updated', 'info');
            });
          };
        })(this));
        modal.addCustomContent({
          divJ: emailFrequencySelectorJ
        });
        manageEmails = (function(_this) {
          return function() {
            window.location = '/accounts/email/';
          };
        })(this);
        modal.addButton({
          name: 'Manage emails',
          icon: 'glyphicon-envelope',
          type: 'info',
          submit: manageEmails
        });
        resetPassword = (function(_this) {
          return function() {
            window.location = '/accounts/password/reset/';
          };
        })(this);
        modal.addButton({
          name: 'Reset password',
          icon: 'glyphicon-lock',
          type: 'info',
          submit: resetPassword
        });
        modal.addButton({
          name: 'Delete account',
          icon: 'glyphicon-trash',
          type: 'danger',
          submit: function() {
            return deleteAccountWarning(modal);
          }
        });
        modal.show();
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

//# sourceMappingURL=Main.js.map
