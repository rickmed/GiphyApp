import { observable } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import request from 'superagent'

const model = observable({
  imgUrl: '',
  loading: false
})

const view = observer(React.createClass({

  getDefaultProps: () => ({
    topic: 'Funny Cats',
    store: model
  }),

  componentWillMount() {
    this.getGif()
  },

  getGif() {
    this.props.store.loading = true
    request
      .get('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=funny+cats')
      .end( (err, res) => this.preLoadImg(res.body.data.image_original_url) )
  },

  preLoadImg(url) {
    const store = this.props.store
    const image = new Image()
    image.src = url
    image.onload = () => {
      store.imgUrl = url
      store.loading = false
    }
  },

  render() {
    const store = this.props.store

    const card = {
      className: 'ui secondary teal raised center aligned stackable segment',
      style: {
        width: 'min-content',
        margin: '1% auto'
      }
    }

    const size = 'calc(5vw + 5vh + 20vmin)'
    const circleSegment = {
      className: 'ui dimmable' + (store.loading ? ' dimmed' : ''),
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
      className: 'ui button right labeled icon circular large green center noWrap'
    }

    const loaderClass = 'ui loader large inverted' + (store.loading ? ' active' : '')

    return <div {...card}>
        <h1 className="ui header noWrap">{this.props.topic}</h1>
        <div {...circleSegment}>
          <img {...img}/>
          <div className={loaderClass} ></div>
          <div className="ui simple dimmer"></div>
        </div>
        <button {...button} onClick={this.getGif}> More Please
          <i className="ui right arrow icon"></i>
        </button>
      </div>
  }
}))

export default { model, view }
