/**
 * @fileOverview
 * d3 selection layout helpers.
 */
define(['d3'], function(d3) {
  'use strict';

  /**
   * Layout function that arranges its child elements, either
   * horizontally or vertically with a gap.
   */
  d3.selection.prototype.layout = function(settings) {
    settings = settings || {};
    var type = settings.type || 'horizontal',
        gap = settings.gap || 0,
        ignore = settings.ignore || 'gl-layout-size';
    this.each(function() {
      var node, offset = 0;
      d3.selectAll(this.childNodes).each(function () {
        node = d3.select(this);
        if (node.classed(ignore)) {
          return;
        }
        if (type === 'horizontal') {
          node.position('center-left', offset, 0);
          offset += node.width() + gap;
        } else if (type === 'vertical') {
          node.position('center-top', 0, offset);
          offset += node.height() + gap;
        }
      });
    });
  };

  return d3;
});