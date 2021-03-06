// Generated by CoffeeScript 1.10.0
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['paper', 'R', 'Utils/Utils', 'UI/Button', 'UI/Modal', 'Tools/Vectorizer', 'Tools/Camera', 'Tools/PathTool', 'Commands/Command', 'i18next', 'cropper'], function(P, R, Utils, Button, Modal, Vectorizer, PathTool, Camera, Command, i18next, Cropper) {
    var ImageProcessor;
    ImageProcessor = (function() {
      function ImageProcessor() {
        this.processImage = bind(this.processImage, this);
        return;
      }

      ImageProcessor.prototype.adaptiveThreshold = function() {
        var C, average, blockSize, color, context, finalImageData, height, i, index, j, k, l, m, n, nPixelsInBlock, no2, ref, ref1, ref2, ref3, ref4, ref5, sourceData, sourceImageData, width, x, xf, xi, y, yf, yi;
        n = 8;
        C = 8;
        width = this.filterCanvas.width;
        height = this.filterCanvas.height;
        no2 = Math.floor(n / 2);
        blockSize = 2 * no2 + 1;
        nPixelsInBlock = blockSize * blockSize;
        finalImageData = new ImageData(width, height);
        context = this.filterCanvas.getContext('2d');
        sourceImageData = context.getImageData(0, 0, width, height);
        sourceData = sourceImageData.data;
        for (y = i = 0, ref = height - 1; 0 <= ref ? i <= ref : i >= ref; y = 0 <= ref ? ++i : --i) {
          for (x = j = 0, ref1 = width - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; x = 0 <= ref1 ? ++j : --j) {
            average = 0;
            for (yi = k = ref2 = -no2, ref3 = no2; ref2 <= ref3 ? k <= ref3 : k >= ref3; yi = ref2 <= ref3 ? ++k : --k) {
              for (xi = l = ref4 = -no2, ref5 = no2; ref4 <= ref5 ? l <= ref5 : l >= ref5; xi = ref4 <= ref5 ? ++l : --l) {
                xf = x + xi < 0 ? x - xi : x + xi >= width ? x - xi : x + xi;
                yf = y + yi < 0 ? y - yi : y + yi >= height ? y - yi : y + yi;
                index = xf + yf * width;
                average += sourceData[4 * index + 0];
              }
            }
            average /= nPixelsInBlock;
            index = x + y * width;
            color = average - C < sourceData[4 * index + 0] ? 255 : 0;
            for (n = m = 0; m <= 2; n = ++m) {
              finalImageData.data[4 * index + n] = color;
            }
            finalImageData.data[4 * index + 3] = 255;
          }
        }
        context.putImageData(finalImageData, 0, 0);
      };

      ImageProcessor.prototype.grayscale = function(context) {
        var blue, color, finalColor, green, height, i, index, j, k, n, red, ref, ref1, sourceData, sourceImageData, width, x, y;
        width = this.filterCanvas.width;
        height = this.filterCanvas.height;
        context = this.filterCanvas.getContext('2d');
        sourceImageData = context.getImageData(0, 0, width, height);
        sourceData = sourceImageData.data;
        for (y = i = 0, ref = height - 1; 0 <= ref ? i <= ref : i >= ref; y = 0 <= ref ? ++i : --i) {
          for (x = j = 0, ref1 = width - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; x = 0 <= ref1 ? ++j : --j) {
            index = x + y * width;
            red = sourceData[4 * index + 0];
            green = sourceData[4 * index + 1];
            blue = sourceData[4 * index + 2];
            color = new P.Color(red / 255, green / 255, blue / 255);
            finalColor = Math.min(color.brightness, 1 - color.saturation);
            for (n = k = 0; k <= 2; n = ++k) {
              sourceData[4 * index + n] = finalColor * 255;
            }
            sourceData[4 * index + 3] = sourceData[4 * index + 3];
          }
        }
        context.putImageData(sourceImageData, 0, 0);
      };

      ImageProcessor.prototype.processImage = function(filterCanvas) {
        var context;
        this.filterCanvas = filterCanvas;
        context = this.filterCanvas.getContext('2d');
        this.initialImage = context.getImageData(0, 0, this.filterCanvas.width, this.filterCanvas.height);
        console.log('start grayscale');
        this.grayscale();
        this.adaptiveThreshold();
        console.log('grayscale finished');
      };

      return ImageProcessor;

    })();
    return ImageProcessor;
  });

}).call(this);

//# sourceMappingURL=ImageProcessor.js.map
