define([
  'glimpse'
],
function (glimpse) {
  'use strict';

  describe('d3', function () {
    it('should load d3', function () {
      expect(glimpse.d3).to.exist;
    });
  });

});
