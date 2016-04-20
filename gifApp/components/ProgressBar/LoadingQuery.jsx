import React from 'react'
import {observer} from 'mobx-react'

const LoadingQuery = observer( ({loadingQuery, queriesLoading}) => {

  function cancel () {
    queriesLoading.remove(loadingQuery)
  }

  return (
    <div class='LoadingQuery' onClick={cancel}>
      {loadingQuery.query === '' ?
        'Random Gif'
        : loadingQuery.query
      }
      <i class="ui icon remove link"></i>
    </div>
  )

})

export default LoadingQuery
