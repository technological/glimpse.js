/**
 * @fileOverview
 * Config mixin generator.
 * A function to generate a new object with a config() method.
 * Optionally adds various named getter/setter methods for individual
 * config options.
 */
define([
  'core/object',
  'core/array'
],
function (obj, array) {
  'use strict';

  return function (context, configObj, propNames) {

    var mixin = {};

    // Generate all the individual property config functions.
    if (propNames && Array.isArray(propNames)) {
      propNames.forEach(function (propName) {
        mixin[propName] = function (value) {
          if (!arguments.length) {
            return configObj[propName];
          }
          configObj[propName] = value;
          return context;
        };
      });
    }

    /**
     * The main multi-property config function.
     */
    mixin.config = function () {
      var args = array.convertArgs(arguments),
          argCount = args.length,
          firstArg;

      if (argCount === 0) {
        return undefined;
      }
      firstArg = args[0];
      if (argCount === 1) {
        if (typeof firstArg === 'string') {
          return typeof configObj[firstArg] === 'function' ?
            configObj[firstArg](context) :
            configObj[firstArg];
        }
        if (typeof firstArg === 'object') {
          obj.extend(configObj, firstArg);
        }
      } else {
        // 2 args.
        configObj[firstArg] = args[1];
      }
      return context;
    };

    return mixin;
  };
});
