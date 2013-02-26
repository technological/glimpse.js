/**
 * @fileOverview
 * Data functions.
 */
define([
  'core/object',
  'data/accessors'
], function (obj, accessors) {
  'use strict';

  /**
   * Checks if the provided date is a valid date
   * @param  {Date}  d
   * @return {Boolean}
   */
  function isValidDate(d) {
    if (Object.prototype.toString.call(d) !== '[object Date]') {
      return false;
    }
    return !isNaN(d.getTime());
  }

  /** Converts the given value to utc date */
  function convertToUTCDate(value) {
    var date, dateUtc;
    date = new Date(value);
    if (isValidDate(date)) {
      dateUtc = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      );
      return dateUtc;
    }
    return null;
  }

  return {
    /**
     * Gets the data using the dimension accessor.
     */
    dimension: function(data, dim) {
      var dimValue;
      dimValue = obj.get(data, ['dimensions', dim]);
      if (!dimValue) {
        return null;
      }
      return accessors.get(dimValue);
    },

    /**
     * Converts given data into UTC date
     * @param  {Array|number|string} data
     * @return {Array<Date>|Date}
     */
    toUTCDate: function(data) {
      if (obj.isDefAndNotNull(data)) {
        if (Array.isArray(data)) {
          return data.map(convertToUTCDate);
        } else {
          return convertToUTCDate(data);
        }
      }
      return null;
    }

  };

});
