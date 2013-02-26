define([
  'data/collection'
], function (dc) {
  'use strict';

  describe('data collection', function () {

    var dataCollection;

    beforeEach(function() {
      dataCollection = dc.create();
    });

    describe('.get()', function() {

      it('returns empty arrary if data is not added', function() {
        expect(dataCollection.get()).toEqual([]);
      });

    });

  });

});
