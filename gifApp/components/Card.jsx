import React from 'react'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import {Observable as Observable$} from 'rxjs/Observable'
import 'rxjs/add/observable/interval'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/throttleTime'
import 'rxjs/add/operator/timestamp'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/pluck'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/takeUntil'
import 'rxjs/add/operator/finally'
import 'rxjs/add/operator/share'
import 'rxjs/add/operator/delay'
import {toSubject, loadImg, randomColor, AjaxObservable$, randomGiphy, randomInt} from '../helpers/util'
import {randomGiphyApi} from '../helpers/data'

const Card = observer(React.createClass({

  componentWillMount () {

    // state
    const {query, imgUrl} = this.props.card

    this.state = observable({
      imgUrl,
      loading: false,
      error: false,
      color: randomColor(),
      btnAnimation: '',
      cardCls: 'enteringCard '
    })
    const {state} = this

    // entering css transition
    setTimeout( () => state.cardCls = 'ui inverted segment gifCard cardSize ', 0)

    this.headerSize = query.length > 15 ? '1rem' : ''

    // fetch button handler
    this.getNewGif$ = toSubject()

    const moreGif$ = this.getNewGif$
      .throttleTime(500)
      // .timestamp()
      // .do( x => console.log('sent: ', x.timestamp))
      .do( () => {
        state.error === true ? state.error = false : 'do nothing'
        state.loading = true
      })

    const loadedImg$ = moreGif$
      .mergeMap( x => {
        return AjaxObservable$(randomGiphy(query))
          .pluck(...randomGiphyApi.respImgPath)
          .catch( () => {
            state.error = true
            return Observable$.of(state.imgUrl)
          })
          .mergeMap(loadImg, imgUrl => imgUrl )
          // .do( () => console.log('loaded: ', x.timestamp) )
          .takeUntil(loadedImg$)
          .finally( () => state.loading = false )
          // .do( null, null, () => console.log('completed: ', x.timestamp) )
      })
      .share()

    const newGif$ = loadedImg$
      .do( imgUrl => {
        state.imgUrl = imgUrl
        state.color = randomColor()
      })

    const newGifSub = newGif$.subscribe()

    //  button animation
    const btnAnimation$ = Observable$.interval(randomInt(3000, 10000))
      .do( () => state.btnAnimation = 'tada' )
      .delay(3000)
      .do( () => state.btnAnimation = '' )

    // subscribe to all observables
    this.subscriptions = btnAnimation$.subscribe()
      .add(newGifSub)
  },

  componentWillUnmount () {
    this.subscriptions.unsubscribe()
  },

  xButton () {
    const style = this.refs.card.style
    style.padding = style.width = this.refs.card.removeMe = '0'

  },

  remove (ev) {
    const {card, cards} = this.props
    ev.target === this.refs.card && this.refs.card.removeMe ?
      cards.remove(card) : 'do nothing'
  },

  render () {
    const {state, remove, xButton, getNewGif$, headerSize} = this
    const {query} = this.props.card

    const header = {
      className: 'reset',
      style: {
        fontSize: headerSize
      }
    }

    const img = {
      className: 'ui circular image gifImg flexWrap flexCenter',
      style: {
        backgroundImage: `url(${state.imgUrl})`,
      }
    }

    const loaderCls = 'ui small loader inverted ' + (state.loading ? 'active' : '')

    const btnCls = 'ui inverted circular icon button transition ' + (state.loading ? '' : state.btnAnimation)

    return (
      <div class={state.cardCls + state.color} ref='card' onTransitionEnd={remove}>
        <h3 {...header}>{query || 'Random Gif'}</h3>
        <i class="remove link icon" onClick={xButton}></i>
        <div {...img}>
          {state.error ? 'Error. Please reload' : null}
          <div class={loaderCls}></div>
        </div>
        <div class={btnCls} onClick={getNewGif$}>
          <i class={'icon ' + (state.loading ? 'undo' : 'fast forward')}></i>
        </div>
      </div>
    )
  }
}))

export default Card
