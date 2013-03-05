define([
  'd3-ext/d3-ext'
],
function () {
  'use strict';

  describe('selection.backgroundColor', function() {

    var g;

    beforeEach(function() {
      g = jasmine.svgFixture().append('g');
    });

    describe('backgroundColor', function() {
      it('sets background color on the node', function() {
        g.backgroundColor('red');
        expect(g.node()).toHaveAttr('fill', 'red');
      });

      it('sets background color on the rect if available', function() {
        g.size('200', '300');
        g.backgroundColor('red');
        expect(g.select('.gl-layout-size').node()).toHaveAttr('fill', 'red');
      });
    });

  });

});
