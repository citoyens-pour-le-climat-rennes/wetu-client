// Generated by CoffeeScript 1.10.0
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    slice = [].slice;

  define(['paper', 'R', 'Utils/Utils', 'Commands/Command'], function(P, R, Utils, Command) {
    var CommandManager;
    CommandManager = (function() {
      CommandManager.maxCommandNumber = 20;

      function CommandManager() {
        this.endAction = bind(this.endAction, this);
        this.nullifyWaitingCommand = bind(this.nullifyWaitingCommand, this);
        this.toggleCurrentCommand = bind(this.toggleCurrentCommand, this);
        this.history = [];
        this.itemToCommands = {};
        this.currentCommand = -1;
        this.historyJ = $("#History ul.history");
        this.add(new Command('Loaded CommeUnDessein'), true);
        return;
      }

      CommandManager.prototype.add = function(command, execute) {
        var currentLiJ, firstCommand, ref;
        if (execute == null) {
          execute = false;
        }
        if (this.currentCommand >= this.constructor.maxCommandNumber - 1) {
          firstCommand = this.history.shift();
          firstCommand["delete"]();
          this.currentCommand--;
        }
        currentLiJ = (ref = this.history[this.currentCommand]) != null ? ref.liJ : void 0;
        if (currentLiJ != null) {
          currentLiJ.nextAll().remove();
        }
        this.historyJ.append(command.liJ);
        this.currentCommand++;
        this.history.splice(this.currentCommand, this.history.length - this.currentCommand, command);
        this.mapItemsToCommand(command);
        this.updateButtons();
        if (execute) {
          command["do"]();
        }
      };

      CommandManager.prototype.toggleCurrentCommand = function(event) {
        var deferred;
        if ((event != null) && (event.detail != null)) {
          if (event.detail !== this.waitingCommand) {
            return;
          }
          this.waitingCommand = null;
          $('#loadingMask').css({
            'visibility': 'hidden'
          });
        }
        document.removeEventListener('command executed', this.toggleCurrentCommand);
        if (this.currentCommand === this.commandIndex) {
          this.waitingCommand = null;
          this.updateButtons();
          return;
        }
        R.drawingPanel.close();
        deferred = this.history[this.currentCommand + this.offset].toggle();
        this.waitingCommand = this.history[this.currentCommand + this.offset];
        this.currentCommand += this.direction;
        if (this.waitingCommand.twin === this.history[this.currentCommand + this.offset] && this.currentCommand === this.commandIndex) {
          this.commandIndex += this.direction;
        }
        if (deferred) {
          $('#loadingMask').css({
            'visibility': 'visible'
          });
          document.addEventListener('command executed', this.toggleCurrentCommand);
        } else {
          this.toggleCurrentCommand();
        }
      };

      CommandManager.prototype.nullifyWaitingCommand = function() {
        if ((typeof event !== "undefined" && event !== null) && (event.detail != null)) {
          if (event.detail !== this.waitingCommand) {
            return;
          }
          this.waitingCommand = null;
          $('#loadingMask').css({
            'visibility': 'hidden'
          });
        }
      };

      CommandManager.prototype.undo = function() {
        if (this.currentCommand <= 0) {
          return;
        }
        this.commandClicked(this.history[this.currentCommand - 1]);
      };

      CommandManager.prototype["do"] = function() {
        if (this.currentCommand >= this.history.length - 1) {
          return;
        }
        this.commandClicked(this.history[this.currentCommand + 1]);
      };

      CommandManager.prototype.commandClicked = function(command) {
        if (this.waitingCommand != null) {
          return;
        }
        this.commandIndex = this.getCommandIndex(command);
        if (this.currentCommand === this.commandIndex) {
          return;
        }
        if (this.currentCommand > this.commandIndex) {
          this.direction = -1;
          this.offset = 0;
        } else {
          this.direction = 1;
          this.offset = 1;
        }
        this.toggleCurrentCommand();
      };

      CommandManager.prototype.getCommandIndex = function(command) {
        var c, i, j, len, ref;
        ref = this.history;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          c = ref[i];
          if (c === command) {
            return i;
          }
        }
        return -1;
      };

      CommandManager.prototype.getCurrentCommand = function() {
        return this.history[this.currentCommand];
      };

      CommandManager.prototype.setButton = function(name, enable) {
        var opacity;
        opacity = enable ? 1 : 0.25;
        R.sidebar.favoriteToolsJ.find("[data-name='" + name + "'] img").css({
          opacity: opacity
        });
      };

      CommandManager.prototype.setUndoButton = function(enable) {
        this.setButton('Undo', enable);
      };

      CommandManager.prototype.setRedoButton = function(enable) {
        this.setButton('Redo', enable);
      };

      CommandManager.prototype.updateButtons = function() {
        if (this.currentCommand >= this.history.length - 1) {
          this.setRedoButton(false);
        } else {
          this.setRedoButton(true);
        }
        if (this.currentCommand === 0) {
          this.setUndoButton(false);
        } else {
          this.setUndoButton(true);
        }
      };

      CommandManager.prototype.clearHistory = function() {
        this.historyJ.empty();
        this.history = [];
        this.currentCommand = -1;
        this.add(new Command("Load CommeUnDessein"), true);
        this.updateButtons();
      };

      CommandManager.prototype.beginAction = function(command, event) {
        if (this.actionCommand != null) {
          clearTimeout(R.updateTimeout['addCurrentCommand-' + this.actionCommand.id]);
          this.endAction();
        }
        this.actionCommand = command;
        this.actionCommand.begin(event);
      };

      CommandManager.prototype.updateAction = function() {
        var ref;
        if ((ref = this.actionCommand) != null) {
          ref.update.apply(this.actionCommand, arguments);
        }
      };

      CommandManager.prototype.endAction = function(event) {
        var ref;
        if ((ref = this.actionCommand) != null) {
          ref.end(event);
        }
        this.actionCommand = null;
      };

      CommandManager.prototype.deferredAction = function() {
        var ActionCommand, args, event, items;
        ActionCommand = arguments[0], items = arguments[1], event = arguments[2], args = 4 <= arguments.length ? slice.call(arguments, 3) : [];
        if (!ActionCommand.prototype.isPrototypeOf(this.actionCommand)) {
          this.beginAction(new ActionCommand(items, args), event);
        }
        this.updateAction.apply(this, args);
        Utils.deferredExecution(this.endAction, 'addCurrentCommand-' + this.actionCommand.id);
      };

      CommandManager.prototype.mapItemsToCommand = function(command) {
        var base, id, item, ref;
        if (command.items == null) {
          return;
        }
        ref = command.items;
        for (id in ref) {
          item = ref[id];
          if ((base = this.itemToCommands)[id] == null) {
            base[id] = [];
          }
          this.itemToCommands[id].push(command);
        }
      };

      CommandManager.prototype.itemSaved = function(item) {
        var command, commands, j, len;
        commands = this.itemToCommands[item.id];
        if (commands != null) {
          for (j = 0, len = commands.length; j < len; j++) {
            command = commands[j];
            command.itemSaved(item);
          }
        }
      };

      CommandManager.prototype.itemDeleted = function(item) {
        var command, commands, j, len;
        commands = this.itemToCommands[item.id];
        if (commands != null) {
          for (j = 0, len = commands.length; j < len; j++) {
            command = commands[j];
            command.itemDeleted(item);
          }
        }
      };

      CommandManager.prototype.unloadItem = function(item) {
        var command, commands, j, len;
        commands = this.itemToCommands[item.id];
        if (commands != null) {
          for (j = 0, len = commands.length; j < len; j++) {
            command = commands[j];
            command.unloadItem(item);
          }
        }
      };

      CommandManager.prototype.loadItem = function(item) {
        var command, commands, j, len;
        commands = this.itemToCommands[item.id];
        if (commands != null) {
          for (j = 0, len = commands.length; j < len; j++) {
            command = commands[j];
            command.loadItem(item);
          }
        }
      };

      CommandManager.prototype.resurrectItem = function(id, item) {
        var command, commands, j, len;
        commands = this.itemToCommands[id];
        if (commands != null) {
          for (j = 0, len = commands.length; j < len; j++) {
            command = commands[j];
            command.resurrectItem(item);
          }
        }
      };

      return CommandManager;

    })();
    return CommandManager;
  });

}).call(this);

//# sourceMappingURL=CommandManager.js.map
