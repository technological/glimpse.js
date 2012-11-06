Graphing library that wraps d3


## Dependencies
- d3js
- requirejs or almondjs

## Features TODO
- modular src(amd)
- custom builds
- gallery of all independent widgets
- travis ci integration
- registered npm module support
- unit tests
- browser support?
- d3 plugin support
- library support for plugins
- clearly defined update interface for polling apps
- lightweight exportable event system
- user settings to decide how to show errors
- standardized lifecycle management (init, render, update, destroy, etc)
- look into shims for Web Components?
- support for users passing in images for things
- support for users passing in absolutely positioned html for rendering tooltips etc?
- awesome loading states and error states (spinners!!!)

## Contribute / Custom Build

Install the build tools

- Install [nodejs](http://nodejs.org)
- Install [PhantomJS](http://phantomjs.org)
- Install [grunt](http://gruntjs.com)   
  `npm install -g grunt'
- Install [mocha-phantomjs](http://metaskills.net/mocha-phantomjs)   
  `npm install -g mochaPhantomJS`
- Install other build dependencies   
  `npm install`

Writing Unit Tests

- Write unit tests in `/test/unit/` using [mocha](http://visionmedia.github.com/mocha/) and [chai](http://chaijs.com/)
- Run tests from the command line: `grunt test`
- Run tests from the browser: `grunt test-deps`, then open `/test/testrunner.html`


## License




