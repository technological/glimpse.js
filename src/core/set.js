/**
 * @fileOverview
 * Very simple implementation for an unordered set.
 * Works with primitive types such as strings and numbers.
 */
define([
  'core/array'
],
function (array) {
  'use strict';

  function set() {
    var store = {};

    return {

      add: function(elements) {
        elements = array.getArray(elements);
        elements.forEach(function(element) {
          store[element] = true;
        });
      },

      remove: function(elements) {
        elements = array.getArray(elements);
        elements.forEach(function(element) {
          delete store[element];
        });
      },

      toArray: function() {
        return Object.keys(store);
      }

    };
  }

  return {

    create: function (array) {
      return set(array);
    }

  };

});
