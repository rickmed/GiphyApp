import {Observable as Observable$} from 'rxjs/Observable'
import {Subject} from 'rxjs/Subject'
import 'rxjs/add/observable/fromEvent'
import {AjaxObservable} from 'rxjs/observable/dom/AjaxObservable'
import {observe, isObservableArray} from 'mobx'
import {randomGiphyApi, colors} from './data'

export function toSubject() {
  const BaseClass = Subject

  function subject(event) {
    subject.next(event)
  }

  for (var key in BaseClass.prototype) {
    subject[key] = BaseClass.prototype[key]
  }

  BaseClass.apply(subject, [].slice.call(arguments, 2))
  return subject
}

export function mobxToRx(mobx) {
  return Observable$.create((observer) =>
    observe(mobx, change => observer.next(
      isObservableArray(mobx) ?
        {
          type: change.type,
          addedCount: change.addedCount,
          index: change.index,
          object: change.object,
          removedValues: change.removed,
        }
        : {
          changeType: change.type,
          propertyChanged: change.name,
          oldValue: change.oldValue,
          newValue: change.object[change.name],
          object: change.object
        }
    ))
  )
}

export function loadImg (imgUrl) {
  const image = new Image()
  image.src = imgUrl
  return Observable$.fromEvent(image, 'load')
}

export function randomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomColor () {
  return colors[randomInt(0, colors.length)]
}


export function AjaxObservable$ (url) {
  return AjaxObservable.create({  // overwrite Rxjs defaults.
    url,
    crossDomain: true,
    createXHR: () => new XMLHttpRequest()
  })
}

let count = 1

export function randomGiphy (str) {
  if (++count % 7 === 0) return 'will err: ' + str
  else
  return randomGiphyApi.base + encodeURI(str)
}


// Below is the original react event to subject function
// which includes and auto selector
//
// function factory(BaseClass, mapFunction) {
//
//   function subject(event) {
//     if (typeof mapFunction === 'function') {
//       event = mapFunction.apply(undefined, arguments)
//     } else if (typeof mapFunction !== 'undefined') {
//       event = mapFunction
//     }
//     subject.next(event)
//   }
//
//   for (var key in BaseClass.prototype) {
//     subject[key] = BaseClass.prototype[key]
//   }
//
//   BaseClass.apply(subject, [].slice.call(arguments, 2))
//
//   return subject
// }
//
// export function toSubject(mapFunction) {
//   return factory(Subject, mapFunction)
// }
