import React from 'react' //eslint-disable-line
import { observer } from 'mobx-react'
import { observable, toJSON } from 'mobx'
import get from 'superagent'
import convert from 'lodash/fp/convert'
const _ = convert(require('lodash').runInContext(), { 'immutable': false })
import {view as GifCard} from './6-Gif-Viewer-l' //eslint-disable-line

const init = {
  gifCards: [],
  input: '',
  loading: false
}

const model = observable(toJSON(init, false))

const view = observer( ({id = 'gif-list', store = model}) => {

  function addCard (topic, apiUrl, imgUrl) {
    store.gifCards.unshift({
      id: Date.now(),
      topic,
      apiUrl,
      imgUrl,
      loading: false
    })
    store.loading = false
  }

  function loadImg (res, cb) {
    const imgUrl = res.body.data.fixed_width_small_url
    const image = new Image()
    image.src = imgUrl
    image.onload = () => cb(imgUrl)
  }

  function apiResp (err, res, cb) {
    err ? console.log(err) : // manage failed response
    res.body.data.length === 0 ?
      console.log('no api for that query') : // manage when data is empty
      loadImg(res, cb)
  }

  function reqGif (apiUrl, cb) {
    store.loading = true
    get(apiUrl)
    .end( (err, res) => apiResp(err, res, cb) )
  }

  function AddGif (val) {
    store.input = ''
    let topic = _.startCase(_.trim(val))
    let apiUrl = `http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${encodeURI(topic)}`
    reqGif( apiUrl, _.curry(addCard)(topic, apiUrl) )
  }

  const evValue = (ev) =>
    ev.key === 'Enter' ?
    AddGif(ev.target.value) :
    store.input = ev.target.value


  const gifCards = store.gifCards.map( (card) => {
    const props = {
      store: card,
      topic: card.topic,
      loadImg,
      key: card.id
    }
    return <GifCard {...props}/>
  })

  return <div id={id}>
    <input placeholder='Type what type of Gifs do you want to see' value={store.input} onKeyUp={evValue} onChange={evValue} autoFocus/>
    {gifCards}
  </div>


})

export default { model, view }
