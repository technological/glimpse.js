/**
 * @fileOVerview
 * Bootstraps RequireJS.
 * Sets up any special configuration for external modules and initializes.
 */

require.config({
  paths: {
    'd3': '../lib/d3'
  },
  // Shim modules that don't natively support AMD.
  shim: {
    'd3': {
      deps: [],
      exports: 'd3'
    }
  }
});

require(['focal'], function (Focal) {
  'use strict';
});
