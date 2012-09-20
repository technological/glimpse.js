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
      baseUrl: 'src',
      name: 'main',
      mainConfigFile: 'src/main.js',
      out: 'build/focal.min.js',
      preserveLicenseComments: false
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
        options: {},
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

  grunt.registerTask('compile', 'requirejs');
  grunt.registerTask('test', 'server mochaphantom');
  grunt.registerTask('default', 'lint compile');
  grunt.registerTask('release', 'lint test compile');
};
