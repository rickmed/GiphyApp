import h from 'snabbdom/h'
let { button, div, span } = require('hyperscript-helpers')(h)
import { observable, extras } from 'mobx'
import render from './snabbdom-render'


// MODEL
let model = observable({
  count: 0
})


// UPDATE
const increment = () => model.count++
const decrement = () => model.count--


// OUTPUT
// OUTPUT: view
let counter = () =>
  div([
    button({on: {click: increment}}, '+'),
    span(
      '.button1',
      {style: {margin: '10px', fontWeight: 'bold'}},
      model.count
    ),
    button({on: {click: decrement}}, '-')
  ])

let main = () => counter()

const container = document.getElementById('root')
render(container, main)
