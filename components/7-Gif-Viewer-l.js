import { observer } from 'mobx-react'
import React from 'react' //eslint-disable-line
import get from 'superagent'

export const view = observer( ({store = model, topic = 'Random Gif', loadImg}) => {

  function setImgUrl (imgUrl) {
    store.imgUrl = imgUrl
    store.loading = false
  }

  function apiResp (err, res) {
    err ? null : loadImg(res, setImgUrl)
  }

  function getGif () {
    store.loading = true
    get(store.apiUrl)
    .end( (err, res) => apiResp(err, res) )
  }

  const card = {
    className: 'ui secondary teal raised center aligned segment',
    style: {
      width: 'min-content',
      margin: '1% auto'
    }
  }

  const size = 'calc(5vw + 5vh + 20vmin)'
  const circleSegment = {
    className: 'ui dimmable segment' + (store.loading ? ' dimmed' : ''),
    style: {
      padding: 0,
      margin: '3% auto',
      borderRadius: '50%',
      height: size,
      width: size,
      border: '0px solid'
    }
  }

  const img = {
    className: "ui circular image",
    src: store.imgUrl,
    style: {
      height: size,
      width: size,
      border: '2px solid teal'
    }
  }

  const button = {
    className: 'ui button right labeled icon circular medium green center noWrap'
  }

  const loaderClass = 'ui loader large inverted' + (store.loading ? ' active' : '')

  return <div {...card}>
      <h1 className="ui header noWrap">{topic}</h1>
      <div {...circleSegment}>
        <img {...img}/>
        <div className={loaderClass} ></div>
        <div className="ui simple dimmer"></div>
      </div>
      <button {...button} onClick={getGif}> More Please
        <i className="ui right arrow icon"></i>
      </button>
    </div>

})
