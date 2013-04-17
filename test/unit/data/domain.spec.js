define([
  'data/collection',
  'data/domain'
], function (collection, domain) {
  'use strict';

  describe('data doamian', function () {

    var dc;

    beforeEach(function() {
      dc = collection.create();
    });

    describe('compute extents', function() {
      var fakeData, xExtents, yExtents;

      fakeData = [
        {
          id:'fakeData1',
          data: [
            { x: 50, y: 10},
            { x: 145, y: 20},
            { x: 250, y: 40}
          ]
        },
        {
          id:'fakeData2',
          data: [
            { x: 10, y: 5},
            { x: 100, y: 20},
            { x: 200, y: 30}
          ]
        },
        {
          id:'fakeData3',
          data: [
            { x: 10, y: 50},
            { x: 150, y: 45},
            { x: 500, y: 35}
          ]
        }
      ];

      beforeEach(function() {
        dc.add([
          {
            id: 'data1',
           data: fakeData[0].data,
            dimensions: {
              x: function(d) { return d.x; },
              y: function(d) { return d.y; }
           }
          },
          {
            id: 'data2',
            data: fakeData[1].data,
           dimensions: {
              x: function(d) { return d.x; },
              y: function(d) { return d.y; }
            }
          },
          {
            id: 'data3',
            data: fakeData[2].data,
            dimensions: {
              x: function(d) { return d.x; },
              y: function(d) { return d.y; }
            }
          },
          {
            id: 'data4',
            sources: '*',
            derivation: function () {
              return {
                x: 1000,
                y: 1000,
              };
            }
          }
        ]);
      });

      it('calculates the extents for the provided sources', function() {
        domain.addDomainDerivation({
          x: {
            sources: 'data1,data2',
            compute: 'extent',
            'default': [0, 0]
          }
        }, dc);
        dc.updateDerivations();
        xExtents = dc.get('$domain').x;
        expect(xExtents).toEqual([10, 250]);
      });


      it('returns the extents of all non-derived sources if called with *',
        function() {
          domain.addDomainDerivation({
            x: {
              sources: '*',
              compute: 'extent',
              'default': [0, 0]
            }
          }, dc);
          dc.updateDerivations();
          xExtents = dc.get('$domain').x;
          expect(xExtents).toEqual([10, 500]);
        }
      );

      it('returns default on no data of 0', function() {
        domain.addDomainDerivation({
          x: {
            sources: '',
            compute: 'extent',
            'default': [0, 0]
          }
        }, dc);
        dc.updateDerivations();
        xExtents = dc.get('$domain').x;
        expect(xExtents).toEqual([0, 0]);
      });

      it('returns non-zero default on no data', function() {
        domain.addDomainDerivation({
          x: {
            sources: '',
            compute: 'extent',
            'default': [100, 50]
          }
        }, dc);
        dc.updateDerivations();
        xExtents = dc.get('$domain').x;
        expect(xExtents).toEqual([100, 50]);
      });

      it('calculates the yExtents for the provided sources', function() {
        domain.addDomainDerivation({
          y: {
            sources: 'data1,data2',
            compute: 'extent',
            'default': [0, 0]
          }
        }, dc);
        dc.updateDerivations();
        yExtents = dc.get('$domain').y;
        expect(yExtents).toEqual([5, 40]);
      });

      it('returns the yExtents of all non-derived sources if called with *',
        function() {
          domain.addDomainDerivation({
            y: {
              sources: '*',
              compute: 'extent',
              'default': [0, 0]
            }
          }, dc);
          dc.updateDerivations();
          expect(dc.get('$domain').y).toEqual([5, 50]);
        }
      );

      describe('modifiers', function() {

        describe('maxMultiplier', function() {

          it('applies maxMultiplier of 1.2', function() {
            domain.addDomainDerivation({
              y: {
                sources: '*',
                compute: 'extent',
                modifier: {
                  maxMultiplier: 1.2
                },
                'default': [0, 0]
              }
            }, dc);
            dc.updateDerivations();
            expect(dc.get('$domain').y).toEqual([5, 60]);
          });

          it('applies maxMultiplier of 0.5', function() {
            domain.addDomainDerivation({
              y: {
                sources: '*',
                compute: 'extent',
                modifier: {
                  maxMultiplier: 0.5
                },
                'default': [0, 0]
              }
            }, dc);
            dc.updateDerivations();
            expect(dc.get('$domain').y).toEqual([5, 25]);
          });

        });

      });

   });

  });

});
