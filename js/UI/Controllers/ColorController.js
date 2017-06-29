// Generated by CoffeeScript 1.10.0
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['UI/Controllers/Controller', 'colorpickersliders'], function(Controller) {
    var ColorController;
    ColorController = (function(superClass) {
      extend(ColorController, superClass);

      ColorController.initialize = function() {
        this.containerJ = R.templatesJ.find('.color-picker');
        this.colorPickerJ = this.containerJ.find('.color-picker-slider');
        this.colorTypeSelectorJ = this.containerJ.find('[name="color-type"]');
        this.options = {
          title: 'Color picker',
          flat: true,
          size: 'sm',
          color: 'blue',
          order: {
            hsl: 1,
            rgb: 2,
            opacity: 3,
            preview: 4
          },
          labels: {
            rgbred: 'Red',
            rgbgreen: 'Green',
            rgbblue: 'Blue',
            hslhue: 'Hue',
            hslsaturation: 'Saturation',
            hsllightness: 'Lightness',
            preview: 'Preview',
            opacity: 'Opacity'
          },
          onchange: this.onColorPickerChange,
          swatches: false
        };
        this.colorPickerJ = this.colorPickerJ.ColorPickerSliders(this.options);
        this.colorTypeSelectorJ.change(this.onColorTypeChange);
      };

      ColorController.popoverContent = function() {
        return ColorController.containerJ;
      };

      ColorController.onColorPickerChange = function(container, color) {
        var ref;
        if ((ref = ColorController.controller) != null) {
          ref.onColorPickerChange(container, color);
        }
      };

      ColorController.onColorTypeChange = function(event) {
        var ref;
        if ((ref = ColorController.controller) != null) {
          ref.onColorTypeChange(event.target.value);
        }
      };

      ColorController.initialize();

      function ColorController(name, parameter, folder) {
        this.name = name;
        this.parameter = parameter;
        this.folder = folder;
        this.enableCheckboxChanged = bind(this.enableCheckboxChanged, this);
        this.onChange = bind(this.onChange, this);
        this.popoverOnHide = bind(this.popoverOnHide, this);
        this.popoverOnShown = bind(this.popoverOnShown, this);
        this.popoverOnShow = bind(this.popoverOnShow, this);
        this.gradientTool = R.tools.gradient;
        this.selectTool = R.tools.select;
        ColorController.__super__.constructor.call(this, this.name, this.parameter, this.folder);
        return;
      }

      ColorController.prototype.initialize = function() {
        var value;
        ColorController.__super__.initialize.call(this);
        value = this.parameter.value;
        if ((value != null ? value.gradient : void 0) != null) {
          this.gradient = value;
          this.parameter.value = 'black';
        }
        this.colorInputJ = $(this.datController.domElement).find('input');
        this.colorInputJ.popover({
          title: this.parameter.label,
          container: 'body',
          placement: 'auto',
          content: this.constructor.popoverContent,
          html: true
        });
        this.colorInputJ.addClass("color-input");
        this.enableCheckboxJ = $('<input type="checkbox">');
        this.enableCheckboxJ.insertBefore(this.colorInputJ);
        this.colorInputJ.on('show.bs.popover', this.popoverOnShow);
        this.colorInputJ.on('shown.bs.popover', this.popoverOnShown);
        this.colorInputJ.on('hide.bs.popover', this.popoverOnHide);
        this.colorInputJ.on('hide.bs.popover', this.popoverOnHidden);
        this.enableCheckboxJ.change(this.enableCheckboxChanged);
        this.setColor(value, false, this.parameter.defaultCheck);
      };

      ColorController.prototype.popoverOnShow = function(event) {
        var previousController;
        previousController = this.constructor.controller;
        if (previousController && previousController !== this) {
          previousController.colorInputJ.popover('hide');
        }
      };

      ColorController.prototype.popoverOnShown = function(event) {
        var ref, ref1;
        this.constructor.controller = this;
        if ((ref = this.gradientTool) != null) {
          ref.controller = this;
        }
        this.setColor(this.getValue());
        if (this.gradient) {
          if ((ref1 = this.gradientTool) != null) {
            ref1.select();
          }
        }
      };

      ColorController.prototype.popoverOnHide = function() {
        var popoverJ, ref, size;
        popoverJ = $('#' + $(this).attr('aria-describedby'));
        size = new P.Size(popoverJ.width(), popoverJ.height());
        popoverJ.find('.color-picker').appendTo(R.templatesJ.find(".color-picker-container"));
        popoverJ.width(size.width).height(size.height);
        this.constructor.controller = null;
        if ((ref = this.gradientTool) != null) {
          ref.controller = null;
        }
        if (this.gradient) {
          this.selectTool.select();
        }
      };

      ColorController.prototype.popoverOnHidden = function() {};

      ColorController.prototype.onChange = function(value) {
        if ((value != null ? value.gradient : void 0) != null) {
          this.gradient = value;
        } else {
          this.gradient = null;
        }
        ColorController.__super__.onChange.call(this, value);
      };

      ColorController.prototype.onColorPickerChange = function(container, color) {
        var ref;
        color = color.tiny.toRgbString();
        this.setColor(color, false);
        if (this.gradient != null) {
          if ((ref = this.gradientTool) != null) {
            ref.colorChange(color, this);
          }
        } else {
          this.onChange(color);
        }
        this.enableCheckboxJ[0].checked = true;
      };

      ColorController.prototype.onColorTypeChange = function(value) {
        var ref, ref1, ref2, ref3;
        switch (value) {
          case 'flat-color':
            this.gradient = null;
            this.onChange(this.getValue());
            this.selectTool.select();
            break;
          case 'linear-gradient':
            if ((ref = this.gradientTool) != null) {
              ref.controller = this;
            }
            if ((ref1 = this.gradientTool) != null) {
              ref1.setRadial(false);
            }
            break;
          case 'radial-gradient':
            if ((ref2 = this.gradientTool) != null) {
              ref2.controller = this;
            }
            if ((ref3 = this.gradientTool) != null) {
              ref3.setRadial(true);
            }
        }
      };

      ColorController.prototype.getValue = function() {
        if (this.enableCheckboxJ[0].checked) {
          return this.gradient || this.colorInputJ.val();
        } else {
          return null;
        }
      };

      ColorController.prototype.setValue = function(value, updateTool) {
        var ref, ref1;
        if (updateTool == null) {
          updateTool = true;
        }
        ColorController.__super__.setValue.call(this, value);
        if ((value != null ? value.gradient : void 0) != null) {
          this.gradient = value;
        } else {
          this.gradient = null;
        }
        this.setColor(value);
        if (updateTool) {
          if (this.gradient != null) {
            if ((ref = this.gradientTool) != null) {
              ref.controller = this;
            }
            if ((ref1 = this.gradientTool) != null) {
              ref1.select(false, false);
            }
          } else {
            this.selectTool.select(false, false);
          }
        }
      };

      ColorController.prototype.setColor = function(color, updateColorPicker, defaultCheck) {
        var c, colors, i, len, ref, ref1, stop;
        if (updateColorPicker == null) {
          updateColorPicker = true;
        }
        if (defaultCheck == null) {
          defaultCheck = null;
        }
        this.enableCheckboxJ[0].checked = defaultCheck != null ? defaultCheck : color != null;
        if (((ref = this.gradient) != null ? ref.gradient : void 0) != null) {
          this.colorInputJ.val('Gradient');
          colors = '';
          ref1 = this.gradient.gradient.stops;
          for (i = 0, len = ref1.length; i < len; i++) {
            stop = ref1[i];
            c = new P.Color(stop.color != null ? stop.color : stop[0]);
            colors += ', ' + c.toCSS();
          }
          this.colorInputJ.css({
            'background-color': ''
          });
          this.colorInputJ.css({
            'background-image': 'linear-gradient( to right' + colors + ')'
          });
          if (this.gradient.gradient.radial) {
            this.constructor.colorTypeSelectorJ.find('[value="radial-gradient"]').prop('selected', true);
          } else {
            this.constructor.colorTypeSelectorJ.find('[value="linear-gradient"]').prop('selected', true);
          }
        } else {
          this.colorInputJ.val(color);
          this.colorInputJ.css({
            'background-image': ''
          });
          this.colorInputJ.css({
            'background-color': color || 'transparent'
          });
          this.constructor.colorTypeSelectorJ.find('[value="flat-color"]').prop('selected', true);
        }
        if (updateColorPicker) {
          this.constructor.colorPickerJ.trigger("colorpickersliders.updateColor", [color, true]);
        }
      };

      ColorController.prototype.enableCheckboxChanged = function(event) {
        var checked, value;
        checked = this.enableCheckboxJ[0].checked;
        value = this.getValue();
        if (checked) {
          this.colorInputJ.popover('show');
        } else {
          this.colorInputJ.popover('hide');
        }
        this.onChange(value);
        this.setColor(value, false);
      };

      ColorController.prototype.remove = function() {
        this.onChange = function() {};
        this.colorInputJ.popover('destroy');
        ColorController.__super__.remove.call(this);
      };

      return ColorController;

    })(Controller);
    return ColorController;
  });

}).call(this);
