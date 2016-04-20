import React from 'react'
import {observer} from 'mobx-react'
import {observable, observe} from 'mobx'

const ErrMessage = observer(React.createClass({

  componentWillMount () {
    this.state = observable({
      visibility: ''
    })
    observe(this.props.errQuery, () =>
      this.state.visibility = ''
    )
  },

  remove () {
    const {errQuery, errQueries} = this.props
    errQuery.notFound || !errQuery.retrying ?
      errQueries.remove(errQuery)
      : this.state.visibility = 'hidden'
  },

  render () {
    const {errQuery} = this.props
    const cls = 'ui small error message reset ' + this.state.visibility
    return (<div class={cls} ref="errMsg" onClick={this.remove}>
      <div class="header">
        { errQuery.notFound ?
          `Sorry. We don't have "${errQuery.query}" gifs`
          : errQuery.retrying ?
            `Could not load "${errQuery.query}". Retrying (${errQuery.retry})...`
            : `Could not load "${errQuery.query}". Please try again later.`
        }
      </div>
      <i class="close icon"></i>
    </div>)
  }
}))

export default ErrMessage
