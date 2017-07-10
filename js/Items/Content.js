// Generated by CoffeeScript 1.10.0
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['Items/Item'], function(Item) {
    var Content;
    Content = (function(superClass) {
      extend(Content, superClass);

      Content.initializeParameters = function() {
        var parameters;
        parameters = Content.__super__.constructor.initializeParameters.call(this);
        delete parameters['Items'].align;
        parameters['Items'].duplicate = R.parameters.duplicate;
        return parameters;
      };

      Content.parameters = Content.initializeParameters();

      function Content(data1, pk1, date, itemListJ, sortedItems) {
        this.data = data1;
        this.pk = pk1;
        this.date = date;
        this.sortedItems = sortedItems;
        this.onLiClick = bind(this.onLiClick, this);
        Content.__super__.constructor.call(this, this.data, this.pk);
        if (this.date == null) {
          this.date = Date.now();
        }
        this.rotation = this.data.rotation || 0;
        return;
      }

      Content.prototype.getDuplicateData = function() {
        var data, ref;
        data = Content.__super__.getDuplicateData.call(this);
        data.lock = (ref = this.lock) != null ? ref.getPk() : void 0;
        return data;
      };

      Content.prototype.getListItem = function() {
        return R.view.draftListJ;
      };

      Content.prototype.addToListItem = function(itemListJ1) {
        var nItemsJ, ref, ref1, title;
        this.itemListJ = itemListJ1;
        title = '' + this.title + ' by ' + this.owner;
        this.liJ = $("<li>");
        this.liJ.html(title);
        this.liJ.attr("data-pk", this.pk);
        this.liJ.click(this.onLiClick);
        this.liJ.mouseover((function(_this) {
          return function(event) {
            _this.highlight();
          };
        })(this));
        this.liJ.mouseout((function(_this) {
          return function(event) {
            _this.unhighlight();
          };
        })(this));
        this.liJ.rItem = this;
        if ((ref = this.itemListJ) != null) {
          ref.find('.rPath-list').prepend(this.liJ);
        }
        nItemsJ = (ref1 = this.itemListJ) != null ? ref1.find(".n-items") : void 0;
        if ((nItemsJ != null) && nItemsJ.length > 0) {
          nItemsJ.html(this.itemListJ.find('.rPath-list').children().length);
        }
      };

      Content.prototype.removeFromListItem = function() {
        var nItemsJ, ref;
        this.liJ.remove();
        nItemsJ = (ref = this.itemListJ) != null ? ref.find(".n-items") : void 0;
        if ((nItemsJ != null) && nItemsJ.length > 0) {
          nItemsJ.html(this.itemListJ.find('.rPath-list').children().length);
        }
      };

      Content.prototype.onLiClick = function(event) {
        var bounds;
        if (!event.shiftKey) {
          R.tools.select.deselectAll();
          bounds = this.getBounds();
          if (!P.view.bounds.intersects(bounds)) {
            R.view.moveTo(bounds.center, 1000);
          }
        }
        this.select();
      };

      Content.prototype.rotate = function(rotation, center, update) {
        this.setRotation(this.rotation + rotation, center, update);
      };

      Content.prototype.setRotation = function(rotation, center, update) {
        var delta, deltaRotation;
        deltaRotation = rotation - this.rotation;
        this.rotation = rotation;
        this.group.rotate(deltaRotation, center);
        delta = this.rectangle.center.subtract(center);
        this.rectangle.center = center.add(delta.rotate(deltaRotation));
        if (!this.socketAction) {
          if (update) {
            this.update('rotation');
          }
          R.socket.emit("bounce", {
            itemPk: this.pk,
            "function": "setRotation",
            "arguments": [rotation, center, false]
          });
        }
      };

      Content.prototype.getData = function() {
        var data;
        data = jQuery.extend({}, Content.__super__.getData.call(this));
        data.rotation = this.rotation;
        return data;
      };

      Content.prototype.getBounds = function() {
        if (this.rotation === 0) {
          return this.rectangle;
        }
        return Utils.Rectangle.getRotatedBounds(this.rectangle, this.rotation);
      };

      Content.prototype.setZindex = function() {
        var dateLabel, zindexLabel;
        dateLabel = '' + this.date;
        dateLabel = dateLabel.substring(dateLabel.length - 7, dateLabel.length - 3);
        zindexLabel = this.constructor.label;
        if (dateLabel.length > 0) {
          zindexLabel += ' - ' + dateLabel;
        }
      };

      Content.prototype.updateZindex = function() {
        var i, item, j, len, ref;
        if (this.date == null) {
          return;
        }
        if (this.sortedItems.length === 0) {
          this.sortedItems.push(this);
          this.setZindex();
          return;
        }
        ref = this.sortedItems;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          item = ref[i];
          if (this.date < item.date) {
            this.insertBelow(item, i);
            return;
          }
        }
        this.insertAbove(_.last(this.sortedItems));
      };

      Content.prototype.insertAbove = function(item, index, update) {
        var nextDate, previousDate;
        if (index == null) {
          index = null;
        }
        if (update == null) {
          update = false;
        }
        this.group.insertAbove(item.group);
        if (!index) {
          Utils.Array.remove(this.sortedItems, this);
          index = this.sortedItems.indexOf(item) + 1;
        }
        this.sortedItems.splice(index, 0, this);
        if (update) {
          if (this.sortedItems[index + 1] == null) {
            this.date = Date.now();
          } else {
            previousDate = this.sortedItems[index - 1].date;
            nextDate = this.sortedItems[index + 1].date;
            this.date = (previousDate + nextDate) / 2;
          }
          this.update('z-index');
        }
        this.setZindex();
      };

      Content.prototype.insertBelow = function(item, index, update) {
        var nextDate, previousDate;
        if (index == null) {
          index = null;
        }
        if (update == null) {
          update = false;
        }
        this.group.insertBelow(item.group);
        if (!index) {
          Utils.Array.remove(this.sortedItems, this);
          index = this.sortedItems.indexOf(item);
        }
        this.sortedItems.splice(index, 0, this);
        if (update) {
          if (this.sortedItems[index - 1] == null) {
            this.date = this.sortedItems[index + 1].date - 1000;
          } else {
            previousDate = this.sortedItems[index - 1].date;
            nextDate = this.sortedItems[index + 1].date;
            this.date = (previousDate + nextDate) / 2;
          }
          this.update('z-index');
        }
        this.setZindex();
      };

      Content.prototype.setPK = function(pk) {
        Content.__super__.setPK.apply(this, arguments);
      };

      Content.prototype.select = function(updateOptions) {
        if (updateOptions == null) {
          updateOptions = true;
        }
        if (!Content.__super__.select.call(this, updateOptions)) {
          return false;
        }
        return true;
      };

      Content.prototype.deselect = function(updateOptions) {
        if (updateOptions == null) {
          updateOptions = true;
        }
        if (!Content.__super__.deselect.call(this, updateOptions)) {
          return false;
        }
        return true;
      };

      Content.prototype.finish = function() {
        var bounds, j, len, lock, locks;
        if (!Content.__super__.finish.call(this)) {
          return false;
        }
        bounds = this.getBounds();
        if (bounds.area > R.rasterizer.maxArea()) {
          R.alertManager.alert("The item is too big", "Warning");
          this.remove();
          return false;
        }
        locks = Item.Lock.getLocksWhichIntersect(bounds);
        for (j = 0, len = locks.length; j < len; j++) {
          lock = locks[j];
          if (lock.rectangle.intersects(bounds)) {
            if (lock.rectangle.contains(bounds) && lock.owner === R.me) {
              lock.addItem(this);
            } else if (lock.owner !== R.me) {
              R.alertManager.alert("The item intersects with a lock", "Warning");
              this.remove();
              return false;
            }
          }
        }
        return true;
      };

      Content.prototype.remove = function() {
        Content.__super__.remove.call(this);
        if (this.sortedItems != null) {
          Utils.Array.remove(this.sortedItems, this);
        }
      };

      Content.prototype["delete"] = function() {
        if ((this.lock != null) && this.lock.owner !== R.me) {
          return;
        }
        Content.__super__["delete"].call(this);
      };

      Content.prototype.update = function() {};

      return Content;

    })(Item);
    Item.Content = Content;
    return Content;
  });

}).call(this);
