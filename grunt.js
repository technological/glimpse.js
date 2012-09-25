/*global module:false*/
module.exports = function(grunt) {
  'use strict';

  // Load external grunt tasks
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadTasks('grunt/tasks');
  grunt.loadTasks('grunt/helpers');

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    lint: {
      grunt: 'grunt.js',
      src: 'src/**/*.js',
      test: 'test/unit/**/*.js'
    },
    requirejs: {
      standalone: {

        almond: true,
        baseUrl: 'src',
        include: ['focal'],
        //insertRequire: ['focal'],
        //wrap: true,
        out: 'build/focal.js',

        wrap: {
          startFile: 'src/wrap.start',
          endFile: 'src/wrap.end'
        },
        optimize: 'none',
        preserveLicenseComments: false,
        skipModuleInsertion: false,
        optimizeAllPluginResources: true,
        findNestedDependencies: true,
        paths: {
          'd3': '../lib/d3'
        },
        // Shim modules that don't natively support AMD.
        shim: {
          'd3': {
            exports: 'd3'
          }
        }
      },
      amd: {
        // source code root
        appDir: 'src',
        // relative path to appDir for module resolution
        baseUrl: '.',
        // output directory for optimizations etc
        dir: 'build',
        modules: [{ name: 'focal' }],
        preserveLicenseComments: false,
        optimizeAllPluginResources: true,
        findNestedDependencies: true,
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
    },
    mochaphantom: {
      src: 'test/unit/**/*.spec.js',
      testRunnerPath: 'test/testrunner',
      requirejsConfig: '',
      // The port here must match the one used below in the server config
      testRunnerUrl: 'http://127.0.0.1:3002/test/testrunner/index.html'
    },
    server: {
      port: 3002,
      base: '.'
    },
    watch: {
      lint: {
        files: ['<config:lint.src>', '<config:lint.test>'],
        tasks: 'lint'
      }
    },
    jshint: {
      // Defaults
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        strict: true,
        es5: true,
        trailing: true,
        maxlen: 80
      },
      globals: {
        define: true,
        require: true
      },
      src: {
        options: {
          browser: true
        },
        globals: {}
      },
      test: {
        options: {
          expr: true
        },
        globals: {
          describe: true,
          it: true,
          ait: true,
          expect: true,
          spyOn: true,
          beforeEach: true,
          afterEach: true,
          setFixtures: true
        }
      }
    },
    uglify: {}
  });

  grunt.registerTask('compile', 'requirejs:standalone');
  grunt.registerTask('compile-amd', 'requirejs:amd');
  grunt.registerTask('test', 'server mochaphantom');
  grunt.registerTask('default', 'lint compile');
  grunt.registerTask('release', 'lint test compile');
};
