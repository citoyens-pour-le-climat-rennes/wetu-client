// Generated by CoffeeScript 1.10.0
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['paper', 'R', 'Utils/Utils'], function(P, R, Utils) {
    var RasterizerBot;
    RasterizerBot = (function() {
      function RasterizerBot() {
        this.deleteAreaToUpdateCallback = bind(this.deleteAreaToUpdateCallback, this);
        this.testSaveOnServer = bind(this.testSaveOnServer, this);
        this.getAreasToUpdateCallback = bind(this.getAreasToUpdateCallback, this);
        this.getAreasToUpdate = bind(this.getAreasToUpdate, this);
        this.areasToRasterize = [];
        return;
      }

      RasterizerBot.prototype.initialize = function() {};

      RasterizerBot.prototype.rasterizeAndSaveOnServer = function() {
        console.log("rasterizeAndSaveOnServer");
        P.view.viewSize = P.Size.min(new P.Size(1000, 1000), this.areaToRasterize.size);
        P.view.center = this.areaToRasterize.topLeft.add(P.view.size.multiply(0.5));
        this.loopRasterize();
      };

      RasterizerBot.prototype.loopRasterize = function() {
        var dataURL, finished, height, imagePosition, newSize, rectangle, topLeft, width;
        rectangle = this.areaToRasterize;
        width = Math.min(1000, rectangle.right - P.view.bounds.left);
        height = Math.min(1000, rectangle.bottom - P.view.bounds.top);
        newSize = new P.Size(width, height);
        if (!P.view.viewSize.equals(newSize)) {
          topLeft = P.view.bounds.topLeft;
          P.view.viewSize = newSize;
          P.view.center = topLeft.add(newSize.multiply(0.5));
        }
        imagePosition = P.view.bounds.topLeft.clone();
        dataURL = R.canvas.toDataURL();
        finished = P.view.bounds.bottom >= rectangle.bottom && P.view.bounds.right >= rectangle.right;
        if (!finished) {
          if (P.view.bounds.right < rectangle.right) {
            P.view.center = P.view.center.add(1000, 0);
          } else {
            P.view.center = new P.Point(rectangle.left + P.view.viewSize.width * 0.5, P.view.bounds.bottom + P.view.viewSize.height * 0.5);
          }
        } else {
          R.areaToRasterize = null;
        }
        window.saveOnServer(dataURL, imagePosition.x, imagePosition.y, finished, R.city);
      };

      RasterizerBot.prototype.loadArea = function(args) {
        var area, areaObject, delta, div, i, len, ref;
        console.log("load_area");
        if (this.areaToRasterize != null) {
          console.log("error: load_area while loading !!");
          return;
        }
        areaObject = JSON.parse(args);
        if (areaObject.city !== R.city) {
          R.loader.unload();
          R.city = areaObject.city;
        }
        area = Utils.Rectangle.expandRectangleToInteger(Utils.CS.rectangleFromBox(areaObject));
        this.areaToRasterize = area;
        delta = area.center.subtract(P.view.center);
        P.view.scrollBy(delta);
        ref = R.divs;
        for (i = 0, len = ref.length; i < len; i++) {
          div = ref[i];
          div.updateTransform();
        }
        console.log("call load");
        R.loader.load(area);
      };

      RasterizerBot.prototype.getAreasToUpdate = function() {
        if (this.areasToRasterize.length === 0 && this.imageSaved) {
          $.ajax({
            method: "POST",
            url: "ajaxCall/",
            data: {
              data: JSON.stringify({
                "function": 'getAreasToUpdate',
                args: {}
              })
            }
          }).done(this.getAreasToUpdateCallback);
        }
      };

      RasterizerBot.prototype.loadNextArea = function() {
        var area;
        if (this.areasToRasterize.length > 0) {
          area = this.areasToRasterize.shift();
          this.areaToRasterizePk = area._id.$oid;
          this.imageSaved = false;
          this.loadArea(JSON.stringify(area));
        }
      };

      RasterizerBot.prototype.getAreasToUpdateCallback = function(areas) {
        this.areasToRasterize = areas;
        this.loadNextArea();
      };

      RasterizerBot.prototype.testSaveOnServer = function(imageDataURL, x, y, finished) {
        if (!imageDataURL) {
          console.log("no image data url");
        }
        this.rasterizedAreasJ.append($('<img src="' + imageDataURL + '" data-position="' + x + ', ' + y + '" finished="' + finished + '">').css({
          border: '1px solid black'
        }));
        console.log('position: ' + x + ', ' + y);
        console.log('finished: ' + finished);
        if (finished) {
          $.ajax({
            method: "POST",
            url: "ajaxCall/",
            data: {
              data: JSON.stringify({
                "function": 'deleteAreaToUpdate',
                args: {
                  pk: this.areaToRasterizePk
                }
              })
            }
          }).done(this.deleteAreaToUpdateCallback);
        } else {
          this.loopRasterize();
        }
      };

      RasterizerBot.prototype.deleteAreaToUpdateCallback = function(result) {
        R.loader.checkError(result);
        this.imageSaved = true;
        this.loadNextArea();
      };

      RasterizerBot.prototype.testRasterizer = function() {
        this.rasterizedAreasJ = $('<div class="rasterized-areas">');
        this.rasterizedAreasJ.css({
          position: 'absolute',
          top: 1000,
          left: 0
        });
        $('body').css({
          overflow: 'auto'
        }).prepend(this.rasterizedAreasJ);
        window.saveOnServer = this.testSaveOnServer;
        this.areasToRasterize = [];
        this.imageSaved = true;
        setInterval(this.getAreasToUpdate, 1000);
      };

      return RasterizerBot;

    })();
    window.loopRasterize = function() {
      return R.rasterizerBot.loopRasterize();
    };
    window.loadArea = function() {
      return R.rasterizerBot.loadArea();
    };
    return RasterizerBot;
  });

}).call(this);

//# sourceMappingURL=RasterizerBot.js.map
