import React from 'react'
import {observer} from 'mobx-react'
import {Observable as Observable$} from 'rxjs/Observable'
import 'rxjs/add/observable/from'
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/merge'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/let'
import 'rxjs/add/operator/zip'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/retryWhen'
import 'rxjs/add/operator/delay'
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/finally'
import 'rxjs/add/operator/cache'
import 'rxjs/add/operator/partition'
import 'rxjs/add/operator/pluck'
import 'rxjs/add/operator/takeUntil'
import {toSubject, loadImg, AjaxObservable$, randomGiphy, mobxToRx} from '../helpers/util'
import {addLoadingQuery, setRetryFalse, removeFromLoading, newErrQuery, updateRetry, addNewCard, queryNotFound} from '../helpers/stateMutation'
import {randomGiphyApi} from '../helpers/data'
// import {dummyQueries} from '../helpers/data'

const Input = observer(React.createClass({

  componentWillMount () {
    const {appState} = this.props

    // Input handlers
    this.submitClick$ = toSubject()
    this.addGifCard$ = toSubject()


    const input$ = this.addGifCard$
      .filter( ev => ev.key === 'Enter' )
      .merge( this.submitClick$.do() )   // do() to convert to observable
      .map( () => this.refs.gifInput.value.trim() )
      .do( () => this.refs.gifInput.value = '' )
      .let( obs =>    // rxjs exercise
        (typeof dummyQueries !== 'undefined') ?
          obs.merge(Observable$.from(dummyQueries))
            .zip(Observable$.timer(0, 0), x => x )
          : obs
      )
      .do( query => addLoadingQuery(query, appState) )

    const ajaxResp$ = input$
      .mergeMap( query => {

        const canceledQueries$ = mobxToRx(appState.queriesLoading)
          .filter( obj => obj.removedValues.length > 0 ?
            obj.removedValues[0].query === query
            : false
          )

        const [emptyRes$, goodRes$] = AjaxObservable$(randomGiphy(query))
          .retryWhen( err$ => err$
            .map( (err, i) => {
              i === 0 ?
                newErrQuery(query, appState)
                : updateRetry(query, appState)
              return err
            })
            .delay(2000)   // retry every 2 seconds
            .take(3)   // number of tries, not retries
            .finally( () => {
              setRetryFalse(query, appState)
              removeFromLoading(query, appState)
            })
          )
          .cache()
          .partition(res => Array.isArray(res.response.data))

        emptyRes$
          .do( () => {
            queryNotFound(query, appState)
            removeFromLoading(query, appState)
          })
          .subscribe()

        return goodRes$
          .pluck(...randomGiphyApi.respImgPath)
          .mergeMap( imgUrl => loadImg(imgUrl), imgUrl => imgUrl)
          .takeUntil(canceledQueries$)
      },
        (query, imgUrl) => ({query, imgUrl})
      )

    this.pushCard$ = ajaxResp$
      .do( obj => {
        addNewCard(obj, appState)
        removeFromLoading(obj.query, appState)
      })

    this.pushCard$.subscribe()
  },

  componentWillUnmount () {
    this.pushCard$.unsubscribe()
  },

  render () {
    return (<div class='flexWrapCenterRow ui icon huge transparent input mainInput inputWidth'>
      <input
        placeholder='What type of Gifs do you want'
        ref='gifInput'
        onKeyUp={this.addGifCard$}
        autoFocus
      />
      <i class="search link icon" onClick={this.submitClick$}></i>
    </div>)
  }
}))

export default Input
