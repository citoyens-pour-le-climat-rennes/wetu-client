// Generated by CoffeeScript 1.10.0
(function() {
  define(['paper', 'R', 'Utils/Utils'], function(P, R, Utils) {
    var Grid;
    Grid = (function() {
      function Grid() {
        this.layer = new P.Layer();
        this.layer.name = "grid";
        this.grid = new P.Group();
        this.grid.name = 'grid group';
        this.layer.addChild(this.grid);
        this.size = new P.Size(R.city.pixelPerMm * (R.city.width || 100000), R.city.pixelPerMm * (R.city.height || 100000));
        this.frameSize = this.size.multiply(10);
        this.frameRectangle = new P.Rectangle(this.frameSize.multiply(-0.5), this.frameSize);
        this.limitCDRectangle = new P.Rectangle(this.size.multiply(-0.5), this.size);
        if (R.city.name !== 'world') {
          this.createFrame();
        }
        this.limitCD = new P.Path.Rectangle(this.limitCDRectangle);
        this.limitCD.strokeColor = '#33383e';
        this.limitCD.strokeWidth = 1;
        this.layer.addChild(this.limitCD);
        this.layer.sendToBack();
        this.update();
        return;
      }

      Grid.prototype.projectToGeoJSON = function(point) {
        return new P.Point(Utils.CS.PlanetWidth * point.x / this.size.width, Utils.CS.PlanetHeight * point.y / this.size.height);
      };

      Grid.prototype.projectToGeoJSONRectangle = function(rectangle) {
        var topLeft;
        topLeft = this.projectToGeoJSON(rectangle.topLeft);
        return new P.Rectangle(topLeft.x, topLeft.y, Utils.CS.PlanetWidth * rectangle.width / this.size.width, Utils.CS.PlanetHeight * rectangle.height / this.size.height);
      };

      Grid.prototype.geoJSONToProject = function(point) {
        return new P.Point(this.size.width * point.x / Utils.CS.PlanetWidth, this.size.height * point.y / Utils.CS.PlanetHeight);
      };

      Grid.prototype.boundsFromBox = function(box) {
        var bottom, left, right, top;
        left = this.size.width * box['coordinates'][0][0][0] / Utils.CS.PlanetWidth;
        top = this.size.height * box['coordinates'][0][0][1] / Utils.CS.PlanetHeight;
        right = this.size.width * box['coordinates'][0][2][0] / Utils.CS.PlanetWidth;
        bottom = this.size.height * box['coordinates'][0][2][1] / Utils.CS.PlanetHeight;
        return new P.Rectangle(left, top, right - left, bottom - top);
      };

      Grid.prototype.createFrame = function() {
        var child, i, l1, l2, l3, l4, len, ref;
        this.frame = new P.Group();
        this.frame.fillColor = '#252525';
        l1 = new P.Path.Rectangle(this.frameRectangle.topLeft, new P.Point(this.frameRectangle.right, this.limitCDRectangle.top));
        l2 = new P.Path.Rectangle(new P.Point(this.frameRectangle.left, this.limitCDRectangle.top), new P.Point(this.limitCDRectangle.left, this.limitCDRectangle.bottom));
        l3 = new P.Path.Rectangle(new P.Point(this.limitCDRectangle.right, this.limitCDRectangle.top), new P.Point(this.frameRectangle.right, this.limitCDRectangle.bottom));
        l4 = new P.Path.Rectangle(new P.Point(this.frameRectangle.left, this.limitCDRectangle.bottom), this.frameRectangle.bottomRight);
        this.frame.addChild(l1);
        this.frame.addChild(l2);
        this.frame.addChild(l3);
        this.frame.addChild(l4);
        ref = this.frame.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          child.fillColor = '#252525';
        }
        this.layer.addChild(this.frame);
      };

      Grid.prototype.rectangleOverlapsTwoPlanets = function(rectangle, tolerance) {
        if (tolerance == null) {
          tolerance = 50;
        }
        return !this.limitCD.bounds.expand(-tolerance).contains(rectangle);
      };

      Grid.prototype.contains = function(item, tolerance) {
        if (tolerance == null) {
          tolerance = 50;
        }
        return this.limitCD.bounds.expand(-tolerance).contains(item);
      };

      Grid.prototype.updateLimitPaths = function() {
        var limit;
        limit = Utils.CS.getLimit();
        this.limitPathV = null;
        this.limitPathH = null;
        if (limit.x >= P.view.bounds.left && limit.x <= P.view.bounds.right) {
          this.limitPathV = new P.Path();
          this.limitPathV.name = 'limitPathV';
          this.limitPathV.strokeColor = 'green';
          this.limitPathV.strokeWidth = 5;
          this.limitPathV.add(limit.x, P.view.bounds.top);
          this.limitPathV.add(limit.x, P.view.bounds.bottom);
          this.grid.addChild(this.limitPathV);
        }
        if (limit.y >= P.view.bounds.top && limit.y <= P.view.bounds.bottom) {
          this.limitPathH = new P.Path();
          this.limitPathH.name = 'limitPathH';
          this.limitPathH.strokeColor = 'green';
          this.limitPathH.strokeWidth = 5;
          this.limitPathH.add(P.view.bounds.left, limit.y);
          this.limitPathH.add(P.view.bounds.right, limit.y);
          this.grid.addChild(this.limitPathH);
        }
      };

      Grid.prototype.update = function() {
        var bounds, halfSize, left, path, px, py, snap, top;
        this.grid.removeChildren();
        this.updateLimitPaths();
        if (P.view.bounds.width > window.innerWidth || P.view.bounds.height > window.innerHeight) {
          halfSize = new P.Point(window.innerWidth * 0.5, window.innerHeight * 0.5);
          bounds = new P.Rectangle(P.view.center.subtract(halfSize), P.view.center.add(halfSize));
          path = new P.Path.Rectangle(bounds);
          path.strokeColor = 'rgba(0, 0, 0, 0.1)';
          path.strokeWidth = 0.1;
          path.dashArray = [10, 4];
          this.grid.addChild(path);
        }
        if (!R.displayGrid) {
          return;
        }
        snap = Utils.Snap.getSnap();
        bounds = Utils.Rectangle.expandRectangleToMultiple(P.view.bounds, snap);
        left = bounds.left;
        top = bounds.top;
        while (left < bounds.right || top < bounds.bottom) {
          px = new P.Path();
          px.name = "grid px";
          py = new P.Path();
          px.name = "grid py";
          px.strokeColor = "#666666";
          if ((left / snap) % 4 === 0) {
            px.strokeColor = "#000000";
            px.strokeWidth = 2;
          }
          py.strokeColor = "#666666";
          if ((top / snap) % 4 === 0) {
            py.strokeColor = "#000000";
            py.strokeWidth = 2;
          }
          px.add(new P.Point(left, P.view.bounds.top));
          px.add(new P.Point(left, P.view.bounds.bottom));
          py.add(new P.Point(P.view.bounds.left, top));
          py.add(new P.Point(P.view.bounds.right, top));
          this.grid.addChild(px);
          this.grid.addChild(py);
          left += snap;
          top += snap;
        }
      };

      return Grid;

    })();
    return Grid;
  });

}).call(this);

//# sourceMappingURL=Grid.js.map
