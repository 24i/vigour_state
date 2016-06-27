'use strict'
const test = require('tape')
const subsTest = require('../util')

test('parent - references - double', function (t) {
  const s = subsTest(
    t,
    {
      bla: {
        x: 'its x',
        d: 'xxxx'
      },
      a: {
        b: {
          c: {
            deep: '$root.bla.x'
          },
          d: 'yes!'
        }
      }
    },
    {
      a: {
        b: {
          c: {
            deep: {
              $parent: {
                parent: {
                  d: { val: true }
                }
              }
            }
          }
        }
      }
    }
  )
  s('initial subscription', [ { path: 'a/b/d', type: 'new' } ])
  t.end()
})
