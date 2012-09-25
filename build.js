{
  baseUrl: 'src',
  name: '../lib/almond',
  include: ['focal'],
  insertRequire: ['focal'],
  out: 'build/focal.min.js',
  wrap: true,
  paths: {
    'd3': '../lib/d3'
  },
  // Shim modules that don't natively support AMD.
  shim: {
    'd3': {
      exports: 'd3'
    }
  }
}

// this build file works, but try again using grunt-require!!!!
