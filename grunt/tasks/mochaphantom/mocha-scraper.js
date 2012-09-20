/*global phantom:true, console:true, WebPage:true, Date:true, document:true*/

/**
 * @fileoverview
 * A scraper for the mocha.js html rest reporter.
 */

(function () {
  'use strict';

  var page = require('webpage').create(),
      // The url of the testrunner to load.
      url,
      // Consider tests failed if this timeout exceeds.
      timeout,
      // Tracks the total runtime to compare against timeout.
      totalRuntime,
      // Function identifiers see desc below.
      scrape,
      hasCompleted,
      attachToPageEvents,
      pollForCompletion;

  if (phantom.args.length < 1) {
    console.log('Usage: phantomjs mocha-scraper.js URL [timeout]');
    phantom.exit();
  }

  url = phantom.args[0];
  timeout = phantom.args[1] || 20000;


  // PAGE-LEVEL SCOPED FUNCTIONS

  /**
   * Determines if the tests have finished running and all results have been
   * analyzed.
   */
  hasCompleted = function () {
    return page.evaluate(function () {
      if (!window || !window.mochaphantom || !window.mochaphantom.complete) {
        return false;
      }
      return true;
    });
  };

  /**
   * Attach to page-level events to ensure document has fully loaded and the
   * testrunner has completed. Only then call the callback.
   */
  attachToPageEvents = function (callback) {
    window.onload = function () {
      console.log('Test runner started.');
      window.mochaphantom.testrunner.on('end', function () {
        console.log('Test runner complete.');
        callback(window.mochaphantom.testrunner);
      });
    };
  };

  /**
   * Scrape function that grabs all the test result info out of the DOM.
   */
  scrape = function (testRunner) {
    var duration,
        results = [], failureList, specs, i, len, parseFailureList;

    console.log('Analyzing results...');
    duration = document.querySelector('#stats .duration em').innerText;
    console.log('Duration: ' + duration);




    // old code: needs cleaning


    // TODO: Old copied code. Refactor this
    parseFailureList = function (document) {
      var parseSuite, parseSuites, parseTests, extractNodes;


      extractNodes = function (nodes, match) {
        var i, len, regex, results = [];
        regex = new RegExp(match);
        for (i = 0, len = nodes.length; i < len; i += 1) {
          if (nodes[i].getAttribute('class').search(regex) !== -1) {
            results.push(nodes[i]);
          }
        }
        return results;
      };

      parseTests = function(tests) {
        var i, len, messages = [];
        for (i = 0, len = tests.length; i < len; i += 1) {
          messages.push(
            tests[i].querySelector('h2').innerText + ' - ' +
            tests[i].querySelector('.error').innerText
          );
        }
        messages = messages.join('  \n');
        return messages;
      };

      parseSuite = function (suite, description) {
        var nested, tests, div, fails = [];
        div = suite.querySelector('div');
        if (typeof description === 'undefined') {
          description = [];
        }
        description.push(suite.querySelector('h1').innerText);
        tests = extractNodes(div.childNodes, 'fail');
        if (tests.length) {
          fails.push({
            desc: description.join(' :: '),
            msg: '  ' + parseTests(tests)
          });
        }
        nested = extractNodes(div.childNodes, 'suite');
        if (nested.length) {
          fails = fails.concat(parseSuites(nested, description));
        }
        return fails;
      };

      parseSuites = function (suites, description) {
        var i, len, fails = [];
        for (i = 0, len = suites.length; i < len; i += 1) {
          fails = fails.concat(parseSuite(suites[i], description));
        }
        return fails;
      };

      return parseSuites(document.querySelectorAll('#mocha > .suite'), []);
    };



    specs = document.querySelectorAll('.test');
    console.log('ran ' + specs.length + ' specs');
    for (i = 0, len = specs.length; i < len; i += 1) {
      results.push(specs[i].getAttribute('class').search(/fail/) === -1);
    }

    // Outputs a '.' or 'F' for each test
    console.log(
      results.reduce(function (str, specPassed) {
        str += (specPassed) ? '.' : 'F';
        return str;
      }, '')
    );


    failureList = parseFailureList(document);

    // If the list of failures is not empty output the failure messages
    console.log('');
    if (failureList.length) {
      for (i = 0, len = failureList.length; i < len; i += 1) {
        console.log(failureList[i].desc + '\n' + failureList[i].msg + '\n');
      }
    }
    // end: old code: needs cleaning



    window.mochaphantom.complete = true;
  };


  // PHANTOMJS-LEVEL SCOPED FUNCTIONS

  /**
   * Log all page console messages.
   */
  page.onConsoleMessage = function (msg) {
    console.log(msg);
  };

  /**
   * Log all page errors.
   */
  page.onError = function (msg, trace) {
    console.log(msg);
    trace.forEach(function(item) {
        console.log('  ', item.file, ':', item.line);
    });
  };

  /**
   * Notify if any resources fail to load.
   */
  page.onResourceReceived = function (response) {
    if (response.status !== 200) {
      console.log('====================');
      console.log('REQUEST ERROR: ' + response.url);
      console.log('====================');
      console.log(JSON.stringify(response, undefined, 2));
      console.log('====================\n');
    }
  };

  /**
   * Polls periodically to see if everything has completed.
   * This is to prevent phantomjs from hanging b/c exit() needs to be called
   * eventually.
   *
   * NOTE: This is a bit lame, but has to be done since all "page" scope 
   * evaluated code is sandboxed.
   */
  pollForCompletion = function () {
    if (hasCompleted()) {
      phantom.exit();
    } else if (totalRuntime > timeout) {
      console.log('Timed out.');
    } else {
      totalRuntime += 100;
      setTimeout(pollForCompletion, 100);
    }
  };

  /**
   * Actually open and load the test runner page.
   */
  page.open(url, function (status) {
    console.log('Opening test runner...');
    if (status !== 'success') {
      console.log('Failed to load the testrunner page. Check the url.');
      phantom.exit();
    }
    page.evaluate(attachToPageEvents, scrape);
    pollForCompletion();
  });

}());
