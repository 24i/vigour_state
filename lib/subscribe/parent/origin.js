'use strict'
const diff = require('../diff')
const remove = require('../remove')

module.exports = function parent (target, subs, update, tree, stamp) {
  var parentTree = tree.parent
  if (target && target.val !== null) {
    if (!parentTree) {
      parentTree = tree.parent = { _p: tree, _key: 'parent' }
      composite(tree, 'parent')
    }
    return diff(target.cParent(), subs, update, parentTree, stamp)
  } else if (parentTree && '$remove' in subs) {
    remove('parent', target, target, subs, update, tree, parentTree, stamp)
    return true
  }
}

function composite (tree, type) {
  var key = type
  // var parentcounter = 1
  while (tree._p) {
    if (tree._key !== type) {
      if (!tree.$c) { tree.$c = {} }
      tree.$c[key] = type
      key = tree._key
      tree = tree._p
      // if (key !== '$any') {
      //   parentcounter--
      // }
    } else {
      // parentcounter++
      tree = tree._p
    }
  }
}