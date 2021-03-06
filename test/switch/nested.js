'use strict'
const test = require('tape')
const subsTest = require('../util')

test('switch - nested', (t) => {
  const subscription = {
    target: {
      $remove: true,
      $switch: {
        exec  (state, type, stamp, subs, tree, sType) {
          if (state.key === 'song') {
            return 'song'
          } else if (state.key === 'title') {
            return 'title'
          }
        },
        val: true,
        song: {
          genre: {
            $switch: {
              val: true,
              exec  (state, type, stamp, subs, tree, sType) {
                if (state.key === 'sexy') {
                  return 'sexy'
                } else if (state.key === 'cool') {
                  return 'cool'
                }
              },
              sexy: {
                title: { val: true }
              },
              cool: {
                description: { val: true }
              }
            }
          },
          val: true
        },
        title: {
          text: { val: true },
          val: true
        }
      }
    }
  }
  const s = subsTest(
    t,
    {
      target: false,
      title: {
        text: 'its a title!'
      },
      song: {
        genre: '$root.genres.sexy'
      },
      genres: {
        sexy: { title: 'steaming' },
        cool: { description: 'ice cold' }
      }
    },
    subscription
  )

  s('initial subscription', [], { target: { $: 1 } })

  s('switch target to $root.title', [
    { path: 'title', type: 'new', sType: 'switch' },
    { path: 'title', type: 'new' },
    { path: 'title/text', type: 'new' }
  ], { target: '$root.title' })

  s('switch target to $root.song', [
    { path: 'song', type: 'update', sType: 'switch' },
    { path: 'song', type: 'new' },
    { path: 'genres/sexy', type: 'new', sType: 'switch' },
    { path: 'genres/sexy/title', type: 'new' }
  ], { target: '$root.song' })

  // so whats up here
  s('switch song.genre to $root.genres.cool', [
    { path: 'song', type: 'update' },
    { path: 'genres/cool', type: 'update', sType: 'switch' },
    { path: 'genres/cool/description', type: 'new' }
  ], { song: { genre: '$root.genres.cool' } })

  t.end()
})
