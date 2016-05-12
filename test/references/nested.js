'use strict'
const test = require('tape')
const subsTest = require('../test')

test('reference - nested', function (t) {
  const s = subsTest(
    t,
    {
      a: '$root.b',
      b: { b: '$root.c' },
      c: { c: 'lulllz' },
      d: { c: 'more lullz!' }
    },
    {
      a: {
        b: {
          c: { val: true }
        }
      }
    }
  )

  s(
    'initial subscription',
    [{ path: 'c/c', type: 'new' }]
  )

  console.log('=============================================')

  var result = s(
    'update b/b to $root.d',
    [{ path: 'd/c', type: 'update' }],
    false,
    {
      b: { b: '$root.d' }
    }
  )

  t.end()
})