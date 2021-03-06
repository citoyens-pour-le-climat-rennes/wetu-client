// Generated by CoffeeScript 1.10.0
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['paper', 'R', 'Utils/Utils', 'Items/Drawing'], function(P, R, Utils, Drawing) {
    var CanvasTileRasterizer, InstantPaperTileRasterizer, PaperTileRasterizer, Rasterizer, TileRasterizer;
    Rasterizer = (function() {
      Rasterizer.TYPE = 'default';

      Rasterizer.MAX_AREA = 1.5;

      Rasterizer.UNION_RATIO = 1.5;

      Rasterizer.areaToImageDataUrl = function(rectangle, convertToView) {
        var canvasTemp, contextTemp, dataURL, viewRectangle;
        if (convertToView == null) {
          convertToView = true;
        }
        if (rectangle.height <= 0 || rectangle.width <= 0) {
          console.log('Warning: trying to extract empty area!!!');
          return null;
        }
        if (convertToView) {
          rectangle = rectangle.intersect(P.view.bounds);
          viewRectangle = Utils.CS.projectToViewRectangle(rectangle);
        } else {
          viewRectangle = rectangle;
        }
        if (viewRectangle.size.equals(P.view.size) && viewRectangle.x === 0 && viewRectangle.y === 0) {
          return R.canvas.toDataURL("image/png");
        }
        canvasTemp = document.createElement('canvas');
        canvasTemp.width = viewRectangle.width;
        canvasTemp.height = viewRectangle.height;
        contextTemp = canvasTemp.getContext('2d');
        contextTemp.putImageData(R.context.getImageData(viewRectangle.x, viewRectangle.y, viewRectangle.width, viewRectangle.height), 0, 0);
        dataURL = canvasTemp.toDataURL("image/png");
        return dataURL;
      };

      function Rasterizer() {
        this.rasterizeCallback = bind(this.rasterizeCallback, this);
        this.rasterizeImmediately = bind(this.rasterizeImmediately, this);
        R.rasterizerManager.rasterizers[this.constructor.TYPE] = this;
        this.rasterizeItems = true;
        return;
      }

      Rasterizer.prototype.quantizeBounds = function(bounds, scale) {
        var quantizedBounds;
        if (bounds == null) {
          bounds = P.view.bounds;
        }
        if (scale == null) {
          scale = R.scale;
        }
        quantizedBounds = {
          t: Utils.floorToMultiple(bounds.top, scale),
          l: Utils.floorToMultiple(bounds.left, scale),
          b: Utils.floorToMultiple(bounds.bottom, scale),
          r: Utils.floorToMultiple(bounds.right, scale)
        };
        return quantizedBounds;
      };

      Rasterizer.prototype.rasterize = function(items, excludeItems) {};

      Rasterizer.prototype.unload = function(limit) {};

      Rasterizer.prototype.load = function(rasters, qZoom) {};

      Rasterizer.prototype.move = function() {};

      Rasterizer.prototype.loadItem = function(item) {};

      Rasterizer.prototype.requestDraw = function() {
        return true;
      };

      Rasterizer.prototype.selectItem = function(item) {};

      Rasterizer.prototype.deselectItem = function(item) {
        if (typeof item.rasterize === "function") {
          item.rasterize();
        }
      };

      Rasterizer.prototype.rasterizeRectangle = function(rectangle) {};

      Rasterizer.prototype.addAreaToUpdate = function(area) {};

      Rasterizer.prototype.setQZoomToUpdate = function(qZoom) {};

      Rasterizer.prototype.rasterizeAreasToUpdate = function() {};

      Rasterizer.prototype.maxArea = function() {
        return P.view.bounds.area * this.constructor.MAX_AREA;
      };

      Rasterizer.prototype.rasterizeView = function() {};

      Rasterizer.prototype.clearRasters = function() {};

      Rasterizer.prototype.drawItems = function() {};

      Rasterizer.prototype.rasterizeAllItems = function() {};

      Rasterizer.prototype.hideOthers = function(itemsToExclude) {};

      Rasterizer.prototype.showItems = function() {};

      Rasterizer.prototype.hideRasters = function() {};

      Rasterizer.prototype.showRasters = function() {};

      Rasterizer.prototype.extractImage = function(rectangle, redraw) {
        return Rasterizer.areaToImageDataUrl(rectangle);
      };

      Rasterizer.prototype.startLoading = function() {};

      Rasterizer.prototype.stopLoading = function(cancelTimeout) {
        if (cancelTimeout == null) {
          cancelTimeout = true;
        }
      };

      Rasterizer.prototype.rasterizeImmediately = function() {};

      Rasterizer.prototype.updateLoadingBar = function(time) {};

      Rasterizer.prototype.drawItemsAndHideRasters = function() {};

      Rasterizer.prototype.rasterLoaded = function(raster) {};

      Rasterizer.prototype.checkRasterizeAreasToUpdate = function(pathsCreated) {
        if (pathsCreated == null) {
          pathsCreated = false;
        }
      };

      Rasterizer.prototype.createRaster = function(x, y, zoom, raster) {};

      Rasterizer.prototype.getRasterBounds = function(x, y) {};

      Rasterizer.prototype.removeRaster = function(raster, x, y) {};

      Rasterizer.prototype.loadImageForRaster = function(raster, url) {};

      Rasterizer.prototype.createRasters = function(rectangle) {};

      Rasterizer.prototype.move = function() {};

      Rasterizer.prototype.splitAreaToRasterize = function() {
        return areas;
      };

      Rasterizer.prototype.rasterizeCanvasInRaster = function(x, y, canvas, rectangle, qZoom, clearRasters, sourceRectangle) {
        if (clearRasters == null) {
          clearRasters = false;
        }
        if (sourceRectangle == null) {
          sourceRectangle = null;
        }
      };

      Rasterizer.prototype.rasterizeCanvas = function(canvas, rectangle, clearRasters, sourceRectangle) {
        if (clearRasters == null) {
          clearRasters = false;
        }
        if (sourceRectangle == null) {
          sourceRectangle = null;
        }
      };

      Rasterizer.prototype.clearAreaInRasters = function(rectangle) {};

      Rasterizer.prototype.rasterizeArea = function(area) {};

      Rasterizer.prototype.rasterizeAreas = function(areas) {};

      Rasterizer.prototype.prepareView = function() {};

      Rasterizer.prototype.restoreView = function() {};

      Rasterizer.prototype.rasterizeCallback = function(step) {};

      Rasterizer.prototype.disableRasterization = function() {};

      Rasterizer.prototype.enableRasterization = function(drawAllItems) {
        if (drawAllItems == null) {
          drawAllItems = true;
        }
      };

      Rasterizer.prototype.refresh = function(callback, drawAllItems) {
        if (callback == null) {
          callback = null;
        }
        if (drawAllItems == null) {
          drawAllItems = false;
        }
      };

      return Rasterizer;

    })();
    TileRasterizer = (function(superClass) {
      extend(TileRasterizer, superClass);

      TileRasterizer.TYPE = 'abstract tile';

      TileRasterizer.loadingBarJ = null;

      TileRasterizer.addChildren = function(parent, sortedItems) {
        var i, item, len, ref;
        if (!parent.visible) {
          return;
        }
        if (parent.children == null) {
          return;
        }
        ref = parent.children;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          if ((item.controller != null) && P.Group.prototype.isPrototypeOf(item)) {
            sortedItems.push(item.controller);
          }
        }
      };

      TileRasterizer.getSortedItems = function() {
        var sortedItems;
        sortedItems = [];
        this.addChildren(R.view.mainLayer, sortedItems);
        this.addChildren(R.view.pendingLayer, sortedItems);
        this.addChildren(R.view.drawnLayer, sortedItems);
        this.addChildren(R.view.drawingLayer, sortedItems);
        this.addChildren(R.view.rejectedLayer, sortedItems);
        return sortedItems;
      };

      function TileRasterizer() {
        this.rasterizeCallback = bind(this.rasterizeCallback, this);
        this.rasterizeImmediately = bind(this.rasterizeImmediately, this);
        TileRasterizer.__super__.constructor.call(this);
        this.itemsToExclude = [];
        this.areaToRasterize = null;
        this.areasToUpdate = [];
        this.rasters = {};
        this.rasterizeItems = true;
        this.rasterizationDisabled = false;
        this.autoRasterization = 'deferred';
        this.rasterizationDelay = 800;
        this.renderInView = false;
        this.itemsAreDrawn = false;
        this.itemsAreVisible = false;
        this.move();
        return;
      }

      TileRasterizer.prototype.loadItem = function(item) {
        var ref;
        if (this.rasterizationDisabled) {
          if (typeof item.draw === "function") {
            item.draw();
          }
          return;
        }
        if (((ref = item.data) != null ? ref.animate : void 0) || R.selectedTool.constructor.drawItems) {
          if (typeof item.draw === "function") {
            item.draw();
          }
        } else {
          this.itemsAreDrawn = false;
        }
        if (this.rasterizeItems) {
          if (typeof item.rasterize === "function") {
            item.rasterize();
          }
        }
      };

      TileRasterizer.prototype.startLoading = function() {
        this.startLoadingTime = P.view._time;
        TileRasterizer.loadingBarJ.css({
          width: 0
        });
        TileRasterizer.loadingBarJ.show();
        Utils.deferredExecution(this.rasterizeCallback, 'rasterize', this.rasterizationDelay);
      };

      TileRasterizer.prototype.stopLoading = function(cancelTimeout) {
        if (cancelTimeout == null) {
          cancelTimeout = true;
        }
        this.startLoadingTime = null;
        TileRasterizer.loadingBarJ.hide();
        if (cancelTimeout) {
          clearTimeout(R.updateTimeout['rasterize']);
        }
      };

      TileRasterizer.prototype.rasterizeImmediately = function() {
        this.stopLoading();
        this.rasterizeCallback();
      };

      TileRasterizer.prototype.updateLoadingBar = function(time) {
        var duration, totalWidth;
        if (this.startLoadingTime == null) {
          return;
        }
        duration = 1000 * (time - this.startLoadingTime) / this.rasterizationDelay;
        totalWidth = 241;
        TileRasterizer.loadingBarJ.css({
          width: duration * totalWidth
        });
        if (duration >= 1) {
          this.stopLoading(false);
        }
      };

      TileRasterizer.prototype.drawItemsAndHideRasters = function() {
        this.drawItems(true);
        this.hideRasters();
      };

      TileRasterizer.prototype.selectItem = function(item) {
        var ref, ref1;
        if (item instanceof Drawing) {
          return;
        }
        this.drawItems();
        this.rasterize(item, true);
        switch (this.autoRasterization) {
          case 'disabled':
            this.drawItemsAndHideRasters();
            if ((ref = item.group) != null) {
              ref.visible = true;
            }
            break;
          case 'deferred':
            this.drawItemsAndHideRasters();
            if ((ref1 = item.group) != null) {
              ref1.visible = true;
            }
            this.stopLoading();
            break;
          case 'immediate':
            Utils.callNextFrame(this.rasterizeCallback, 'rasterize');
        }
      };

      TileRasterizer.prototype.deselectItem = function(item) {
        if (item instanceof Drawing) {
          return;
        }
        if (this.rasterizeItems) {
          if (typeof item.rasterize === "function") {
            item.rasterize();
          }
        }
        this.rasterize(item);
        switch (this.autoRasterization) {
          case 'deferred':
            this.startLoading();
            break;
          case 'immediate':
            Utils.callNextFrame(this.rasterizeCallback, 'rasterize');
        }
      };

      TileRasterizer.prototype.rasterLoaded = function(raster) {
        raster.context.clearRect(0, 0, R.scale, R.scale);
        raster.context.drawImage(raster.image, 0, 0);
        raster.ready = true;
        raster.loaded = true;
        this.checkRasterizeAreasToUpdate();
      };

      TileRasterizer.prototype.checkRasterizeAreasToUpdate = function(pathsCreated) {
        var allRastersAreReady, raster, rasterColumn, ref, x, y;
        if (pathsCreated == null) {
          pathsCreated = false;
        }
        if (pathsCreated || Utils.isEmpty(R.loader.pathsToCreate)) {
          allRastersAreReady = true;
          ref = this.rasters;
          for (x in ref) {
            rasterColumn = ref[x];
            for (y in rasterColumn) {
              raster = rasterColumn[y];
              allRastersAreReady &= raster.ready;
            }
          }
          if (allRastersAreReady) {
            this.rasterizeAreasToUpdate();
          }
        }
      };

      TileRasterizer.prototype.createRaster = function(x, y, zoom, raster) {
        var base;
        raster.zoom = zoom;
        raster.ready = true;
        raster.loaded = false;
        if ((base = this.rasters)[x] == null) {
          base[x] = {};
        }
        this.rasters[x][y] = raster;
      };

      TileRasterizer.prototype.getRasterBounds = function(x, y) {
        var size;
        size = this.rasters[x][y].zoom * R.scale;
        return new P.Rectangle(x, y, size, size);
      };

      TileRasterizer.prototype.removeRaster = function(raster, x, y) {
        delete this.rasters[x][y];
        if (Utils.isEmpty(this.rasters[x])) {
          delete this.rasters[x];
        }
      };

      TileRasterizer.prototype.unload = function(limit) {
        var qZoom, raster, rasterColumn, rectangle, ref, x, y;
        qZoom = Utils.CS.quantizeZoom(1.0 / P.view.zoom);
        ref = this.rasters;
        for (x in ref) {
          rasterColumn = ref[x];
          x = Number(x);
          for (y in rasterColumn) {
            raster = rasterColumn[y];
            y = Number(y);
            rectangle = this.getRasterBounds(x, y);
            if (!limit.intersects(rectangle) || this.rasters[x][y].zoom !== qZoom) {
              this.removeRaster(raster, x, y);
            }
          }
        }
      };

      TileRasterizer.prototype.loadImageForRaster = function(raster, url) {};

      TileRasterizer.prototype.load = function(rasters, qZoom) {
        var i, len, r, raster, ref, url, x, y;
        this.move();
        for (i = 0, len = rasters.length; i < len; i++) {
          r = rasters[i];
          x = r.position.x * R.scale;
          y = r.position.y * R.scale;
          raster = (ref = this.rasters[x]) != null ? ref[y] : void 0;
          if (raster && !raster.loaded) {
            raster.ready = false;
            url = R.commeUnDesseinURL + r.url + '?' + Math.random();
            this.loadImageForRaster(raster, url);
          }
        }
      };

      TileRasterizer.prototype.createRasters = function(rectangle) {
        var i, j, qBounds, qZoom, ref, ref1, ref2, ref3, ref4, ref5, scale, x, y;
        qZoom = Utils.CS.quantizeZoom(1.0 / P.view.zoom);
        scale = R.scale * qZoom;
        qBounds = this.quantizeBounds(rectangle, scale);
        for (x = i = ref = qBounds.l, ref1 = qBounds.r, ref2 = scale; ref2 > 0 ? i <= ref1 : i >= ref1; x = i += ref2) {
          for (y = j = ref3 = qBounds.t, ref4 = qBounds.b, ref5 = scale; ref5 > 0 ? j <= ref4 : j >= ref4; y = j += ref5) {
            this.createRaster(x, y, qZoom);
          }
        }
      };

      TileRasterizer.prototype.move = function() {
        this.createRasters(P.view.bounds);
      };

      TileRasterizer.prototype.splitAreaToRasterize = function() {
        var area, areaToRasterizeInteger, areas, maxSize;
        maxSize = P.view.size.multiply(2);
        areaToRasterizeInteger = Utils.Rectangle.expandRectangleToInteger(this.areaToRasterize);
        area = Utils.Rectangle.expandRectangleToInteger(new P.Rectangle(this.areaToRasterize.topLeft, P.Size.min(maxSize, this.areaToRasterize.size)));
        areas = [area.clone()];
        while (area.right < this.areaToRasterize.right || area.bottom < this.areaToRasterize.bottom) {
          if (area.right < this.areaToRasterize.right) {
            area.x += maxSize.width;
          } else {
            area.x = areaToRasterizeInteger.left;
            area.y += maxSize.height;
          }
          areas.push(area.intersect(areaToRasterizeInteger));
        }
        return areas;
      };

      TileRasterizer.prototype.rasterizeCanvasInRaster = function(x, y, canvas, rectangle, qZoom, clearRasters, sourceRectangle) {
        var context, destinationRectangle, intersection, rasterRectangle, ref;
        if (clearRasters == null) {
          clearRasters = false;
        }
        if (sourceRectangle == null) {
          sourceRectangle = null;
        }
        if (((ref = this.rasters[x]) != null ? ref[y] : void 0) == null) {
          return;
        }
        rasterRectangle = this.getRasterBounds(x, y);
        intersection = rectangle.intersect(rasterRectangle);
        destinationRectangle = new P.Rectangle(intersection.topLeft.subtract(rasterRectangle.topLeft).divide(qZoom), intersection.size.divide(qZoom));
        context = this.rasters[x][y].context;
        if (clearRasters) {
          context.clearRect(destinationRectangle.x, destinationRectangle.y, destinationRectangle.width, destinationRectangle.height);
        }
        if (canvas != null) {
          if (sourceRectangle != null) {
            sourceRectangle = new P.Rectangle(intersection.topLeft.subtract(sourceRectangle.topLeft), intersection.size);
          } else {
            sourceRectangle = new P.Rectangle(intersection.topLeft.subtract(rectangle.topLeft).divide(qZoom), intersection.size.divide(qZoom));
          }
          if (sourceRectangle.width > 0 && sourceRectangle.height > 0 && destinationRectangle.width > 0 && destinationRectangle.height > 0) {
            context.drawImage(canvas, sourceRectangle.x, sourceRectangle.y, sourceRectangle.width, sourceRectangle.height, destinationRectangle.x, destinationRectangle.y, destinationRectangle.width, destinationRectangle.height);
          }
        }
      };

      TileRasterizer.prototype.rasterizeCanvas = function(canvas, rectangle, clearRasters, sourceRectangle) {
        var i, j, qBounds, qZoom, ref, ref1, ref2, ref3, ref4, ref5, scale, x, y;
        if (clearRasters == null) {
          clearRasters = false;
        }
        if (sourceRectangle == null) {
          sourceRectangle = null;
        }
        qZoom = Utils.CS.quantizeZoom(1.0 / P.view.zoom);
        scale = R.scale * qZoom;
        qBounds = this.quantizeBounds(rectangle, scale);
        for (x = i = ref = qBounds.l, ref1 = qBounds.r, ref2 = scale; ref2 > 0 ? i <= ref1 : i >= ref1; x = i += ref2) {
          for (y = j = ref3 = qBounds.t, ref4 = qBounds.b, ref5 = scale; ref5 > 0 ? j <= ref4 : j >= ref4; y = j += ref5) {
            this.rasterizeCanvasInRaster(x, y, canvas, rectangle, qZoom, clearRasters, sourceRectangle);
          }
        }
      };

      TileRasterizer.prototype.clearAreaInRasters = function(rectangle) {
        this.rasterizeCanvas(null, rectangle, true);
      };

      TileRasterizer.prototype.rasterizeArea = function(area) {
        if (this.rasterizationDisabled) {
          return;
        }
        P.view.viewSize = area.size.multiply(P.view.zoom);
        P.view.center = area.center;
        P.view.update();
        this.rasterizeCanvas(R.canvas, area, true);
      };

      TileRasterizer.prototype.rasterizeAreas = function(areas) {
        var area, i, len, viewPosition, viewSize, viewZoom;
        if (this.rasterizationDisabled) {
          return;
        }
        viewZoom = P.view.zoom;
        viewSize = P.view.viewSize;
        viewPosition = P.view.center;
        P.view.zoom = 1.0 / Utils.CS.quantizeZoom(1.0 / P.view.zoom);
        for (i = 0, len = areas.length; i < len; i++) {
          area = areas[i];
          this.rasterizeArea(area);
        }
        P.view.zoom = viewZoom;
        P.view.viewSize = viewSize;
        P.view.center = viewPosition;
      };

      TileRasterizer.prototype.prepareView = function() {
        var i, id, item, len, ref, ref1, ref2, ref3;
        if (this.rasterizationDisabled) {
          return;
        }
        ref = R.items;
        for (id in ref) {
          item = ref[id];
          item.group.visible = true;
        }
        ref1 = this.itemsToExclude;
        for (i = 0, len = ref1.length; i < len; i++) {
          item = ref1[i];
          if ((ref2 = item.group) != null) {
            ref2.visible = false;
          }
        }
        R.grid.visible = false;
        R.view.selectionLayer.visible = false;
        R.view.carLayer.visible = false;
        this.viewOnFrame = P.view.onFrame;
        P.view.onFrame = null;
        if ((ref3 = this.rasterLayer) != null) {
          ref3.visible = false;
        }
      };

      TileRasterizer.prototype.restoreView = function() {
        var ref, ref1;
        if ((ref = this.rasterLayer) != null) {
          ref.visible = true;
        }
        P.view.onFrame = this.viewOnFrame;
        R.view.carLayer.visible = true;
        R.view.selectionLayer.visible = true;
        if ((ref1 = R.grid) != null) {
          ref1.visible = true;
        }
      };

      TileRasterizer.prototype.rasterizeCallback = function(step) {
        var area, areas, i, id, item, j, k, len, len1, len2, ref, ref1, ref2, ref3, ref4, sortedItems;
        if (this.rasterizationDisabled) {
          return;
        }
        if (!this.areaToRasterize) {
          return;
        }
        if (this.autoRasterization === 'deferred' || this.autoRasterization === 'disabled') {
          this.showRasters();
        }
        areas = this.splitAreaToRasterize();
        if (this.renderInView) {
          this.prepareView();
          this.rasterizeAreas(areas);
          this.restoreView();
        } else {
          sortedItems = this.constructor.getSortedItems();
          for (i = 0, len = areas.length; i < len; i++) {
            area = areas[i];
            this.clearAreaInRasters(area);
            for (j = 0, len1 = sortedItems.length; j < len1; j++) {
              item = sortedItems[j];
              if (((ref = item.raster) != null ? ref.bounds.intersects(area) : void 0) && indexOf.call(this.itemsToExclude, item) < 0) {
                this.rasterizeCanvas(item.raster.canvas, item.raster.bounds.intersect(area), false, item.raster.bounds);
              }
            }
          }
        }
        ref1 = R.items;
        for (id in ref1) {
          item = ref1[id];
          if (item === R.currentPaths[R.me] || R.selectedItems.indexOf(item) >= 0) {
            continue;
          }
          if ((ref2 = item.group) != null) {
            ref2.visible = false;
          }
        }
        ref3 = this.itemsToExclude;
        for (k = 0, len2 = ref3.length; k < len2; k++) {
          item = ref3[k];
          if ((ref4 = item.group) != null) {
            ref4.visible = true;
          }
          if (typeof item.showChildren === "function") {
            item.showChildren();
          }
        }
        this.itemsToExclude = [];
        this.areaToRasterize = null;
        this.itemsAreVisible = false;
        this.stopLoading();
        if (typeof this.postRasterizationCallback === "function") {
          this.postRasterizationCallback();
        }
        this.postRasterizationCallback = null;
      };

      TileRasterizer.prototype.rasterize = function(items, excludeItems) {
        var i, item, len;
        if (this.rasterizationDisabled) {
          return;
        }
        if (!Utils.Array.isArray(items)) {
          items = [items];
        }
        if (!excludeItems) {
          this.itemsToExclude = [];
        }
        for (i = 0, len = items.length; i < len; i++) {
          item = items[i];
          if (this.areaToRasterize == null) {
            this.areaToRasterize = item.getDrawingBounds();
          }
          this.areaToRasterize = this.areaToRasterize.unite(item.getDrawingBounds());
          if (excludeItems) {
            Utils.Array.pushIfAbsent(this.itemsToExclude, item);
          }
        }
      };

      TileRasterizer.prototype.rasterizeRectangle = function(rectangle) {
        if (this.rasterizationDisabled) {
          return;
        }
        this.drawItems();
        if (this.areaToRasterize == null) {
          this.areaToRasterize = rectangle;
        } else {
          this.areaToRasterize = this.areaToRasterize.unite(rectangle);
        }
        Utils.callNextFrame(this.rasterizeCallback, 'rasterize');
      };

      TileRasterizer.prototype.addAreaToUpdate = function(area) {
        if (this.rasterizationDisabled) {
          return;
        }
        this.areasToUpdate.push(area);
      };

      TileRasterizer.prototype.setQZoomToUpdate = function(qZoom) {
        this.areasToUpdateQZoom = qZoom;
      };

      TileRasterizer.prototype.rasterizeAreasToUpdate = function() {
        var area, i, len, previousAreaToRasterize, previousItemsToExclude, previousZoom, ref;
        if (this.rasterizationDisabled) {
          return;
        }
        if (this.areasToUpdate.length === 0) {
          return;
        }
        this.drawItems(true);
        previousItemsToExclude = this.itemsToExclude;
        previousAreaToRasterize = this.areaToRasterize;
        previousZoom = P.view.zoom;
        P.view.zoom = 1.0 / this.areasToUpdateQZoom;
        this.itemsToExclude = [];
        ref = this.areasToUpdate;
        for (i = 0, len = ref.length; i < len; i++) {
          area = ref[i];
          this.areaToRasterize = area;
          this.rasterizeCallback();
        }
        this.areasToUpdate = [];
        this.itemsToExclude = previousItemsToExclude;
        this.areaToRasterize = previousAreaToRasterize;
        P.view.zoom = previousZoom;
      };

      TileRasterizer.prototype.clearRasters = function() {
        var raster, rasterColumn, ref, x, y;
        ref = this.rasters;
        for (x in ref) {
          rasterColumn = ref[x];
          for (y in rasterColumn) {
            raster = rasterColumn[y];
            raster.context.clearRect(0, 0, R.scale, R.scale);
          }
        }
      };

      TileRasterizer.prototype.drawItems = function(showItems) {
        var i, item, len, sortedItems;
        if (showItems == null) {
          showItems = false;
        }
        if (showItems) {
          this.showItems();
        }
        if (this.itemsAreDrawn) {
          return;
        }
        sortedItems = this.constructor.getSortedItems();
        for (i = 0, len = sortedItems.length; i < len; i++) {
          item = sortedItems[i];
          if (item.drawing == null) {
            if (typeof item.draw === "function") {
              item.draw();
            }
          }
          if (this.rasterizeItems) {
            if (typeof item.rasterize === "function") {
              item.rasterize();
            }
          }
        }
        this.itemsAreDrawn = true;
      };

      TileRasterizer.prototype.showItems = function() {
        var id, item, ref;
        if (this.itemsAreVisible) {
          return;
        }
        ref = R.items;
        for (id in ref) {
          item = ref[id];
          item.group.visible = true;
        }
        this.itemsAreVisible = true;
      };

      TileRasterizer.prototype.disableRasterization = function() {
        this.rasterizationDisabled = true;
        this.clearRasters();
        this.drawItems(true);
      };

      TileRasterizer.prototype.enableRasterization = function(drawAllItems) {
        var sortedItems;
        if (drawAllItems == null) {
          drawAllItems = true;
        }
        this.rasterizationDisabled = false;
        if (drawAllItems) {
          this.itemsAreDrawn = false;
          this.drawItems();
        }
        sortedItems = this.constructor.getSortedItems();
        this.rasterize(sortedItems);
      };

      TileRasterizer.prototype.refresh = function(callback, drawAllItems) {
        var sortedItems;
        if (callback == null) {
          callback = null;
        }
        if (drawAllItems == null) {
          drawAllItems = false;
        }
        if (callback == null) {
          callback = function() {
            var p;
            p = new P.Path();
            R.view.selectionLayer.addChild(p);
            p.remove();
          };
        }
        this.clearRasters();
        if (drawAllItems) {
          this.itemsAreDrawn = false;
          this.drawItems();
        }
        sortedItems = this.constructor.getSortedItems();
        this.rasterize(sortedItems);
        this.postRasterizationCallback = callback;
        this.rasterizeView();
      };

      TileRasterizer.prototype.rasterizeView = function() {
        this.rasterizeRectangle(P.view.bounds);
      };

      TileRasterizer.prototype.hideRasters = function() {};

      TileRasterizer.prototype.showRasters = function() {};

      TileRasterizer.prototype.hideOthers = function(itemToExclude) {
        var id, item, ref;
        console.log(itemToExclude.id);
        ref = R.items;
        for (id in ref) {
          item = ref[id];
          if (item !== itemToExclude) {
            item.group.visible = false;
          }
        }
      };

      TileRasterizer.prototype.extractImage = function(rectangle, redraw) {
        var dataURL, disableDrawing, id, item, rasterizeItems, ref;
        if (redraw) {
          rasterizeItems = this.rasterizeItems;
          this.rasterizeItems = false;
          disableDrawing = this.disableDrawing;
          this.disableDrawing = false;
          this.drawItemsAndHideRasters();
          dataURL = Rasterizer.areaToImageDataUrl(rectangle);
          if (rasterizeItems) {
            this.rasterizeItems = true;
            ref = R.items;
            for (id in ref) {
              item = ref[id];
              if (typeof item.rasterize === "function") {
                item.rasterize();
              }
            }
          }
          if (disableDrawing) {
            this.disableDrawing = true;
          }
          this.showRasters();
          this.rasterizeImmediately();
          return dataURL;
        } else {
          return Rasterizer.areaToImageDataUrl(rectangle);
        }
      };

      return TileRasterizer;

    })(Rasterizer);
    PaperTileRasterizer = (function(superClass) {
      extend(PaperTileRasterizer, superClass);

      PaperTileRasterizer.TYPE = 'paper tile';

      function PaperTileRasterizer() {
        this.onRasterLoad = bind(this.onRasterLoad, this);
        this.rasterLayer = new P.Layer();
        this.rasterLayer.name = 'raster layer';
        this.rasterLayer.moveBelow(R.view.mainLayer);
        R.view.mainLayer.activate();
        PaperTileRasterizer.__super__.constructor.call(this);
        return;
      }

      PaperTileRasterizer.prototype.onRasterLoad = function() {
        raster.context = raster.canvas.getContext('2d');
        this.rasterLoaded(raster);
      };

      PaperTileRasterizer.prototype.createRaster = function(x, y, zoom) {
        var image, raster, ref;
        if (((ref = this.rasters[x]) != null ? ref[y] : void 0) != null) {
          return;
        }
        image = new Image();
        image.width = R.scale;
        image.height = R.scale;
        raster = new P.Raster(image);
        raster.name = 'raster: ' + x + ', ' + y;
        raster.position.x = x + 0.5 * R.scale * zoom;
        raster.position.y = y + 0.5 * R.scale * zoom;
        raster.width = R.scale;
        raster.height = R.scale;
        raster.scale(zoom);
        raster.context = raster.canvas.getContext('2d');
        this.rasterLayer.addChild(raster);
        raster.onLoad = this.onRasterLoad;
        PaperTileRasterizer.__super__.createRaster.call(this, x, y, zoom, raster);
      };

      PaperTileRasterizer.prototype.removeRaster = function(raster, x, y) {
        raster.remove();
        PaperTileRasterizer.__super__.removeRaster.call(this, raster, x, y);
      };

      PaperTileRasterizer.prototype.loadImageForRaster = function(raster, url) {
        raster.source = url;
      };

      PaperTileRasterizer.prototype.hideRasters = function() {
        var raster, rasterColumn, ref, x, y;
        ref = this.rasters;
        for (x in ref) {
          rasterColumn = ref[x];
          for (y in rasterColumn) {
            raster = rasterColumn[y];
            raster.visible = false;
          }
        }
      };

      PaperTileRasterizer.prototype.showRasters = function() {
        var raster, rasterColumn, ref, x, y;
        ref = this.rasters;
        for (x in ref) {
          rasterColumn = ref[x];
          for (y in rasterColumn) {
            raster = rasterColumn[y];
            raster.visible = true;
          }
        }
      };

      return PaperTileRasterizer;

    })(TileRasterizer);
    InstantPaperTileRasterizer = (function(superClass) {
      extend(InstantPaperTileRasterizer, superClass);

      InstantPaperTileRasterizer.TYPE = 'light';

      function InstantPaperTileRasterizer() {
        InstantPaperTileRasterizer.__super__.constructor.call(this);
        this.disableDrawing = true;
        this.updateDrawingAfterDelay = true;
        this.itemsToDraw = {};
        return;
      }

      InstantPaperTileRasterizer.prototype.drawItemsAndHideRasters = function() {};

      InstantPaperTileRasterizer.prototype.requestDraw = function(item, simplified, redrawing) {
        var delay, time;
        if (this.disableDrawing) {
          if (this.updateDrawingAfterDelay) {
            time = Date.now();
            delay = 500;
            if ((this.itemsToDraw[item.id] == null) || time - this.itemsToDraw[item.id] < delay) {
              this.itemsToDraw[item.id] = time;
              Utils.deferredExecution(item.draw, 'item.draw:' + item.id, delay, [simplified, redrawing], item);
            } else {
              delete this.itemsToDraw[item.id];
              return true;
            }
          }
        }
        return !this.disableDrawing;
      };

      InstantPaperTileRasterizer.prototype.selectItem = function(item) {
        if (item instanceof Drawing) {
          return;
        }
        if (!this.rasterizeItems) {
          item.removeDrawing();
        }
        InstantPaperTileRasterizer.__super__.selectItem.call(this, item);
      };

      InstantPaperTileRasterizer.prototype.deselectItem = function(item) {
        InstantPaperTileRasterizer.__super__.deselectItem.call(this, item);
        if (!this.rasterizeItems) {
          item.replaceDrawing();
        }
      };

      InstantPaperTileRasterizer.prototype.rasterizeCallback = function(step) {
        var id, item, ref;
        this.disableDrawing = false;
        ref = R.items;
        for (id in ref) {
          item = ref[id];
          if ((item.drawn != null) && !item.drawn && item.getDrawingBounds().intersects(this.areaToRasterize)) {
            if (typeof item.draw === "function") {
              item.draw();
            }
            if (this.rasterizeItems) {
              if (typeof item.rasterize === "function") {
                item.rasterize();
              }
            }
          }
        }
        this.disableDrawing = true;
        InstantPaperTileRasterizer.__super__.rasterizeCallback.call(this, step);
      };

      InstantPaperTileRasterizer.prototype.rasterizeAreasToUpdate = function() {
        this.disableDrawing = false;
        InstantPaperTileRasterizer.__super__.rasterizeAreasToUpdate.call(this);
        this.disableDrawing = true;
      };

      return InstantPaperTileRasterizer;

    })(PaperTileRasterizer);
    CanvasTileRasterizer = (function(superClass) {
      extend(CanvasTileRasterizer, superClass);

      CanvasTileRasterizer.TYPE = 'canvas tile';

      function CanvasTileRasterizer() {
        CanvasTileRasterizer.__super__.constructor.call(this);
        return;
      }

      CanvasTileRasterizer.prototype.createRaster = function(x, y, zoom) {
        var raster, ref;
        raster = (ref = this.rasters[x]) != null ? ref[y] : void 0;
        if (raster != null) {
          return;
        }
        raster = {};
        raster.canvasJ = $('<canvas hidpi="off" width="' + R.scale + '" height="' + R.scale + '">');
        raster.canvas = raster.canvasJ[0];
        raster.context = raster.canvas.getContext('2d');
        raster.image = new Image();
        raster.image.onload = (function(_this) {
          return function() {
            _this.rasterLoaded(raster);
          };
        })(this);
        $("#rasters").append(raster.canvasJ);
        CanvasTileRasterizer.__super__.createRaster.call(this, x, y, zoom, raster);
      };

      CanvasTileRasterizer.prototype.removeRaster = function(raster, x, y) {
        raster.canvasJ.remove();
        CanvasTileRasterizer.__super__.removeRaster.call(this, raster, x, y);
      };

      CanvasTileRasterizer.prototype.loadImageForRaster = function(raster, url) {
        raster.image.src = url;
      };

      CanvasTileRasterizer.prototype.move = function() {
        var css, raster, rasterColumn, ref, scale, viewPos, x, y;
        CanvasTileRasterizer.__super__.move.call(this);
        ref = this.rasters;
        for (x in ref) {
          rasterColumn = ref[x];
          x = Number(x);
          for (y in rasterColumn) {
            raster = rasterColumn[y];
            y = Number(y);
            viewPos = P.view.projectToView(new P.Point(x, y));
            if (P.view.zoom === 1) {
              raster.canvasJ.css({
                'left': viewPos.x,
                'top': viewPos.y,
                'transform': 'none'
              });
            } else {
              scale = P.view.zoom * raster.zoom;
              css = 'translate(' + viewPos.x + 'px,' + viewPos.y + 'px)';
              css += ' scale(' + scale + ')';
              raster.canvasJ.css({
                'transform': css,
                'top': 0,
                'left': 0,
                'transform-origin': '0 0'
              });
            }
          }
        }
      };

      CanvasTileRasterizer.prototype.hideRasters = function() {
        var raster, rasterColumn, ref, x, y;
        ref = this.rasters;
        for (x in ref) {
          rasterColumn = ref[x];
          for (y in rasterColumn) {
            raster = rasterColumn[y];
            raster.canvasJ.hide();
          }
        }
      };

      CanvasTileRasterizer.prototype.showRasters = function() {
        var raster, rasterColumn, ref, x, y;
        ref = this.rasters;
        for (x in ref) {
          rasterColumn = ref[x];
          for (y in rasterColumn) {
            raster = rasterColumn[y];
            raster.canvasJ.show();
          }
        }
      };

      return CanvasTileRasterizer;

    })(TileRasterizer);
    Rasterizer.Tile = TileRasterizer;
    Rasterizer.CanvasTile = CanvasTileRasterizer;
    Rasterizer.InstantPaperTile = InstantPaperTileRasterizer;
    Rasterizer.PaperTile = PaperTileRasterizer;
    return Rasterizer;
  });

}).call(this);

//# sourceMappingURL=Rasterizer.js.map
