// Generated by CoffeeScript 1.10.0
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['Items/Item', 'Items/Content', 'Tools/PathTool'], function(Item, Content, PathTool) {
    var Path;
    Path = (function(superClass) {
      extend(Path, superClass);

      Path.label = 'Pen';

      Path.description = "The classic and basic pen tool";

      Path.cursor = {
        position: {
          x: 0,
          y: 0
        },
        name: 'crosshair'
      };

      Path.constructor.secureDistance = 2;

      Path.initializeParameters = function() {
        var parameters;
        parameters = Path.__super__.constructor.initializeParameters.call(this);
        parameters['Items'].duplicate = R.parameters.duplicate;
        delete parameters['Style'];
        return parameters;
      };

      Path.parameters = Path.initializeParameters();

      Path.createTool = function(Path) {
        new R.Tools.Path(Path);
      };

      Path.create = function(duplicateData) {
        var copy;
        if (duplicateData == null) {
          duplicateData = this.getDuplicateData();
        }
        copy = new this(duplicateData.date, duplicateData.data, null, duplicateData.points);
        copy.draw();
        if (!this.socketAction) {
          copy.save(false);
          R.socket.emit("bounce", {
            itemClass: this.name,
            "function": "create",
            "arguments": [duplicateData]
          });
        }
        return copy;
      };

      function Path(date, data1, pk1, points, lock, owner, drawingPk) {
        this.date = date != null ? date : null;
        this.data = data1 != null ? data1 : null;
        this.pk = pk1 != null ? pk1 : null;
        if (points == null) {
          points = null;
        }
        this.lock = lock != null ? lock : null;
        this.owner = owner != null ? owner : null;
        this.drawingPk = drawingPk != null ? drawingPk : null;
        this.sendToSpacebrew = bind(this.sendToSpacebrew, this);
        this.update = bind(this.update, this);
        this.saveCallback = bind(this.saveCallback, this);
        if (!this.lock) {
          Path.__super__.constructor.call(this, this.data, this.pk, this.date, R.sidebar.pathListJ, R.sortedPaths);
        } else {
          Path.__super__.constructor.call(this, this.data, this.pk, this.date, this.lock.itemListsJ.find('.rPath-list'), this.lock.sortedPaths);
        }
        this.selectionHighlight = null;
        if (points != null) {
          this.loadPath(points);
        }
        return;
      }

      Path.prototype.getDuplicateData = function() {
        var data;
        data = Path.__super__.getDuplicateData.call(this);
        data.points = this.pathOnPlanet();
        data.date = this.date;
        return data;
      };

      Path.prototype.getDrawingBounds = function() {
        if (!this.canvasRaster && (this.drawing != null) && this.drawing.strokeBounds.area > 0) {
          if (this.raster != null) {
            return this.raster.bounds;
          }
          return this.drawing.strokeBounds;
        }
        return this.getBounds().expand(this.data.strokeWidth);
      };

      Path.prototype.endSetRectangle = function() {
        Path.__super__.endSetRectangle.call(this);
        this.draw();
        this.rasterize();
      };

      Path.prototype.setRectangle = function(rectangle, update) {
        Path.__super__.setRectangle.call(this, rectangle, update);
        this.draw(update);
      };

      Path.prototype.setRotation = function(rotation, center, update) {
        Path.__super__.setRotation.call(this, rotation, center, update);
        this.draw(update);
      };

      Path.prototype.projectToRaster = function(point) {
        return point.subtract(this.canvasRaster.bounds.topLeft);
      };

      Path.prototype.prepareHitTest = function(fullySelected, strokeWidth) {
        var ref;
        Path.__super__.prepareHitTest.call(this);
        this.stateBeforeHitTest = {};
        this.stateBeforeHitTest.groupWasVisible = this.group.visible;
        this.stateBeforeHitTest.controlPathWasVisible = this.controlPath.visible;
        this.stateBeforeHitTest.controlPathWasSelected = this.controlPath.selected;
        this.stateBeforeHitTest.controlPathWasFullySelected = this.controlPath.fullySelected;
        this.stateBeforeHitTest.controlPathStrokeWidth = this.controlPath.strokeWidth;
        this.group.visible = true;
        this.controlPath.visible = true;
        this.controlPath.selected = true;
        if (strokeWidth) {
          this.controlPath.strokeWidth = strokeWidth;
        }
        if (fullySelected) {
          this.controlPath.fullySelected = true;
        }
        if ((ref = this.speedGroup) != null) {
          ref.selected = true;
        }
      };

      Path.prototype.finishHitTest = function(fullySelected) {
        var ref;
        if (fullySelected == null) {
          fullySelected = true;
        }
        Path.__super__.finishHitTest.call(this, fullySelected);
        this.group.visible = this.stateBeforeHitTest.groupWasVisible;
        this.controlPath.visible = this.stateBeforeHitTest.controlPathWasVisible;
        this.controlPath.strokeWidth = this.stateBeforeHitTest.controlPathStrokeWidth;
        this.controlPath.fullySelected = this.stateBeforeHitTest.controlPathWasFullySelected;
        if (!this.controlPath.fullySelected) {
          this.controlPath.selected = this.stateBeforeHitTest.controlPathWasSelected;
        }
        this.stateBeforeHitTest = null;
        if ((ref = this.speedGroup) != null) {
          ref.selected = false;
        }
      };

      Path.prototype.hitTest = function(event) {
        var hitResult, wasSelected;
        if (R.me !== this.owner) {
          return null;
        }
        wasSelected = this.selected;
        hitResult = Path.__super__.hitTest.call(this, event);
        if (hitResult == null) {
          return;
        }
        if (hitResult.type === 'stroke' || !wasSelected) {
          hitResult.type = 'stroke';
          if (R.tools.select.selectionRectangle != null) {
            R.tools.select.selectionRectangle.beginAction(hitResult, event);
          } else {
            $(R.tools.select).one('selectionRectangleUpdated', function() {
              return R.tools.select.selectionRectangle.beginAction(hitResult, event);
            });
          }
        }
        return hitResult;
      };

      Path.prototype.select = function(updateOptions) {
        if (updateOptions == null) {
          updateOptions = true;
        }
        if (R.me !== this.owner) {
          return null;
        }
        if ((this.drawingPk != null) && (R.items[this.drawingPk] != null)) {
          R.items[this.drawingPk].select();
          return null;
        }
        if (!Path.__super__.select.call(this, updateOptions) || (this.controlPath == null)) {
          return false;
        }
        return true;
      };

      Path.prototype.deselect = function(updateOptions) {
        if (updateOptions == null) {
          updateOptions = true;
        }
        if (!Path.__super__.deselect.call(this, updateOptions)) {
          return false;
        }
        return true;
      };

      Path.prototype.updateSelect = function(event) {
        Path.__super__.updateSelect.call(this, event);
      };

      Path.prototype.doubleClick = function(event) {};

      Path.prototype.loadPath = function(points) {};

      Path.prototype.setParameter = function(name, value, updateGUI, update) {
        Path.__super__.setParameter.call(this, name, value, updateGUI, update);
        if (this.previousBoundingBox == null) {
          this.previousBoundingBox = this.getDrawingBounds();
        }
        this.draw();
      };

      Path.prototype.applyStylesToPath = function(path) {
        path.strokeColor = 'black';
        path.strokeWidth = 2;
        path.fillColor = null;
        if (this.data.shadowOffsetY != null) {
          path.shadowOffset = new P.Point(this.data.shadowOffsetX, this.data.shadowOffsetY);
        }
        if (this.data.shadowBlur != null) {
          path.shadowBlur = this.data.shadowBlur;
        }
        if (this.data.shadowColor != null) {
          path.shadowColor = this.data.shadowColor;
        }
      };

      Path.prototype.addPath = function(path, applyStyles) {
        if (applyStyles == null) {
          applyStyles = true;
        }
        if (path == null) {
          path = new P.Path();
        }
        path.controller = this;
        if (applyStyles) {
          this.applyStylesToPath(path);
        }
        this.drawing.addChild(path);
        return path;
      };

      Path.prototype.addControlPath = function(controlPath) {
        this.controlPath = controlPath;
        if (this.lock) {
          this.lock.group.addChild(this.group);
        }
        if (this.controlPath == null) {
          this.controlPath = new P.Path();
        }
        this.group.addChild(this.controlPath);
        this.controlPath.name = "controlPath";
        this.controlPath.controller = this;
        this.controlPath.strokeWidth = 10;
        this.controlPath.strokeColor = R.selectionBlue;
        this.controlPath.strokeColor.alpha = 0.25;
        this.controlPath.strokeCap = 'round';
        this.controlPath.visible = false;
      };

      Path.prototype.initializeDrawing = function(createCanvas) {
        var bounds, canvas, position, ref, ref1, ref2;
        if (createCanvas == null) {
          createCanvas = false;
        }
        if ((ref = this.raster) != null) {
          ref.remove();
        }
        this.raster = null;
        this.controlPath.strokeWidth = 10;
        if ((ref1 = this.drawing) != null) {
          ref1.remove();
        }
        this.drawing = new P.Group();
        this.drawing.name = "drawing";
        this.drawing.strokeColor = 'black';
        this.drawing.strokeWidth = 2;
        this.drawing.fillColor = null;
        this.drawing.insertBelow(this.controlPath);
        this.drawing.controlPath = this.controlPath;
        this.drawing.controller = this;
        this.group.addChild(this.drawing);
        if (createCanvas) {
          canvas = document.createElement("canvas");
          if (this.rectangle.area < 2) {
            canvas.width = P.view.size.width;
            canvas.height = P.view.size.height;
            position = P.view.center;
          } else {
            bounds = this.getDrawingBounds();
            canvas.width = bounds.width;
            canvas.height = bounds.height;
            position = bounds.center;
          }
          if ((ref2 = this.canvasRaster) != null) {
            ref2.remove();
          }
          this.canvasRaster = new P.Raster(canvas, position);
          this.drawing.addChild(this.canvasRaster);
          this.context = this.canvasRaster.canvas.getContext("2d");
          this.context.strokeStyle = 'black';
          this.context.fillStyle = null;
          this.context.lineWidth = 2;
        }
      };

      Path.prototype.setAnimated = function(animated) {
        if (animated) {
          Utils.Animation.registerAnimation(this);
        } else {
          Utils.Animation.deregisterAnimation(this);
        }
      };

      Path.prototype.draw = function(simplified) {
        if (simplified == null) {
          simplified = false;
        }
      };

      Path.prototype.initialize = function() {};

      Path.prototype.beginCreate = function(point, event) {};

      Path.prototype.updateCreate = function(point, event) {};

      Path.prototype.endCreate = function(point, event) {};

      Path.prototype.insertAbove = function(path, index, update) {
        if (index == null) {
          index = null;
        }
        if (update == null) {
          update = false;
        }
        this.zindex = this.group.index;
        Path.__super__.insertAbove.call(this, path, index, update);
      };

      Path.prototype.insertBelow = function(path, index, update) {
        if (index == null) {
          index = null;
        }
        if (update == null) {
          update = false;
        }
        this.zindex = this.group.index;
        Path.__super__.insertBelow.call(this, path, index, update);
      };

      Path.prototype.getData = function() {
        return this.data;
      };

      Path.prototype.getStringifiedData = function() {
        return JSON.stringify(this.getData());
      };

      Path.prototype.getPlanet = function() {
        return Utils.CS.projectToPlanet(this.controlPath.segments[0].point);
      };

      Path.prototype.save = function(addCreateCommand) {
        var args;
        if (addCreateCommand == null) {
          addCreateCommand = true;
        }
        if (this.controlPath == null) {
          return;
        }
        R.paths[this.pk != null ? this.pk : this.id] = this;
        args = {
          city: R.city,
          box: Utils.CS.boxFromRectangle(this.getDrawingBounds()),
          points: this.pathOnPlanet(),
          data: this.getStringifiedData(),
          date: this.date,
          object_type: this.constructor.label
        };
        $.ajax({
          method: "POST",
          url: "ajaxCall/",
          data: {
            data: JSON.stringify({
              "function": 'savePath',
              args: args
            })
          }
        }).done(this.saveCallback);
        Path.__super__.save.apply(this, arguments);
      };

      Path.prototype.saveCallback = function(result) {
        R.loader.checkError(result);
        if (result.pk == null) {
          return;
        }
        this.setPK(result.pk);
        this.owner = result.owner;
        if (this.updateAfterSave != null) {
          this.update(this.updateAfterSave);
        }
        Path.__super__.saveCallback.apply(this, arguments);
      };

      Path.prototype.getUpdateFunction = function() {
        return 'updatePath';
      };

      Path.prototype.getUpdateArguments = function(type) {
        var args;
        switch (type) {
          case 'z-index':
            args = {
              pk: this.pk,
              date: this.date
            };
            break;
          default:
            args = {
              pk: this.pk,
              points: this.pathOnPlanet(),
              data: this.getStringifiedData(),
              box: Utils.CS.boxFromRectangle(this.getDrawingBounds())
            };
        }
        return args;
      };

      Path.prototype.update = function(type) {
        if (this.pk == null) {
          this.updateAfterSave = type;
          return;
        }
        delete this.updateAfterSave;
        $.ajax({
          method: "POST",
          url: "ajaxCall/",
          data: {
            data: JSON.stringify({
              "function": 'updatePath',
              args: this.getUpdateArguments(type)
            })
          }
        }).done(this.updatePathCallback);
      };

      Path.prototype.updatePathCallback = function(result) {
        R.loader.checkError(result);
      };

      Path.prototype.setPK = function(pk) {
        Path.__super__.setPK.apply(this, arguments);
        R.paths[pk] = this;
        delete R.paths[this.id];
      };

      Path.prototype.remove = function() {
        if (!this.group) {
          return;
        }
        Utils.Animation.deregisterAnimation();
        this.controlPath = null;
        this.drawing = null;
        if (this.raster == null) {
          this.raster = null;
        }
        if (this.canvasRaster == null) {
          this.canvasRaster = null;
        }
        if (this.pk != null) {
          delete R.paths[this.pk];
        } else {
          delete R.paths[this.id];
        }
        Path.__super__.remove.call(this);
      };

      Path.prototype.deleteFromDatabase = function() {
        $.ajax({
          method: "POST",
          url: "ajaxCall/",
          data: {
            data: JSON.stringify({
              "function": 'deletePath',
              args: {
                pk: this.pk
              }
            })
          }
        }).done(R.loader.checkError);
      };

      Path.prototype.pathOnPlanet = function(controlSegments) {
        var i, len, p, planet, points, segment;
        if (controlSegments == null) {
          controlSegments = this.controlPath.segments;
        }
        points = [];
        planet = this.getPlanet();
        for (i = 0, len = controlSegments.length; i < len; i++) {
          segment = controlSegments[i];
          p = Utils.CS.projectToPosOnPlanet(segment.point, planet);
          points.push(Utils.CS.pointToArray(p));
        }
        return points;
      };

      Path.prototype.getPathList = function(item, paths) {
        var child, i, j, len, len1, path, ref, segment, segments;
        switch (item.className) {
          case 'Group':
          case 'CompoundPath':
            ref = item.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              this.getPathList(child, paths);
            }
            break;
          case 'Path':
          case 'Shape':
            segments = item.className === 'Shape' ? item.toPath(false).segments : item.segments;
            path = [];
            for (j = 0, len1 = segments.length; j < len1; j++) {
              segment = segments[j];
              path.push(segment.point.toJSON());
            }
            if (item.closed) {
              path.push(item.firstSegment.point.toJSON());
            }
            paths.push(path);
        }
      };

      Path.prototype.requireAndSendToSpacebrew = function() {
        if (typeof spacebrew === "undefined" || spacebrew === null) {
          require(['Spacebrew'], this.sendToSpacebrew);
        }
      };

      Path.prototype.sendToSpacebrew = function(spacebrew) {
        var data, i, j, json, len, len1, linkAllPaths, path, paths, point;
        paths = [];
        this.getPathList(this.drawing, paths);
        linkAllPaths = [];
        for (i = 0, len = paths.length; i < len; i++) {
          path = paths[i];
          for (j = 0, len1 = path.length; j < len1; j++) {
            point = path[j];
            linkAllPaths.push(point);
          }
        }
        paths = [linkAllPaths];
        data = {
          paths: paths,
          bounds: paper.view.bounds.toJSON()
        };
        json = JSON.stringify(data);
        spacebrew.send("commands", "string", json);
      };

      Path.prototype.exportToSVG = function(item, filename) {
        var blob, drawing, link, svg, url;
        if (item == null) {
          item = this.drawing;
        }
        if (filename == null) {
          filename = "image.svg";
        }
        drawing = item.clone();
        drawing.position = new P.Point(drawing.bounds.size.multiply(0.5));
        svg = drawing.exportSVG({
          asString: true
        });
        drawing.remove();
        svg = svg.replace(new RegExp('<g', 'g'), '<svg');
        svg = svg.replace(new RegExp('</g', 'g'), '</svg');
        blob = new Blob([svg], {
          type: 'image/svg+xml'
        });
        url = URL.createObjectURL(blob);
        link = document.createElement("a");
        document.body.appendChild(link);
        link.href = url;
        link.download = filename;
        link.text = filename;
        link.click();
        document.body.removeChild(link);
      };

      return Path;

    })(Content);
    Item.Path = Path;
    return Path;
  });

}).call(this);
