'use strict'
var Observable = require('vigour-observable')

module.exports = new Observable({
  type: 'state',
  inject: require('./inject'),
  child: 'Constructor'
}, false).Constructor
