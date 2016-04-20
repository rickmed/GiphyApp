import React from 'react'


const view = () => {

  return <div id={id} >
    <button onClick={increment} onMouseOver={increment}>+</button>
    <span style={style}>{state.count}</span>
    <button onClick={decrement} onMouseOver={decrement}>-</button>
  </div>
}

export default { view }
