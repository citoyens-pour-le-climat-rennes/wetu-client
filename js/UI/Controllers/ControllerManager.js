// Generated by CoffeeScript 1.10.0
(function() {
  var dependencies,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  dependencies = ['paper', 'R', 'Utils/Utils', 'UI/Controllers/Controller', 'UI/Controllers/ColorController', 'UI/Controllers/Folder'];

  if (typeof document !== "undefined" && document !== null) {
    dependencies.push('gui');
  }

  define('UI/Controllers/ControllerManager', dependencies, function(P, R, Utils, Controller, ColorController, Folder, GUI) {
    var ControllerManager;
    ControllerManager = (function() {
      ControllerManager.initializeGlobalParameters = function() {
        var colorName, hueRange, i, j, minHue, step;
        R.defaultColors = [];
        R.polygonMode = false;
        R.selectionBlue = '#2fa1d6';
        hueRange = Utils.random(10, 180);
        minHue = Utils.random(0, 360 - hueRange);
        step = hueRange / 10;
        for (i = j = 0; j <= 10; i = ++j) {
          R.defaultColors.push(new P.Color({
            hue: minHue + i * step,
            saturation: Utils.random(0.3, 0.9),
            lightness: Utils.random(0.5, 0.7)
          }).toCSS());
        }
        R.parameters = {};
        R.parameters['General'] = {};
        R.parameters['General'].location = {
          type: 'string',
          label: 'Location',
          "default": '0.0, 0.0',
          permanent: true,
          onFinishChange: function(value) {
            R.view.setPositionFromString(value);
          }
        };
        R.parameters['General'].zoom = {
          type: 'slider',
          label: 'Zoom',
          min: 25,
          max: 500,
          "default": 100,
          permanent: true,
          onChange: function(value) {
            var div, k, len, ref;
            P.view.zoom = value / 100.0;
            R.view.grid.update();
            R.rasterizer.move();
            ref = R.divs;
            for (k = 0, len = ref.length; k < len; k++) {
              div = ref[k];
              div.updateTransform();
            }
          },
          onFinishChange: function(value) {
            R.loader.load();
          }
        };
        R.parameters["default"] = {};
        R.parameters.strokeWidth = {
          type: 'slider',
          label: 'Stroke width',
          min: 1,
          max: 100,
          "default": 5
        };
        R.parameters.strokeColor = {
          type: 'color',
          label: 'Stroke color',
          "default": Utils.Array.random(R.defaultColors),
          defaultCheck: true
        };
        R.parameters.fillColor = {
          type: 'color',
          label: 'Fill color',
          "default": Utils.Array.random(R.defaultColors),
          defaultCheck: false
        };
        R.parameters["delete"] = {
          type: 'button',
          label: 'Delete items',
          "default": function() {
            var item, k, len, selectedItems;
            selectedItems = R.selectedItems.slice();
            for (k = 0, len = selectedItems.length; k < len; k++) {
              item = selectedItems[k];
              item.deleteCommand();
            }
          },
          onChange: function() {}
        };
        R.parameters.duplicate = {
          type: 'button',
          label: 'Duplicate items',
          "default": function() {
            var item, k, len, ref;
            ref = R.selectedItems;
            for (k = 0, len = ref.length; k < len; k++) {
              item = ref[k];
              item.duplicateCommand();
            }
          }
        };
        R.parameters.align = {
          type: 'button-group',
          label: 'Align',
          "default": '',
          initializeController: function(controller) {
            var align, alignJ, domElement;
            domElement = controller.datController.domElement;
            $(domElement).find('input').remove();
            align = function(type) {
              var avgX, avgY, bottom, bounds, item, items, k, l, left, len, len1, len10, len11, len2, len3, len4, len5, len6, len7, len8, len9, m, n, o, p, q, r, right, s, t, top, u, v, xMax, xMin, yMax, yMin;
              items = R.selectedItems;
              switch (type) {
                case 'h-top':
                  yMin = NaN;
                  for (k = 0, len = items.length; k < len; k++) {
                    item = items[k];
                    top = item.getBounds().top;
                    if (isNaN(yMin) || top < yMin) {
                      yMin = top;
                    }
                  }
                  items.sort(function(a, b) {
                    return a.getBounds().top - b.getBounds().top;
                  });
                  for (l = 0, len1 = items.length; l < len1; l++) {
                    item = items[l];
                    bounds = item.getBounds();
                    item.moveTo(new P.Point(bounds.centerX, top + bounds.height / 2));
                  }
                  break;
                case 'h-center':
                  avgY = 0;
                  for (m = 0, len2 = items.length; m < len2; m++) {
                    item = items[m];
                    avgY += item.getBounds().centerY;
                  }
                  avgY /= items.length;
                  items.sort(function(a, b) {
                    return a.getBounds().centerY - b.getBounds().centerY;
                  });
                  for (n = 0, len3 = items.length; n < len3; n++) {
                    item = items[n];
                    bounds = item.getBounds();
                    item.moveTo(new P.Point(bounds.centerX, avgY));
                  }
                  break;
                case 'h-bottom':
                  yMax = NaN;
                  for (o = 0, len4 = items.length; o < len4; o++) {
                    item = items[o];
                    bottom = item.getBounds().bottom;
                    if (isNaN(yMax) || bottom > yMax) {
                      yMax = bottom;
                    }
                  }
                  items.sort(function(a, b) {
                    return a.getBounds().bottom - b.getBounds().bottom;
                  });
                  for (p = 0, len5 = items.length; p < len5; p++) {
                    item = items[p];
                    bounds = item.getBounds();
                    item.moveTo(new P.Point(bounds.centerX, bottom - bounds.height / 2));
                  }
                  break;
                case 'v-left':
                  xMin = NaN;
                  for (q = 0, len6 = items.length; q < len6; q++) {
                    item = items[q];
                    left = item.getBounds().left;
                    if (isNaN(xMin) || left < xMin) {
                      xMin = left;
                    }
                  }
                  items.sort(function(a, b) {
                    return a.getBounds().left - b.getBounds().left;
                  });
                  for (r = 0, len7 = items.length; r < len7; r++) {
                    item = items[r];
                    bounds = item.getBounds();
                    item.moveTo(new P.Point(xMin + bounds.width / 2, bounds.centerY));
                  }
                  break;
                case 'v-center':
                  avgX = 0;
                  for (s = 0, len8 = items.length; s < len8; s++) {
                    item = items[s];
                    avgX += item.getBounds().centerX;
                  }
                  avgX /= items.length;
                  items.sort(function(a, b) {
                    return a.getBounds().centerY - b.getBounds().centerY;
                  });
                  for (t = 0, len9 = items.length; t < len9; t++) {
                    item = items[t];
                    bounds = item.getBounds();
                    item.moveTo(new P.Point(avgX, bounds.centerY));
                  }
                  break;
                case 'v-right':
                  xMax = NaN;
                  for (u = 0, len10 = items.length; u < len10; u++) {
                    item = items[u];
                    right = item.getBounds().right;
                    if (isNaN(xMax) || right > xMax) {
                      xMax = right;
                    }
                  }
                  items.sort(function(a, b) {
                    return a.getBounds().right - b.getBounds().right;
                  });
                  for (v = 0, len11 = items.length; v < len11; v++) {
                    item = items[v];
                    bounds = item.getBounds();
                    item.moveTo(new P.Point(xMax - bounds.width / 2, bounds.centerY));
                  }
              }
            };
            R.templatesJ.find("#align").clone().appendTo(domElement);
            alignJ = $("#align:first");
            alignJ.find("button").click(function() {
              return align($(this).attr("data-type"));
            });
          }
        };
        colorName = Utils.Array.random(R.defaultColors);
        R.strokeColor = colorName;
        R.fillColor = "rgb(255,255,255,255)";
        R.displayGrid = false;
      };

      ControllerManager.initializeGlobalParameters();

      function ControllerManager() {
        this.updateParametersForSelectedItemsCallback = bind(this.updateParametersForSelectedItemsCallback, this);
        dat.GUI.autoPace = false;
        R.gui = new dat.GUI();
        R.gui.onResize = function() {};
        R.gui.constructor.prototype.onResize = function() {};
        $(R.gui.domElement).children().first().css({
          height: 'auto'
        });
        $(R.gui.domElement).hide();
        dat.GUI.toggleHide = function() {};
        this.folders = {};
        return;
      }

      ControllerManager.prototype.createGlobalControllers = function() {
        var generalFolder, name, parameter, ref;
        generalFolder = new Folder('General');
        ref = R.parameters['General'];
        for (name in ref) {
          parameter = ref[name];
          this.createController(name, parameter, generalFolder);
        }
      };

      ControllerManager.prototype.toggleGui = function() {
        var parentJ;
        parentJ = $(R.gui.domElement).parent();
        if (parentJ.hasClass("dg-sidebar")) {
          $(".dat-gui.dg-right").append(R.gui.domElement);
          localStorage.optionsBarPosition = 'right';
        } else if (parentJ.hasClass("dg-right")) {
          $(".dat-gui.dg-sidebar").append(R.gui.domElement);
          localStorage.optionsBarPosition = 'sidebar';
        }
      };

      ControllerManager.prototype.removeUnusedControllers = function() {
        var controller, folder, folderName, name, ref, ref1;
        ref = this.folders;
        for (folderName in ref) {
          folder = ref[folderName];
          if (folder.name === 'General') {
            continue;
          }
          ref1 = folder.controllers;
          for (name in ref1) {
            controller = ref1[name];
            if (!controller.used) {
              controller.remove();
            } else {
              controller.used = false;
            }
          }
        }
      };

      ControllerManager.prototype.updateHeight = function() {};

      ControllerManager.prototype.createController = function(name, parameter, folder) {
        var controller;
        controller = null;
        switch (parameter.type) {
          case 'color':
            controller = new ColorController(name, parameter, folder);
            break;
          default:
            controller = new Controller(name, parameter, folder);
        }
        return controller;
      };

      ControllerManager.prototype.initializeControllers = function() {
        var base, controller, folder, folderName, name, ref, ref1;
        ref = this.folders;
        for (folderName in ref) {
          folder = ref[folderName];
          ref1 = folder.controllers;
          for (name in ref1) {
            controller = ref1[name];
            if (typeof (base = controller.parameter).initializeController === "function") {
              base.initializeController(controller);
            }
          }
        }
      };

      ControllerManager.prototype.initializeValue = function(name, parameter, firstItem) {
        var ref, value;
        value = null;
        if ((firstItem != null ? (ref = firstItem.data) != null ? ref[name] : void 0 : void 0) !== void 0) {
          value = firstItem.data[name];
        } else if (parameter["default"] != null) {
          value = parameter["default"];
        } else if (parameter.defaultFunction != null) {
          value = parameter.defaultFunction();
        }
        return value;
      };

      ControllerManager.prototype.updateControllers = function(tools, resetValues) {
        var controller, folder, folderName, folderParameters, name, parameter, ref, tool;
        if (resetValues == null) {
          resetValues = false;
        }
        for (name in tools) {
          tool = tools[name];
          ref = tool.parameters;
          for (folderName in ref) {
            folderParameters = ref[folderName];
            if (folderName === 'General') {
              continue;
            }
            folder = this.folders[folderName];
            if (folder == null) {
              folder = new Folder(folderName, folderParameters.folderIsClosedByDefault);
            }
            for (name in folderParameters) {
              parameter = folderParameters[name];
              if (name === 'folderIsClosedByDefault') {
                continue;
              }
              controller = folder.controllers[name];
              parameter.value = this.initializeValue(name, parameter, tool.items[0]);
              if (controller != null) {
                if (resetValues) {
                  controller.setValue(parameter.value, false);
                }
              } else {
                if (controller == null) {
                  controller = this.createController(name, parameter, folder);
                }
              }
              parameter.controller = controller;
              controller.used = true;
            }
          }
        }
        this.removeUnusedControllers();
        this.initializeControllers();
      };

      ControllerManager.prototype.updateController = function(controllerName, value) {
        var controller, folder, folderName, name, ref, ref1;
        ref = this.folders;
        for (folderName in ref) {
          folder = ref[folderName];
          ref1 = folder.controllers;
          for (name in ref1) {
            controller = ref1[name];
            if (name === controllerName) {
              controller.setValue(value);
            }
          }
        }
      };

      ControllerManager.prototype.updateParametersForSelectedItems = function() {
        Utils.callNextFrame(this.updateParametersForSelectedItemsCallback, 'updateParametersForSelectedItems');
      };

      ControllerManager.prototype.updateParametersForSelectedItemsCallback = function() {
        var item, j, len, name1, ref, tools;
        tools = {};
        ref = R.selectedItems;
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          if (tools[name1 = item.constructor.name] == null) {
            tools[name1] = {
              parameters: item.constructor.parameters,
              items: []
            };
          }
          tools[item.constructor.name].items.push(item);
        }
        this.updateControllers(tools, true);
      };

      ControllerManager.prototype.setSelectedTool = function(tool) {
        var tools;
        Utils.cancelCallNextFrame('updateParametersForSelectedItems');
        tools = {};
        tools[tool.name] = {
          parameters: tool.parameters,
          items: []
        };
        this.updateControllers(tools, false);
      };

      ControllerManager.prototype.updateItemData = function(item) {
        var base, controller, folder, name, name1, ref, ref1;
        ref = this.folders;
        for (name in ref) {
          folder = ref[name];
          if (name === 'General' || name === 'Items') {
            continue;
          }
          ref1 = folder.controllers;
          for (name in ref1) {
            controller = ref1[name];
            if ((base = item.data)[name1 = controller.name] == null) {
              base[name1] = controller.getValue();
            }
          }
        }
      };

      ControllerManager.prototype.getController = function(folderNames, controllerName) {
        var folder, folderName, j, len;
        if (!Utils.Array.isArray(folderNames)) {
          folderNames = [folderNames];
        }
        folder = {
          folders: this.folders
        };
        for (j = 0, len = folderNames.length; j < len; j++) {
          folderName = folderNames[j];
          folder = folder.folders[folderName];
          if (folder == null) {
            return;
          }
        }
        return folder.controllers[controllerName];
      };

      return ControllerManager;

    })();
    return ControllerManager;
  });

}).call(this);
