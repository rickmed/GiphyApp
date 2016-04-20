import React from 'react'
const vTree = React.createElement
import { observable, extendObservable, toJSON } from 'mobx'
import { observer } from 'mobx-react'
import Counter from './1-Counter'
import h from 'react-hyperscript'
const { button } = require('hyperscript-helpers')(h)

const init = {
  counters : [],
  nextId: 0
}

const model = observable(toJSON(init, false))

const view = observer( ({id = 'dynamic-counters', state = model}) => {

  const initState = () =>
    extendObservable(state, toJSON(init, false))

  const resetAll = () =>
    state.counters.forEach( (counter) => counter.model.count = 0 )

  const addCounter = () =>
    state.counters.push({
      id: state.nextId++,
      model: toJSON(Counter.model, false)
    })

  const removeCounter = () => {
    state.counters.pop()
    return state.nextId--
  }

  return vTree('div', {id},
    button( { onClick: addCounter, key: 1 }, 'Add Counter' ),
    button( { onClick: removeCounter }, 'Remove Counter' ),
    button( { onClick: resetAll }, 'Reset all counters' ),
    button( { onClick: initState }, 'Reset App' ),
    state.counters.map( (counter) =>
      vTree(Counter.view, {state: counter.model, key: counter.id, id: '#' + counter.id})
    )
  )
})

export default { model, view }
