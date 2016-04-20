import React from 'react' //eslint-disable-line
import { observer } from 'mobx-react'
import { observable, extendObservable, toJSON } from 'mobx'
import convert from 'lodash/fp/convert'
const _ = convert(require('lodash').runInContext(), { 'immutable': false })
import CounterX from './5-Counter-x.jsx'


const init = {
  counters: [],
  nextId: 0
}

const model = observable(toJSON(init, false))

const view = observer( ({id = 'dynamic-counters', state = model}) => {

  const initState = () =>
    extendObservable(state, toJSON(init, false))

  const resetAll = () =>
    _.map( _.set('counter.count', 0) )(state.counters)

  const addCounter = () => {
    const mod = Object.assign(
      toJSON(CounterX.model, false),
      {id: state.nextId++}
    )
    state.counters.push(mod)
  }

  const Counters = state.counters.map( (counter) =>
    <CounterX.view state={counter} counterId={counter.id} key={counter.id} id={'#' + counter.id} />
  )

  return <div id={id} class='epale'>
    <button onClick={addCounter}>Add Counter</button>
    <button onClick={resetAll}>Reset all Counters</button>
    <button onClick={initState}>Reset App</button>
      {Counters}
  </div>

})

export default { model, view }
