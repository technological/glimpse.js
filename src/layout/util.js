/**
 * @fileOverview
 * Utils for layout
 */
define(function () {
  'use strict';

  var addDashedBorder_,
    applyDashedBorder_,
    applySolidBorder_,
    getStrokeDashArray_,
    getStrokeWidth_;

  getStrokeDashArray_ = function(border, width, height) {
    var stroke = [], t, r, b, l;

    t = border.top;
    r = border.right;
    b = border.bottom;
    l = border.left;

    if (t) {
      stroke.push(width);
    } else {
      stroke = stroke.concat([0, width]);
    }

    if (r && stroke.length % 2 !== 0 || !r && stroke.length % 2 === 0) {
      stroke.push(0);
    }
    stroke.push(height);

    if (b && stroke.length % 2 !== 0 || !b && stroke.length % 2 === 0) {
      stroke.push(0);
    }
    stroke.push(width);

    if (l && stroke.length % 2 !== 0 || !l && stroke.length % 2 === 0) {
      stroke.push(0);
    }
    stroke.push(height);

    return stroke;
  };

  applySolidBorder_ = function(node, nodeInfo) {
    var border = {},
      strokeDashArray = [],
      hasBorder = false,
      strokeWidth;

    border = {
      top: !!nodeInfo.border || !!nodeInfo.borderTop,
      right: !!nodeInfo.border || !!nodeInfo.borderRight,
      bottom: !!nodeInfo.border || !!nodeInfo.borderBottom,
      left: !!nodeInfo.border || !!nodeInfo.borderLeft,
    };

    hasBorder = border.top || border.right || border.bottom || border.left;

    if (nodeInfo.border) {
      strokeWidth = nodeInfo.border;
    } else if (nodeInfo.borderTop) {
      strokeWidth = nodeInfo.borderTop;
    } else if (nodeInfo.borderRight) {
      strokeWidth = nodeInfo.borderTop;
    } else if (nodeInfo.borderBottom) {
      strokeWidth = nodeInfo.borderBottom;
    } else if (nodeInfo.borderLeft) {
      strokeWidth = nodeInfo.borderLeft;
    }

    if (hasBorder) {
      strokeDashArray = getStrokeDashArray_(
        border,
        node.width(),
        node.height()
      );

      node.select('.gl-layout-size')
        .attr({
          'stroke': nodeInfo.borderColor || '#999',
          'stroke-width': getStrokeWidth_(nodeInfo),
          'stroke-opacity': nodeInfo.borderOpacity || 1,
          'stroke-dasharray': strokeDashArray.toString()
        });
    }
  };

  applyDashedBorder_ = function(node, nodeInfo) {
    var coordinates = {};

    if (nodeInfo.border || nodeInfo.borderTop) {
      coordinates.x1 = 0;
      coordinates.y1 = 0;
      coordinates.x2 = node.width();
      coordinates.y2 = 0;
      addDashedBorder_(coordinates,  node, nodeInfo);
    }

    if (nodeInfo.border || nodeInfo.borderBottom) {
      coordinates.x1 = 0;
      coordinates.y1 = node.height();
      coordinates.x2 = node.width();
      coordinates.y2 = node.height();
      addDashedBorder_(coordinates, node, nodeInfo);
    }

    if (nodeInfo.border || nodeInfo.borderLeft) {
      coordinates.x1 = 0;
      coordinates.y1 = 0;
      coordinates.x2 = 0;
      coordinates.y2 = node.height();
      addDashedBorder_(coordinates, node, nodeInfo);
    }

    if (nodeInfo.border || nodeInfo.borderRight) {
      coordinates.x1 = node.width();
      coordinates.y1 = 0;
      coordinates.x2 = node.width();
      coordinates.y2 = node.height();
      addDashedBorder_(coordinates, node, nodeInfo);
    }
  };

  addDashedBorder_ = function(coordinates, node, nodeInfo) {
    node.append('line')
      .attr({
        x1: coordinates.x1,
        y1: coordinates.y1,
        x2: coordinates.x2,
        y2: coordinates.y2,
        'class': 'gl-dashed-border',
        'stroke': nodeInfo.borderColor || '#999',
        'stroke-width': getStrokeWidth_(nodeInfo),
        'stroke-dasharray': '1,1'
      });
  };

  getStrokeWidth_ = function(nodeInfo) {
    var strokeWidth = 1;

    if (nodeInfo.border) {
      strokeWidth = nodeInfo.border;
    } else if (nodeInfo.borderTop) {
      strokeWidth = nodeInfo.borderTop;
    } else if (nodeInfo.borderRight) {
      strokeWidth = nodeInfo.borderTop;
    } else if (nodeInfo.borderBottom) {
      strokeWidth = nodeInfo.borderBottom;
    } else if (nodeInfo.borderLeft) {
      strokeWidth = nodeInfo.borderLeft;
    }

    return strokeWidth;
  };

  return {
    border: function (node, nodeInfo) {
      if (nodeInfo.borderStyle === 'dashed') {
        applyDashedBorder_(node, nodeInfo);
      } else {
        applySolidBorder_(node, nodeInfo);
      }
    },

    backgroundColor: function (node, nodeInfo) {
      node.select('.gl-layout-size')
        .attr('fill', nodeInfo.backgroundColor || 'none');
    }
  };
});

