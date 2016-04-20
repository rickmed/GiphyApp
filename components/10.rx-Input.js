import { observable } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react' //eslint-disable-line
import {toSubject as to$} from '../helpers/handlerToSubj'


const model = observable({
  title: 'Hello'
})

const view = observer( ({id = '#input', state = model}) => {

  const updateTitle = to$()
  updateTitle
    // .mapTo(1)
    // .scan( (acc, curr) => acc + curr, 0)
    .subscribe( ev => {
      if (ev.key === 'Enter') console.log('the enter key was pressed')
      state.title = ev.target.value.length >= 3 ? ev.target.value : ''
    })

  return <div id={id}>
    <div className="ui input">
      <input placeholder='write at least 3 characters' onKeyUp={updateTitle} autoFocus/>
      <input defaultValue={state.title} onKeyUp={updateTitle}/>
    </div>
    <br/>
    <span>{`Input Result: ${state.title}`}</span>
  </div>

})

export default { model, view }
