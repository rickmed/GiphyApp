import h from 'snabbdom/h'
let { button, div, span } = require('hyperscript-helpers')(h)
import { observable, extendObservable, toJSON } from 'mobx'
import render from './snabbdom-render'

import { Observable as __ } from 'rxjs'
import 'rxjs/add/operator/map'

__.of(1, 2, 3).map(x => x + '!!!').subscribe((x) => console.log(x))


// INPUT



// MODEL
let model = observable({
  count: 0
})


// UPDATE
const increment = (model) => {
  model.count++
  return model
}

// RUNTIME
function dispatch (action) {
  let newModel = action(toJSON(model))
  extendObservable(model, newModel)
}

// OUTPUT
// OUTPUT: view
let counter = (count) =>
  div([
    button({on: {mouseover: [dispatch, increment]}}, '+'),
    span(
      '.button1',
      {style: {margin: '10px', fontWeight: 'bold'}},
      count
    ),
    button('-')
  ])

let main = () => counter(model.count)

let container = document.getElementById('root')
render(container, main)
