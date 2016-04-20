import React from 'react'
import {observer} from 'mobx-react'
import LoadingQuery from './LoadingQuery.jsx'

const ProgressBar = observer(React.createClass({
  render () {
    const {queriesLoading, nuMquerloaded} = this.props
    const total = queriesLoading.length + nuMquerloaded
    const percentage = Math.floor((nuMquerloaded / total) * 100)
    const percent = isNaN(percentage) ?
      'start'
      : percentage

    const baseCls = 'flexWrap ui progress reset indicating'
    const loadingCls = baseCls + ' loading active'
    const loadedCls = baseCls + ' loaded inputWidth'

    const progress = {
      className: percent === 100 || percent === 'start' ? loadedCls : loadingCls,
      'data-percent': percent === 'start' ? 0 : percent === 0 ? 1 : percent
    }

    const bar = {
      className: 'bar' + (percent === 'start' ?
        ' loaded'
        : percent === 100 ?
          ' '
          : ''
      ), // force re-render after affecting DOM directly below
      style: {
        width: percent === 100 || percent === 'start' ? '100%' : percent + '%'
      }
    }

    const {refs} = this
    function setLoaded (ev) {
      if (ev.target.className.indexOf('inputWidth') >= 0) {
        refs.queue.innerHTML = ''
        refs.bar.className = 'bar loaded'
      }
    }

    return (
      <div {...progress} ref='pgrsBar' onTransitionEnd={setLoaded}>
        <div {...bar} ref="bar"></div>
        <div class="queue flexWrap flexCenter" ref='queue'>
          {
          percent === 100 ?
            'All Loaded'
            : queriesLoading.map( query =>
              <LoadingQuery
                loadingQuery={query}
                queriesLoading={queriesLoading}
                key={query.id}
              />
            )
          }
        </div>
      </div>
    )
  }
}))

export default ProgressBar
