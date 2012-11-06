require.config({
  baseUrl: '../src',
  paths: {
    'd3':   '../lib/d3',
    'mocha': '../lib/mocha',
    'chai': '../lib/chai',
    'testDeps': '../test/deps'
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
