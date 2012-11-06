/*global module:false*/

module.exports = function(grunt) {
  'use strict';

  /**
   * Load external grunt helpers & tasks.
   */
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-exec');
  //grunt.loadTasks('grunt/helpers');
  grunt.loadTasks('grunt/tasks');

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',

    /**
     * Specify which files to lint.
     */
    lint: {
      grunt: 'grunt.js',
      src: 'src/**/*.js',
      test: 'test/unit/**/*.js'
    },

    /**
     * Cleans out the "build" directory.
     */
    clean: ['build/**'],

    /**
     * Compilation configuration.
     */
    requirejs: {
      /**
       * Config for the static build which generates a single static JS file.
       * This uses Almond.js as a shim for fake module loading.
       */
      staticBuild: {
        almond: true,
        baseUrl: 'src',
        include: ['glimpse'],
        out: 'build/glimpse.js',
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
      /**
       * Config for the default multi-file AMD build.
       */
      amdBuild: {
        // source code root
        appDir: 'src',
        // relative path to appDir for module resolution
        baseUrl: '.',
        // output directory for optimizations etc
        dir: 'build',
        modules: [{ name: 'glimpse' }],
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

    /**
     * Generate unit test dependencies for the test runner.
     */
    depsGenerator: {
      src: 'test/unit/**/*.spec.js',
      out: 'test/deps.js'
    },

    /**
     * Run the unit tests from the command line.
     */
    exec: {
      mochaPhantomJS: {
        command: 'mocha-phantomjs -R spec test/testrunner.html',
        stdout: true
      }
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
    }
  });

  grunt.registerTask('test-deps', 'depsGenerator');
  grunt.registerTask('compile', 'clean requirejs:amdBuild');
  grunt.registerTask('compile-static', 'clean requirejs:staticBuild');
  grunt.registerTask('test', 'test-deps exec:mochaPhantomJS');
  grunt.registerTask('release', 'lint test compile');
  grunt.registerTask('default', 'lint compile');
};
