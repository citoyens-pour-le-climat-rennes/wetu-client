// Generated by CoffeeScript 1.10.0
(function() {
  var dependencies;

  dependencies = ['R', 'Utils/Utils', 'Tools/Tool', 'UI/Button', 'Tools/MoveTool', 'Tools/SelectTool', 'Tools/PathTool', 'Tools/EraserTool', 'Tools/ItemTool', 'Tools/Tracer', 'UI/Modal', 'i18next'];

  define('Tools/ToolManager', dependencies, function(R, Utils, Tool, Button, MoveTool, SelectTool, PathTool, EraserTool, ItemTool, Tracer, Modal, i18next) {
    var ToolManager;
    ToolManager = (function() {
      function ToolManager() {
        var defaultFavoriteTools, error, error1;
        R.ToolsJ = $(".tool-list");
        R.favoriteToolsJ = $("#FavoriteTools .tool-list");
        R.allToolsContainerJ = $("#AllTools");
        R.allToolsJ = R.allToolsContainerJ.find(".all-tool-list");
        R.favoriteTools = [];
        if (typeof localStorage !== "undefined" && localStorage !== null) {
          try {
            R.favoriteTools = JSON.parse(localStorage.favorites);
          } catch (error1) {
            error = error1;
            console.log(error);
          }
        }
        R.tools.move = new R.Tools.Move();
        R.tools.select = new R.Tools.Select();
        R.tracer = new Tracer();
        R.tools.eraser = new R.Tools.Eraser();
        R.tools.eraser.btn.hide();
        defaultFavoriteTools = [];
        while (R.favoriteTools.length < 8 && defaultFavoriteTools.length > 0) {
          Utils.Array.pushIfAbsent(R.favoriteTools, defaultFavoriteTools.pop().label);
        }
        R.tools.move.select();
        R.wacomPlugin = document.getElementById('wacomPlugin');
        if (R.wacomPlugin != null) {
          R.wacomPenAPI = wacomPlugin.penAPI;
          R.wacomTouchAPI = wacomPlugin.touchAPI;
          R.wacomPointerType = {
            0: 'Mouse',
            1: 'Pen',
            2: 'Puck',
            3: 'Eraser'
          };
        }
        this.createZoombuttons();
        this.createUndoRedoButtons();
        this.createInfoButton();
        return;
      }

      ToolManager.prototype.zoom = function(value, snap) {
        var bounds, i, j, len, len1, newZoom, ref, v, zoomValues;
        if (snap == null) {
          snap = true;
        }
        if (P.view.zoom * value < 0.125 || P.view.zoom * value > 4) {
          return;
        }
        bounds = R.view.getViewBounds(true);
        if (value < 1 && bounds.contains(R.view.grid.limitCD.bounds)) {
          return;
        }
        if (bounds.contains(R.view.grid.limitCD.bounds.scale(value))) {
          R.view.fitRectangle(R.view.grid.limitCD.bounds.expand(200), true);
          return;
        }
        if (snap) {
          newZoom = 1;
          zoomValues = [0.125, 0.25, 0.5, 1, 2, 4];
          if (value < 1) {
            for (i = 0, len = zoomValues.length; i < len; i++) {
              v = zoomValues[i];
              if (P.view.zoom > v) {
                newZoom = v;
              } else {
                break;
              }
            }
          } else {
            for (j = 0, len1 = zoomValues.length; j < len1; j++) {
              v = zoomValues[j];
              if (P.view.zoom < v) {
                newZoom = v;
                break;
              }
            }
          }
          P.view.zoom = newZoom;
        } else {
          P.view.zoom *= value;
        }
        if ((ref = R.tracer) != null) {
          ref.update();
        }
        R.view.moveBy(new P.Point());
      };

      ToolManager.prototype.createZoombuttons = function() {
        this.zoomInBtn = new Button({
          name: 'Zoom +',
          iconURL: R.style === 'line' ? 'icones_icon_zoomin.png' : R.style === 'hand' ? 'a-zoomIn.png' : 'glyphicon-zoom-in',
          favorite: true,
          category: null,
          disableHover: true,
          popover: true,
          order: 1
        });
        this.zoomInBtn.btnJ.click((function(_this) {
          return function() {
            return _this.zoom(2);
          };
        })(this));
        this.zoomOutBtn = new Button({
          name: 'Zoom -',
          iconURL: R.style === 'line' ? 'icones_icon_zoomout.png' : R.style === 'hand' ? 'a-zoomOut.png' : 'glyphicon-zoom-out',
          favorite: true,
          category: null,
          disableHover: true,
          popover: true,
          order: 2
        });
        this.zoomOutBtn.btnJ.click((function(_this) {
          return function() {
            return _this.zoom(0.5);
          };
        })(this));
      };

      ToolManager.prototype.createUndoRedoButtons = function() {
        this.undoBtn = new Button({
          name: 'Undo',
          iconURL: R.style === 'line' ? 'icones_icon_back_02.png' : R.style === 'hand' ? 'a-undo.png' : 'glyphicon-share-alt',
          favorite: true,
          category: null,
          disableHover: true,
          popover: true,
          order: null,
          transform: 'scaleX(-1)'
        });
        this.undoBtn.hide();
        this.undoBtn.btnJ.click(function() {
          return R.commandManager.undo();
        });
        this.redoBtn = new Button({
          name: 'Redo',
          iconURL: R.style === 'line' ? 'icones_icon_forward_02.png' : R.style === 'hand' ? 'a-redo.png' : 'glyphicon-share-alt',
          favorite: true,
          category: null,
          disableHover: true,
          popover: true,
          order: null
        });
        this.redoBtn.hide();
        this.redoBtn.btnJ.click(function() {
          return R.commandManager["do"]();
        });
      };

      ToolManager.prototype.createInfoButton = function() {
        this.infoBtn = new Button({
          name: 'Help',
          iconURL: 'icones_info.png',
          favorite: false,
          category: null,
          popover: true,
          order: 1000,
          classes: 'align-end',
          parentJ: $("#user-profile"),
          prepend: true,
          divType: 'div'
        });
        this.infoBtn.btnJ.click(function() {
          var mailJ, modal, welcomeTextJ;
          welcomeTextJ = $('#welcome-text');
          modal = Modal.createModal({
            id: 'info',
            title: 'Welcome to Comme un Dessein',
            submit: (function() {})
          });
          modal.addCustomContent({
            divJ: welcomeTextJ.clone(),
            name: 'welcome-text'
          });
          modal.modalJ.find('[name="cancel"]').hide();
          mailJ = $('<div>' + i18next.t('Contact us at') + ' <a href="mailto:idlv.contact@gmail.com">idlv.contact@gmail.com</a></div>');
          modal.addCustomContent({
            divJ: mailJ
          });
          modal.show();
        });
      };

      ToolManager.prototype.createSubmitButton = function() {
        this.submitButton = new Button({
          name: 'Submit drawing',
          iconURL: 'icones_icon_proposer_02.png',
          classes: 'btn-success displayName',
          parentJ: $('#submit-drawing-button'),
          ignoreFavorite: true,
          onClick: (function(_this) {
            return function() {
              var ref;
              if ((ref = R.tracer) != null) {
                ref.hide();
              }
              R.drawingPanel.submitDrawingClicked();
            };
          })(this)
        });
        this.submitButton.hide();
      };

      ToolManager.prototype.createDeleteButton = function() {
        this.deleteButton = new Button({
          name: 'Delete draft',
          iconURL: 'icones_cancel_02.png',
          classes: 'btn-danger',
          parentJ: $('#submit-drawing-button'),
          ignoreFavorite: true,
          onClick: (function(_this) {
            return function() {
              var draft;
              draft = R.Drawing.getDraft();
              if (draft != null) {
                draft.removePaths(true);
              }
              R.tools['Precise path'].showDraftLimits();
            };
          })(this)
        });
        this.deleteButton.hide();
      };

      ToolManager.prototype.updateButtonsVisibility = function(draft) {
        var ref, ref1;
        if (draft == null) {
          draft = null;
        }
        if (R.selectedTool === R.tools['Precise path'] || R.selectedTool === R.tools.eraser) {
          this.redoBtn.show();
          this.undoBtn.show();
          this.submitButton.show();
          this.deleteButton.show();
          if ((ref = R.tracer) != null) {
            ref.showButton();
          }
          R.tools.eraser.btn.show();
        } else {
          this.redoBtn.hide();
          this.undoBtn.hide();
          this.submitButton.hide();
          this.deleteButton.hide();
          if ((ref1 = R.tracer) != null) {
            ref1.hideButton();
          }
          R.tools.eraser.btn.hide();
        }
        if (draft == null) {
          draft = R.Drawing.getDraft();
        }
        if ((draft == null) || (draft.paths == null) || draft.paths.length === 0 || (R.drawingPanel.opened && R.drawingPanel.status !== 'information')) {
          this.submitButton.hide();
          this.deleteButton.hide();
        } else {
          this.submitButton.show();
          this.deleteButton.show();
        }
      };

      ToolManager.prototype.enterDrawingMode = function() {
        var id, item, ref;
        if (R.selectedTool !== R.tools['Precise path']) {
          R.tools['Precise path'].select();
        }
        ref = R.items;
        for (id in ref) {
          item = ref[id];
          if (R.items[id].owner === R.me) {
            R.drawingPanel.showSubmitDrawing();
            break;
          }
        }
      };

      ToolManager.prototype.leaveDrawingMode = function(selectTool) {
        if (selectTool == null) {
          selectTool = false;
        }
        if (selectTool) {
          R.tools.select.select(false, true, true);
        }
        R.drawingPanel.hideSubmitDrawing();
      };

      ToolManager.prototype.enableDrawingButton = function(enable) {
        if (enable) {
          R.sidebar.favoriteToolsJ.find("[data-name='Precise path']").css({
            opacity: 1
          });
        } else {
          R.sidebar.favoriteToolsJ.find("[data-name='Precise path']").css({
            opacity: 0.25
          });
        }
      };

      return ToolManager;

    })();
    return ToolManager;
  });

}).call(this);
