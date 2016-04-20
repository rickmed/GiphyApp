import React from 'react' //eslint-disable-line
import { observable, extendObservable, toJSON } from 'mobx'
import { observer } from 'mobx-react'
import Counters from './2-Two-Counters'

const init = {
  countersPair1: Counters.model,
  countersPair2: Counters.model
}

const model = observable(toJSON(init, false))

const view = observer( ({id = 'two-counters-pairs', state = model}) => {

  const initState = () => extendObservable(state, toJSON(init, false))

  return <div id={id}>
    <Counters.view state={state.countersPair1} id="#pair1"/>
    <Counters.view state={state.countersPair2} id="#pair2"/>
    <button onClick={initState}>Reset All</button>
  </div>
})

export default { model, view }
