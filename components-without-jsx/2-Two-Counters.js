const vTree = require('react').createElement
import { observable, extendObservable, toJSON } from 'mobx'
import { observer } from 'mobx-react'
const { button } = require('hyperscript-helpers')(require('react-hyperscript'))
import Counter from './1-Counter'


const init = {
  counter1: Counter.model,
  counter2: Counter.model
}

const model = observable(toJSON(init, false))

const view = observer( ({id = 'two-counters', state = model}) => {

  const initState = () => extendObservable(state, toJSON(init, false))

  return vTree('div', {id},
    vTree(Counter.view, {id: '#counter1', state: state.counter1}),
    vTree(Counter.view, {id: '#counter2', state: state.counter2}),
    button( { onClick: initState, onMouseOver: initState }, 'Reset' )
  )
})

export default { model, view }
