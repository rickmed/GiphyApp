

// retry delayed 3 times with a final default value.
const ajaxResp$ = Observable$.from(data)
  .flatMap(topic =>
    AjaxObservable$(topic)  // auto encodes param
    .retryWhen( err$ => {
      return err$
      .delay(500)
      .take(3)   // number of tries, not retries
      .do( err => console.log('do something with each error', x))
      .concat(Observable$.throw('catch this on fetch'))
      // create and error subject and be done with it
    })
    .catch( err => {
      if (err !== 'catch this on fetch') console.log(err)
      return Observable$.of('default value')
    })
