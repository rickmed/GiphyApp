import { observable } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react' //eslint-disable-line

const model = observable({
  count: 0
})

const view = observer( ({id = '#counter', state = model}) => {

  const increment = () => state.count++
  const decrement = () => state.count--

  const style = { margin: '10px', fontWeight: 'bold' }

  return <div id={id} >
    <button onClick={increment} onMouseOver={increment}>+</button>
    <span style={style}>{state.count}</span>
    <button onClick={decrement} onMouseOver={decrement}>-</button>
  </div>
})

export default { model, view }
