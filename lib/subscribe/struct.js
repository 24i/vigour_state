'use strict'
const diff = require('./diff')
const val = require('./val')
const valUpdate = val.update
const valCreate = val.create

const dictionary = require('./dictionary')
const remove = require('./remove')
const composite = require('./composite')
const DONE = dictionary.DONE

module.exports = function struct (key, target, pSubs, subs, update, tree, stamp) {
  const keyTarget = target && target[key]
  var treeKey = tree[key]
  if (keyTarget && keyTarget.val !== null) {
    let leafStamp = keyTarget._lstamp + (keyTarget._uid || keyTarget.uid())
    let traveltarget
    if (keyTarget.val && keyTarget.val._base_version) {
      traveltarget = keyTarget.origin()
    } else {
      traveltarget = keyTarget
    }
    if (!treeKey) {
      treeKey = tree[key] = { _p: tree, _key: key }
      treeKey.$ = leafStamp
      valCreate(keyTarget, traveltarget, subs, update, treeKey, stamp)
    } else {
      if (treeKey.$ !== leafStamp) {
        treeKey.$ = leafStamp
        valUpdate(keyTarget, traveltarget, subs, update, treeKey, stamp)
      } else if ('$c' in treeKey) {
        composite(traveltarget, subs, update, treeKey, stamp)
      }
    }
  } else if (treeKey) {
    remove(key, keyTarget, subs, update, tree, treeKey, stamp)
  }
}