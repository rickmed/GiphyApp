import React from 'react'
import {observer} from 'mobx-react'
import {observable, asFlat} from 'mobx'
import Input from './components/Input.jsx'
import ProgressBar from './components/ProgressBar/Bar.jsx'
import ErrMessage from './components/ErrMessage.jsx'
import Card from './components/Card.jsx'

const state = observable({
  queriesLoading: [
    // query: string,
    // id: sttring
  ],
  errQueries: [
    // {
    //   query: string,
    //   retry: int, // retrying fetching
    //   retrying: bool,
    //   notFound: bool,  // does not exist in giphy
    //   id: string
    // }
  ],
  cards: asFlat([
    // {
    //   query: string,
    //   imgUrl: string
    //   id: string
    // }
  ])
})

const App = observer( () =>
  (<div id='gif-list' class="ui container reset flexWrapCenterRow">

    <div id="inputRow" class="flexWrapCenterRow">
      <Input appState={state}/>
    </div>

    <div id="progressBar" class="flexWrapCenterRow">
      <ProgressBar
        queriesLoading={state.queriesLoading}
        nuMquerloaded={state.cards.length}
      />
    </div>
    {
      state.errQueries.length > 0 ?
        (<div id="errMessages">
          {state.errQueries.map( errQuery =>
            <ErrMessage
              errQuery={errQuery}
              errQueries={state.errQueries}
              key={errQuery.id}
            />
          )}
        </div>)
        : null
    }
    {
      state.cards.length > 0 ?
        (<div id="cards" class="flexWrapCenterRow">
          {state.cards.map( card =>
            <Card
              card={card}
              cards={state.cards}
              key={card.id}
            />
          )}
        </div>)
        : null
    }

  </div>)
)

export default App
