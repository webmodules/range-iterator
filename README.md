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
var RangeIterator = require('range-iterator');

var range = document.createRange();
range.selectNodeContents(document.body);

var next;
var iterator = new RangeIterator(range)
  .revisit(false)
  .select(Node.TEXT_NODE)
  .select(function (node) {
    return node.nodeName === 'BR';
  });
// reads as: select all TextNodes and BR elements within the Range selection

while (next = iterator.next()) {
  // do something with Node `next`
}
```
