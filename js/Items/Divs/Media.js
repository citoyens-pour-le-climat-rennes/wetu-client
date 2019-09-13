// Generated by CoffeeScript 1.10.0
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['paper', 'R', 'Utils/Utils', 'Items/Item', 'Items/Divs/Div', 'UI/Modal', 'oembed'], function(P, R, Utils, Item, Div, Modal, oe) {
    var Media;
    Media = (function(superClass) {
      extend(Media, superClass);

      Media.label = 'Media';

      Media.modalTitle = "Insert a media";

      Media.modalTitleUpdate = "Modify your media";

      Media.object_type = 'media';

      Media.initialize = function(rectangle) {
        var modal, submit;
        submit = function(data) {
          var div;
          div = new Media(rectangle, data);
          div.finish();
          if (!div.group) {
            return;
          }
          div.save();
          div.select();
        };
        modal = Modal.createModal({
          title: 'Add media',
          submit: submit
        });
        modal.addTextInput({
          name: 'url',
          placeholder: 'http:// or <iframe>',
          type: 'url',
          "class": 'url',
          label: 'URL',
          required: true
        });
        modal.show();
      };

      Media.initializeParameters = function() {
        var parameters;
        parameters = Media.__super__.constructor.initializeParameters.call(this);
        parameters['Media'] = {
          url: {
            type: 'string',
            label: 'URL',
            "default": 'http://'
          },
          fitImage: {
            type: 'checkbox',
            label: 'Fit image',
            "default": false
          }
        };
        return parameters;
      };

      Media.parameters = Media.initializeParameters();

      function Media(bounds, data1, id, pk, date, lock) {
        this.data = data1 != null ? data1 : null;
        this.id = id != null ? id : null;
        this.pk = pk != null ? pk : null;
        this.date = date;
        this.lock = lock != null ? lock : null;
        this.afterEmbed = bind(this.afterEmbed, this);
        this.setURL = bind(this.setURL, this);
        this.loadMedia = bind(this.loadMedia, this);
        Media.__super__.constructor.call(this, bounds, this.data, this.id, this.pk, this.date, this.lock);
        this.url = this.data.url;
        if ((this.url != null) && this.url.length > 0) {
          this.setURL(this.url, false);
        }
        return;
      }

      Media.prototype.dispatchLoadedEvent = function() {};

      Media.prototype.beginSelect = function(event) {
        var ref;
        Media.__super__.beginSelect.call(this, event);
        if ((ref = this.contentJ) != null) {
          ref.css({
            'pointer-events': 'none'
          });
        }
      };

      Media.prototype.endSelect = function(event) {
        var ref;
        Media.__super__.endSelect.call(this, event);
        if ((ref = this.contentJ) != null) {
          ref.css({
            'pointer-events': 'auto'
          });
        }
      };

      Media.prototype.select = function(updateOptions, updateSelectionRectangle) {
        var ref;
        if (updateOptions == null) {
          updateOptions = true;
        }
        if (updateSelectionRectangle == null) {
          updateSelectionRectangle = true;
        }
        if (!Media.__super__.select.call(this, updateOptions, updateSelectionRectangle)) {
          return false;
        }
        if ((ref = this.contentJ) != null) {
          ref.css({
            'pointer-events': 'auto'
          });
        }
        return true;
      };

      Media.prototype.deselect = function() {
        var ref;
        if (!Media.__super__.deselect.call(this)) {
          return false;
        }
        if ((ref = this.contentJ) != null) {
          ref.css({
            'pointer-events': 'none'
          });
        }
        return true;
      };

      Media.prototype.setRectangle = function(rectangle, update) {
        var height, ref, width;
        if (update == null) {
          update = true;
        }
        Media.__super__.setRectangle.call(this, rectangle, update);
        width = this.divJ.width();
        height = this.divJ.height();
        this.contentJ.attr("width", width).attr("height", height).css({
          "max-width": width,
          "max-height": height
        });
        if (!((ref = this.contentJ) != null ? ref.is('iframe') : void 0)) {
          this.contentJ.find('iframe').attr("width", width).attr("height", height).css({
            "max-width": width,
            "max-height": height
          });
        }
      };

      Media.prototype.toggleFitImage = function() {
        if (this.isImage != null) {
          this.contentJ.toggleClass("fit-image", this.data.fitImage);
        }
      };

      Media.prototype.setParameter = function(name, value) {
        Media.__super__.setParameter.call(this, name, value);
        switch (name) {
          case 'fitImage':
            this.toggleFitImage();
            break;
          case 'url':
            this.setURL(value, false);
        }
      };

      Media.prototype.hasImageUrlExt = function(url) {
        var ext, exts;
        exts = ["jpeg", "jpg", "gif", "png"];
        ext = url.substring(url.lastIndexOf(".") + 1);
        if (indexOf.call(exts, ext) >= 0) {
          return true;
        }
        return false;
      };

      Media.prototype.checkIsImage = function() {
        var image, timedOut, timeout, timer;
        timedOut = false;
        timeout = this.hasImageUrlExt(this.url) ? 5000 : 1000;
        image = new Image();
        timer = setTimeout((function(_this) {
          return function() {
            timedOut = true;
            _this.loadMedia("timeout");
          };
        })(this), timeout);
        image.onerror = image.onabort = (function(_this) {
          return function() {
            if (!timedOut) {
              clearTimeout(timer);
              _this.loadMedia('error');
            }
          };
        })(this);
        image.onload = (function(_this) {
          return function() {
            var ref;
            if (!timedOut) {
              clearTimeout(timer);
            } else {
              if ((ref = _this.contentJ) != null) {
                ref.remove();
              }
            }
            _this.loadMedia('success');
          };
        })(this);
        image.src = this.url;
      };

      Media.prototype.loadMedia = function(imageLoadResult) {
        var commandEvent, oembbedContent;
        if (imageLoadResult === 'success') {
          this.contentJ = $('<img class="content image" src="' + this.url + '" alt="' + this.url + '"">');
          this.contentJ.mousedown(function(event) {
            return event.preventDefault();
          });
          this.isImage = true;
        } else {
          oembbedContent = (function(_this) {
            return function() {
              var args;
              _this.contentJ = $('<div class="content oembedall-container"></div>');
              args = {
                includeHandle: false,
                embedMethod: 'fill',
                maxWidth: _this.divJ.width(),
                maxHeight: _this.divJ.height(),
                afterEmbed: _this.afterEmbed
              };
              _this.contentJ.oembed(_this.url, args);
            };
          })(this);
          if (this.url.indexOf("http://") !== 0 && this.url.indexOf("https://") !== 0) {
            this.contentJ = $(this.url);
            if (this.contentJ.is('iframe')) {
              this.contentJ.attr('width', this.divJ.width());
              this.contentJ.attr('height', this.divJ.height());
            } else {
              oembbedContent();
            }
          } else {
            oembbedContent();
          }
        }
        this.contentJ.insertBefore(this.maskJ);
        this.setCss();
        if (!this.isSelected()) {
          this.contentJ.css({
            'pointer-events': 'none'
          });
        }
        commandEvent = document.createEvent('Event');
        commandEvent.initEvent('command executed', true, true);
        document.dispatchEvent(commandEvent);
      };

      Media.prototype.setURL = function(url, updateDiv) {
        if (updateDiv == null) {
          updateDiv = false;
        }
        console.log('setURL, updateDiv: ' + updateDiv + ', ' + this.pk);
        this.url = url;
        if (this.contentJ != null) {
          this.contentJ.remove();
          $("#jqoembeddata").remove();
        }
        this.checkIsImage();
        if (updateDiv) {
          this.update();
        }
      };

      Media.prototype.afterEmbed = function() {
        var height, ref, width;
        width = this.divJ.width();
        height = this.divJ.height();
        if ((ref = this.contentJ) != null) {
          ref.find("iframe").attr("width", width).attr("height", height);
        }
      };

      return Media;

    })(Div);
    Item.Media = Media;
    return Media;
  });

}).call(this);
