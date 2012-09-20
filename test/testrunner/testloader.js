require.config({
  baseUrl: '../../src',

  paths: {
    'd3':   '../lib/d3',
    'mocha': '../test/testrunner/mocha/mocha',
    'chai': '../test/testrunner/chai/chai',
    'testlist': '../test/testrunner/testlist'
  },
  shim: {
    'd3': {
      deps: [],
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
  'testlist'
  ], function (require, mocha, chai, testList) {

  'use strict';

  window.expect = chai.expect;
  mocha.setup({ ui: 'bdd', reporter: mocha.reporters.HTML });

  require(testList, function () {
    // Add global reference to testrunner so scrapers can access it and
    // listen to its events.
    window.mochaphantom = {
      testrunner: mocha.run(),
      complete: false
    };
  });

});
