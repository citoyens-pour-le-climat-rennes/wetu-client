// Generated by CoffeeScript 1.10.0
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['paper', 'R', 'Utils/Utils', 'Tools/Tool', 'Items/Item', 'Commands/Command', 'View/SelectionRectangle'], function(P, R, Utils, Tool, Item, Command, SelectionRectangle) {
    var SelectTool;
    SelectTool = (function(superClass) {
      extend(SelectTool, superClass);

      SelectTool.SelectionRectangle = SelectionRectangle;

      SelectTool.label = 'Select';

      SelectTool.description = '';

      SelectTool.iconURL = R.style === 'line' ? 'icones_icon_arrow.png' : R.style === 'hand' ? 'a-cursor.png' : 'cursor.png';

      SelectTool.cursor = {
        position: {
          x: 0,
          y: 0
        },
        name: 'default'
      };

      SelectTool.drawItems = false;

      SelectTool.order = 1;

      SelectTool.hitOptions = {
        stroke: true,
        fill: true,
        handles: true,
        selected: true
      };

      function SelectTool() {
        this.updateSelectionRectangleCallback = bind(this.updateSelectionRectangleCallback, this);
        this.setSelectionRectangleVisibility = bind(this.setSelectionRectangleVisibility, this);
        SelectTool.__super__.constructor.call(this, true);
        this.selectedItem = null;
        this.selectionRectangle = null;
        return;
      }

      SelectTool.prototype.deselectAll = function(updateOptions) {
        var ref;
        if (updateOptions == null) {
          updateOptions = true;
        }
        if (R.selectedItems.length > 0) {
          R.commandManager.add(new Command.Deselect(void 0, updateOptions), true);
          if ((ref = this.selectionRectangle) != null) {
            ref.remove();
          }
          this.selectionRectangle = null;
        }
        P.project.activeLayer.selected = false;
      };

      SelectTool.prototype.setSelectionRectangleVisibility = function(value) {
        var ref;
        if ((ref = this.selectionRectangle) != null) {
          ref.setVisibility(value);
        }
      };

      SelectTool.prototype.updateSelectionRectangle = function(rotation) {
        Utils.callNextFrame(this.updateSelectionRectangleCallback, 'updateSelectionRectangleCallback', [rotation]);
      };

      SelectTool.prototype.updateSelectionRectangleCallback = function() {
        var ref;
        if (R.selectedItems.length > 0) {
          if (this.selectionRectangle == null) {
            this.selectionRectangle = SelectionRectangle.create();
          }
          this.selectionRectangle.update();
          $(this).trigger('selectionRectangleUpdated');
        } else {
          if ((ref = this.selectionRectangle) != null) {
            ref.remove();
          }
          this.selectionRectangle = null;
        }
      };

      SelectTool.prototype.select = function(deselectItems, updateParameters, forceSelect) {
        if (deselectItems == null) {
          deselectItems = false;
        }
        if (updateParameters == null) {
          updateParameters = true;
        }
        if (forceSelect == null) {
          forceSelect = false;
        }
        SelectTool.__super__.select.call(this, false, updateParameters);
      };

      SelectTool.prototype.deselect = function() {
        R.canvasJ.css({
          cursor: 'auto'
        });
        SelectTool.__super__.deselect.apply(this, arguments);
      };

      SelectTool.prototype.updateParameters = function() {
        R.controllerManager.updateParametersForSelectedItems();
      };

      SelectTool.prototype.highlightItemsUnderRectangle = function(rectangle) {
        var bounds, item, itemsToHighlight, name, ref;
        itemsToHighlight = [];
        ref = R.items;
        for (name in ref) {
          item = ref[name];
          if (item instanceof Item.Drawing) {
            item.unhighlight();
            bounds = item.getBounds();
            if (bounds.intersects(rectangle)) {
              item.highlight();
            }
            if (rectangle.area === 0) {
              break;
            }
          }
        }
      };

      SelectTool.prototype.unhighlightItems = function() {
        var item, name, ref;
        ref = R.items;
        for (name in ref) {
          item = ref[name];
          if (item instanceof Item.Drawing) {
            item.unhighlight();
          }
        }
      };

      SelectTool.prototype.createSelectionHighlight = function(event) {
        var highlightPath, rectangle;
        rectangle = new P.Rectangle(event.downPoint, event.point);
        highlightPath = new P.Path.Rectangle(rectangle);
        highlightPath.name = 'select tool selection rectangle';
        highlightPath.strokeColor = R.selectionBlue;
        highlightPath.strokeScaling = false;
        highlightPath.dashArray = [10, 4];
        R.view.selectionLayer.addChild(highlightPath);
        R.currentPaths[R.me] = highlightPath;
        this.highlightItemsUnderRectangle(rectangle);
      };

      SelectTool.prototype.updateSelectionHighlight = function(event) {
        var rectangle;
        rectangle = new P.Rectangle(event.downPoint, event.point);
        Utils.Rectangle.updatePathRectangle(R.currentPaths[R.me], rectangle);
        this.highlightItemsUnderRectangle(rectangle);
      };

      SelectTool.prototype.populateItemsToSelect = function(itemsToSelect, locksToSelect, rectangle) {
        var allDrawingsInRectangleBox, drawing, hitResult, i, item, justClicked, len, name, ref;
        justClicked = rectangle.area === 0;
        if (justClicked) {
          rectangle = rectangle.expand(5);
        }
        allDrawingsInRectangleBox = [];
        ref = R.items;
        for (name in ref) {
          item = ref[name];
          if (item.getBounds().intersects(rectangle) && item.isVisible()) {
            if (item instanceof Item.Drawing) {
              allDrawingsInRectangleBox.push(item);
            } else {
              if (justClicked) {
                if (item instanceof Item.Path) {
                  hitResult = item.performHitTest(rectangle.center, {
                    segments: true,
                    stroke: true,
                    handles: false,
                    tolerance: 5
                  });
                  if (hitResult != null) {
                    itemsToSelect.push(item);
                  }
                }
              } else {
                itemsToSelect.push(item);
              }
            }
          }
        }
        if (allDrawingsInRectangleBox.length === 1) {
          itemsToSelect.length = 0;
          itemsToSelect.push(allDrawingsInRectangleBox[0]);
        }
        if (justClicked && allDrawingsInRectangleBox.length > 0 && itemsToSelect.length === 0) {
          for (i = 0, len = allDrawingsInRectangleBox.length; i < len; i++) {
            drawing = allDrawingsInRectangleBox[i];
            itemsToSelect.push(drawing);
          }
        }
        return false;
      };

      SelectTool.prototype.itemsAreSiblings = function(itemsToSelect) {
        var i, item, itemsAreSiblings, len, parent;
        itemsAreSiblings = true;
        parent = itemsToSelect[0].group.parent;
        for (i = 0, len = itemsToSelect.length; i < len; i++) {
          item = itemsToSelect[i];
          if (item.group.parent !== parent) {
            itemsAreSiblings = false;
            break;
          }
        }
        return itemsAreSiblings;
      };

      SelectTool.prototype.removeLocksChildren = function(itemsToSelect, locksToSelect) {
        var child, i, j, len, len1, lock, ref;
        for (i = 0, len = locksToSelect.length; i < len; i++) {
          lock = locksToSelect[i];
          ref = lock.children();
          for (j = 0, len1 = ref.length; j < len1; j++) {
            child = ref[j];
            Utils.Array.remove(itemsToSelect, child);
          }
        }
      };

      SelectTool.prototype.isDrawingSelected = function() {
        var i, item, len, ref;
        ref = R.selectedItems;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          if (Item.Drawing.prototype.isPrototypeOf(item)) {
            return true;
          }
        }
        return false;
      };

      SelectTool.prototype.selectItems = function(event) {
        var itemsToSelect, locksToSelect, rectangle, selectDrawing;
        rectangle = new P.Rectangle(event.downPoint, event.point);
        itemsToSelect = [];
        locksToSelect = [];
        selectDrawing = this.populateItemsToSelect(itemsToSelect, locksToSelect, rectangle);
        if (selectDrawing) {
          this.deselectAll();
        }
        if (itemsToSelect.length === 0) {
          itemsToSelect = locksToSelect;
        }
        if (itemsToSelect.length > 0) {
          R.commandManager.add(new Command.Select(itemsToSelect), true);
        }
      };

      SelectTool.prototype.begin = function(event) {
        var controller, hitResult, itemWasHit, name, path, ref, ref1, ref2;
        if (event.event.which === 2) {
          return;
        }
        itemWasHit = false;
        if (this.selectionRectangle != null) {
          itemWasHit = this.selectionRectangle.hitTest(event);
        }
        if (!itemWasHit && R.administrator) {
          ref = R.paths;
          for (name in ref) {
            path = ref[name];
            path.prepareHitTest();
          }
          hitResult = P.project.hitTest(event.point, this.constructor.hitOptions);
          ref1 = R.paths;
          for (name in ref1) {
            path = ref1[name];
            path.finishHitTest();
          }
          controller = hitResult != null ? hitResult.item.controller : void 0;
          if (controller != null) {
            controller.hitTest(event);
          }
          itemWasHit = controller != null;
        }
        if (!itemWasHit) {
          if (!event.event.shiftKey || this.isDrawingSelected()) {
            this.deselectAll();
          } else {
            if ((ref2 = this.selectionRectangle) != null) {
              ref2.remove();
            }
            this.selectionRectangle = null;
          }
          this.createSelectionHighlight(event);
        }
      };

      SelectTool.prototype.update = function(event) {
        if (this.selectionRectangle != null) {
          R.commandManager.updateAction(event);
        } else if (R.currentPaths[R.me] != null) {
          this.updateSelectionHighlight(event);
        }
      };

      SelectTool.prototype.move = function(event) {
        var id, item, ref;
        ref = R.items;
        for (id in ref) {
          item = ref[id];
          if (item.getBounds().contains(event.point)) {
            R.canvasJ.css({
              cursor: 'pointer'
            });
            return;
          }
        }
        R.canvasJ.css({
          cursor: 'auto'
        });
      };

      SelectTool.prototype.end = function(event) {
        if (this.selectionRectangle != null) {
          R.commandManager.endAction(event);
        } else if (R.currentPaths[R.me] != null) {
          this.selectItems(event);
          R.currentPaths[R.me].remove();
          delete R.currentPaths[R.me];
          this.unhighlightItems();
        }
      };

      SelectTool.prototype.doubleClick = function(event) {
        var i, item, len, ref;
        ref = R.selectedItems;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          if (typeof item.doubleClick === "function") {
            item.doubleClick(event);
          }
        }
      };

      SelectTool.prototype.disableSnap = function() {
        return R.currentPaths[R.me] != null;
      };

      SelectTool.prototype.keyUp = function(event) {
        var delta, i, item, len, ref, ref1, selectedItems;
        if ((ref = event.key) === 'left' || ref === 'right' || ref === 'up' || ref === 'down') {
          delta = event.modifiers.shift ? 50 : event.modifiers.option ? 5 : 1;
        }
        switch (event.key) {
          case 'escape':
            this.deselectAll();
            break;
          case 'delete':
          case 'backspace':
            selectedItems = R.selectedItems.slice();
            for (i = 0, len = selectedItems.length; i < len; i++) {
              item = selectedItems[i];
              if (((ref1 = item.selectionState) != null ? ref1.segment : void 0) != null) {
                item.deletePointCommand();
              } else {
                item.deleteCommand();
              }
            }
        }
      };

      return SelectTool;

    })(Tool);
    R.Tools.Select = SelectTool;
    return SelectTool;
  });

}).call(this);
