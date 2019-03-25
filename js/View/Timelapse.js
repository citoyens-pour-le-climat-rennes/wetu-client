// Generated by CoffeeScript 1.12.7
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['paper', 'R', 'Utils/Utils', 'Items/Item', 'i18next', 'moment'], function(P, R, Utils, Item, i18next, moment) {
    var Timelapse;
    return Timelapse = (function() {
      Timelapse.duration = 2 * 60 * 1000;

      function Timelapse() {
        this.load = bind(this.load, this);
        this.loadTimelapseDataFromDatabase = bind(this.loadTimelapseDataFromDatabase, this);
        this.handleTimelapseData = bind(this.handleTimelapseData, this);
        this.loadOneByOne = bind(this.loadOneByOne, this);
        this.createTimeline = bind(this.createTimeline, this);
        this.mouseUp = bind(this.mouseUp, this);
        this.mouseMove = bind(this.mouseMove, this);
        this.mouseDown = bind(this.mouseDown, this);
        this.update = bind(this.update, this);
        this.goToNextEvent = bind(this.goToNextEvent, this);
        this.goToPreviousEvent = bind(this.goToPreviousEvent, this);
        this.animate = bind(this.animate, this);
        this.begin = bind(this.begin, this);
        this.activate = bind(this.activate, this);
        this.close = bind(this.close, this);
        this.play = bind(this.play, this);
        this.sortedEvents = [];
        this.timelineJ = $('#timeline');
        this.timelineJ.find('.btn.show').click(this.activate);
        this.timelineJ.find('.btn-play').click(this.play);
        this.timelineJ.find('.btn-step-backward').click(this.goToPreviousEvent);
        this.timelineJ.find('.btn-step-forward').click(this.goToNextEvent);
        this.timelineJ.find('.btn-close').click(this.close);
        return;
      }

      Timelapse.prototype.play = function() {
        if (this.playing) {
          this.stop();
          return;
        }
        this.playing = true;
        this.timelineJ.find('.btn-play span').removeClass('glyphicon-play').addClass('glyphicon-pause');
        if (this.time >= 1) {
          this.time = 0;
        }
        this.startTime = Date.now();
        this.lastAnimateTime = this.startTime;
        requestAnimationFrame(this.animate);
      };

      Timelapse.prototype.stop = function() {
        this.playing = false;
        this.timelineJ.find('.btn-play span').removeClass('glyphicon-pause').addClass('glyphicon-play');
      };

      Timelapse.prototype.close = function() {
        var drawing, j, len, ref;
        ref = R.drawings;
        for (j = 0, len = ref.length; j < len; j++) {
          drawing = ref[j];
          drawing.show();
          if (drawing.svg != null) {
            drawing.svg.removeAttribute('stroke');
          }
        }
        this.stop();
        this.timelineJ.removeClass('active');
        $('body').removeClass('timeline-active');
        R.stageJ.height(window.innerHeight - R.stageJ.offset().top);
        R.view.onWindowResize();
        R.view.fitRectangle(R.view.grid.limitCD.bounds.expand(40), true);
        this.activated = false;
        if (!this.rejectedDrawingsWereVisible) {
          R.view.rejectedLayer.data.setVisibility(false);
        }
      };

      Timelapse.prototype.activate = function() {
        if (this.activated) {
          return;
        }
        this.activated = true;
        this.rejectedDrawingsWereVisible = R.view.rejectedLayer.visible;
        this.timelineJ.addClass('active');
        $('body').addClass('timeline-active');
        setTimeout(((function(_this) {
          return function() {
            R.stageJ.height(window.innerHeight - R.stageJ.offset().top - _this.timelineJ.outerHeight());
            R.view.onWindowResize();
            R.view.fitRectangle(R.view.grid.limitCD.bounds.expand(40), true);
          };
        })(this)), 250);
        this.load();
      };

      Timelapse.prototype.begin = function() {
        var currentDrawings, date, drawing, duration, event, events, j, k, l, len, len1, len2, len3, m, nNegativeVotes, nPositiveVotes, prefix, ref, ref1, ref2, ref3, sortByDate, sortedVotes, v, vote, votes;
        R.view.pendingLayer.data.setVisibility(true);
        R.view.drawingLayer.data.setVisibility(true);
        R.view.drawnLayer.data.setVisibility(true);
        ref = R.drawings;
        for (j = 0, len = ref.length; j < len; j++) {
          drawing = ref[j];
          drawing.hide();
        }
        duration = 120;
        events = [];
        sortByDate = (function(_this) {
          return function(a, b) {
            return a.date - b.date;
          };
        })(this);
        ref1 = R.drawings;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          drawing = ref1[k];
          votes = [];
          nNegativeVotes = 0;
          nPositiveVotes = 0;
          ref2 = drawing.votes;
          for (l = 0, len2 = ref2.length; l < len2; l++) {
            vote = ref2[l];
            if (!vote.emailConfirmed) {
              continue;
            }
            v = JSON.parse(vote.vote);
            v.date = v.date.$date;
            if (v.positive) {
              nPositiveVotes++;
            } else {
              nNegativeVotes++;
            }
            prefix = v.positive ? 'positive' : 'negative';
            events.push({
              date: v.date,
              type: prefix + ' vote',
              drawing: drawing
            });
            votes.push(v);
          }
          if (votes.length > 0) {
            events.push({
              date: drawing.date,
              type: 'create drawing',
              drawing: drawing
            });
            sortedVotes = votes.sort(sortByDate);
            date = sortedVotes[sortedVotes.length - 1].date;
            if (drawing.status === 'rejected') {
              events.push({
                date: date,
                type: 'drawing rejected',
                drawing: drawing
              });
              events.push({
                date: date + 3600 * 1000,
                type: 'drawing rejected ignore',
                drawing: drawing
              });
            } else if (drawing.status === 'drawing' || drawing.status === 'drawn') {
              events.push({
                date: date,
                type: 'drawing validated',
                drawing: drawing
              });
              events.push({
                date: date + 3600 * 1000,
                type: 'drawing drawn',
                drawing: drawing
              });
            }
          }
        }
        this.sortedEvents = events.sort(sortByDate);
        currentDrawings = new Map();
        ref3 = this.sortedEvents;
        for (m = 0, len3 = ref3.length; m < len3; m++) {
          event = ref3[m];
          switch (event.type) {
            case 'create drawing':
              currentDrawings.set(event.drawing, 'pending');
              break;
            case 'drawing validated':
              currentDrawings.set(event.drawing, 'drawing');
              break;
            case 'drawing rejected':
              currentDrawings.set(event.drawing, 'rejected');
              break;
            case 'drawing drawn':
              currentDrawings.set(event.drawing, 'drawn');
              break;
            case 'drawing rejected ignore':
              currentDrawings.set(event.drawing, 'rejected ignore');
          }
          event.currentDrawings = new Map(currentDrawings);
          if (event.type === 'drawing rejected ignore') {
            currentDrawings["delete"](event.drawing);
          }
        }
        this.beginDate = this.sortedEvents[0].date - 3600 * 1000;
        this.duration = this.sortedEvents[this.sortedEvents.length - 1].date - this.beginDate;
        this.currentDrawings = [];
        this.createTimeline(this.duration, this.beginDate);
        this.startTime = Date.now();
        this.lastAnimateTime = this.startTime;
        this.time = 0;
        this.play();
      };

      Timelapse.prototype.animate = function() {
        var animateTime, deltaTime, time;
        if (this.time >= 1 || !this.playing) {
          this.stop();
          return;
        }
        animateTime = Date.now();
        deltaTime = animateTime - this.lastAnimateTime;
        time = this.time + deltaTime / this.constructor.duration;
        if (time < 1) {
          this.update(time);
          requestAnimationFrame(this.animate);
        } else {
          this.update(1);
          this.stop();
        }
        this.lastAnimateTime = animateTime;
      };

      Timelapse.prototype.setFrame = function(i, computeTime, updateThumb) {
        var date, event, message;
        if (computeTime == null) {
          computeTime = true;
        }
        if (updateThumb == null) {
          updateThumb = true;
        }
        this.eventIndex = i;
        event = this.sortedEvents[i];
        if (computeTime) {
          this.time = (event.date - this.beginDate) / this.duration;
        }
        if (updateThumb) {
          this.thumb.position.x = this.time * this.canvas.width;
        }
        date = this.time * this.duration + this.beginDate;
        this.timelineJ.find('.info .date').text(moment(date).format('l - LT'));
        this.currentDrawings.forEach((function(_this) {
          return function(drawing) {
            return drawing.hide();
          };
        })(this));
        this.currentDrawings = [];
        message = '';
        switch (event.type) {
          case 'create drawing':
            message = 'Le dessin "' + event.drawing.title + '" a été créé';
            break;
          case 'drawing validated':
            message = 'Le dessin "' + event.drawing.title + '" a été validé';
            break;
          case 'drawing rejected':
          case 'drawing rejected ignore':
            message = 'Le dessin "' + event.drawing.title + '" a été rejeté';
            break;
          case 'drawing drawn':
            message = 'Le dessin "' + event.drawing.title + '" a été dessiné';
            break;
          case 'positive vote':
            message = 'Quelqu\'un a voté pour le dessin "' + event.drawing.title + '"';
            break;
          case 'negative vote':
            message = 'Quelqu\'un a voté contre le dessin "' + event.drawing.title + '"';
        }
        this.timelineJ.find('.info .events').text(message);
        event.currentDrawings.forEach((function(_this) {
          return function(status, drawing) {
            if (status !== 'rejected ignore') {
              _this.currentDrawings.push(drawing);
              drawing.show();
              return drawing.svg.setAttribute('stroke', R.Path.colorMap[status]);
            } else {
              return drawing.hide();
            }
          };
        })(this));
      };

      Timelapse.prototype.goToPreviousEvent = function() {
        if (this.eventIndex <= 0) {
          return;
        }
        this.setFrame(this.eventIndex - 1);
      };

      Timelapse.prototype.goToNextEvent = function() {
        if (this.eventIndex >= this.sortedEvents.length - 1) {
          return;
        }
        this.setFrame(this.eventIndex + 1);
      };

      Timelapse.prototype.update = function(time1, updateThumb) {
        var date, event, i, j, len, ref;
        this.time = time1;
        if (updateThumb == null) {
          updateThumb = true;
        }
        if (this.time >= 1) {
          this.setFrame(this.sortedEvents.length - 1, false, updateThumb);
          return;
        }
        date = this.time * this.duration + this.beginDate;
        ref = this.sortedEvents;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          event = ref[i];
          if (i + 1 < this.sortedEvents.length && this.sortedEvents[i + 1].date > date) {
            this.setFrame(i, false, updateThumb);
            break;
          }
        }
      };

      Timelapse.prototype.mouseDown = function(event) {
        this.dragging = true;
        this.mouseMove(event);
      };

      Timelapse.prototype.mouseMove = function(event) {
        var canvasOffset, point;
        if (this.dragging) {
          canvasOffset = this.canvasJ.offset();
          point = Utils.Event.GetPoint(event).subtract(new P.Point(canvasOffset.left, canvasOffset.top));
          this.thumb.position.x = point.x - this.thumb.bounds.width / 2;
          this.update(this.thumb.position.x / this.canvas.width, false);
        }
      };

      Timelapse.prototype.mouseUp = function(event) {
        this.dragging = false;
      };

      Timelapse.prototype.onWindowResize = function() {
        var ref;
        if ((ref = this.canvasJ) != null) {
          ref.width(window.innerWidth - 3 * 38);
        }
      };

      Timelapse.prototype.createTimeline = function(durationInMilliseconds, beginDate) {
        var durationInHours, event, i, j, k, len, path, ref, ref1, step, timelineHeight, x, yBegin, yEnd;
        durationInHours = durationInMilliseconds / (3600 * 1000);
        this.timelineJ.removeClass('hidden');
        timelineHeight = 100 - 26;
        if (this.canvas == null) {
          this.canvasJ = this.timelineJ.find('#timeline-canvas');
          this.canvas = this.canvasJ.get(0);
          this.project = new P.Project(this.canvas);
          this.canvasJ.on({
            touchstart: this.mouseDown
          });
          this.canvasJ.on({
            touchmove: this.mouseMove
          });
          this.canvasJ.on({
            touchend: this.mouseUp
          });
          this.canvasJ.on({
            touchleave: this.mouseUp
          });
          this.canvasJ.on({
            touchcancel: this.mouseUp
          });
          this.canvasJ.mousedown(this.mouseDown);
          this.canvasJ.mousemove(this.mouseMove);
          $(window).mouseup(this.mouseUp);
          $(window).keydown((function(_this) {
            return function(event) {
              var amount;
              if (Utils.specialKeys[event.keyCode] === 'space') {
                _this.play();
                event.stopPropagation();
                event.preventDefault();
                return -1;
              } else if (Utils.specialKeys[event.keyCode] === 'left') {
                if (event.shiftKey || event.ctrlKey || event.altKey) {
                  amount = event.shiftKey ? 0.1 : 0.025;
                  _this.update(Math.max(0, _this.time - amount));
                } else {
                  _this.goToPreviousEvent();
                }
              } else if (Utils.specialKeys[event.keyCode] === 'right') {
                if (event.shiftKey || event.ctrlKey || event.altKey) {
                  amount = event.shiftKey ? 0.1 : 0.025;
                  _this.update(Math.min(_this.time + amount, 1));
                } else {
                  _this.goToNextEvent();
                }
              }
            };
          })(this));
        }
        this.project.activate();
        this.project.clear();
        this.project.view.viewSize = new P.Size(this.canvasJ.innerWidth(), timelineHeight);
        this.canvas.width = this.project.view.viewSize.width;
        this.canvas.height = this.project.view.viewSize.height;
        this.thumb = new P.Path.Rectangle(0, 0, 1, timelineHeight);
        this.thumb.fillColor = 'white';
        step = this.canvas.width / durationInHours;
        for (i = j = 1, ref = durationInHours; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
          x = durationInHours * step;
          path = new P.Path();
          path.add(x, 0);
          path.add(x, i % 24 === 0 ? timelineHeight : timelineHeight / 3);
          path.strokeWidth = 1;
          path.strokeColor = 'black';
        }
        ref1 = this.sortedEvents;
        for (k = 0, len = ref1.length; k < len; k++) {
          event = ref1[k];
          if (event.type === 'drawing rejected ignore') {
            continue;
          }
          x = this.canvas.width * (event.date - beginDate) / durationInMilliseconds;
          path = new P.Path();
          yBegin = 0;
          yEnd = timelineHeight;
          path.strokeWidth = 1;
          switch (event.type) {
            case 'create drawing':
              path.strokeColor = R.Path.colorMap.pending;
              yEnd = timelineHeight / 4;
              break;
            case 'positive vote':
              path.strokeColor = R.Path.colorMap.drawing;
              yBegin = timelineHeight / 4;
              yEnd = 2 * timelineHeight / 4;
              break;
            case 'negative vote':
              path.strokeColor = R.Path.colorMap.rejected;
              yBegin = timelineHeight / 4;
              yEnd = 2 * timelineHeight / 4;
              break;
            case 'drawing validated':
              path.strokeColor = R.Path.colorMap.drawing;
              yBegin = 2 * timelineHeight / 4;
              yEnd = 3 * timelineHeight / 4;
              break;
            case 'drawing rejected':
              path.strokeColor = R.Path.colorMap.rejected;
              yBegin = 2 * timelineHeight / 4;
              yEnd = 3 * timelineHeight / 4;
              break;
            case 'drawing drawn':
              path.strokeColor = R.Path.colorMap.drawing;
              yBegin = 3 * timelineHeight / 4;
              yEnd = timelineHeight;
          }
          path.add(x, yBegin);
          path.add(x, yEnd);
        }
        this.thumb.bringToFront();
        paper.projects[0].activate();
      };

      Timelapse.prototype.loadOneByOne = function() {
        var args, drawing, j, len, nDrawingsToLoad, ref;
        nDrawingsToLoad = R.drawings.length;
        ref = R.drawings;
        for (j = 0, len = ref.length; j < len; j++) {
          drawing = ref[j];
          args = {
            pk: drawing.pk
          };
          $.ajax({
            method: "POST",
            url: "ajaxCall/",
            data: {
              data: JSON.stringify({
                "function": 'loadDrawing',
                args: args
              })
            }
          }).done((function(_this) {
            return function(result) {
              var latestDrawing;
              if (!R.loader.checkError(result)) {
                return;
              }
              latestDrawing = JSON.parse(result.drawing);
              drawing = R.pkToDrawing[latestDrawing._id.$oid];
              drawing.votes = result.votes;
              drawing.status = latestDrawing.status;
              nDrawingsToLoad--;
              if (nDrawingsToLoad === 0) {
                return _this.begin();
              }
            };
          })(this));
        }
      };

      Timelapse.prototype.handleTimelapseData = function(results) {
        var drawing, j, len, ref, result;
        this.loaded = true;
        R.loader.hideLoadingBar();
        if (!R.loader.checkError(results)) {
          return;
        }
        ref = results.results;
        for (j = 0, len = ref.length; j < len; j++) {
          result = ref[j];
          drawing = R.pkToDrawing[result.pk];
          if (drawing != null) {
            drawing.votes = result.votes;
            drawing.status = result.status;
          }
        }
        this.begin();
      };

      Timelapse.prototype.loadTimelapseDataFromDatabase = function() {
        var args, drawing, j, len, pks, ref;
        pks = [];
        ref = R.drawings;
        for (j = 0, len = ref.length; j < len; j++) {
          drawing = ref[j];
          if (drawing.isVisible() && ((drawing.votes == null) || drawing.votes.length === 0)) {
            pks.push(drawing.pk);
          }
        }
        args = {
          pks: pks
        };
        $.ajax({
          method: "POST",
          url: "ajaxCall/",
          data: {
            data: JSON.stringify({
              "function": 'loadTimelapse',
              args: args
            })
          }
        }).done(this.handleTimelapseData);
      };

      Timelapse.prototype.load = function(loadRejectedDrawings) {
        var jqxhr;
        if (loadRejectedDrawings == null) {
          loadRejectedDrawings = true;
        }
        if (loadRejectedDrawings) {
          R.view.loadRejectedDrawings();
          R.view.rejectedLayer.data.setVisibility(true);
        }
        if (!this.loaded) {
          R.loader.showLoadingBar();
          jqxhr = $.get(location.origin + '/static/timelapses/' + R.city.name + '-timelapse.json', ((function(_this) {
            return function(results) {
              if (results != null) {
                _this.handleTimelapseData(results);
              } else {
                _this.loadTimelapseDataFromDatabase();
              }
            };
          })(this))).fail(this.loadTimelapseDataFromDatabase);
        } else {
          this.begin();
        }
      };

      return Timelapse;

    })();
  });

}).call(this);
