require.config({
  baseUrl: '../src',
  paths: {
    'd3':   '../lib/d3',
    'mocha': '../lib/mocha',
    'chai': '../lib/chai',
    'deps': '../test/deps'
  },
  shim: {
    'd3': {
      exports: 'd3'
    },
    'mocha': {
      exports: 'mocha'
    },
    'chai': {
      deps: ['mocha'],
      exports: 'expect'
    }
  }
});

require([
  'require',
  'mocha',
  'chai',
  'deps'
],
function (require, mocha, chai, deps) {
  'use strict';

  window.expect = chai.expect;
  mocha.ui('bdd');
  mocha.reporter('html');
  require(deps, function () {
    // Check for global mochaPhantomJS for mocha-phantomJS npm module usage.
    (window.mochaPhantomJS || mocha).run();
  });
});
