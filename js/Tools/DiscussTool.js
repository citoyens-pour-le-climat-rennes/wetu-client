// Generated by CoffeeScript 1.10.0
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['paper', 'R', 'Utils/Utils', 'Tools/Tool', 'Items/Item', 'Items/Discussion', 'Commands/Command', 'UI/Modal', 'i18next', 'moment'], function(P, R, Utils, Tool, Item, Discussion, Command, Modal, i18next, moment) {
    var DiscussTool;
    DiscussTool = (function(superClass) {
      extend(DiscussTool, superClass);

      DiscussTool.label = 'Discuss';

      DiscussTool.popover = false;

      DiscussTool.iconURL = 'new 1/Discuss.svg';

      DiscussTool.buttonClasses = 'displayName';

      DiscussTool.cursor = {
        position: {
          x: 0,
          y: 0
        },
        name: 'pointer'
      };

      function DiscussTool() {
        if (!R.isCommeUnDessein) {
          DiscussTool.__super__.constructor.call(this, true);
        }
        this.discussions = new Map();
        this.currentDiscussion = null;
        return;
      }

      DiscussTool.prototype.select = function(deselectItems, updateParameters, forceSelect, selectedBy) {
        var ref, ref1;
        if (deselectItems == null) {
          deselectItems = false;
        }
        if (updateParameters == null) {
          updateParameters = true;
        }
        if (forceSelect == null) {
          forceSelect = false;
        }
        if (selectedBy == null) {
          selectedBy = 'default';
        }
        if (R.isCommeUnDessein) {
          return;
        }
        if ((ref = R.city) != null ? ref.finished : void 0) {
          R.alertManager.alert("Cette édition est terminée, vous ne pouvez plus discuter.", 'info');
          return;
        }
        if (!R.userAuthenticated && !forceSelect) {
          R.alertManager.alert('Log in before discussing', 'info');
          return;
        }
        if ((ref1 = R.tracer) != null) {
          ref1.hide();
        }
        DiscussTool.__super__.select.call(this, false, updateParameters, selectedBy);
        R.tools.select.deselectAll();
      };

      DiscussTool.prototype.deselect = function() {
        if (R.isCommeUnDessein) {
          return;
        }
        DiscussTool.__super__.deselect.apply(this, arguments);
        if ((this.currentDiscussion != null) && this.currentDiscussion.status === 'draft') {
          this.removeCurrentDiscussion();
          R.drawingPanel.close();
        }
      };

      DiscussTool.prototype.begin = function(event) {
        var discussions;
        if (!R.view.grid.limitCDRectangle.contains(event.point)) {
          return;
        }
        discussions = R.view.discussionLayer.getItems({
          match: function(item) {
            return item.data.type === 'discussion' && item.bounds.contains(event.point);
          }
        });
        this.clickedDiscussions = null;
        if ((discussions != null) && discussions.length > 0) {
          this.clickedDiscussions = discussions;
          return;
        }
        this.currentDiscussion = new Discussion(event.point);
        this.discussions.set(this.currentDiscussion.id, this.currentDiscussion);
      };

      DiscussTool.prototype.update = function(event) {
        var ref;
        if ((ref = this.currentDiscussion) != null) {
          ref.setPosition(event.point);
        }
      };

      DiscussTool.prototype.move = function(event) {
        var ref;
        if (R.isCommeUnDessein) {
          return;
        }
        if (((ref = event.originalEvent) != null ? ref.target : void 0) !== document.getElementById('canvas')) {
          return;
        }
      };

      DiscussTool.prototype.end = function(event) {
        if (R.isCommeUnDessein) {
          return;
        }
        if (!R.view.grid.limitCDRectangle.contains(event.point)) {
          return;
        }
        if ((this.clickedDiscussions != null) && event.point.equals(event.downPoint)) {
          this.currentDiscussion = Utils.Array.random(this.clickedDiscussions).data.discussion;
          if (this.clickedDiscussions.length > 1) {
            R.alertManager.alert("Click again to select other discussion at this point", 'info');
          }
          this.clickedDiscussions = null;
          R.drawingPanel.openDiscussion(this.currentDiscussion);
          return;
        }
        this.clickedDiscussions = null;
        R.drawingPanel.addDiscussionClicked();
      };

      DiscussTool.prototype.updateCurrentDiscussion = function(text) {
        var ref;
        if ((ref = this.currentDiscussion) != null) {
          ref.updateTitle(text);
        }
      };

      DiscussTool.prototype.centerOnDiscussion = function() {
        if (this.currentDiscussion == null) {
          return;
        }
        R.view.fitRectangle(this.currentDiscussion.rectangle.bounds, true);
      };

      DiscussTool.prototype.doubleClick = function(event) {};

      DiscussTool.prototype.keyUp = function(event) {};

      DiscussTool.prototype.removeCurrentDiscussion = function() {
        this.currentDiscussion["delete"]();
        this.discussions["delete"](this.currentDiscussion.clientId);
        this.currentDiscussion = null;
      };

      DiscussTool.prototype.removeDisucssionsInRectangle = function(rectangle) {
        if (R.isCommeUnDessein) {
          return;
        }
        console.log('remove discussions');
        this.discussions.forEach((function(_this) {
          return function(discussion, id) {
            if (rectangle.contains(discussion.rectangle.bounds)) {
              console.log('delete: ' + discussion.pointText.content);
              discussion.remove();
              return _this.discussions["delete"](discussion.id);
            }
          };
        })(this));
      };

      DiscussTool.prototype.createDiscussion = function(data) {
        var bounds, discussion, pk;
        bounds = R.view.grid.boundsFromBox(data.box);
        pk = data._id.$oid;
        discussion = new Discussion(bounds.center, data.title, data.clientId, pk, data.owner, 'loaded');
        console.log('create: ' + discussion.pointText.content);
        this.discussions.set(discussion.id, discussion);
      };

      return DiscussTool;

    })(Tool);
    R.Tools.Discuss = DiscussTool;
    return DiscussTool;
  });

}).call(this);

//# sourceMappingURL=DiscussTool.js.map
