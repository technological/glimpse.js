/**
 * @fileOverview
 *
 * A reusable X-Y graph.
 */
define([
  'core/object',
  'core/config',
  'core/array',
  'core/asset-loader',
  'core/component-manager',
  'core/string',
  'components/component',
  'layout/layoutmanager',
  'd3-ext/util',
  'mixins/mixins',
  'data/functions',
  'data/collection',
  'data/domain'
],
function(obj, config, array, assetLoader, componentManager, string, components,
  layoutManager, d3util, mixins, dataFns, collection, domain) {
  'use strict';

  return function() {

    /**
     * Private variables.
     */
    var config_,
      defaults_,
      root_,
      defaultXaccessor_,
      defaultYaccessor_,
      dataCollection_,
      STATES,
      NO_COLORED_COMPONENTS,
      coloredComponentsCount,
      componentManager_,
      isRendered;

    /**
     * @enum
     * The possible states a graph can be in.
     */
    STATES = {
      NORMAL: 'normal',
      EMPTY: 'empty',
      LOADING: 'loading',
      ERROR: 'error',
      DESTROYED: 'destroyed'
    };

    /**
     * Components that do not require a default color
     * @type {Array}
     */
    NO_COLORED_COMPONENTS = ['axis', 'legend', 'label'];

    config_ = {};

    defaults_ = {
      layout: 'default',
      width: 700,
      height: 230,
      viewBoxHeight: 230,
      viewBoxWidth: 700,
      preserveAspectRatio: 'none',
      xScale: d3.time.scale.utc().domain([0, 0]),
      yScale: d3.scale.linear(),
      showLegend: true,
      xTicks: 7,
      yTicks: 3,
      emptyMessage: 'No data to display',
      loadingMessage: 'Loading...',
      errorMessage: 'Error loading graph data',
      state: 'normal',
      yDomainModifier: 1.2,
      colorPalette: d3.scale.category10().range(),
      xAxisUnit: null,
      yAxisUnit: null,
      primaryContainer: 'gl-main',
      domainIntervalUnit: null,
      id: string.random(),
      domainSources: null,
      domainConfig: null
    };

    /**
     * Default x accessor for data
     * @private
     * @param  {Object} d
     * @return {Object}
     */
    defaultXaccessor_ = function(d) {
      return d.x;
    };

    /**
     * Default x accessor for data
     * @private
     * @param  {Object} d
     * @return {Object}
     */
    defaultYaccessor_ = function(d) {
      return d.y;
    };

    /**
     * Gets the main container selection.
     * @private
     * @return {d3.selection}
     */
    function getPrimaryContainer() {
      return root_.selectAttr('gl-container-name', config_.primaryContainer);
    }

    /**
     * Calculates the main container width/height
     * @private
     * @return {Array} Array of numbers [width, height]
     */
    function getPrimaryContainerSize() {
      return getPrimaryContainer().size();
    }

    /**
     * Sets default color for on component if color not set
     * @private
     * @param {Object} component [description]
     */
    function setDefaultColor(component) {
      var colors, len;

      if (!array.contains(NO_COLORED_COMPONENTS, component.config().type)){
        colors = d3.functor(config_.colorPalette)();
        len = colors.length;
        if (component.hasOwnProperty('color')) {
          component.config().color = component.config().color ||
            colors[(coloredComponentsCount += 1) % len];
        }
      }
    }

    /**
     * Appends defs
     * @private
     * @param  {d3.selection} selection
     */
    function renderDefs(selection) {
      return selection.append('defs');
    }

    /**
     * Appends svg node to the selection
     * @private
     * @param  {d3.selection} selection
     */
    function renderSvg(selection) {
      root_ = selection.append('svg')
        .attr({
          'width': config_.width,
          'height': config_.height,
          'viewBox': [
            0,
            0,
            config_.viewBoxWidth,
            config_.viewBoxHeight].toString(),
          'preserveAspectRatio': config_.preserveAspectRatio
        });
      return root_;
    }

    /**
     * Sets up the panel(svg)
     * @private
     * @param  {d3.selection} selection
     */
    function renderPanel(selection) {
      root_ = renderSvg(selection);
      renderDefs(root_);
      layoutManager.setLayout(
        config_.layout,
        root_,
        config_.viewBoxWidth,
        config_.viewBoxHeight);
      root_.select('g').attr('gl-id', config_.id);
    }

    function getDomainConfig(sources) {
      return {
        x: {
          sources: sources,
          compute: 'interval',
          args: {
            unit: config_.domainIntervalUnit,
            period: config_.domainIntervalPeriod
          },
          modifier: {
            force: config_.forceX
          },
          'default': [0, 0]
        },
        y: {
          sources: sources,
          compute: 'extent',
          modifier: {
            force: config_.forceY,
            maxMultiplier: config_.yDomainModifier
          },
          'default': [0, 0]
        }
      };
    }

    /**
     * Updates the domain on the scales
     * @private
     */
    function updateScales() {
      var graphDomain,
          domainSources,
          domainConfig;

      domainSources = config_.domainSources || '*';
      domainConfig = getDomainConfig(domainSources);
      if (config_.domainConfig) {
        domainConfig = obj.extend(domainConfig, config_.domainConfig);
      }
      domain.addDomainDerivation(domainConfig, dataCollection_);

      dataCollection_.updateDerivations();
      graphDomain = dataCollection_.get('$domain');
      if (dataCollection_.select(domainSources).length() > 0) {
        config_.xScale.rangeRound([0, getPrimaryContainerSize()[0]])
          .domain(graphDomain.x);

        config_.yScale.rangeRound([getPrimaryContainerSize()[1], 0])
          .domain(graphDomain.y);
      }
    }

    /**
     * Add legend component to the graph
     */
    function addLegend() {
      if (!componentManager_.first('gl-legend') && config_.showLegend) {
        componentManager_.add({
          cid: 'gl-legend',
          type: 'legend',
          target: 'gl-info'
        });
      }
    }

    /**
     * Formats the keys for the legend and calls update on it
     * @private
     */
    function updateLegend() {
      var legendKeys = [], legend;

      legend = componentManager_.first('gl-legend');

      if (!legend) {
        addLegend();
        legend = componentManager_.first('gl-legend');
      }

      if (legend) {
        componentManager_.get().forEach(function(c) {
          var cData = c.data ? c.data() : null;
          if (c.config('inLegend') && cData) {
            legendKeys.push({
              dataId: c.config('dataId'),
              color: c.config('color'),
              label: c.data().title || ''
            });
          }
        });
        componentManager_.first('gl-legend')
          .config({ keys: legendKeys })
          .update();
      }
    }

    /**
     * Updates all the special components.
     */
    function updateComponents() {
      var yaxisComponent,
        xaxisComponent;
        xaxisComponent = componentManager_.first('gl-xaxis');
        if (xaxisComponent) {
          xaxisComponent.config({
            scale: config_.xScale,
            ticks: config_.xTicks,
            unit: config_.xAxisUnit
          });
        }
        yaxisComponent = componentManager_.first('gl-yaxis');
        if (yaxisComponent) {
          yaxisComponent.config({
            scale: config_.yScale,
            ticks: config_.yTicks,
            unit: config_.yAxisUnit,
            target: config_.primaryContainer
          });
        }
        componentManager_.update();
        updateLegend();
    }

    /**
     * Displays the empty message over the main container.
     * @private
     */
    function showEmptyOverlay() {
      var labelTexts,
          labels,
          layoutConfig;

      layoutConfig = {
        type: 'vertical', position: 'center', gap: 6
      };
      labelTexts = array.getArray(config_.emptyMessage);
      labels = labelTexts.map(function(text, idx) {
        var label = components.label().text(text);
        if (idx === 0) {
          label.config({
            color: '#666',
            fontSize: 18,
            fontWeight: 'bold'
          });
        } else {
          label.config({
            color: '#a9a9a9',
            fontSize: 13
          });
        }
        return label;
      });
      graph.component({
          type: 'overlay',
          cid: 'gl-empty-overlay',
          layoutConfig: layoutConfig,
          components: labels
        });
      componentManager_.render(root_, 'gl-empty-overlay');
    }

    /**
     * Displays the loading spinner and message over the main container.
     * @private
     */
    function showLoadingOverlay() {
      var label,
          spinner;

      spinner = components.asset().config({
        assetId: 'gl-asset-spinner'
      });
      label = components.label()
        .text(config_.loadingMessage)
        .config({
          color: '#666',
          fontSize: 13
        });
      graph.component({
          type: 'overlay',
          cid: 'gl-loading-overlay',
          components: [spinner, label]
        });
      componentManager_.render(root_, 'gl-loading-overlay');
    }

    /**
     * Displays the error icon and message over the main container.
     * @private
     */
    function showErrorOverlay() {
      var label,
          icon;

      icon = components.asset().config({
        assetId: 'gl-asset-icon-error'
      });
      label = components.label()
        .text(config_.errorMessage)
        .config({
          color: '#C40022',
          fontSize: 13
        });
      graph.component({
          type: 'overlay',
          cid: 'gl-error-overlay',
          components: [icon, label]
        });
      componentManager_.render(root_, 'gl-error-overlay');
    }

    /**
     * Determins if the domain is "empty" (both values are zero).
     * TODO: Move to data collection when ready.
     *
     * @private
     * @param {Array} domain A 2 element array.
     * @return {Boolean}
     */
    function domainIsEmpty(domain) {
      var d0, d1;

      d0 = domain[0];
      d1 = domain[1];
      if (d0 instanceof Date && d1 instanceof Date) {
        return d0.getTime() === 0 && d1.getTime() === 0;
      }
      return d0 === 0 && d1 === 0;
    }

    /**
     * Adds/removes overlays & hides/shows components based on state.
     * @private
     */
    function updateComponentVisibility() {
      componentManager_.destroy([
          'gl-empty-overlay',
          'gl-loading-overlay',
          'gl-error-overlay']);
      componentManager_.get().forEach(function(c) {
        var hiddenStates = c.config('hiddenStates'),
            dataId = c.config('dataId');
        if (array.contains(hiddenStates, config_.state) ||
              (dataId && dataCollection_.hasTags(dataId, 'inactive'))) {
          c.hide();
        } else {
          c.show();
        }
      });
      switch (config_.state) {
        case STATES.EMPTY:
          showEmptyOverlay();
          break;
        case STATES.LOADING:
          showLoadingOverlay();
          break;
        case STATES.ERROR:
          showErrorOverlay();
          break;
        case STATES.NORMAL:
          // Hide x-axis if theres no data.
          if (domainIsEmpty(config_.xScale.domain())) {
            componentManager_.first('gl-xaxis').hide();
            componentManager_.first('gl-yaxis').hide();
          }
          break;
      }
    }

    /**
     * Main function, sets defaults, scales and axes
     * @return {graphs.graph}
     */
    function graph() {
      obj.extend(config_, defaults_);
      dataCollection_ = collection.create();
      // TODO: move these specific components to graphBuilder.
      componentManager_ = componentManager.create([
        {
          cid: 'gl-xaxis',
          type: 'axis',
          axisType: 'x',
          orient: 'bottom',
          target: 'gl-xaxis',
          hiddenStates: ['empty', 'loading', 'error']
        },
        {
          cid: 'gl-yaxis',
          axisType: 'y',
          type: 'axis',
          orient: 'right',
          tickPadding: 5,
          hiddenStates: ['empty', 'loading', 'error']
        }
      ]);
      componentManager_
        .registerSharedObject('xScale', config_.xScale, true)
        .registerSharedObject('yScale', config_.yScale, true)
        .registerSharedObject('data', dataCollection_, true);
      coloredComponentsCount = 0;
      return graph;
    }

    obj.extend(
      graph,
      config.mixin(config_, 'id', 'width', 'height'),
      mixins.toggle);

    graph.STATES = STATES;

    /**
     * Event dispatcher.
     * @public
     */
    graph.dispatch = mixins.dispatch('state');

    /**
     * Configures the graph state and triggers overlays updates.
     * @public
     * @return {graph.STATES}
     */
    graph.state = function(newState) {
      var oldState = config_.state;

      if (!newState) {
        return oldState;
      }
      config_.state = newState;
      if (graph.isRendered()) {
        updateComponentVisibility();
      }
      graph.dispatch.state.call(this);
      return graph;
    };

    /**
     * Gets/Sets the data
     * @param  {Object|Array} data
     * @return {graphs.graph|Object}
     */
    graph.data = function(data) {
      if (data) {
        // Single string indicates id of data to return.
        if (typeof data === 'string') {
          return dataCollection_.get(data);
        }
        array.getArray(data).forEach(function(d) {
          dataCollection_.extend(d);
        });
        return graph;
      }

      return dataCollection_;
    };

    /**
     * Creates and adds a component to the graph based on the type
     * or returns the component based on the cid.
     * @param  {string|Object} componentConfig
     * @return {component|graphs.graph}
     */
    graph.component = function(componentConfig) {
      var components;
      // No args. Return component manager.
      if (!componentConfig) {
        return componentManager_;
      }
      // Single string indicates cid of component to return.
      if (typeof componentConfig === 'string') {
        components = componentManager_.get(componentConfig);
        if (components.length) {
          return components[0];
        }
      }

      // Add component(s).
      components = componentManager_.add(componentConfig);
      components.forEach(function(c) {
        if (!c.config('target')) {
          c.config('target', config_.primaryContainer);
        }
        setDefaultColor(c);
      });

      return graph;
    };

    /**
     * Updates the graph with new/updated data/config
     * @return {graphs.graph}
     */
    graph.update = function() {
      componentManager_.applySharedObject('data');
      updateScales();
      updateComponents();
      if (graph.isRendered()) {
        updateComponentVisibility();
      }
      graph.dispatch.update.call(this);
      return graph;
    };

    /**
     * Initial panel setup and rendering of the components
     * Note: should be called only once.
     * @param  {d3.selection|Node|string} selector
     * @return {graphs.graph}
     */
    graph.render = function(selector) {
      var selection = d3util.select(selector);
      assetLoader.loadAll();
      renderPanel(selection);
      //Add legend before applying shared objects.
      addLegend();
      componentManager_.registerSharedObject('rootId', config_.id, true);
      componentManager_.applySharedObject('rootId', componentManager_.cids());
      graph.update();
      componentManager_.render(graph.root());
      // Update y-axis once more to ensure ticks are above everything else.
      componentManager_.update(['gl-yaxis']);
      // Force state update.
      updateComponentVisibility();
      isRendered = true;
      graph.dispatch.render.call(this);
      return graph;
    };

    /**
     * Has the graph been rendered or not.
     * @return {Boolean}
     */
    graph.isRendered = function() {
      return isRendered;
    };

    /**
     * Removes everything from the DOM, cleans up all references.
     * @public
     */
    graph.destroy = function() {
      config_.state = STATES.DESTROYED;
      componentManager_.destroy();
      if (root_) {
        root_.remove();
        root_ = null;
      }
      config_ = null;
      defaults_ = null;
      componentManager_ = null;
      graph.dispatch.destroy.call(this);
    };

     /**
     * Returns the root_
     * @return {d3.selection}
     */
    graph.root = function() {
      return root_;
    };

    return graph();
  };

});
