/**
 * @fileOverview
 * Data Selection.
 */
define([
  'data/dimension/dimension'
], function (dimension) {
  'use strict';

  var Selection;

  /**
   * @constructor
   * Data Selection.
   */
  Selection = function(optDataSource) {
    this.dataSources = optDataSource || [];
  };

  Selection.prototype.add = function(data) {
    if(Array.isArray(data)) {
      data.forEach(function(d) {
        this.dataSources.push(d);
      }, this);
    } else {
      this.dataSources.push(data);
    }
    return this;
  };

  Selection.prototype.map = function(fn) {
    return dimension.create(this.dataSources.map(fn));
  };

  Selection.prototype.all = function() {
    return this.dataSources;
  };

  Selection.prototype.get = function(i) {
    i = i || 0;
    return this.dataSources[i];
  };

  Selection.prototype.dim = function(dim) {
    return this.map(function(dataSource) {
      // TODO: Handle dimensions from dimensions field.
      return dataSource.data.map(dataSource[dim]);
    });
  };

  return {

    create: function() {
      return new Selection();
    },
    getSelectionPrototype: function() {
      return Selection.prototype;
    }

  };

});
