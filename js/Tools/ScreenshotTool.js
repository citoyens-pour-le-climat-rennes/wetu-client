// Generated by CoffeeScript 1.12.7
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['paper', 'R', 'Utils/Utils', 'Tools/Tool', 'zeroClipboard', 'View/SelectionRectangle'], function(P, R, Utils, Tool, ZeroClipboard, SelectionRectangle) {
    var ScreenshotTool;
    ScreenshotTool = (function(superClass) {
      extend(ScreenshotTool, superClass);

      ScreenshotTool.label = 'Screenshot';

      ScreenshotTool.description = '';

      ScreenshotTool.iconURL = 'screenshot.png';

      ScreenshotTool.cursor = {
        position: {
          x: 0,
          y: 0
        },
        name: 'crosshair',
        icon: 'screenshot'
      };

      ScreenshotTool.drawItems = false;

      ScreenshotTool.order = 3;

      function ScreenshotTool() {
        this.downloadSVG = bind(this.downloadSVG, this);
        this.downloadPNG = bind(this.downloadPNG, this);
        this.publishOnPinterestCallback = bind(this.publishOnPinterestCallback, this);
        this.publishOnPinterest = bind(this.publishOnPinterest, this);
        this.publishOnFacebookAsPhotoCallback = bind(this.publishOnFacebookAsPhotoCallback, this);
        this.publishOnFacebookAsPhoto = bind(this.publishOnFacebookAsPhoto, this);
        this.publishOnFacebookCallback = bind(this.publishOnFacebookCallback, this);
        this.publishOnFacebook = bind(this.publishOnFacebook, this);
        this.extractImage = bind(this.extractImage, this);
        ScreenshotTool.__super__.constructor.call(this, true);
        this.modalJ = $("#screenshotModal");
        this.modalJ.find('button[name="publish-on-facebook"]').click((function(_this) {
          return function() {
            return _this.publishOnFacebook();
          };
        })(this));
        this.modalJ.find('button[name="publish-on-facebook-photo"]').click((function(_this) {
          return function() {
            return _this.publishOnFacebookAsPhoto();
          };
        })(this));
        this.modalJ.find('button[name="download-png"]').click((function(_this) {
          return function() {
            return _this.downloadPNG();
          };
        })(this));
        this.modalJ.find('button[name="download-svg"]').click((function(_this) {
          return function() {
            return _this.downloadSVG();
          };
        })(this));
        this.modalJ.find('button[name="publish-on-pinterest"]').click((function(_this) {
          return function() {
            return _this.publishOnPinterest();
          };
        })(this));
        this.descriptionJ = this.modalJ.find('input[name="message"]');
        this.descriptionJ.change((function(_this) {
          return function() {
            _this.modalJ.find('a[name="publish-on-twitter"]').attr("data-text", _this.getDescription());
          };
        })(this));
        ZeroClipboard.config({
          swfPath: R.commeUnDesseinURL + "static/libs/ZeroClipboard/ZeroClipboard.swf"
        });
        this.selectionRectangle = null;
        return;
      }

      ScreenshotTool.prototype.getDescription = function() {
        if (this.descriptionJ.val().length > 0) {
          return this.descriptionJ.val();
        } else {
          return "Artwork made with CommeUnDessein: " + this.locationURL;
        }
      };

      ScreenshotTool.prototype.checkRemoveScreenshotRectangle = function(item) {
        if ((this.selectionRectangle != null) && item !== this.selectionRectangle) {
          this.selectionRectangle.remove();
        }
      };

      ScreenshotTool.prototype.begin = function(event) {
        var from;
        from = R.me;
        R.currentPaths[from] = new P.Path.Rectangle(event.point, event.point);
        R.currentPaths[from].name = 'screenshot tool selection rectangle';
        R.currentPaths[from].dashArray = [4, 10];
        R.currentPaths[from].strokeColor = 'black';
        R.currentPaths[from].strokeWidth = 1;
        R.view.selectionLayer.addChild(R.currentPaths[from]);
      };

      ScreenshotTool.prototype.update = function(event) {
        var from;
        from = R.me;
        R.currentPaths[from].lastSegment.point = event.point;
        R.currentPaths[from].lastSegment.next.point.y = event.point.y;
        R.currentPaths[from].lastSegment.previous.point.x = event.point.x;
      };

      ScreenshotTool.prototype.end = function(event) {
        var from, r;
        from = R.me;
        R.currentPaths[from].remove();
        delete R.currentPaths[from];
        r = new P.Rectangle(event.downPoint, event.point);
        if (r.area < 100) {
          return;
        }
        this.selectionRectangle = new SelectionRectangle(new P.Rectangle(event.downPoint, event.point), this.extractImage);
      };

      ScreenshotTool.prototype.extractImage = function(redraw) {
        var copyDataBtnJ, imgJ, maxHeight, twitterLinkJ, twitterScriptJ;
        this.rectangle = this.selectionRectangle.getBounds();
        this.selectionRectangle.remove();
        this.dataURL = R.rasterizer.extractImage(this.rectangle, redraw);
        this.locationURL = R.commeUnDesseinURL + location.hash;
        this.descriptionJ.attr('placeholder', 'Artwork made with CommeUnDessein: ' + this.locationURL);
        copyDataBtnJ = this.modalJ.find('button[name="copy-data-url"]');
        copyDataBtnJ.attr("data-clipboard-text", this.dataURL);
        imgJ = this.modalJ.find("img.png");
        imgJ.attr("src", this.dataURL);
        maxHeight = window.innerHeight - 220;
        imgJ.css({
          'max-height': maxHeight + "px"
        });
        this.modalJ.find("a.png").attr("href", this.dataURL);
        twitterLinkJ = this.modalJ.find('a[name="publish-on-twitter"]');
        twitterLinkJ.empty().text("Publish on Twitter");
        twitterLinkJ.attr("data-url", this.locationURL);
        twitterScriptJ = $("<script type=\"text/javascript\">\n	window.twttr=(function(d,s,id){var t,js,fjs=d.getElementsByTagName(s)[0];\n	if(d.getElementById(id)){return}js=d.createElement(s);\n	js.id=id;js.src=\"https://platform.twitter.com/widgets.js\";\n	fjs.parentNode.insertBefore(js,fjs);\n	return window.twttr||(t={_e:[],ready:function(f){t._e.push(f)}})}(document,\"script\",\"twitter-wjs\"));\n</script>");
        twitterLinkJ.append(twitterScriptJ);
        this.modalJ.modal('show');
        this.modalJ.on('shown.bs.modal', function(e) {
          var client;
          client = new ZeroClipboard(copyDataBtnJ);
          client.on("ready", function(readyEvent) {
            console.log("ZeroClipboard SWF is ready!");
            client.on("aftercopy", function(event) {
              R.alertManager.alert("Image data url was successfully copied into the clipboard!", "success");
              this.destroy();
            });
          });
        });
      };

      ScreenshotTool.prototype.saveImage = function(callback) {
        Dajaxice.draw.saveImage(callback, {
          'image': this.dataURL
        });
        R.alertManager.alert("Your image is being uploaded...", "info");
      };

      ScreenshotTool.prototype.publishOnFacebook = function() {
        this.saveImage(this.publishOnFacebookCallback);
      };

      ScreenshotTool.prototype.publishOnFacebookCallback = function(result) {
        var caption;
        R.alertManager.alert("Your image was successfully uploaded to CommeUnDessein, posting to Facebook...", "info");
        caption = this.getDescription();
        FB.ui({
          method: "feed",
          name: "CommeUnDessein",
          caption: caption,
          description: "CommeUnDessein is an infinite collaborative drawing app.",
          link: this.locationURL,
          picture: R.commeUnDesseinURL + result.url
        }, function(response) {
          if (response && response.post_id) {
            R.alertManager.alert("Your Post was successfully published!", "success");
          } else {
            R.alertManager.alert("An error occured. Your post was not published.", "error");
          }
        });
      };

      ScreenshotTool.prototype.publishOnFacebookAsPhoto = function() {
        if (!R.loggedIntoFacebook) {
          FB.login((function(_this) {
            return function(response) {
              if (response && !response.error) {
                _this.saveImage(_this.publishOnFacebookAsPhotoCallback);
              } else {
                R.alertManager.alert("An error occured when trying to log you into facebook.", "error");
              }
            };
          })(this));
        } else {
          this.saveImage(this.publishOnFacebookAsPhotoCallback);
        }
      };

      ScreenshotTool.prototype.publishOnFacebookAsPhotoCallback = function(result) {
        var caption;
        R.alertManager.alert("Your image was successfully uploaded to CommeUnDessein, posting to Facebook...", "info");
        caption = this.getDescription();
        FB.api("/me/photos", "POST", {
          "url": R.commeUnDesseinURL + result.url,
          "message": caption
        }, function(response) {
          if (response && !response.error) {
            R.alertManager.alert("Your Post was successfully published!", "success");
          } else {
            R.alertManager.alert("An error occured. Your post was not published.", "error");
            console.log(response.error);
          }
        });
      };

      ScreenshotTool.prototype.publishOnPinterest = function() {
        this.saveImage(this.publishOnPinterestCallback);
      };

      ScreenshotTool.prototype.publishOnPinterestCallback = function(result) {
        var buttonJ, caption, description, imageUrl, imgJ, linkJ, linkJcopy, pinterestModalJ, siteUrl, submit;
        R.alertManager.alert("Your image was successfully uploaded to CommeUnDessein...", "info");
        pinterestModalJ = $("#customModal");
        pinterestModalJ.modal('show');
        pinterestModalJ.addClass("pinterest-modal");
        pinterestModalJ.find(".modal-title").text("Publish on Pinterest");
        siteUrl = encodeURI(R.commeUnDesseinURL);
        imageUrl = siteUrl + result.url;
        caption = this.getDescription();
        description = encodeURI(caption);
        linkJ = $("<a>");
        linkJ.addClass("image");
        linkJ.attr("href", "http://pinterest.com/pin/create/button/?url=" + siteUrl + "&media=" + imageUrl + "&description=" + description);
        linkJcopy = linkJ.clone();
        imgJ = $('<img>');
        imgJ.attr('src', siteUrl + result.url);
        linkJ.append(imgJ);
        buttonJ = pinterestModalJ.find('button[name="submit"]');
        linkJcopy.addClass("btn btn-primary").text("Pin it!").insertBefore(buttonJ);
        buttonJ.hide();
        submit = function() {
          pinterestModalJ.modal('hide');
        };
        linkJ.click(submit);
        pinterestModalJ.find(".modal-body").empty().append(linkJ);
        pinterestModalJ.on('hide.bs.modal', function(event) {
          pinterestModalJ.removeClass("pinterest-modal");
          linkJcopy.remove();
          pinterestModalJ.off('hide.bs.modal');
        });
      };

      ScreenshotTool.prototype.downloadPNG = function() {
        this.modalJ.find("a.png")[0].click();
        this.modalJ.modal('hide');
      };

      ScreenshotTool.prototype.downloadSVG = function() {
        var blob, bounds, canvasTemp, controlPath, fileName, i, item, itemsToSave, j, k, len, len1, len2, link, position, rectanglePath, ref, svg, svgGroup, tempProject, url;
        rectanglePath = new P.Path.Rectangle(this.rectangle);
        itemsToSave = [];
        ref = P.project.activeLayer.children;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          bounds = item.bounds;
          if (item.controller != null) {
            controlPath = item.controller.controlPath;
            if (this.rectangle.contains(bounds) || (this.rectangle.intersects(bounds) && (controlPath != null ? controlPath.getIntersections(rectanglePath).length : void 0) > 0)) {
              Utils.Array.pushIfAbsent(itemsToSave, item.controller);
            }
          }
        }
        svgGroup = new P.Group();
        for (j = 0, len1 = itemsToSave.length; j < len1; j++) {
          item = itemsToSave[j];
          if (item.drawing == null) {
            item.draw();
          }
        }
        P.view.update();
        for (k = 0, len2 = itemsToSave.length; k < len2; k++) {
          item = itemsToSave[k];
          svgGroup.addChild(item.drawing.clone());
        }
        rectanglePath.remove();
        position = svgGroup.position.subtract(this.rectangle.topLeft);
        fileName = "image.svg";
        canvasTemp = document.createElement('canvas');
        canvasTemp.width = this.rectangle.width;
        canvasTemp.height = this.rectangle.height;
        tempProject = new Project(canvasTemp);
        svgGroup.position = position;
        tempProject.addChild(svgGroup);
        svg = tempProject.exportSVG({
          asString: true
        });
        tempProject.remove();
        paper.projects[0].activate();
        blob = new Blob([svg], {
          type: 'image/svg+xml'
        });
        url = URL.createObjectURL(blob);
        link = document.createElement("a");
        link.download = fileName;
        link.href = url;
        link.click();
        this.modalJ.modal('hide');
      };

      ScreenshotTool.prototype.copyURL = function() {};

      return ScreenshotTool;

    })(Tool);
    R.Tools.Screenshot = ScreenshotTool;
    return ScreenshotTool;
  });

}).call(this);
