define([
  'components/mixins'
],
function (mixins) {
  'use strict';

  describe('core.mixins', function () {

    describe('mixins.toggle', function () {
      var selection, root, component;

      beforeEach(function () {
        selection = jasmine.svgFixture();
        root = d3.select('#svg-fixture').append('g')
          .attr({
            'class': 'gl-component'
          });
        component = {
          root: function () {
            return root;
          }
        };
        component.show = mixins.toggle.show;
        component.hide = mixins.toggle.hide;
      });

      it('show()', function () {
        component.show();
        expect(d3.select('.gl-component').node())
          .toHaveAttr('display', 'inline');
      });

      it('hide()', function () {
        component.hide();
        expect(d3.select('.gl-component').node())
          .toHaveAttr('display', 'none');
      });

    });

  });

});
