import snabbdom from 'snabbdom'
import style from 'snabbdom/modules/style'
import eventlisteners from 'snabbdom/modules/eventlisteners';
import { computed, autorun } from 'mobx'


export default function render (container, vnode) {
  let vNode
  const patch = snabbdom.init([ style, eventlisteners ])
  vNode = patch(container, vnode())
  const render = computed(function HELLO () {
    vNode = patch(vNode, vnode())
  })
  autorun(function WHAAT (){render.get()})
}
