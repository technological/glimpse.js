define([
  'core/array'
],
function (array) {
  'use strict';

  var Obj;
  Obj = {

    /**
     * Similar to underscore.js's extend() but es5 safe.
     */
    extend: function (target) {
      var sources = array.convertArgs(arguments, 1);
      sources.forEach(function (src) {
        if (typeof src !== 'object') {
          return;
        }
        Object.getOwnPropertyNames(src).forEach(function (propName) {
          Object.defineProperty(target, propName,
            Object.getOwnPropertyDescriptor(src, propName));
        });
      });
      return target;
    },

    isDef: function(val) {
      return val !== undefined;
    },

    isDefAndNotNull: function(val) {
      return val != null;
    },

    get: function(obj, path) {
      var i;
      path = array.getArray(path);
      for (i = 0; i < path.length; i += 1) {
        if(this.isDefAndNotNull(obj)) {
          obj = obj[path[i]];
        }
      }
      if (obj) {
        return obj;
      }
      return null;
    }

  };

  return Obj;
});
