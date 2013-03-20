/**
 * @fileOverview
 * d3 scale type.
 */
define(['d3'], function(d3) {
  'use strict';

  return {
    /**
    * Returns the type of scale
    * @param  {d3.scale|d3.time.scale} scale
    * @return {string}
    */
    isTimeScale: function(scale) {
      var scaleFn;
      if (scale) {
        scaleFn = scale.toString();
        //TODO: Find a better way of comparing scale types
        if (scaleFn === d3.time.scale().toString()) {
          return true;
        }
      }
      return false;
    }
  };

});