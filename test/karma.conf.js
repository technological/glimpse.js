// Testacular configuration
// Generated on Thu Jan 10 2013 11:31:02 GMT-0800 (PST)


// base path, that will be used to resolve files and exclude
basePath = '../';


// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  REQUIRE,
  REQUIRE_ADAPTER,

  // requirejs shim
  'components/d3/d3.js',

  // requirejs paths
  // src and test modules
  { pattern: 'src/**/*.js', included: false },
  { pattern: 'src/*.js', included: false },
  { pattern: 'test/unit/*.spec.js', included: false },
  { pattern: 'test/unit/**/*.spec.js', included: false },
  { pattern: 'test/util/*.js', included: false },

  // custom jasmine matchers
  'test/matchers.js',

  // fixtures
  'test/fixtures.js',

  // main test module
  'test/testrunner.js'
];

// list of files to exclude
exclude = [];

//TODO: Remove after adding coverage command.
//preprocessors = {
  //'**/src/*.js': 'coverage',
  //'**/src/**/*.js': 'coverage'
//};

//coverageReporter = {
  //type : 'html',
  //dir : 'test/coverage/'
//}


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
//reporters = ['progress', 'coverage'];
reporters = ['progress'];


// web server port
port = 8080;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
