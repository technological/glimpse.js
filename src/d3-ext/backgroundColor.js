/**
 * @fileOverview
 * d3 Selection group backgroundColor helpers.
 */
define(['d3'], function(d3) {
  'use strict';

  /**
   * d3 selection backgroundColor
   * Sets the fill attr for the node and
   *   sets the gl-background-color attribute.
   */
  d3.selection.prototype.backgroundColor = function(color) {
    var rect;
    rect = this.select('.gl-layout-size');
    if (!rect.empty()) {
      rect.attr('fill', color);

    } else {
      this.attr('fill', color);
    }
    this.attr('gl-background-color', color);

    return this;
  };

  return d3;
});
