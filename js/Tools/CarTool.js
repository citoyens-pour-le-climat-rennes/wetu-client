// Generated by CoffeeScript 1.10.0
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['paper', 'R', 'Utils/Utils', 'Tools/Tool'], function(P, R, Utils, Tool) {
    var CarTool;
    CarTool = (function(superClass) {
      extend(CarTool, superClass);

      CarTool.label = 'Car';

      CarTool.description = '';

      CarTool.iconURL = 'car.png';

      CarTool.favorite = true;

      CarTool.category = '';

      CarTool.cursor = {
        position: {
          x: 0,
          y: 0
        },
        name: 'default'
      };

      CarTool.order = 7;

      CarTool.minSpeed = 0.05;

      CarTool.maxSpeed = 100;

      CarTool.initializeParameters = function() {
        var parameters;
        parameters = {
          'Car': {
            speed: {
              type: 'string',
              label: 'Speed',
              "default": '0',
              addController: true,
              onChange: function() {}
            },
            volume: {
              type: 'slider',
              label: 'Volume',
              "default": 1,
              min: 0,
              max: 10,
              onChange: function(value) {
                var sound;
                if (R.selectedTool.constructor.name === "CarTool") {
                  sound = R.tools.car.sound;
                  if (sound == null) {
                    return;
                  }
                  if (value > 0) {
                    sound.play('car');
                    sound.volume(0.1 * value);
                  } else {
                    sound.stop();
                  }
                }
              }
            }
          }
        };
        return parameters;
      };

      CarTool.parameters = CarTool.initializeParameters();

      function CarTool() {
        this.howlerLoaded = bind(this.howlerLoaded, this);
        CarTool.__super__.constructor.call(this, true);
        this.constructor.car = this;
        return;
      }

      CarTool.prototype.select = function(deselectItems, updateParameters) {
        var howlerPath;
        if (deselectItems == null) {
          deselectItems = true;
        }
        if (updateParameters == null) {
          updateParameters = true;
        }
        CarTool.__super__.select.apply(this, arguments);
        howlerPath = 'howler';
        require([howlerPath], this.howlerLoaded);
      };

      CarTool.prototype.howlerLoaded = function() {
        this.car = new P.Raster("/static/images/car.png");
        R.view.carLayer.addChild(this.car);
        this.car.position = P.view.center;
        this.car.speed = 0;
        this.car.direction = new P.Point(0, -1);
        this.car.onLoad = function() {
          console.log('car loaded');
        };
        this.car.previousSpeed = 0;
        this.sound = new Howl({
          urls: ['/static/sounds/viper.ogg'],
          loop: true,
          volume: 0.1,
          sprite: {
            car: [3260, 5220]
          }
        });
        this.sound.play('car');
        this.lastUpdate = Date.now();
        R.socket.socket.on("car move", this.onCarMove);
      };

      CarTool.prototype.deselect = function() {
        CarTool.__super__.deselect.call(this);
        this.car.remove();
        this.car = null;
        this.sound.stop();
      };

      CarTool.prototype.onFrame = function() {
        if (this.car == null) {
          return;
        }
        if (P.Key.isDown('right')) {
          this.car.direction.angle += 5;
        }
        if (P.Key.isDown('left')) {
          this.car.direction.angle -= 5;
        }
        if (P.Key.isDown('up')) {
          if (this.car.speed < this.constructor.maxSpeed) {
            this.car.speed++;
          }
        } else if (P.Key.isDown('down')) {
          if (this.car.speed > -this.constructor.maxSpeed) {
            this.car.speed--;
          }
        } else {
          this.car.speed *= 0.9;
          if (Math.abs(this.car.speed) < this.constructor.minSpeed) {
            this.car.speed = 0;
          }
        }
        this.updateSound();
        this.car.previousSpeed = this.car.speed;
        this.car.rotation = this.car.direction.angle + 90;
        if (Math.abs(this.car.speed) > this.constructor.minSpeed) {
          this.car.position = this.car.position.add(this.car.direction.multiply(this.car.speed));
          R.view.moveTo(this.car.position);
        }
        if (Date.now() - this.lastUpdate > 150) {
          if (R.me != null) {
            R.socket.emit("car move", R.me, this.car.position, this.car.rotation, this.car.speed);
          }
          this.lastUpdate = Date.now();
        }
      };

      CarTool.prototype.updateSound = function() {
        var maxRate, minRate, rate, ref, ref1, ref2;
        minRate = 0.25;
        maxRate = 3;
        rate = minRate + Math.abs(this.car.speed) / this.constructor.maxSpeed * (maxRate - minRate);
        this.sound._rate = rate;
        if ((ref = this.sound._activeNode()) != null) {
          if ((ref1 = ref.bufferSource) != null) {
            if ((ref2 = ref1.playbackRate) != null) {
              ref2.value = rate;
            }
          }
        }
      };

      CarTool.prototype.onCarMove = function(user, position, rotation, speed) {
        var base;
        if (R.ignoreSockets) {
          return;
        }
        if ((base = R.cars)[user] == null) {
          base[user] = new P.Raster("/static/images/car.png");
        }
        R.cars[user].position = new P.Point(position);
        R.cars[user].rotation = rotation;
        R.cars[user].speed = speed;
        R.cars[user].rLastUpdate = Date.now();
      };

      CarTool.prototype.updateOtherCars = function() {
        var car, direction, ref, username;
        ref = R.cars;
        for (username in ref) {
          car = ref[username];
          direction = new P.Point(1, 0);
          direction.angle = car.rotation - 90;
          car.position = car.position.add(direction.multiply(car.speed));
          if (Date.now() - car.rLastUpdate > 1000) {
            R.cars[username].remove();
            delete R.cars[username];
          }
        }
      };

      CarTool.prototype.keyUp = function(event) {
        switch (event.key) {
          case 'escape':
            R.Tools.move.select();
        }
      };

      return CarTool;

    })(Tool);
    R.Tools.Car = CarTool;
    return CarTool;
  });

}).call(this);
