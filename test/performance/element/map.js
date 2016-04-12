'use strict'
var set = require('lodash.set')
exports.define = {
  $map (map) {
    var returnValue
    var n
    if (!map) {
      returnValue = map = {}
    }

    if (this.$any) {
      n = this.$any
      n.$ = this
      // this is still wrong need to ignore _ fields or something like that
      set(map, this.$, { $any: n })
      map = n
    } else if (this.$) {
      if (this.$ !== true) {
        n = {
          val: true,
          $: this
        }
        set(map, this.$, n)
        map = n
      }
    }
    console.log(map)
    this.each(each, hasMap, map) // use keys and properties
    return returnValue
  }
}

function hasMap (p) {
  return p.$map
}

function each (p, key, base, map) {
  p.$map(map)
}
