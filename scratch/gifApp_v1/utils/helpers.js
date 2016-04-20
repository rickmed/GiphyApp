import {Subject, Observable} from 'rxjs'
import {randomGifBase, colors} from './data'

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

export const loadImg = $ =>
   $.flatMap(param => {
     const image = new Image()
     image.src = param.imgUrl || param
     return Observable.fromEvent(image, 'load')
   },
    param => param
   )


export const randomGif = str =>
  randomGifBase + encodeURI(str)


const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min

export const randomColor = () =>
      colors[randomInt(0, colors.length)]

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
