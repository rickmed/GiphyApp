const vTree = require('react').createElement
import { observable, extendObservable, toJSON } from 'mobx'
import { observer } from 'mobx-react'
import convert from 'lodash/fp/convert'
const _ = convert(require('lodash').runInContext(), { 'immutable': false })
const { button } = require('hyperscript-helpers')(require('react-hyperscript'))
import CounterX from './5-Counter-x'


const init = {
  counters : [],
  nextId: 0
}

const model = observable(toJSON(init, false))

const view = observer( ({id = 'dynamic-counters', state = model}) => {

  const initState = () =>
    extendObservable(state, toJSON(init, false))

  const resetAll = () =>
    _.map( _.set('model.counter.count', 0) )(state.counters)

  const addCounter = () =>
    state.counters.push({
      id: state.nextId++,
      model: toJSON(CounterX.model, false)
    })

  const Counters = state.counters.map( (counter) =>
    vTree(CounterX.view, {state: counter.model, counterId: counter.id, key: counter.id, id: '#' + counter.id}) )

  return vTree('div', {id},
    button( { onClick: addCounter, key: 1 }, 'Add Counter' ),
    button( { onClick: resetAll }, 'Reset all counters' ),
    button( { onClick: initState }, 'Reset App' ),
    Counters
  )
})

export default { model, view }
