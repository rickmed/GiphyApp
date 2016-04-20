export function addLoadingQuery (query, appState) {
  appState.queriesLoading.push({
    query,
    id: query + Date.now()
  })
}

export function setRetryFalse (query, appState) {
  appState.errQueries.find( item => item.query === query )
    .retrying = false
}

export function removeFromLoading (query, appState) {
  const queriesLoading = appState.queriesLoading
  const querInArr = queriesLoading.find( item => item.query === query )
  queriesLoading.remove(querInArr)
}

export function newErrQuery (query, appState) {
  appState.errQueries.push({
    query,
    retry: 1,
    retrying: true,
    id: query + Date.now()
  })
}
export function updateRetry (query, appState) {
  appState.errQueries.find( item => item.query === query )
    .retry++
}

export function addNewCard (obj, appState) {
  appState.cards.push({
    query: obj.query,
    imgUrl: obj.imgUrl,
    id: obj.query + Date.now()
  })
}

export function queryNotFound (query, appState) {
  appState.errQueries.push({ query, notFound: true })
}
