define(
'glimpse',
['core/core', 'util/math'],
function (core, math) {
  'use strict';

  var glimpse = core;
  glimpse.version = '0.0.1';
  glimpse.math = math;

  return glimpse;
});
