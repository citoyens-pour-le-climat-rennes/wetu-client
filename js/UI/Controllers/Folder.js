// Generated by CoffeeScript 1.10.0
(function() {
  define(['paper', 'R', 'Utils/Utils'], function(P, R, Utils) {
    var Folder;
    Folder = (function() {
      function Folder(name1, closedByDefault, parentFolder) {
        this.name = name1;
        if (closedByDefault == null) {
          closedByDefault = false;
        }
        this.parentFolder = parentFolder;
        this.controllers = {};
        this.folders = {};
        if (!this.parentFolder) {
          this.datFolder = R.gui.addFolder(this.name);
        } else {
          this.parentFolder.folders[this.name] = this;
          this.datFolder = this.parentFolder.datFolder.addFolder(this.name);
        }
        if (!closedByDefault) {
          this.datFolder.open();
        }
        return;
      }

      Folder.prototype.remove = function() {
        var controller, folder, name, ref, ref1;
        ref = this.controllers;
        for (name in ref) {
          controller = ref[name];
          controller.remove();
          delete this.controller[name];
        }
        ref1 = this.folders;
        for (name in ref1) {
          folder = ref1[name];
          folder.remove();
          delete this.folders[name];
        }
        this.datFolder.close();
        $(this.datFolder.domElement).parent().remove();
        delete this.datFolder.parent.__folders[this.datFolder.name];
        R.gui.onResize();
        delete R.controllerManager.folders[this.name];
      };

      return Folder;

    })();
    return Folder;
  });

}).call(this);

//# sourceMappingURL=Folder.js.map
