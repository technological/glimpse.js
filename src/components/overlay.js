/**
 * @fileOverview
 * An overlay component that fills an area, hides its contents, and displays
 * a series of other components which render to the specified layout.
 */
define([
  'core/object',
  'core/config',
  'components/label',
  'components/mixins',
  'd3-ext/util',
  'layout/layoutmanager'
],
function(obj, config, label, mixins, d3util, layoutManager) {
  'use strict';

  return function() {

    var defaults_,
      config_,
      root_,
      removeExisting_,
      appendChildren_;

    config_ = {};

    defaults_ = {
      cid: undefined,
      target: undefined,
      components: [],
      sublayout: null,
      opacity: 1,
      labels: [],
      backgroundColor: '#fff'
    };

    /**
     * @private
     * Remove all existing items from this overlay.
     */
    removeExisting_ = function() {
      root_.selectAll('*').remove();
    };

    /**
     * @private
     * Append background rect, all child components, and apply the layout.
     */
    appendChildren_ = function() {
      var parent = d3.select(root_.node().parentNode);

      root_.append('rect').attr({
        width: parent.width(),
        height: parent.height(),
        opacity: config_.opacity,
        fill: config_.backgroundColor
      });
      layoutManager.setLayout(
        config_.sublayout,
        root_,
        parent.width(),
        parent.height());
      config_.components.forEach(function(component) {
        component.render();
      });
    };

    function overlay() {
      obj.extend(config_, defaults_);
      return overlay;
    }

    // Apply Mixins
    obj.extend(
      overlay,
      config.mixin(
        config_,
        'cid',
        'target',
        'cssClass',
        'opacity',
        'backgroundColor'
      ),
      mixins.lifecycle,
      mixins.toggle);

    /*
     * @public
     * Gets the root selection of this component.
     * @return {d3.selection}
     */
    overlay.root = function () {
      return root_;
    };

    /**
     * @public
     * Renders the component to the specified selection,
     * or to the configured target.
     * @param {d3.selection|Node|String}
     * @return {components.overlay}
     */
    overlay.render = function(selection) {
      if (!root_) {
        root_ = d3util.select(selection || config_.target).append('g');
        overlay.update();
      }
      return overlay;
    };

    /**
     * @public
     * Triggers an update of the component reapplying all specified config
     * updates.
     * @return {componnets.update}
     */
    overlay.update = function() {
      if (!root_) {
        return overlay;
      }
      root_.attr({
        'class': 'gl-component gl-overlay'
      });
      if (config_.cssClass) {
        root_.classed(config_.cssClass, true);
      }
      if (config_.cid) {
        root_.attr('gl-cid', config_.cid);
      }
      removeExisting_();
      appendChildren_();
      return overlay;
    };

    /**
     * @public
     * Destroys this component and cleans up after itself.
     */
    overlay.destroy = function() {
      // TODO: Need a more generalized way of removing sub-components.
      config_.components.forEach(function(label) {
        label.destroy();
      });
      root_.remove();
      root_ = null;
      config_ = null;
      defaults_ = null;
    };

    return overlay();

  };

});
