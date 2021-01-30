// Generated by CoffeeScript 1.10.0
(function() {
  define(['paper', 'R', 'Utils/Utils', 'spacebrew'], function(P, R, Utils, SpacebrewLib) {
    var description, name, server, spacebrew;
    server = "localhost";
    name = "CommeUnDessein";
    description = "Tipibot commands.";
    spacebrew = new Spacebrew.Client(server, name, description);
    spacebrew.onOpen = function() {
      console.log("Connected as " + spacebrew.name() + ".");
    };
    spacebrew.connect();
    spacebrew.addPublish("commands", "string", "");
    spacebrew.addPublish("command", "string", "");
    R.spacebrew = spacebrew;
    return spacebrew;
  });

}).call(this);

//# sourceMappingURL=Spacebrew.js.map
