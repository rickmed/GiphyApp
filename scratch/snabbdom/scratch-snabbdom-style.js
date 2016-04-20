import h from 'snabbdom/h'
const { div, h1, span } = require('hyperscript-helpers')(h)

var snabbdom = require('snabbdom');
var patch = snabbdom.init([ // Init patch function with choosen modules
]);
var vnode = h('div#container.two.classes', [
  h('span', {style: {fontWeight: 'bold'}}, 'This is bold'),
  ' and this is just normal text',
  h('a', {props: {href: '/foo'}}, 'I\'ll take you places!')
]);
var container = document.getElementById('root');
// Patch into empty DOM element – this modifies the DOM as a side effect
patch(container, vnode);
var newVnode = h('div#container.two.classes', [
  span({style: {fontWeight: 'bold', textDecoration: 'underline'}}, 'This is now italics'),
  ' and this is still just normal text',
  h('a', {props: {href: '/bar'}}, 'I\'ll take you places!')
]);
// Second `patch` invocation
patch(vnode, newVnode); // Snabbdom efficiently updates the old view to the new state


console.log(h('span', {style: {fontWeight: 'normal', 'text-decoration-line': 'underline'}}, 'This is now italics'));
