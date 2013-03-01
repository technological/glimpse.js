define([
  'layout/util'
],
function (util) {
  'use strict';

  describe('layout.util', function() {

    var node, nodeInfo, w, h, rect;

    beforeEach(function() {
      w = 400;
      h = 300;
      node = jasmine.svgFixture().append('g').size(w, h);
    });

    describe('border-solid', function() {
      var expectedValue;

      describe('border', function() {
        beforeEach(function() {
          nodeInfo = {
            border: 1,
            borderOpacity: 0.3,
            borderColor: 'red'
          };
          util.border(node, nodeInfo);
          rect = node.select('.gl-layout-size').node();
        });

        it('sets stroke-dasharray', function() {
          expectedValue = [w,0,h,0,w,0,h];
          expect(rect).toHaveAttr(
            'stroke-dasharray', expectedValue.toString()
          );
        });

        it('sets stroke-opacity', function() {
          expect(rect).toHaveAttr(
            'stroke-opacity', nodeInfo.borderOpacity
          );
        });

        it('sets stroke-width', function() {
          expect(rect).toHaveAttr(
            'stroke-width', nodeInfo.border
          );
        });

        it('sets stroke', function() {
          expect(rect).toHaveAttr(
            'stroke', nodeInfo.borderColor
          );
        });

      });

      describe('individual borders', function() {
        it('stroke-dasharray for top border', function() {
          nodeInfo = {
            borderTop: 1,
            borderOpacity: 0.3,
            borderColor: 'red'
          };
          util.border(node, nodeInfo);
          rect = node.select('.gl-layout-size').node();
          expectedValue = [w,h,0,w,0,h];
          expect(rect).toHaveAttr(
            'stroke-dasharray', expectedValue.toString()
          );
        });

        it('stroke-dasharray for right border', function() {
          nodeInfo = {
            borderRight: 1
          };
          util.border(node, nodeInfo);
          rect = node.select('.gl-layout-size').node();
          expectedValue = [0,w,h,w,0,h];
          expect(rect).toHaveAttr(
            'stroke-dasharray', expectedValue.toString()
          );
        });

        it('stroke-dasharray for bottom border', function() {
          nodeInfo = {
            borderBottom: 1
          };
          util.border(node, nodeInfo);
          rect = node.select('.gl-layout-size').node();
          expectedValue = [0,w,0,h,w,h];
          expect(rect).toHaveAttr(
            'stroke-dasharray', expectedValue.toString()
          );
        });

        it('stroke-dasharray for left border', function() {
          nodeInfo = {
            borderLeft: 1
          };
          util.border(node, nodeInfo);
          rect = node.select('.gl-layout-size').node();
          expectedValue = [0,w,0,h,0,w,h];
          expect(rect).toHaveAttr(
            'stroke-dasharray', expectedValue.toString()
          );
        });

      });

    });

    describe('border-dotted', function() {
      var lines, line;

      describe('border', function() {
        beforeEach(function() {
          nodeInfo = {
            border: 1,
            borderStyle: 'dotted',
            borderColor: 'red',
            borderOpacity: 0.3
          };
          util.border(node, nodeInfo);
          lines = node.selectAll('line');
        });

        it('adds four dotted lines', function() {
          expect(lines[0].length).toBe(4);
        });

        it('adds a dotted line for top border', function() {
          line = node.select('.gl-dotted-border-top').node();
          expect(line).toHaveAttr({
            'x1': 0,
            'y1': 0,
            'x2': w,
            'y2': 0,
            'stroke-width': nodeInfo.border,
            'stroke': nodeInfo.borderColor,
            'stroke-opacity': nodeInfo.borderOpacity,
            'stroke-dasharray':'1,1'
          });
        });

        it('adds a dotted line for right border', function() {
          line = node.select('.gl-dotted-border-right').node();
          expect(line).toHaveAttr({
            'x1': w,
            'y1': 0,
            'x2': w,
            'y2': h,
            'stroke-width': nodeInfo.border,
            'stroke': nodeInfo.borderColor,
            'stroke-opacity': nodeInfo.borderOpacity,
            'stroke-dasharray':'1,1'
          });
        });

        it('adds a dotted line for bottom border', function() {
          line = node.select('.gl-dotted-border-bottom').node();
          expect(line).toHaveAttr({
            'x1': 0,
            'y1': h,
            'x2': w,
            'y2': h,
            'stroke-width': nodeInfo.border,
            'stroke': nodeInfo.borderColor,
            'stroke-opacity': nodeInfo.borderOpacity,
            'stroke-dasharray':'1,1'
          });
        });

        it('adds a dotted line for left border', function() {
          line = node.select('.gl-dotted-border-left').node();
          expect(line).toHaveAttr({
            'x1': 0,
            'y1': 0,
            'x2': 0,
            'y2': h,
            'stroke-width': nodeInfo.border,
            'stroke': nodeInfo.borderColor,
            'stroke-opacity': nodeInfo.borderOpacity,
            'stroke-dasharray':'1,1'
          });

        });

      });

      describe('individual borders', function() {

        it('adds a dotted line for borderTop', function() {
          nodeInfo = {
            borderTop: 1,
            borderStyle: 'dotted'
          };
          util.border(node, nodeInfo);
          lines = node.selectAll('line');
          expect(lines[0].length).toBe(1);
          line = node.select('.gl-dotted-border-top').node();
          expect(line).toBeDefinedAndNotNull();
        });

        it('adds a dotted line for borderRight', function() {
          nodeInfo = {
            borderRight: 1,
            borderStyle: 'dotted'
          };
          util.border(node, nodeInfo);
          lines = node.selectAll('line');
          expect(lines[0].length).toBe(1);
          line = node.select('.gl-dotted-border-right').node();
          expect(line).toBeDefinedAndNotNull();
        });

        it('adds a dotted line for borderBottom', function() {
          nodeInfo = {
            borderBottom: 1,
            borderStyle: 'dotted'
          };
          util.border(node, nodeInfo);
          lines = node.selectAll('line');
          expect(lines[0].length).toBe(1);
          line = node.select('.gl-dotted-border-bottom').node();
          expect(line).toBeDefinedAndNotNull();
        });

        it('adds a dotted line for borderLeft', function() {
          nodeInfo = {
            borderLeft: 1,
            borderStyle: 'dotted'
          };
          util.border(node, nodeInfo);
          lines = node.selectAll('line');
          expect(lines[0].length).toBe(1);
          line = node.select('.gl-dotted-border-left').node();
          expect(line).toBeDefinedAndNotNull();
        });

      });
    });

    describe('border-dashed', function() {
      var line;

      describe('border', function() {
        beforeEach(function() {
          nodeInfo = {
            border: 1,
            borderStyle: 'dashed',
            borderColor: 'red',
            borderOpacity: 0.3,
            borderDashArray: '5,5'
          };
          util.border(node, nodeInfo);
        });

        it('adds a dashed line for top border', function() {
          line = node.select('.gl-dashed-border-top').node();
          expect(line).toHaveAttr({
            'x1': 0,
            'y1': 0,
            'x2': w,
            'y2': 0,
            'stroke-width': nodeInfo.border,
            'stroke': nodeInfo.borderColor,
            'stroke-opacity': nodeInfo.borderOpacity,
            'stroke-dasharray':'5,5'
          });
        });

        it('adds a dashed line for right border', function() {
          line = node.select('.gl-dashed-border-right').node();
          expect(line).toHaveAttr({
            'x1': w,
            'y1': 0,
            'x2': w,
            'y2': h,
            'stroke-width': nodeInfo.border,
            'stroke': nodeInfo.borderColor,
            'stroke-opacity': nodeInfo.borderOpacity,
            'stroke-dasharray':'5,5'
          });
        });

        it('adds a dashed line for bottom border', function() {
          line = node.select('.gl-dashed-border-bottom').node();
          expect(line).toHaveAttr({
            'x1': 0,
            'y1': h,
            'x2': w,
            'y2': h,
            'stroke-width': nodeInfo.border,
            'stroke': nodeInfo.borderColor,
            'stroke-opacity': nodeInfo.borderOpacity,
            'stroke-dasharray':'5,5'
          });
        });

        it('adds a dashed line for left border', function() {
          line = node.select('.gl-dashed-border-left').node();
          expect(line).toHaveAttr({
            'x1': 0,
            'y1': 0,
            'x2': 0,
            'y2': h,
            'stroke-width': nodeInfo.border,
            'stroke': nodeInfo.borderColor,
            'stroke-opacity': nodeInfo.borderOpacity,
            'stroke-dasharray':'5,5'
          });

        });

      });

    });

    describe('backgroundColor', function() {
      it('sets background color', function() {
        nodeInfo = {
          backgroundColor: 'red'
        };
        util.backgroundColor(node, nodeInfo);
        expect(node.select('.gl-layout-size').node())
          .toHaveAttr('fill', nodeInfo.backgroundColor);
      });
    });

  });

});
