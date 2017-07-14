// Generated by CoffeeScript 1.10.0
(function() {
  var Utils, baseUrl, libs, parameters, prefix;

  R.offline = false;

  Utils = {};

  Utils.URL = {};

  Utils.URL.getParameters = function(hash) {
    var parameters, re, tokens;
    hash = hash.replace('#', '');
    parameters = {};
    re = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = re.exec(hash)) {
      parameters[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }
    return parameters;
  };

  Utils.URL.setParameters = function(parameters) {
    var hash, name, value;
    hash = '';
    for (name in parameters) {
      value = parameters[name];
      hash += '&' + name + "=" + value;
    }
    hash = hash.replace('&', '');
    return hash;
  };

  window.Utils = Utils;

  window.P = {};

  R.DajaxiceXMLHttpRequest = window.XMLHttpRequest;

  window.XMLHttpRequest = window.RXMLHttpRequest;

  libs = '../../libs/';

  parameters = Utils.URL.getParameters(document.location.hash);

  window.R.repository = {
    owner: 'arthursw',
    commit: null
  };

  if ((parameters['repository-owner'] != null) && (parameters['repository-commit'] != null)) {
    prefix = parameters['repository-use-cdn'] != null ? '//cdn.' : '//';
    baseUrl = prefix + 'rawgit.com/' + parameters['repository-owner'] + '/comme-un-dessein-client/' + parameters['repository-commit'] + '/js';
    window.R.repository = {
      owner: parameters['repository-owner'],
      commit: parameters['repository-commit']
    };
    libs = location.origin + '/static/libs/';
  } else {
    baseUrl = '../static/comme-un-dessein-client/js';
  }

  requirejs.config({
    baseUrl: baseUrl,
    paths: {
      'domReady': [libs + 'domReady'],
      'aceTools': [libs + 'ace/ext-language_tools'],
      'underscore': [libs + 'underscore-min'],
      'jquery': [libs + 'jquery-2.1.3.min'],
      'jqueryUi': [libs + 'jquery-ui.min'],
      'mousewheel': [libs + 'jquery.mousewheel.min'],
      'scrollbar': [libs + 'jquery.mCustomScrollbar.min'],
      'tinycolor': [libs + 'tinycolor.min'],
      'bootstrap': [libs + 'bootstrap.min'],
      'paper': [libs + 'paper-full'],
      'three': [libs + 'three'],
      'gui': [libs + 'dat.gui'],
      'typeahead': [libs + 'typeahead.bundle.min'],
      'pinit': [libs + 'pinit'],
      'howler': [libs + 'howler'],
      'spin': [libs + 'spin.min'],
      'zeroClipboard': [libs + 'ZeroClipboard.min'],
      'diffMatch': libs + 'AceDiff/diff_match_patch',
      'aceDiff': libs + 'AceDiff/ace-diff',
      'colorpickersliders': libs + 'bootstrap-colorpickersliders/bootstrap.colorpickersliders.nocielch',
      'requestAnimationFrame': libs + 'RequestAnimationFrame',
      'coffee': libs + 'coffee-script',
      'tween': libs + 'tween.min',
      'socketio': libs + 'socket.io',
      'oembed': libs + 'jquery.oembed',
      'jqtree': libs + 'jqtree/tree.jquery',
      'js-cookie': libs + 'js.cookie',
      'octokat': libs + 'octokat',
      'spacebrew': libs + 'sb-1.4.1.min',
      'jszip': libs + 'jszip/jszip',
      'fileSaver': libs + 'FileSaver.min',
      'color-classifier': libs + 'color-classifier'
    },
    shim: {
      'oembed': ['jquery'],
      'mousewheel': ['jquery'],
      'scrollbar': ['jquery'],
      'jqueryUi': ['jquery'],
      'bootstrap': ['jquery'],
      'typeahead': ['jquery'],
      'js-cookie': ['jquery'],
      'jqtree': ['jquery'],
      'aceDiff': ['jquery', 'diffMatch', 'ace/ace'],
      'colorpickersliders': {
        deps: ['jquery', 'tinycolor']
      },
      'underscore': {
        exports: '_'
      },
      'jquery': {
        exports: '$'
      }
    }
  });

  requirejs(['Main']);

}).call(this);
