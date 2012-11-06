module.exports = function (grunt) {
  'use strict';

  grunt.registerTask(
  'depsGenerator',
  'Generate amd dependencies for a file list.',
  function () {

    // This is async. Don't return until done() is called.
    var done = this.async(),
        // All config options for this task.
        config = grunt.config.get('depsGenerator');

    // These options are required.
    function validate() {
      grunt.config.requires('depsGenerator.src');
    }

    // Load all the files and map them to their AMD deps format.
    function loadFiles() {
      // Array of all the files.
      var files = grunt.file.expandFiles(config.src);
      files = files.map(function (file) {
        return '\'../' + file.replace('.js', '') + '\'';
      });
      return files;
    }

    // Write out an AMD file which returns a list of all js files.
    function writeDepsFile() {
      grunt.file.write(config.out,
        'define(function () {\n' +
        '  return [' + loadFiles() + '];\n' +
        '});'
      );
      done();
    }

    validate();
    writeDepsFile();
  });

};
