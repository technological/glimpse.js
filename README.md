Graphing library that wraps d3 and provides some standard graphs.   

DO NOT USE THIS. It is a work in progress.   


## Dependencies
- d3js
- requirejs or almondjs

## Features
- Modular source with AMD support
- Use as AMD or build a single static script
- Includes D3 and provides direct access to it
- d3 plugin support

## TODO

- lightweight exportable event system
- user settings to decide how to show errors
- standardized lifecycle management (init, render, update, destroy, etc)
- look into shims for Web Components?
- support for user defined images
- support for user defined absolutely positioned html for rendering tooltips etc?
- custom loading states and error states (spinners!!!)


## Contribute / Custom Build

Install the build tools

- Install [nodejs](http://nodejs.org)
- Install [grunt](http://gruntjs.com)   
  `npm install -g grunt-cli'
- Install [testacular](http://vojtajina.github.com/testacular/)   
  `npm install -g testacular@0.5.7`
- Install other build dependencies   
  `npm install`

Writing Unit Tests

- Write unit tests in `/test/unit/` using [mocha](http://visionmedia.github.com/mocha/) and [chai](http://chaijs.com/)
- Run tests from the command line: `grunt test`
- Run tests from the browser: `grunt test-deps`, then open `/test/testrunner.html`


## License




