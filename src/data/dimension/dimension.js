/**
 * @fileOverview
 * Data Dimension.
 */
define(
function () {
  'use strict';

  var Dimension;

  function sumReduce(arr) {
    return arr.reduce(function(prevValue, curValue){
      return curValue + prevValue;
    });
  }

  /**
   * @constructor
   * Data Dimension.
   */
  Dimension = function(optDataSource) {
    this.dataSources = optDataSource || [];
  };

  Dimension.prototype.add = function(data) {
    if(Array.isArray(data)) {
      data.forEach(function(d) {
        this.dataSources.push(d);
      }, this);
    } else {
      this.dataSources.push(data);
    }
    return this;
  };

  Dimension.prototype.map = function(fn) {
    return new Dimension(this.dataSources.map(fn));
  };

  Dimension.prototype.filter = function(fn) {
    return this.map(function(dataSource) {
      return dataSource.filter(fn);
    });
  };

  Dimension.prototype.sum = function() {
    return this.map(function(dataSource) {
      return sumReduce(dataSource);
    });
  };

  Dimension.prototype.avg = function() {
    return this.map(function(dataSource) {
      return sumReduce(dataSource)/dataSource.length;
    });
  };

  Dimension.prototype.max = function() {
    return this.map(function(dataSource) {
      return d3.max(dataSource);
    });
  };

  Dimension.prototype.min = function() {
    return this.map(function(dataSource) {
      return d3.min(dataSource);
    });
  };

  Dimension.prototype.extent = function() {
    return this.map(function(dataSource) {
      return d3.extent(dataSource);
    });
  };

  Dimension.prototype.round = function() {
    return this.map(function(dataSource) {
      if (Array.isArray(dataSource)) {
        return dataSource.map(function(d) {
          return Math.round(d);
        });
      } else {
        return Math.round(dataSource);
      }
    });
  };

  Dimension.prototype.concat = function() {
    var arr = [];
    this.dataSources.forEach(function(dataSource) {
      arr = arr.concat(dataSource);
    });
    return new Dimension([arr]);
  };

  Dimension.prototype.all = function() {
    return this.dataSources;
  };

  Dimension.prototype.get = function(i) {
    i = i || 0;
    return this.dataSources[i];
  };

  return {

    create: function(optDimensions) {
      return new Dimension(optDimensions);
    },

    getDimensionPrototype: function() {
      return Dimension.prototype;
    }

  };

});
