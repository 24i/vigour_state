'use strict'
import Observable from 'vigour-observable' // very slow init -- need to opmize
import subscribe from '../../../subscribe'
import s from '../../../s'

require('./style.less')
console.time('START')
// -------------------------
const raf = window.requestAnimationFrame
// -------------------------
const state = s({ name: 'trees' })
const obj = {}
for (var i = 0; i < 2; i++) { obj[i] = { title: i } }
state.set({
  collection: obj,
  ms: { val: 100, $transform (val) { return Math.round(val) } }
})
// // -------------------------
const Property = new Observable({
  properties: {
    $ (val) {
      this.$ = val
    },
    // has$: true,
    render (val) {
      this.define({ render: val })
    }
  },
  inject: require('./map'),
  Child: 'Constructor'
}, false).Constructor

const Element = new Observable({
  type: 'element',
  properties: {
    css: true,
    $: true, // this basicly means field or path
    // hard thing is to get multiple fields on one level -- we will not support it
    $any: true,
    text: new Property({
      render (node, state, tree, type) {
        // state or val ----
        console.log('should render this prop', this.path())
        console.log(node, state)
        if (node) {
          node.innerText = this.compute(state)
        } else {
          console.error('wtf wtf!', node, state.path())
        }
      }
    }),
    nodeType: true,
    state: true,
    _node: true
  },
  inject: [
    require('./map')
    // require('./render')
  ], // needs to be very different ofcourse
  Child: 'Constructor'
}, false).Constructor

var app = new Element({
  key: 'app',
  ms: {
    text: { $: 'ms' }
  },
  main: {
    // message: { text: 'hello' },
    holder: {
      $: 'collection',
      $any: true,
      Child: {
        css: 'nestchild',
        on: {
          // on data as well?
          remove (val, stamp, node) {
            console.log('FIRE REMOVE:', val, stamp, node)
          }
        },
        // need to know that there is a deeper subs
        // star: {}, does nto work when there is no state yet...
        // has$: true,
        title: {
          // has$: true,
          text: { $: 'title' }
        },
        // more: {
        //   text: { $: '$root.ms' } -- root is not yet supported
        // },
        header: {
          // has$: true,
          a: {
            text: { $: 'title' }
          }
        }
      }
    }
    // holder2: {
    //   $: 'collection',
    //   $any: true,
    //   Child: {
    //     has$: true,
    //     text: { $: 'title' }
    //   }
    // }
  },
  // menu: {
  //   button: { text: 'a button' },
  //   settings: {
  //     $: 'settings',
  //     button: { text: { $: 'languages' } }
  //   }
  // },
  // footer: {
  //   left: { text: 'on the left' },
  //   right: { text: 'on the right' }
  // }
}, false)

var subs = app.$map()

var render = require('./render')
// var elem = render.fn(app)
console.log(app)

var tree = {}

tree = subscribe(state, subs, function (type, stamp, subs, ctree, ptree) {
  console.log('FIRE', this.path(), type, subs)
  // console.log('tree:', tree)
  // console.log('ptree:', ptree)
  // ctree._parent = ptree
  if (subs._) {
    render.fn(this, type, stamp, subs, ctree, ptree, tree)
  } else {
    console.warn('no _ ?', this.path())
  }
  // render.f
}, tree)
// -------------------------
console.log('subs:', subs)
// -------------------------
console.timeEnd('START')
global.state = state
global.tree = tree

console.log(tree._[app.uid()])
document.body.appendChild(tree._[app.uid()])
// console.clear()
// something like rendered : true
var cnt = 0
var total = 0

function loop () {
  cnt++
  var ms = Date.now()
  var obj = {}
  for (var i = 0; i < 2e3; i++) { obj[i] = { title: i + cnt } }
  state.collection.set(obj)
  total += (Date.now() - ms)
  state.ms.set(total / cnt)
  raf(loop)
}

state.collection[0].remove()
// loop()

// if i do this correctly dont need parent ever -- just need to store
// element and then find it by checking parent yes better
// document.appendChild(elem)
// tree.node or something...
