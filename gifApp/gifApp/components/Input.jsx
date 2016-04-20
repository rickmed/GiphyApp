import React from 'react'
import {observer} from 'mobx-react'
import {get as getAjax} from 'popsicle'
import {Observable as Observable$} from 'rxjs'
import {toSubject, loadImg, randomGif} from '../utils/helpers'
import {respImgPath} from '../utils/data'
import {dummyQueries} from '../utils/data'

export const view = observer(React.createClass({ //eslint-disable-line

  componentWillMount() {
    const {state} = this.props

    // Input handlers
    this.searchClick$ = toSubject()
    this.addGifCard$ = toSubject()

    const inputSubmit$ = this.addGifCard$
      /*.filter(ev => ev.key !== 'Tab') // prevent auto search on alt+tab switch
      .do(ev => ev.persist())  // react synthetic events to work with debounce
      .debounce(ev => ev.key === 'Enter' ?
        Observable$.timer(0) :
        Observable$.timer(1000).distinctUntilChanged(ev => ev.target.value)
      )
      .filter( ev => ev.target.value !== '' )*/ // with debounce
      .filter( ev => ev.key === 'Enter') // without debounce
      .merge( this.searchClick$.do() ) // do to convert to observable
      .map( () => this.refs.gifInput.value.trim() )
      .do( () => this.refs.gifInput.value = '' )
      .let( obs => typeof dummyQueries !== 'undefined' ? // conditional exercise
        obs.merge(Observable$.from(dummyQueries))
        : obs
      )
      .do( () => state.loading++ )

    const ajaxResp$ = inputSubmit$
      .flatMap(topic =>
        Observable$.from(getAjax(randomGif(topic)))
        .map(res => {
          if (Array.isArray(res.body.data)) {
            state.noGifApi = topic
            state.loading--
            return res
          }
          else return res
        })
        .filter(res => !Array.isArray(res.body.data))
        .pluck(...respImgPath)
        , (topic, imgUrl) =>
          ({topic, imgUrl})
      )

    this.pushCard$ = loadImg(ajaxResp$)
      .do(newCard =>
        state.cards.push({
          topic: newCard.topic,
          imgUrl: newCard.imgUrl,
          id: state.cards.length + 1
        })
      )
      .do( () => state.loading-- )

    this.pushCard$.subscribe()
  },

  componentWillUnmount() {
    this.pushCard$.unsubscribe()
  },

  render() {
    const {state} = this.props

    return (<div class="inputRow">
      <div class='flexWrap ui icon huge transparent input'>
        <input
          placeholder='What type of Gifs do you want'
          ref='gifInput'
          onKeyUp={this.addGifCard$}
          autoFocus
        />
        <i class="search link icon" onClick={this.searchClick$}></i>
        <div class="ui fitted divider"></div>
      </div>

      {
        state.loading > 0 ?
          (<div class="ui small inline active loader reset flexWrap flexCenter">
            <div class="ui disabled sub header loaderHeader reset">
              {state.loading}
            </div>
          </div>)
          : null
      }
    </div>)
  }
}))
