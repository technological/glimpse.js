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
