/**
 * @fileOverview
 * Data source mutators.
 */
define([
  'core/object',
  'core/array',
  'data/selection/selection',
  'data/selection/diff-quotient'
], function (obj, array, selection) {
  'use strict';

  function applyDerivation(dc, data) {
    var sel = dc.select(data.sources),
        derivedData = data.derivation(sel);
    //TODO: Determine if this is a complete data source
    if (typeof derivedData === 'object' &&
         !Array.isArray(derivedData)) {
      obj.extend(derivedData, data);
    }
    return {
      id: data.id,
      glOrigData: data,
      derivedData: derivedData,
      sources: data.sources,
      derivation: data.derivation
    };
  }

  function isDerived(data) {
    return data.sources || data.derivation;
  }

  function collection() {
    var dataCollection = {};
    return {
      /**
       * Add a data source.
       */
      add: function(data) {
        if (Array.isArray(data)) {
          data.forEach(this.add);
          return;
        }
        if (isDerived(data)) {
          data = applyDerivation(this, data);
        }
        dataCollection[data.id] = data;
      },

      /**
       * Recalculate derived sources.
       */
      updateDerivations: function() {
        var data, id, origData;
        Object.keys(dataCollection).forEach(function(k) {
          data = dataCollection[k];
          if(isDerived(data)) {
            id = data.id;
            origData = data.glOrigData;
            this.remove(id);
            this.add(origData);
          }
        }, this);
      },

      /**
       * Remove a data source by id.
       */
      remove: function(id) {
        delete dataCollection[id];
      },

      upsert: function(data) {
        var id = data.id;
        if (dataCollection[id]) {
          obj.extend(dataCollection[id], data);
        } else {
          this.add(data);
        }
      },

      /**
       * Append data to a source by id.
       */
      append: function(id, dataToAppend) {
        var dataSource = this.get(id);
        if (dataSource) {
          if (Array.isArray(dataToAppend)) {
            array.append(dataSource.data, dataToAppend);
          } else {
            dataSource.data.push(dataToAppend);
          }
        }
      },

      /**
       * Get data source by id.
       */
      get: function(id) {
        if (id) {
          if (dataCollection[id]) {
            return dataCollection[id].derivedData || dataCollection[id];
          }
          return  null;
        }
        return Object.keys(dataCollection).map(function(k) {
          return dataCollection[k];
        });
      },

      /**
       * Accepts sources string of ids that are
       * delimited by a comma.
       */
      select: function(sources) {
        var sel = selection.create(),
            ids, data;
        if(sources === '*') {
          data = [];
          Object.keys(dataCollection).forEach(function(k) {
            if(!isDerived(dataCollection[k])) {
              data.push(dataCollection[k]);
            }
          });
          sel.add(data);
        } else {
          ids = sources.split(',');
          ids.forEach(function(id) {
            data = dataCollection[id];
            if(data) {
              sel.add(data);
            }
          });
        }

        return sel;
      }
    };
  }

  return {
    create: function() {
      return collection();
    }
  };

});
