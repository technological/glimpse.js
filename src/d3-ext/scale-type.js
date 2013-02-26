/**
 * @fileOverview
 * d3 scale type.
 */
define(['d3'], function(d3) {
  'use strict';

  /* Enum for scale types*/
  d3.scale.types = {
    TIME: 'time',
    LINEAR: 'linear',
    ORDINAL: 'ordinal',
    IDENTITY: 'identity'
  };

  /**
   * Returns the type of scale
   * @param  {d3.scale|d3.time.scale} scale
   * @return {string}
   */
  d3.scale.type = function(scale) {
    var scaleFn;
    scaleFn = scale.toString();
    //TODO: Find a better way of comparing scale types
    if (scaleFn === d3.time.scale().toString()) {
      return d3.scale.types.TIME;
    }
    if (scaleFn === d3.scale.linear().toString()) {
      return d3.scale.types.LINEAR;
    }
    if (scaleFn === d3.scale.ordinal().toString()) {
      return d3.scale.types.ORDINAL;
    }
     if (scaleFn === d3.scale.identity().toString()) {
      return d3.scale.types.IDENTITY;
    }
    //TODO: Add other scales as needed.
    return '';
  };

  return d3;
});