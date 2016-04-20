import React from 'react'

const view = ({list = []}) => {

  return <div id={id} >
    <button onClick={increment} onMouseOver={increment}>+</button>
    <span style={style}>{state.count}</span>
    <button onClick={decrement} onMouseOver={decrement}>-</button>
  </div>
}

export default { view }
