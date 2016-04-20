import { observable } from 'mobx'
import { observer } from 'mobx-react'
const { div, span, button } =
  require('hyperscript-helpers')(require('react-hyperscript'))


const model = observable({
  count: 0
})

const view = observer( ({id = '#counter', state = model}) => {

  const increment = () => state.count++
  const decrement = () => state.count--


  const style = { style: { margin: '10px', fontWeight: 'bold' } }

  return div(id, [
    button( { onClick: increment, onMouseOver: increment }, '+' ),
    span(style, `${state.count}`),
    button( { onClick: decrement, onMouseOver: decrement }, '-')
  ])
})

export default { model, view }
