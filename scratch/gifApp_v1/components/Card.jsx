import React from 'react'
import {observer} from 'mobx-react'
import {get as getAjax} from 'popsicle'
import {extendObservable} from 'mobx'
import {Observable} from 'rxjs'
import {toSubject, loadImg, randomGif, randomColor} from '../utils/helpers'
import {respImgPath} from '../utils/data'


export const view = observer(React.createClass({

  componentWillMount() {
    const {state} = this.props

    extendObservable(state, {
      loading: 0,
      btnAnimation: '',
      cardColor: randomColor(),
      removingAnimation: ''
    })

    // button handler
    this.getGif$ = toSubject()

    const imgUrl$ = this.getGif$
      .throttleTime(500)
      .do(() => state.loading++ )
      .flatMap(() => getAjax(randomGif(state.topic)))
      .pluck(...respImgPath)

    const newGif$ = loadImg(imgUrl$)
      .do(imgUrl => state.imgUrl = imgUrl )
      .do(() => state.loading-- )
      .do(() => state.cardColor = randomColor() )

    const newGifSub = newGif$.subscribe()

    // interval animate button
    // const btnAnimation$ = Observable.interval(randomInt(1000, 3000))
    const btnAnimation$ = Observable.interval(3000)
      // .do( () => state.btnAnimation = 'scale in' )
      // .delay(1000)
      // .do( () => state.btnAnimation = 'hidden scale out' )

    // subscribe to all observables
    this.subscriptions = btnAnimation$.subscribe()
      .add(newGifSub)
  },

  componentWillUnmount() {
    this.subscriptions.unsubscribe()
  },

  removeCard() {
    const props = this.props
    props.state.removingAnimation = ' transition horizontal flip out'
    setTimeout( () =>
      props.cardsState.remove(props.state) //mobx special method
      , 450
    )
  },

  render() {
    const {state} = this.props

    const img = {
      className: 'ui circular dimmable image gifImg' + (state.loading ? ' dimmed' : ''),
      style: {
        backgroundImage: `url(${state.imgUrl})`,
      }
    }

    const loaderCls = 'ui large loader inverted ' + (state.loading ? 'active flexWrap flexCenter' : '')

    // const buttonCls = 'ui transition pulse looping animated fade button circular inverted small noWrap'
    const buttonCls = 'ui animated fade button circular inverted small noWrap transition ' + (state.btnAnimation ? 'pulse' : '')

    return <div class={'ui inverted segment reset gifCard cardSize ' + state.cardColor + state.removingAnimation}>
      <h3 class={'ui transition ' + state.btnAnimation}>{state.topic || 'Random Gif'}</h3>
      <i class="remove link icon" onClick={this.removeCard}></i>
      <div {...img}>
        <div class={loaderCls}>
          <h1>{state.loading}</h1>
        </div>
        <div class="ui simple dimmer"></div>
      </div>
      <div id="btn" class={buttonCls} tabIndex="0" onClick={this.getGif$}>
        <div class="visible content">More Please&nbsp;
          <i class="fitted chevron circle right icon"></i>
        </div>
        <div class="hidden content">Go!</div>
      </div>
    </div>
  }
}))
