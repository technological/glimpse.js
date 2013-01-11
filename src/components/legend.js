define([
  'core/object',
  'core/config'
],
function (obj, config) {
  'use strict';

  return function () {

    var config_ = {},
      defaults_ = {
        isFramed: false,
        radius: 4,
        textColor: '#333',
        spacing: 4,
        marginLeft: 4,
        marginTop: 16
      },
      data_,
      root_;

    function legend() {
      obj.extend(config_, defaults_);

      return legend;
    }

    legend.update = function () {
      var previousX;
      previousX = config_.marginLeft;


      // TODO: remove any existing stuff 1st

      if (!config_.keys || !root_) {
        return;
      }
      config_.keys.forEach(function (key) {
        var group, text, circle;
        group = root_.append('g')
          .attr({
            'transform': 'translate(' + previousX + ')'
          });
        text = group.append('text')
          .text(key.title)
          .attr({
            'x': config_.radius * 4,
            'y': config_.marginTop,
            'stroke': 'none',
            'fill': config_.textColor,
            'text-anchor': 'start'
          });
        circle = group.append('circle')
          .attr({
            'stroke': 'none',
            'fill': key.color,
            'r': config_.radius,
            'cx': config_.radius * 2,
            'cy': Math.max(config_.marginTop - config_.radius, 0)
          });
        previousX += text[0][0].scrollWidth + config_.spacing;
      });

      return legend;
    };

    legend.render = function (selection) {
      root_ = selection.append('g')
        .attr({
          'class': 'component legend id-' + config_.id
        });
      legend.update();
      return legend;
    };

    obj.extend(legend, config(legend, config_, []));
    return legend();
  };

});
