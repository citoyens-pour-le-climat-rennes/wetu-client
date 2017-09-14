// Generated by CoffeeScript 1.10.0
(function() {
  var baseUrl, getParameters, libs, parameters, prefix, repository;

  libs = '../../libs/';

  getParameters = function(hash) {
    var key, parameters, re, tokens, value;
    hash = hash.replace('#', '');
    parameters = {};
    re = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = re.exec(hash)) {
      key = decodeURIComponent(tokens[1]);
      value = decodeURIComponent(tokens[2]);
      parameters[key] = value === 'true' ? true : value === 'false' ? false : value;
    }
    return parameters;
  };

  parameters = typeof document !== "undefined" && document !== null ? getParameters(document.location.hash) : null;

  repository = {
    owner: 'arthursw',
    commit: null
  };

  if ((parameters != null) && (parameters['repository-owner'] != null) && (parameters['repository-commit'] != null)) {
    prefix = parameters['repository-use-cdn'] != null ? '//cdn.' : '//';
    baseUrl = prefix + 'rawgit.com/' + parameters['repository-owner'] + '/comme-un-dessein-client/' + parameters['repository-commit'] + '/js';
    repository = {
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
      'i18next': [libs + 'i18next.min'],
      'i18nextXHRBackend': [libs + 'i18nextXHRBackend'],
      'i18nextBrowserLanguageDetector': [libs + 'i18nextBrowserLanguageDetector'],
      'moment': [libs + 'moment.min'],
      'jqueryI18next': [libs + 'jquery-i18next.min'],
      'hammer': [libs + 'hammer.min'],
      'aceTools': [libs + 'ace/ext-language_tools'],
      'underscore': [libs + 'underscore-min'],
      'jquery': [libs + 'jquery-2.1.3.min'],
      'jqueryUi': [libs + 'jquery-ui.min'],
      'mousewheel': [libs + 'jquery.mousewheel.min'],
      'scrollbar': [libs + 'jquery.mCustomScrollbar.min'],
      'tinycolor2': [libs + 'tinycolor'],
      'bootstrap': [libs + 'bootstrap.min'],
      'paper': [libs + 'paper-full'],
      'raphael': [libs + 'raphael.min'],
      'three': [libs + 'three'],
      'gui': [libs + 'dat.gui'],
      'typeahead': [libs + 'typeahead.bundle.min'],
      'pinit': [libs + 'pinit'],
      'howler': [libs + 'howler'],
      'zeroClipboard': [libs + 'ZeroClipboard.min'],
      'diffMatch': libs + 'AceDiff/diff_match_patch',
      'aceDiff': libs + 'AceDiff/ace-diff',
      'colorpickersliders': libs + 'bootstrap-colorpickersliders/bootstrap.colorpickersliders.nocielch',
      'requestAnimationFrame': libs + 'RequestAnimationFrame',
      'coffeescript-compiler': libs + 'coffee-script',
      'tween': libs + 'tween.min',
      'socket.io': libs + 'socket.io',
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
      'i18nextXHRBackend': ['i18next'],
      'i18nextBrowserLanguageDetector': ['i18next'],
      'jqueryI18next': ['i18next'],
      'colorpickersliders': {
        deps: ['jquery', 'tinycolor2']
      },
      'underscore': {
        exports: '_'
      },
      'jquery': {
        exports: '$'
      }
    }
  });

  requirejs(['R'], function(R) {
    R.repository = repository;
    R.tipibot = parameters['tipibot'];
    R.style = parameters['style'] || 'line';
    R.getParameters = getParameters;
    requirejs(['Main']);
  });

}).call(this);
