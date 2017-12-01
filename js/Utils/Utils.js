// Generated by CoffeeScript 1.10.0
(function() {
  var hasProp = {}.hasOwnProperty;

  define(['paper', 'R', 'Utils/CoordinateSystems', 'underscore', 'jquery', 'tinycolor2', 'bootstrap'], function(P, R, CS, _, $, tinycolor, bs) {
    var EPSILON, Formatter, Utils, __nativeSI__, __nativeST__, checkError, sqrtTwoPi;
    if (typeof window !== "undefined" && window !== null) {
      window.tinycolor = tinycolor;
    }
    if (typeof window !== "undefined" && window !== null) {
      window.P = P;
    }
    Utils = {};
    Utils.CS = CS;
    $.ajaxSetup({
      beforeSend: function(xhr, settings) {
        var getCookie;
        getCookie = function(name) {
          var cookie, cookieValue, cookies, i;
          cookieValue = null;
          if (document.cookie && document.cookie !== '') {
            cookies = document.cookie.split(';');
            i = 0;
            while (i < cookies.length) {
              cookie = jQuery.trim(cookies[i]);
              if (cookie.substring(0, name.length + 1) === name + '=') {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
              }
              i++;
            }
          }
          return cookieValue;
        };
        if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
          xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        }
      }
    });
    R.commeUnDesseinURL = 'http://localhost:8000/';
    R.OSName = "Unknown OS";
    if (navigator.appVersion.indexOf("Win") !== -1) {
      R.OSName = "Windows";
    }
    if (navigator.appVersion.indexOf("Mac") !== -1) {
      R.OSName = "MacOS";
    }
    if (navigator.appVersion.indexOf("X11") !== -1) {
      R.OSName = "UNIX";
    }
    if (navigator.appVersion.indexOf("Linux") !== -1) {
      R.OSName = "Linux";
    }
    R.templatesJ = $("#templates");
    if (document.all && !window.setTimeout.isPolyfill) {
      __nativeST__ = window.setTimeout;
      window.setTimeout = function(vCallback, nDelay) {
        var aArgs;
        aArgs = Array.prototype.slice.call(arguments, 2);
        return __nativeST__((vCallback instanceof Function ? function() {
          return vCallback.apply(null, aArgs);
        } : vCallback), nDelay);
      };
      window.setTimeout.isPolyfill = true;
    }
    if (document.all && !window.setInterval.isPolyfill) {
      __nativeSI__ = window.setInterval;
      window.setInterval = function(vCallback, nDelay) {
        var aArgs;
        aArgs = Array.prototype.slice.call(arguments, 2);
        return __nativeSI__((vCallback instanceof Function ? function() {
          return vCallback.apply(null, aArgs);
        } : vCallback), nDelay);
      };
    }
    window.setInterval.isPolyfill = true;
    Utils.URL = {};
    Utils.URL.getParameters = R.getParameters;
    Utils.URL.setParameters = function(parameters) {
      var hash, name, value;
      hash = '';
      for (name in parameters) {
        value = parameters[name];
        hash += '&' + name + "=" + value;
      }
      hash = hash.replace('&', '');
      return hash;
    };
    Utils.LocalStorage = {};
    Utils.LocalStorage.set = function(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    };
    Utils.LocalStorage.get = function(key) {
      var value;
      value = localStorage.getItem(key);
      return value && JSON.parse(value);
    };
    Utils.specialKeys = {
      8: 'backspace',
      9: 'tab',
      13: 'enter',
      16: 'shift',
      17: 'control',
      18: 'option',
      19: 'pause',
      20: 'caps-lock',
      27: 'escape',
      32: 'space',
      35: 'end',
      36: 'home',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      46: 'delete',
      91: 'command',
      93: 'command',
      224: 'command'
    };
    Utils.createId = function() {
      return ('' + Math.random()).substring(2) + '-' + Date.now();
    };
    Utils.sign = function(x) {
      if (typeof x === "number") {
        if (x) {
          if (x < 0) {
            return -1;
          } else {
            return 1;
          }
        } else {
          if (x === x) {
            return 0;
          } else {
            return NaN;
          }
        }
      } else {
        return NaN;
      }
    };
    Utils.clamp = function(min, value, max) {
      return Math.min(Math.max(value, min), max);
    };
    Utils.random = function(min, max) {
      return min + Math.random() * (max - min);
    };
    Utils.clone = function(object) {
      return $.extend({}, object);
    };
    Utils.Array = {};
    Utils.Array.remove = function(array, itemToRemove) {
      var i;
      if (!Array.prototype.isPrototypeOf(array)) {
        return;
      }
      i = array.indexOf(itemToRemove);
      if (i >= 0) {
        array.splice(i, 1);
      }
    };
    Utils.Array.random = function(array) {
      return array[Math.floor(Math.random() * array.length)];
    };
    Utils.Array.max = function(array) {
      var item, j, len, max;
      max = array[0];
      for (j = 0, len = array.length; j < len; j++) {
        item = array[j];
        if (item > max) {
          max = item;
        }
      }
      return max;
    };
    Utils.Array.min = function(array) {
      var item, j, len, min;
      min = array[0];
      for (j = 0, len = array.length; j < len; j++) {
        item = array[j];
        if (item < min) {
          min = item;
        }
      }
      return min;
    };
    Utils.Array.maxc = function(array, biggerThan) {
      var item, j, len, max;
      max = array[0];
      for (j = 0, len = array.length; j < len; j++) {
        item = array[j];
        if (biggerThan(item, max)) {
          max = item;
        }
      }
      return max;
    };
    Utils.Array.minc = function(array, smallerThan) {
      var item, j, len, min;
      min = array[0];
      for (j = 0, len = array.length; j < len; j++) {
        item = array[j];
        if (smallerThan(item, min)) {
          min = item;
        }
      }
      return min;
    };
    Utils.Array.isArray = function(array) {
      return array.constructor === Array;
    };
    Utils.Array.pushIfAbsent = function(array, item) {
      if (array.indexOf(item) < 0) {
        array.push(item);
      }
    };
    R.updateTimeout = {};
    R.requestedCallbacks = {};
    Utils.deferredExecutionCallbackWrapper = function(callback, id, args, oThis) {
      delete R.updateTimeout[id];
      if (args == null) {
        if (typeof callback === "function") {
          callback();
        }
      } else {
        if (callback != null) {
          callback.apply(oThis, args);
        }
      }
    };
    Utils.deferredExecution = function(callback, id, n, args, oThis) {
      if (n == null) {
        n = 500;
      }
      if (id == null) {
        return;
      }
      if (R.updateTimeout[id] != null) {
        clearTimeout(R.updateTimeout[id]);
      }
      R.updateTimeout[id] = setTimeout(Utils.deferredExecutionCallbackWrapper, n, callback, id, args, oThis);
    };
    Utils.callNextFrame = function(callback, id, args) {
      var base, callbackWrapper;
      if (id == null) {
        id = callback;
      }
      callbackWrapper = function() {
        delete R.requestedCallbacks[id];
        if (args == null) {
          callback();
        } else {
          callback.apply(window, args);
        }
      };
      if ((base = R.requestedCallbacks)[id] == null) {
        base[id] = window.requestAnimationFrame(callbackWrapper);
      }
    };
    Utils.cancelCallNextFrame = function(idToCancel) {
      window.cancelAnimationFrame(R.requestedCallbacks[idToCancel]);
      delete R.requestedCallbacks[idToCancel];
    };
    sqrtTwoPi = Math.sqrt(2 * Math.PI);
    Utils.gaussian = function(mean, sigma, x) {
      var expf;
      expf = -((x - mean) * (x - mean) / (2 * sigma * sigma));
      return (1.0 / (sigma * sqrtTwoPi)) * Math.exp(expf);
    };
    Utils.isEmpty = function(map) {
      var key, value;
      for (key in map) {
        value = map[key];
        if (map.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    };
    Utils.capitalizeFirstLetter = function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };
    Utils.linearInterpolation = function(v1, v2, f) {
      return v1 * (1 - f) + v2 * f;
    };
    Utils.floorToMultiple = function(x, m) {
      return Math.floor(x / m) * m;
    };
    Utils.ceilToMultiple = function(x, m) {
      return Math.ceil(x / m) * m;
    };
    Utils.roundToMultiple = function(x, m) {
      return Math.round(x / m) * m;
    };
    Utils.floorPointToMultiple = function(point, m) {
      return new P.Point(Utils.floorToMultiple(point.x, m), Utils.floorToMultiple(point.y, m));
    };
    Utils.ceilPointToMultiple = function(point, m) {
      return new P.Point(Utils.ceilToMultiple(point.x, m), Utils.ceilToMultiple(point.y, m));
    };
    Utils.roundPointToMultiple = function(point, m) {
      return new P.Point(Utils.roundToMultiple(point.x, m), Utils.roundToMultiple(point.y, m));
    };
    Utils.Rectangle = {};
    Utils.Rectangle.updatePathRectangle = function(path, rectangle) {
      path.segments[0].point = rectangle.bottomLeft;
      path.segments[1].point = rectangle.topLeft;
      path.segments[2].point = rectangle.topRight;
      path.segments[3].point = rectangle.bottomRight;
    };
    Utils.Rectangle.getRotatedBounds = function(rectangle, rotation) {
      var bottomLeft, bottomRight, bounds, topLeft, topRight;
      if (rotation == null) {
        rotation = 0;
      }
      topLeft = rectangle.topLeft.subtract(rectangle.center);
      topLeft.angle += rotation;
      bottomRight = rectangle.bottomRight.subtract(rectangle.center);
      bottomRight.angle += rotation;
      bottomLeft = rectangle.bottomLeft.subtract(rectangle.center);
      bottomLeft.angle += rotation;
      topRight = rectangle.topRight.subtract(rectangle.center);
      topRight.angle += rotation;
      bounds = new P.Rectangle(rectangle.center.add(topLeft), rectangle.center.add(bottomRight));
      bounds = bounds.include(rectangle.center.add(bottomLeft));
      bounds = bounds.include(rectangle.center.add(topRight));
      return bounds;
    };
    Utils.Rectangle.shrinkRectangleToInteger = function(rectangle) {
      return new P.Rectangle(rectangle.topLeft.ceil(), rectangle.bottomRight.floor());
    };
    Utils.Rectangle.expandRectangleToInteger = function(rectangle) {
      return new P.Rectangle(rectangle.topLeft.floor(), rectangle.bottomRight.ceil());
    };
    Utils.Rectangle.expandRectangleToMultiple = function(rectangle, multiple) {
      return new P.Rectangle(Utils.floorPointToMultiple(rectangle.topLeft, multiple), Utils.ceilPointToMultiple(rectangle.bottomRight, multiple));
    };
    Utils.Rectangle.roundRectangle = function(rectangle) {
      return new P.Rectangle(rectangle.topLeft.round(), rectangle.bottomRight.round());
    };
    P.Point.prototype.toJSON = function() {
      return {
        x: this.x,
        y: this.y
      };
    };
    P.Point.prototype.exportJSON = function() {
      return JSON.stringify(this.toJSON());
    };
    P.Rectangle.prototype.toJSON = function() {
      return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      };
    };
    P.Rectangle.prototype.exportJSON = function() {
      return JSON.stringify(this.toJSON());
    };
    P.Rectangle.prototype.translate = function(point) {
      return new P.Rectangle(this.x + point.x, this.y + point.y, this.width, this.height);
    };
    P.Rectangle.prototype.scaleFromCenter = function(scale, center) {
      var delta, topLeft;
      delta = this.topLeft.subtract(center);
      delta = delta.multiply(scale.x, scale.y);
      topLeft = center.add(delta);
      return new P.Rectangle(topLeft, new P.Size(this.width * scale.x, this.height * scale.y));
    };
    P.Rectangle.prototype.moveSide = function(sideName, destination) {
      switch (sideName) {
        case 'left':
          this.x = destination;
          break;
        case 'right':
          this.x = destination - this.width;
          break;
        case 'top':
          this.y = destination;
          break;
        case 'bottom':
          this.y = destination - this.height;
      }
    };
    P.Rectangle.prototype.moveCorner = function(cornerName, destination) {
      switch (cornerName) {
        case 'topLeft':
          this.x = destination.x;
          this.y = destination.y;
          break;
        case 'topRight':
          this.x = destination.x - this.width;
          this.y = destination.y;
          break;
        case 'bottomRight':
          this.x = destination.x - this.width;
          this.y = destination.y - this.height;
          break;
        case 'bottomLeft':
          this.x = destination.x;
          this.y = destination.y - this.height;
      }
    };
    P.Rectangle.prototype.moveCenter = function(destination) {
      this.x = destination.x - this.width * 0.5;
      this.y = destination.y - this.height * 0.5;
    };
    P.Event.prototype.toJSON = function() {
      var event;
      event = {
        modifiers: this.modifiers,
        event: {
          which: this.event.which
        },
        point: this.point,
        downPoint: this.downPoint,
        delta: this.delta,
        middlePoint: this.middlePoint,
        type: this.type,
        count: this.count
      };
      return event;
    };
    P.Event.prototype.fromJSON = function(event) {
      if (event.point != null) {
        event.point = new P.Point(event.point);
      }
      if (event.downPoint != null) {
        event.downPoint = new P.Point(event.downPoint);
      }
      if (event.delta != null) {
        event.delta = new P.Point(event.delta);
      }
      if (event.middlePoint != null) {
        event.middlePoint = new P.Point(event.middlePoint);
      }
      return event;
    };
    Utils.Event = {};
    Utils.Event.GetPoint = function(event) {
      if ((event.originalEvent != null) && (typeof TouchEvent !== "undefined" && TouchEvent !== null) && event.originalEvent instanceof TouchEvent) {
        return new P.Point(event.originalEvent.touches[0].pageX, event.originalEvent.touches[0].pageY);
      } else {
        return new P.Point(event.pageX, event.pageY);
      }
    };
    Utils.Event.jEventToPoint = function(event) {
      var point;
      point = Utils.Event.GetPoint(event);
      return P.view.viewToProject(new P.Point(point.x - R.canvasJ.offset().left, point.y - R.canvasJ.offset().top));
    };
    Utils.Event.jEventToPaperEvent = function(event, previousPosition, initialPosition, type, count) {
      var currentPosition, delta, paperEvent;
      if (previousPosition == null) {
        previousPosition = null;
      }
      if (initialPosition == null) {
        initialPosition = null;
      }
      if (type == null) {
        type = null;
      }
      if (count == null) {
        count = null;
      }
      currentPosition = Utils.Event.jEventToPoint(event);
      if (previousPosition == null) {
        previousPosition = currentPosition;
      }
      if (initialPosition == null) {
        initialPosition = currentPosition;
      }
      delta = currentPosition.subtract(previousPosition);
      paperEvent = {
        modifiers: {
          shift: event.shiftKey,
          control: event.ctrlKey,
          option: event.altKey,
          command: event.metaKey
        },
        point: currentPosition,
        downPoint: initialPosition,
        delta: delta,
        middlePoint: previousPosition.add(delta.divide(2)),
        type: type,
        count: count
      };
      return paperEvent;
    };
    R.specialKey = function(event) {
      var specialKey;
      if (event instanceof Event) {
        specialKey = R.OSName === "MacOS" ? event.metaKey : event.ctrlKey;
      } else {
        specialKey = R.OSName === "MacOS" ? event.modifiers.command : event.modifiers.control;
      }
      return specialKey;
    };
    Utils.Snap = {};
    Utils.Snap.getSnap = function() {
      return R.parameters.General.snap.value;
    };
    Utils.Snap.snap = function(event, from) {
      var snap, snappedEvent;
      if (from == null) {
        from = R.me;
      }
      if (from !== R.me) {
        return event;
      }
      if (R.selectedTool.disableSnap()) {
        return event;
      }
      snap = R.parameters.General.snap.value;
      if (snap !== 0) {
        snappedEvent = jQuery.extend({}, event);
        snappedEvent.modifiers = event.modifiers;
        snappedEvent.point = Utils.Snap.snap2D(event.point, snap);
        if (event.lastPoint != null) {
          snappedEvent.lastPoint = Utils.Snap.snap2D(event.lastPoint, snap);
        }
        if (event.downPoint != null) {
          snappedEvent.downPoint = Utils.Snap.snap2D(event.downPoint, snap);
        }
        if (event.lastPoint != null) {
          snappedEvent.middlePoint = snappedEvent.point.add(snappedEvent.lastPoint).multiply(0.5);
        }
        if (event.type !== 'mouseup' && (event.lastPoint != null)) {
          snappedEvent.delta = snappedEvent.point.subtract(snappedEvent.lastPoint);
        } else if (event.downPoint != null) {
          snappedEvent.delta = snappedEvent.point.subtract(snappedEvent.downPoint);
        }
        return snappedEvent;
      } else {
        return event;
      }
    };
    Utils.Snap.snap1D = function(value, snap) {
      if (snap == null) {
        snap = Utils.Snap.getSnap();
      }
      if (snap !== 0) {
        return Math.round(value / snap) * snap;
      } else {
        return value;
      }
    };
    Utils.Snap.snap2D = function(point, snap) {
      if (snap == null) {
        snap = Utils.Snap.getSnap();
      }
      if (snap !== 0) {
        return new P.Point(Utils.Snap.snap1D(point.x, snap), Utils.Snap.snap1D(point.y, snap));
      } else {
        return point;
      }
    };
    Utils.Animation = {};
    Utils.Animation.registerAnimation = function(item) {
      Utils.Array.pushIfAbsent(R.animatedItems, item);
    };
    Utils.Animation.deregisterAnimation = function(item) {
      Utils.Array.remove(R.animatedItems, item);
    };
    Utils.stringToPoint = function(string) {
      var p, pos;
      pos = string.split(',');
      p = new P.Point(parseFloat(pos[0]), parseFloat(pos[1]));
      if (!_.isFinite(p.x)) {
        p.x = 0;
      }
      if (!_.isFinite(p.y)) {
        p.y = 0;
      }
      return p;
    };
    Utils.pointToString = function(point, precision) {
      if (precision == null) {
        precision = 2;
      }
      return point.x.toFixed(precision).replace(/\.?0+$/, '') + ',' + point.y.toFixed(precision).replace(/\.?0+$/, '');
    };
    Utils.logElapsedTime = function() {
      var time;
      time = (Date.now() - R.startTime) / 1000;
      console.log("Time elapsed: " + time + " sec.");
    };
    Utils.defaultCallback = function(a) {
      console.log(a);
    };
    Utils.defineRequireJsModule = function(moduleName, resultName) {
      require([moduleName], function(result) {
        return window[resultName] = result;
      });
    };
    Formatter = P.Base.extend({
      initialize: function(precision) {
        this.precision = P.Base.pick(precision, 5);
        this.multiplier = Math.pow(10, this.precision);
      },
      number: function(val) {
        if (this.precision < 16) {
          return Math.round(val * this.multiplier) / this.multiplier;
        } else {
          return val;
        }
      },
      pair: function(val1, val2, separator) {
        return this.number(val1) + (separator || ',') + this.number(val2);
      },
      point: function(val, separator) {
        return this.number(val.x) + (separator || ',') + this.number(val.y);
      },
      size: function(val, separator) {
        return this.number(val.width) + (separator || ',') + this.number(val.height);
      },
      rectangle: function(val, separator) {
        return this.point(val, separator) + (separator || ',') + this.size(val, separator);
      }
    });
    Utils.formatter = new Formatter();
    EPSILON = 1e-12;
    Utils.isZero = function(val) {
      return val >= -EPSILON && val <= EPSILON;
    };
    Utils.getSVGTransform = function(matrix, coordinates, center) {
      var angle, attrs, decomposed, parts, point, scale, skew, trans;
      if (coordinates == null) {
        coordinates = false;
      }
      if (center == null) {
        center = null;
      }
      attrs = new P.Base();
      trans = matrix.getTranslation();
      if (coordinates) {
        matrix = matrix._shiftless();
        point = matrix._inverseTransform(trans);
        attrs[center ? 'cx' : 'x'] = point.x;
        attrs[center ? 'cy' : 'y'] = point.y;
        trans = null;
      }
      if (!matrix.isIdentity()) {
        decomposed = matrix.decompose();
        if (decomposed) {
          parts = [];
          angle = decomposed.rotation;
          scale = decomposed.scaling;
          skew = decomposed.skewing;
          if (trans && !trans.isZero()) {
            parts.push('translate(' + Utils.formatter.point(trans) + ')');
          }
          if (angle) {
            parts.push('rotate(' + Utils.formatter.number(angle) + ')');
          }
          if (!Utils.isZero(scale.x - 1) || !Utils.isZero(scale.y - 1)) {
            parts.push('scale(' + Utils.formatter.point(scale) + ')');
          }
          if (skew.x) {
            parts.push('skewX(' + Utils.formatter.number(skew.x) + ')');
          }
          if (skew.y) {
            parts.push('skewY(' + Utils.formatter.number(skew.y) + ')');
          }
          attrs.transform = parts.join(' ');
        } else {
          attrs.transform = 'matrix(' + matrix.getValues().join(',') + ')';
        }
      }
      return attrs;
    };
    Utils.xmlSerializer = new XMLSerializer();
    R.startTime = Date.now();
    R.startTimer = function() {
      R.timerStartTime = Date.now();
    };
    R.stopTimer = function(message) {
      var time;
      time = (Date.now() - R.timerStartTime) / 1000;
      console.log("" + message + ": " + time + " sec.");
    };
    checkError = function(results) {
      if (!R.loader.checkError(results)) {
        return false;
      }
      console.log(results.message);
      console.log(results.status);
      console.log(results.state);
      return true;
    };
    R.setDebugMode = function(debugMode) {
      if (!R.administrator) {
        return false;
      }
      $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            "function": 'setDebugMode',
            args: {
              debug: debugMode
            }
          })
        }
      }).done(checkError);
    };
    R.removeDeadReferences = function() {
      if (!R.administrator) {
        return false;
      }
      $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            "function": 'removeDeadReferences',
            args: {}
          })
        }
      }).done(checkError);
    };
    R.setDrawingMode = function(mode) {
      if (!R.administrator) {
        return false;
      }
      $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            "function": 'setDrawingMode',
            args: {
              mode: mode
            }
          })
        }
      }).done(checkError);
    };
    R.setDrawingStatus = function(drawingPk, status) {
      var args;
      if (!R.administrator) {
        return false;
      }
      if (!drawingPk) {
        console.log("setDrawingStatus(drawingPk, status)");
      }
      args = {
        pk: drawingPk,
        status: status
      };
      $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            "function": 'setDrawingStatus',
            args: args
          })
        }
      }).done(checkError);
    };
    R.setNegativeVoteThreshold = function(voteThreshold) {
      if (!R.administrator) {
        return false;
      }
      $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            "function": 'setNegativeVoteThreshold',
            args: {
              voteThreshold: voteThreshold
            }
          })
        }
      }).done(checkError);
    };
    R.setPositiveVoteThreshold = function(voteThreshold) {
      if (!R.administrator) {
        return false;
      }
      $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            "function": 'setPositiveVoteThreshold',
            args: {
              voteThreshold: voteThreshold
            }
          })
        }
      }).done(checkError);
    };
    R.setVoteValidationDelay = function(hours, minutes, seconds) {
      if (!R.administrator) {
        return false;
      }
      $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            "function": 'setVoteValidationDelay',
            args: {
              hours: hours,
              minutes: minutes,
              seconds: seconds
            }
          })
        }
      }).done(checkError);
    };
    R.setVoteMinDuration = function(hours, minutes, seconds) {
      if (!R.administrator) {
        return false;
      }
      $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            "function": 'setVoteMinDuration',
            args: {
              hours: hours,
              minutes: minutes,
              seconds: seconds
            }
          })
        }
      }).done(checkError);
    };
    R.setVoteParameters = function(negativeVoteThreshold, positiveVoteThreshold, voteValidationDelayInSeconds, voteMinDurationInSeconds) {
      if (negativeVoteThreshold == null) {
        negativeVoteThreshold = 2;
      }
      if (positiveVoteThreshold == null) {
        positiveVoteThreshold = 2;
      }
      if (voteValidationDelayInSeconds == null) {
        voteValidationDelayInSeconds = 1;
      }
      if (voteMinDurationInSeconds == null) {
        voteMinDurationInSeconds = 5;
      }
      if (!R.administrator) {
        return false;
      }
      R.setNegativeVoteThreshold(negativeVoteThreshold);
      R.setPositiveVoteThreshold(positiveVoteThreshold);
      R.setVoteValidationDelay(0, 0, voteValidationDelayInSeconds);
      R.setVoteMinDuration(0, 0, voteMinDurationInSeconds);
    };
    R.setSelectedDrawingsToCity = function(city) {
      var args;
      args = {
        pk: R.s.pk,
        city: {
          name: city
        }
      };
      $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            "function": 'setDrawingToCity',
            args: args
          })
        }
      }).done(checkError);
    };
    R.updateDrawings = function() {
      $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            "function": 'updateDrawings',
            args: {}
          })
        }
      }).done(checkError);
    };
    R.validateDrawing = function() {
      var ref;
      if (((ref = R.s) != null ? ref.pk : void 0) == null) {
        return;
      }
      $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            "function": 'validateDrawing',
            args: {
              pk: R.s.pk
            }
          })
        }
      }).done(checkError);
    };
    R.createDrawingThumbnail = function() {
      var imageURL;
      imageURL = R.view.getThumbnail(R.s, 1200, 630, true, true);
      $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            "function": 'createDrawingThumbnail',
            args: {
              png: imageURL,
              pk: R.s.pk
            }
          })
        }
      }).done(checkError);
    };
    R.getEmail = function(username) {
      $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            "function": 'getEmail',
            args: {
              username: username
            }
          })
        }
      }).done((function(_this) {
        return function(result) {
          if (!checkError(result)) {
            return;
          }
          console.log(result.email);
        };
      })(this));
    };
    R.confirmEmail = function(username) {
      $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            "function": 'confirmEmail',
            args: {
              username: username
            }
          })
        }
      }).done((function(_this) {
        return function(result) {
          if (!checkError(result)) {
            return;
          }
          console.log(result.email);
        };
      })(this));
    };
    R.checkDrawing = function() {
      var args, draft, drawing, j, len, ref;
      ref = R.drawings;
      for (j = 0, len = ref.length; j < len; j++) {
        drawing = ref[j];
        if (drawing !== R.s) {
          drawing.remove();
        }
      }
      draft = R.Drawing.getDraft();
      args = {
        pk: R.s.pk,
        loadPathList: true
      };
      $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            'function': 'loadDrawing',
            args: args
          })
        }
      }).done((function(_this) {
        return function(results) {
          drawing = JSON.parse(results.drawing);
          if (draft != null) {
            draft.removePaths();
          }
          draft = new R.Drawing(null, null, null, null, R.me, Date.now(), null, null, 'draft');
          R.drawingToCheck = drawing;
          R.currentPathToCheck = drawing.pathList.length;
        };
      })(this));
      $(window).keyup((function(_this) {
        return function(event) {
          var k, len1, path, ref1;
          draft = R.Drawing.getDraft();
          if (event.key === 'a') {
            R.currentPathToCheck--;
            if (R.currentPathToCheck >= 0) {
              draft.addPathsFromPathList([R.drawingToCheck.pathList[R.currentPathToCheck]], true, true);
            } else {
              R.currentPathToCheck = 0;
            }
            console.log(R.currentPathToCheck, R.drawingToCheck.pathList.length);
          }
          if (event.key === 'z') {
            R.currentPathToCheck++;
            if (R.currentPathToCheck < R.drawingToCheck.pathList.length) {
              draft.paths[draft.paths.length - 1].remove();
            } else {
              R.currentPathToCheck = R.drawingToCheck.pathList.length;
            }
            console.log(R.currentPathToCheck, R.drawingToCheck.pathList.length);
          }
          if (event.key === 'p') {
            args = {
              city: R.city,
              clientId: draft.id,
              date: Date.now(),
              title: 'TEST',
              description: '',
              points: null
            };
            draft.group = new P.Group();
            ref1 = draft.paths;
            for (k = 0, len1 = ref1.length; k < len1; k++) {
              path = ref1[k];
              draft.addPathToSave(path);
            }
            draft.computeRectangle();
            $.ajax({
              method: "POST",
              url: "ajaxCall/",
              data: {
                data: JSON.stringify({
                  "function": 'saveDrawing',
                  args: args
                })
              }
            }).done(function(results) {
              if (!R.loader.checkError(results)) {
                return;
              }
              draft.saveCallback(results);
              R.drawingPanel.submitDrawingClicked();
            });
          }
        };
      })(this));
    };
    R.updateDrawingSVGs = function() {
      var args, drawing, id, item, j, len, ref, ref1;
      R.Drawing.addPaths();
      ref = R.drawings;
      for (j = 0, len = ref.length; j < len; j++) {
        drawing = ref[j];
        R.view.mainLayer.addChild(drawing.group);
      }
      ref1 = R.items;
      for (id in ref1) {
        if (!hasProp.call(ref1, id)) continue;
        item = ref1[id];
        if (item instanceof R.Drawing) {
          args = {
            pk: item.pk,
            svg: item.getSVG()
          };
          $.ajax({
            method: "POST",
            url: "ajaxCall/",
            data: {
              data: JSON.stringify({
                "function": 'updateDrawingSVG',
                args: args
              })
            }
          }).done(checkError);
        }
      }
    };
    R.updateDrawingBounds = function() {
      var args, group, item, j, len, ref, svg;
      ref = R.drawings;
      for (j = 0, len = ref.length; j < len; j++) {
        item = ref[j];
        group = item.convertToGroup();
        svg = group.exportSVG({
          asString: true
        });
        args = {
          pk: item.pk,
          svg: svg,
          bounds: JSON.stringify(group.bounds)
        };
        $.ajax({
          method: "POST",
          url: "ajaxCall/",
          data: {
            data: JSON.stringify({
              "function": 'updateDrawingBounds',
              args: args
            })
          }
        }).done(checkError);
      }
    };
    R.saveSVG = function() {
      var blob, link, svg, url;
      svg = P.project.exportSVG({
        asString: true
      });
      blob = new Blob([svg], {
        type: 'image/svg+xml'
      });
      url = URL.createObjectURL(blob);
      link = document.createElement("a");
      document.body.appendChild(link);
      link.download = 'indian.svg';
      link.href = url;
      link.click();
      document.body.removeChild(link);
    };
    R.saveSVGfromSVG = function() {
      var blob, filename, link, svgData, url;
      R.svgJ.find('#grid').hide();
      R.svgJ.attr('width', 1000);
      R.svgJ.attr('height', 700);
      R.stageJ.width(1000);
      R.stageJ.height(700);
      R.view.fitRectangle(R.view.grid.limitCD.bounds.expand(0), true);
      filename = 'CommeUnDessein.svg';
      svgData = (new XMLSerializer()).serializeToString(R.svgJ.get(0));
      link = document.createElement("a");
      document.body.appendChild(link);
      blob = new Blob([svgData], {
        type: 'image/svg+xml'
      });
      url = URL.createObjectURL(blob);
      link.href = url;
      link.download = filename;
      link.text = filename;
      link.click();
      document.body.removeChild(link);
    };
    R.deleteAllItems = function(confirm) {
      var args;
      args = {
        confirm: confirm
      };
      $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            "function": 'deleteAllItems',
            args: args
          })
        }
      }).done(checkError);
    };
    R.deleteDrawing = function(drawingPkToDelete, confirm) {
      return R.deleteDrawings([drawingPkToDelete], confirm);
    };
    R.deleteDrawings = function(drawingPksToDelete, confirm) {
      var args;
      args = {
        drawingsToDelete: drawingPksToDelete,
        confirm: confirm
      };
      $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            "function": 'deleteDrawings',
            args: args
          })
        }
      }).done(checkError);
    };
    R.createUsers = function(logins) {
      $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            "function": 'createUsers',
            args: {
              logins: logins
            }
          })
        }
      }).done(checkError);
    };
    R.deleteUsers = function(logins) {
      $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            "function": 'deleteUsers',
            args: {
              logins: logins
            }
          })
        }
      }).done(checkError);
    };
    R.loadAdmin = function() {
      var prefix;
      prefix = window.location.hash.length === 0 || window.location.href.indexOf('#') === -1 ? '#' : '&';
      window.location += prefix + 'administrator=true';
      R.administrator = true;
    };
    R.deleteItems = function(itemsToDelete, confirm) {
      var args;
      console.log("itemsToDelete: [\n	{\n		itemType: 'Drawing'\n		pks: [data.pk]\n	},\n	{\n		itemType: 'Path'\n		pks: [data.pathPks]\n	}\n]");
      args = {
        itemsToDelete: itemsToDelete,
        confirm: confirm
      };
      $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            "function": 'deleteItems',
            args: args
          })
        }
      }).done(checkError);
    };
    R.Utils = Utils;
    return Utils;
  });

}).call(this);
