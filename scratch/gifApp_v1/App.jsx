import React from 'react'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import {view as Input } from './components/Input.jsx'
import {view as GifCard } from './components/Card.jsx'

const state = observable({
  cards: [],
  loading: 0,
  noGifApi: ''
})

const view = observer( () =>
  <div id='gif-list' class="ui container flexWrapCenter">

    <div id="input" class="flexWrapCenterRow">
      <Input state={state} />
    </div>

    <div id="cards" class="flexWrapCenterRow">
      {state.cards.map( (card, i) =>
        <GifCard state={card} cardsState={state.cards} key={i}/>
      )}
    </div>

  </div>
)

export default { state, view }
