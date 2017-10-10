// Generated by CoffeeScript 1.10.0
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['paper', 'R', 'Utils/Utils', 'i18next'], function(P, R, Utils, i18next) {
    var AlertManager;
    AlertManager = (function() {
      AlertManager.hideDelay = 10000;

      function AlertManager() {
        this.hide = bind(this.hide, this);
        this.hideDeferred = bind(this.hideDeferred, this);
        this.show = bind(this.show, this);
        this.alertsContainer = $("#CommeUnDessein_alerts");
        this.alertsContainer.find('button.show').click(this.show);
        this.alertsContainer.on({
          touchstart: this.show
        });
        this.alerts = [];
        this.currentAlert = -1;
        this.alertTimeOut = null;
        this.alertsContainer.find(".btn-up").click((function(_this) {
          return function() {
            return _this.showAlert(_this.currentAlert - 1);
          };
        })(this));
        this.alertsContainer.find(".btn-down").click((function(_this) {
          return function() {
            return _this.showAlert(_this.currentAlert + 1);
          };
        })(this));
        this.alertsContainer.find(".btn-close").click((function(_this) {
          return function() {
            R.ignoreNextAlert = true;
            localStorage.setItem('showWelcomMessage', R.me);
            console.log(localStorage.getItem('showWelcomMessage'));
            _this.hide();
          };
        })(this));
        return;
      }

      AlertManager.prototype.showAlert = function(index) {
        var alertData, alertJ, messageOptions, newAlertJ, previousType, ref, ref1, text;
        if (this.alerts.length <= 0 || index < 0 || index >= this.alerts.length) {
          return;
        }
        previousType = (ref = this.alerts[this.currentAlert]) != null ? ref.type : void 0;
        this.currentAlert = index;
        alertData = this.alerts[this.currentAlert];
        alertJ = this.alertsContainer.find(".alert");
        messageOptions = '';
        if ((alertData.messageOptions != null) && (alertData.messageOptions.html == null)) {
          messageOptions = "data-i18n-options='" + JSON.stringify(alertData.messageOptions) + "'";
        }
        newAlertJ = $("<div class='alert fade in' data-i18n='" + alertData.message + "' " + messageOptions + ">");
        newAlertJ.addClass(alertData.type);
        if (((ref1 = alertData.messageOptions) != null ? ref1.html : void 0) != null) {
          newAlertJ.append(alertData.messageOptions.html);
        } else {
          text = alertData.messageOptions != null ? i18next.t(alertData.message.replace(/\./g, ''), alertData.messageOptions) : i18next.t(alertData.message);
          newAlertJ.text(text);
        }
        newAlertJ.insertAfter(alertJ);
        alertJ.remove();
        this.alertsContainer.find(".alert-number").text(this.currentAlert + 1);
      };

      AlertManager.prototype.alert = function(message, type, delay, messageOptions) {
        var alertJ;
        if (type == null) {
          type = "";
        }
        if (delay == null) {
          delay = this.constructor.hideDelay;
        }
        if (messageOptions == null) {
          messageOptions = null;
        }
        if (type.length === 0) {
          type = "info";
        } else if (type === "error") {
          type = "danger";
        }
        type = " alert-" + type;
        alertJ = this.alertsContainer.find(".alert");
        this.alertsContainer.removeClass("r-hidden");
        this.alerts.push({
          type: type,
          message: message,
          messageOptions: messageOptions
        });
        if (this.alerts.length > 0) {
          this.alertsContainer.addClass("activated");
          $('body').addClass("alert-activated");
        }
        this.showAlert(this.alerts.length - 1);
        this.show();
        this.hideDeferred(delay);
      };

      AlertManager.prototype.show = function() {
        var alertJ, blink, suffix;
        if (this.alertTimeOut != null) {
          clearTimeout(this.alertTimeOut);
          this.alertTimeOut = null;
        }
        alertJ = this.alertsContainer.find(".alert");
        alertJ.css({
          'background-color': null
        });
        R.alertManager.alertsContainer.addClass('show');
        R.sidebar.sidebarJ.addClass('r-alert');
        suffix = R.alertManager.alertsContainer.hasClass('top') ? '-top' : '';
        R.drawingPanel.drawingPanelJ.addClass('r-alert' + suffix);
        $('#submit-drawing-button').addClass('r-alert' + suffix);
        this.openning = true;
        setTimeout(((function(_this) {
          return function() {
            return _this.openning = null;
          };
        })(this)), 500);
        this.nBlinks = 0;
        if (this.blinkIntervalID != null) {
          clearInterval(this.blinkIntervalID);
          this.blinkIntervalID = null;
        }
        blink = (function(_this) {
          return function() {
            var backgroundColor;
            _this.nBlinks++;
            if (_this.nBlinks > 4) {
              clearInterval(_this.blinkIntervalID);
              _this.blinkIntervalID = null;
            }
            backgroundColor = alertJ.css('background-color');
            alertJ.css({
              'background-color': 'white'
            });
            alertJ.animate({
              'background-color': backgroundColor
            }, 250);
          };
        })(this);
        blink();
        this.blinkIntervalID = setInterval(blink, 300);
      };

      AlertManager.prototype.hideDeferred = function(delay) {
        if (delay == null) {
          delay = this.constructor.hideDelay;
        }
        if (delay !== 0) {
          if (this.alertTimeOut != null) {
            clearTimeout(this.alertTimeOut);
            this.alertTimeOut = null;
          }
          this.alertTimeOut = setTimeout(this.hide, delay);
        }
      };

      AlertManager.prototype.hideIfNoTimeout = function() {
        if ((this.alertTimeOut == null) && !this.openning) {
          this.hide();
        }
      };

      AlertManager.prototype.hide = function() {
        var suffix;
        if (this.alertTimeOut != null) {
          clearTimeout(this.alertTimeOut);
          this.alertTimeOut = null;
        }
        this.alertsContainer.removeClass("show");
        R.sidebar.sidebarJ.removeClass('r-alert');
        suffix = R.alertManager.alertsContainer.hasClass('top') ? '-top' : '';
        R.drawingPanel.drawingPanelJ.removeClass('r-alert' + suffix);
        $('#submit-drawing-button').removeClass('r-alert' + suffix);
      };

      return AlertManager;

    })();
    return AlertManager;
  });

}).call(this);
