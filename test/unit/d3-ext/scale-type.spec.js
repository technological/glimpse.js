define([
  'd3-ext/d3-ext'
],
function(d3) {
  'use strict';

  describe('d3-ext.scale-type', function() {

    it('sets the scale types', function() {
      expect(d3.scale.types).toBeDefinedAndNotNull();
    });

    it('returns type of time scale', function() {
      expect(d3.scale.type(d3.time.scale())).toBe(d3.scale.types.TIME);
    });

    it('returns type of linear scale', function() {
      expect(d3.scale.type(d3.scale.linear())).toBe(d3.scale.types.LINEAR);
    });

    it('returns type of ordinal scale', function() {
       expect(d3.scale.type(d3.scale.ordinal())).toBe(d3.scale.types.ORDINAL);
    });

    it('returns type of identity scale', function() {
       expect(d3.scale.type(d3.scale.identity())).toBe(d3.scale.types.IDENTITY);
    });

  });

});
