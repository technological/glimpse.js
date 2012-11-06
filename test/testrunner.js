require([
  'require',
  'mocha',
  'chai',
  'testDeps'
],
function (require, mocha, chai, testDeps) {
  'use strict';

  window.expect = chai.expect;
  mocha.ui('bdd');
  mocha.reporter('html');
  require(testDeps, function () {
    // Check for global mochaPhantomJS for mocha-phantomJS npm module usage.
    (window.mochaPhantomJS || mocha).run();
  });
});
