/**
 * @fileOverview
 * An object that constructs/configures graphs by encapsulating complexity
 * in order to simplify the end-user api when generating typical graphs.
 *
 * "internal" refers to data/components added by this build and not by the user.
 */
define([
  'core/object',
  'core/array',
  'core/string',
  'd3-ext/util',
  'graphs/graph'
],
function(obj, array, string, d3util, graph) {
  'use strict';

    var defaults,
      config,
      INTERNAL_DATA_CONFIG,
      INTERNAL_COMPONENTS_CONFIG,
      GRAPH_TYPES;

    defaults = {
      layout: 'default',
    };

    config = {};

    /**
     * The supported types of pre-configured graphs.
     */
    GRAPH_TYPES = ['line', 'area'];

    /**
     * Dataset configurations automatically applied to graphs.
     */
    INTERNAL_DATA_CONFIG = [{
      id: 'gl-stats',
      sources: ['*', '$domain'],
      derivation: function(sources, domain) {
        var xDomain, points, pointValues, result;

        result = {
          min: 0,
          max: 0,
          avg: 0
        };
        if (sources.all().length) {
          xDomain = domain.get().x;
          points = sources.filter('x', xDomain).dim('y').concat();
          pointValues = points.get();
          if (pointValues && pointValues.length) {
            result.min = points.min().round().get();
            result.max = points.max().round().get();
            result.avg = points.avg().round().get();
          }
        }
        return result;
      }
    }];

    /**
     * Component configurations automatically applied to graphs.
     *
     * TODO: Externalize this once a component manager is available.
     */
    INTERNAL_COMPONENTS_CONFIG = [
      {
        cid: 'gl-stats',
        type: 'label',
        dataId: 'gl-stats',
        position: 'center-left',
        target: 'gl-footer'
      },
      {
        cid: 'gl-domain-label',
        type: 'domainLabel',
        target: 'gl-footer',
        position: 'center-right',
        suffix: 'UTC'
      }
    ];

    /**
     * Determines if a data set corresponding to the data id is an internal
     * data set or not.
     *
     * @private
     * @param {String} dataId
     * @return {Boolean}
     */
    function isInternalData(dataId) {
      var foundData;
      foundData = array.find(INTERNAL_DATA_CONFIG, function(d) {
        return d.id === dataId;
      });
      return foundData || string.startsWith(dataId, '$') ? true : false;
    }

    /**
     * Checks if a component alread exists in the componets collection with the
     * same data id.
     *
     * @param {String} dataId
     * @param {graphs.graph} g
     * @return {Boolean}
     */
    function componentExists(dataId, g) {
      var components, foundComponent;
      components = g.component();
      foundComponent = array.find(components, function(c) {
        return c.dataId === dataId;
      });
      return foundComponent ? true : false;
    }

    /**
     * Adds a new component of the specified type for every supplied data id
     * that is not an internal data source.
     *
     * @private
     * @param {Array|Object} dataSources
     * @param {String} componentType
     * @param {graphs.graph} g
     */
    function addComponentsForDataSources(dataSources, componentType, g) {
      array.getArray(dataSources).forEach(function(dataSource) {
        if (!isInternalData(dataSource.id) &&
            !componentExists(dataSource.id, g)) {
          g.component({
            type: componentType,
            dataId: dataSource.id,
            cid: dataSource.id,
            color: dataSource.color || null
          });
        }
      });
    }

    /**
     * Overrides the removeData() funciton on the graph.
     * Additionally removes any corresponding components when called.
     *
     * TODO: remove this in favor of data collection events
     *
     * @private
     * @param {graphs.graph} g
     */
    function overrideRemoveDataFn(g) {
      var dataCollection = g.data();
      obj.override(dataCollection, 'remove', function(supr, dataId) {
        var args = array.convertArgs(arguments, 1);
        g.component().remove(dataId);
        return supr.apply(g, args);
      });
    }

    /**
     * Overrides the add() function on the graph's data collection. Anytime
     * add() is called a new component of the specified type will be added too.
     *
     * TODO: remove this in favor of data collection events
     *
     * @private
     * @param {String} componentType
     * @param {graphs.graph} g
     */
    function overrideAddDataFn(componentType, g) {
      var dataCollection = g.data();
      obj.override(dataCollection, 'add', function(supr, data) {
        var args, retVal;
        args = array.convertArgs(arguments, 1);
        retVal = supr.apply(dataCollection, args);
        addComponentsForDataSources(data, componentType, g);
        return retVal;
      });
    }

    /**
     * Adds all pre-configured internal data sources to the graph.
     *
     * @private
     * @param {graphs.graph} g
     */
    function addInternalData(g) {
      INTERNAL_DATA_CONFIG.forEach(function(dataConfig) {
        g.data().add(dataConfig);
      });
    }

    /**
     * Adds all pre-configured internal components to the graph.
     *
     * @private
     * @param {graphs.graph} g
     */
    function addInternalComponents(g) {
      var unit;
      INTERNAL_COMPONENTS_CONFIG.forEach(function(componentConfig) {
        g.component(componentConfig);
      });
      unit = g.config('yAxisUnit') || '';
      g.component('gl-stats').text(function(d) {
        var values = {
          avg: 0,
          min: 0,
          max: 0
        };
        if (d) {
          values.avg = d.avg || 0;
          values.min = d.min || 0;
          values.max = d.max || 0;
        }
        return 'Avg: ' + values.avg + unit +
               '    Min: ' +  values.min + unit +
               '    Max: ' + values.max + unit;
      });
    }

    /**
     * An object that constructs/configures graphs by encapsulating complexity
     *   in order to simplify the end-user api.
     *
     * @public
     * @return {graphs.graphBuilder}
     */
    function graphBuilder() {
      obj.extend(config, defaults);
      return graphBuilder;
    }

    /**
     * Gets the available valid types to build pre-configured graphs.
     *
     * @public
     * @return {Array}
     */
    graphBuilder.types = function() {
      return GRAPH_TYPES;
    };

    /**
     * Build and return a new graph of the specified type.
     *
     * @param {String} type A valid pre-configured graph type.
     * @param {layout.layouts} layout The layout to use.
     * @return {graphs.graph}
     */
    graphBuilder.create = function(type, optLayout) {
      var g;

      g = graph()
        .config({
          forceY: [0],
          layout: optLayout || 'default',
          yAxisUnit: 'ms'
        });
      addInternalData(g);
      addInternalComponents(g);

      switch (type) {
        case 'line':
        case 'area':
          overrideRemoveDataFn(g);
          overrideAddDataFn(type, g);
          break;
      }
      return g;
    };

    return graphBuilder();
});