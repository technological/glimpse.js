/**
 * @fileOverview
 * Utils for layout
 */
define(function () {
  'use strict';

  /**
   * Computes the stroke-dasharray value
   * https://developer.mozilla.org/en-US/docs/SVG/Attribute/stroke-dasharray
   * @param  {Object} border {top:bool, right:bool, bottom:bool, left:bool}
   * @param  {integer} width  [description]
   * @param  {integer} height [description]
   * @return {Array}  stroke-dasharray
   */
  function getStrokeDashArray(border, width, height) {
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
  }

  /**
   * Applies solid border node by setting the
   * stroke-dasharray attribute on the rect inside
   * the node.
   * @param  {d3.selection} node
   * @param  {Object} nodeInfo
   */
  function applySolidBorder(node, nodeInfo) {
    var border = {},
      strokeDashArray = [],
      hasBorder = false;

    border = {
      top: !!nodeInfo.border || !!nodeInfo.borderTop,
      right: !!nodeInfo.border || !!nodeInfo.borderRight,
      bottom: !!nodeInfo.border || !!nodeInfo.borderBottom,
      left: !!nodeInfo.border || !!nodeInfo.borderLeft,
    };

    hasBorder = border.top || border.right || border.bottom || border.left;

    if (hasBorder) {
      strokeDashArray = getStrokeDashArray(
        border,
        node.width(),
        node.height()
      );

      node.select('.gl-layout-size')
        .attr({
          'stroke': nodeInfo.borderColor || '#999',
          'stroke-width': getStrokeWidth(nodeInfo),
          'stroke-opacity': nodeInfo.borderOpacity || 1,
          'stroke-dasharray': strokeDashArray.toString()
        });
    }
  }

  /**
   * Applies styled border to the node by
   * adding svg line elements.
   * @param  {d3.selection} node
   * @param  {Object} nodeInfo
   */
  function applyStyledBorder(node, nodeInfo, style) {
    var coordinates = {};

    if (nodeInfo.border || nodeInfo.borderTop) {
      coordinates.x1 = 0;
      coordinates.y1 = 0;
      coordinates.x2 = node.width();
      coordinates.y2 = 0;
      coordinates.subClass = 'top';
      addStyledBorder(coordinates,  node, nodeInfo, style);
    }

    if (nodeInfo.border || nodeInfo.borderRight) {
      coordinates.x1 = node.width();
      coordinates.y1 = 0;
      coordinates.x2 = node.width();
      coordinates.y2 = node.height();
      coordinates.subClass = 'right';
      addStyledBorder(coordinates, node, nodeInfo, style);
    }

    if (nodeInfo.border || nodeInfo.borderBottom) {
      coordinates.x1 = 0;
      coordinates.y1 = node.height();
      coordinates.x2 = node.width();
      coordinates.y2 = node.height();
      coordinates.subClass = 'bottom';
      addStyledBorder(coordinates, node, nodeInfo, style);
    }

    if (nodeInfo.border || nodeInfo.borderLeft) {
      coordinates.x1 = 0;
      coordinates.y1 = 0;
      coordinates.x2 = 0;
      coordinates.y2 = node.height();
      coordinates.subClass = 'left';
      addStyledBorder(coordinates, node, nodeInfo, style);
    }
  }

  /**
   * Adds svg line elements based on the coordinates array
   * @param {Object} coordinates Cooridates to draw the line
   * @param  {d3.selection} node
   * @param  {Object} nodeInfo
   * @param  {String} style
   */
  function addStyledBorder(coordinates, node, nodeInfo, style) {
    var className, dasharray, strokeWidth;

    className = 'gl-' + style + '-border-' + coordinates.subClass;
    strokeWidth = getStrokeWidth(nodeInfo);
    dasharray = (style === 'dotted') ? '1,1' :
      (nodeInfo.borderDashArray || '2,2');
    node.append('line')
      .attr({
        x1: coordinates.x1,
        y1: coordinates.y1,
        x2: coordinates.x2,
        y2: coordinates.y2,
        'class': className,
        'stroke': nodeInfo.borderColor || '#999',
        'stroke-width': strokeWidth,
        'stroke-opacity': nodeInfo.borderOpacity || 1,
        'stroke-dasharray': dasharray
      });
  }

  /**
   * Computes the stroke-width attribute
   * @param  {Object} nodeInfo
   */
  function getStrokeWidth(nodeInfo) {
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
  }

  return {
    /**
     * Sets the border on the node
     * @param  {d3.selection} node
     * @param  {Object} nodeInfo
     */
    border: function(node, nodeInfo) {
      var style;

      style = nodeInfo.borderStyle || 'solid';

      switch(style) {
        case 'dotted':
          applyStyledBorder(node, nodeInfo, 'dotted');
          break;
        case 'dashed':
          applyStyledBorder(node, nodeInfo, 'dashed');
          break;
        case 'solid':
          applySolidBorder(node, nodeInfo);
          break;
        default:
          applySolidBorder(node, nodeInfo);
      }
    },

    /**
     * Sets the background color on the node
     * @param  {d3.selection} node
     * @param  {Object} nodeInfo
     */
    backgroundColor: function(node, nodeInfo) {
      node.select('.gl-layout-size')
        .attr('fill', nodeInfo.backgroundColor || 'none');
    }
  };
});

