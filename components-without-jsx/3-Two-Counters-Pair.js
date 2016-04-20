const vTree = require('react').createElement
import { observable, extendObservable, toJSON } from 'mobx'
import { observer } from 'mobx-react'
import Counters from './2-Two-Counters'
import h from 'react-hyperscript'
const { button } = require('hyperscript-helpers')(h)

const init = {
  countersPair1: Counters.model,
  countersPair2: Counters.model
}

const model = observable(toJSON(init, false))

const view = observer( ({id = 'two-counters-pairs', state = model}) => {

  const initState = () => extendObservable(state, toJSON(init, false))

  return vTree('div', {id},
    vTree(Counters.view, {id: '#pair1', state: state.countersPair1}),
    vTree(Counters.view, {id: '#pair2', state: state.countersPair2}),
    button( { onClick: initState }, 'Reset All' )
  )
})

export default { model, view }
