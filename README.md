range-iterator
============
### Subclass of [`DomIterator`](https://github.com/MatthewMueller/dom-iterator) that iterates over a Range's selection

[![Sauce Test Status](https://saucelabs.com/browser-matrix/range-iterator.svg)](https://saucelabs.com/u/range-iterator)

[![Build Status](https://travis-ci.org/webmodules/range-iterator.svg?branch=master)](https://travis-ci.org/webmodules/range-iterator)


Installation
------------

``` bash
$ npm install range-iterator
```


Example
-------

``` js
import RangeIterator from 'range-iterator';

let range = document.createRange();
range.selectNodeContents(document.body);

// Iterate over all TextNodes and BR elements within the Range selection
let iterator = RangeIterator(range, NodeFilter.SHOW_ALL, function (node) {
  return node.nodeType === Node.TEXT_NODE || node.nodeName === 'BR';
})

let node;
for (node of iterator) {
  // do something with Node `node`
  console.log(node);
}
```
