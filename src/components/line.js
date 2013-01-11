define([
  'core/object',
  'core/array',
  'core/config'
],
function (obj, array, config) {
  'use strict';

  return function () {

    var config_ = {},
      defaults_ = {
        isFramed: true,
        strokeWidth: 1,
        color: 'steelBlue',
        showInLegend: true
      },
      lineGenerator_,
      data_,
      root_;

    function line() {
      obj.extend(config_, defaults_);
      lineGenerator_ = d3.svg.line();
      return line;
    }

    // TODO: this will be the same for all components
    // put this func somehwere else and apply as needed
    line.data = function (data) {
      if (data) {
        data_ = data;
        return line;
      }
      return array.find(data_, function (d) {
        return d.id === config_.dataId;
      });
    };

    line.update = function () {
      var dataConfig = line.data();

      root_.select('.line')
        .datum(dataConfig.data)
        .attr({
          'stroke-width': config_.strokeWidth,
          'stroke': dataConfig.color,
          'fill': 'none',
          'opacity': 1,
          'd': lineGenerator_
        });

      return line;
    };

    line.render = function (selection) {
      var dataConfig = line.data();

       root_ = selection.append('g')
        .attr({
          'class': 'component line-chart'
        });

      // draw the line
      lineGenerator_ = d3.svg.line()
        .x(function(d) {
          return config_.xScale(dataConfig.x(d));
        })
        .y(function(d) {
          return config_.yScale(dataConfig.y(d));
        })
        .interpolate(config_.interpolate);

      root_.append('path')
        .attr('class', 'line');

      line.update();

      return line;
    };

    obj.extend(line, config(line, config_, ['xScale', 'yScale']));
    return line();
  };

});