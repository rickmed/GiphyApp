import React from 'react'
import { observable, extendObservable, toJSON } from 'mobx'
import { observer } from 'mobx-react'
import convert from 'lodash/fp/convert'
const _ = convert(require('lodash').runInContext(), { 'immutable': false })
import Counter from './1-Counter.jsx'
import ParentStore from './5-Fancier-Counters-List.jsx'

const init = {
  counter: Counter.model
}

const model = observable(toJSON(init, false))

const view = observer( ({state = model, counterId}) => {

  const reset = () => extendObservable(state, toJSON(init, false))
  const removeOnId = _.remove({id: counterId}) // (counter) => counter.id === counterId
  const removeCounter = () => removeOnId(ParentStore.model.counters)

  return <div>
    <Counter.view id="counter1" state={state.counter} />
    <button onClick={reset}>Reset Counter</button>
    <button onClick={removeCounter}>Remove Counter</button>
  </div>
})

export default { model, view }
