define([
  'util/util'
],
function(util) {
  'use strict';

  describe('util.util', function() {

    describe('isTimeScale', function() {
      it('returns true for time scale', function() {
        expect(util.isTimeScale(d3.time.scale())).toBe(true);
      });

      it('returns false for linear scale', function() {
        expect(util.isTimeScale(d3.scale.linear())).toBe(false);
      });

      it('returns false for null', function() {
         expect(util.isTimeScale(null)).toBe(false);
      });

      it('returns false for undefined', function() {
         expect(util.isTimeScale(undefined)).toBe(false);
      });

    });

  });

});
