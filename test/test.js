
var assert = require('assert');
var RangeIterator = require('../');

describe('RangeIterator', function () {

  var d = document.createElement('div');
  d.style.display = 'none';
  document.body.appendChild(d);

  after(function () {
    // clean up
    document.body.removeChild(d);
  });

  it('should return an ES6 Iterator', function () {
    d.innerHTML =
      '<p>' +
        'hello ' +
        '<b>world</b>' +
        '.' +
      '</p>' +
      '<p>' +
        'foo' +
      '</p>';

    var range = document.createRange();
    range.setStart(d.firstChild.firstChild, 2);
    range.setEnd(d.firstChild.firstChild, 2);
    assert(range.collapsed);

    var iterator = RangeIterator(range);
    assert.equal('function', typeof iterator.next);
  });

  it('should throw a TypeError if no Range is given', function () {
    try {
      RangeIterator(null);
      assert(false); // unreachable
    } catch (e) {
      assert(e);
      assert(e.name === 'TypeError');
    }
  });

  it('should iterate over the TextNodes within a Range', function () {
    d.innerHTML =
      '<p>' +
        'hello ' +
        '<b>world</b>' +
        '.' +
      '</p>' +
      '<p>' +
        'foo' +
      '</p>';

    var range = document.createRange();
    range.setStart(d.firstChild.firstChild, 2);
    range.setEnd(d.lastChild.firstChild, 2);
    assert.equal('llo world.fo', range.toString());

    var next;
    var iterator = RangeIterator(range, NodeFilter.SHOW_TEXT);

    next = iterator.next();
    assert.equal(false, next.done);
    assert.equal(next.value.nodeValue, 'hello ');

    next = iterator.next();
    assert.equal(false, next.done);
    assert.equal(next.value.nodeValue, 'world');

    next = iterator.next();
    assert.equal(false, next.done);
    assert.equal(next.value.nodeValue, '.');

    next = iterator.next();
    assert.equal(false, next.done);
    assert.equal(next.value.nodeValue, 'foo');

    next = iterator.next();
    assert.equal(true, next.done);
  });

  it('should iterate over the TextNodes within a Range selecting beginning of last paragraph', function () {
    d.innerHTML =
      '<p>' +
        'hello ' +
        '<b>world</b>' +
        '.' +
      '</p>' +
      '<p>' +
        'foo' +
      '</p>';

    var range = document.createRange();
    range.setStart(d.firstChild.firstChild, 0);
    range.setEnd(d.lastChild, 0);
    assert.equal('hello world.', range.toString());

    var next;
    var iterator = RangeIterator(range, NodeFilter.SHOW_TEXT);

    next = iterator.next();
    assert.equal(false, next.done);
    assert.equal(next.value.nodeValue, 'hello ');

    next = iterator.next();
    assert.equal(false, next.done);
    assert.equal(next.value.nodeValue, 'world');

    next = iterator.next();
    assert.equal(false, next.done);
    assert.equal(next.value.nodeValue, '.');

    next = iterator.next();
    assert.equal(true, next.done);
  });

  it('should iterate over the B element within a Range', function () {
    d.innerHTML =
      '<p>' +
        'hello ' +
        '<b>world</b>' +
        '.' +
      '</p>' +
      '<p>' +
        'foo' +
      '</p>';

    var range = document.createRange();
    range.setStart(d.firstChild.firstChild, 2);
    range.setEnd(d.lastChild.firstChild, 2);
    assert.equal('llo world.fo', range.toString());

    var next;
    var iterator = RangeIterator(range, NodeFilter.SHOW_ALL, function (node) {
      return node.nodeName === 'B';
    });

    next = iterator.next();
    assert.equal(false, next.done);
    assert.equal(next.value.nodeName, 'B');
    assert.equal(next.value.firstChild.nodeValue, 'world');

    next = iterator.next();
    assert.equal(true, next.done);
  });

  it('should iterate over the TextNode within a collapsed Range', function () {
    d.innerHTML =
      '<p>' +
        'hello ' +
        '<b>world</b>' +
        '.' +
      '</p>' +
      '<p>' +
        'foo' +
      '</p>';

    var range = document.createRange();
    range.setStart(d.lastChild.firstChild, 2);
    range.setEnd(d.lastChild.firstChild, 2);
    assert(range.collapsed);

    var next;
    var iterator = RangeIterator(range, NodeFilter.SHOW_TEXT);

    next = iterator.next();
    assert.equal(false, next.done);
    assert.equal(next.value.nodeValue, 'foo');

    next = iterator.next();
    assert.equal(true, next.done);
  });

  it('should iterate over the TextNodes and BR elements within a Range with multiple blocks', function () {
    d.innerHTML = '<p>' +
                    'hel' +
                    '<b>lo</b>' +
                  '</p>' +
                  '<p>' +
                    '<b><br></b>' +
                  '</p>' +
                  '<p>' +
                    '<b><br></b>' +
                  '</p>' +
                  '<p>' +
                    '<b>wo</b>' +
                    'rld' +
                  '</p>';

    var range = document.createRange();
    range.setStart(d.firstChild.firstChild, 0);
    range.setEnd(d.lastChild.lastChild, 3);
    assert(!range.collapsed);
    assert.equal('helloworld', range.toString());

    var next;
    var iterator = RangeIterator(range, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, function (node) {
      return node.nodeType === Node.TEXT_NODE || 'BR' === node.nodeName;
    });

    next = iterator.next();
    assert.equal(false, next.done);
    assert.equal(next.value.nodeValue, 'hel');

    next = iterator.next();
    assert.equal(false, next.done);
    assert.equal(next.value.nodeValue, 'lo');

    next = iterator.next();
    assert.equal(false, next.done);
    assert.equal(next.value.nodeName, 'BR');

    next = iterator.next();
    assert.equal(false, next.done);
    assert.equal(next.value.nodeName, 'BR');

    next = iterator.next();
    assert.equal(false, next.done);
    assert.equal(next.value.nodeValue, 'wo');

    next = iterator.next();
    assert.equal(false, next.done);
    assert.equal(next.value.nodeValue, 'rld');

    next = iterator.next();
    assert.equal(true, next.done);
  });

  it('should iterate over the TextNodes within a Range that ends with the beginning of a P', function () {
    d.innerHTML = '<p>foo</p>' +
                  '<p>bar</p>';

    var range = document.createRange();
    range.setStart(d.firstChild.firstChild, 0);
    range.setEnd(d.lastChild, 0);
    assert(!range.collapsed);
    assert.equal('foo', range.toString());

    var next;
    var iterator = RangeIterator(range, NodeFilter.SHOW_TEXT);

    next = iterator.next();
    assert.equal(false, next.done);
    assert.equal(next.value.nodeValue, 'foo');

    next = iterator.next();
    assert.equal(true, next.done);
  });

  it('should iterate over the first selected BR element', function () {
    d.innerHTML = '<p>' +
                    'hel' +
                    '<b>lo</b>' +
                  '</p>' +
                  '<p>' +
                    '<b><br></b>' +
                  '</p>' +
                  '<p>' +
                    '<b><br></b>' +
                  '</p>' +
                  '<p>' +
                    '<b>wo</b>' +
                    'rld' +
                  '</p>';

    var range = document.createRange();
    range.setStart(d.firstChild.firstChild, 0);
    range.setEnd(d.childNodes[1], 1);
    assert(!range.collapsed);
    assert.equal('hello', range.toString());

    var next;
    var iterator = RangeIterator(range, NodeFilter.SHOW_ALL, function (node) {
      return 'BR' === node.nodeName;
    });

    next = iterator.next();
    assert.equal(false, next.done);
    assert.equal(next.value.nodeName, 'BR');

    next = iterator.next();
    assert.equal(true, next.done);
  });

  it('should allow passing a NodeFilter function as 2nd parameter', function () {
    d.innerHTML = '<p>' +
                    'hel' +
                    '<b>lo</b>' +
                  '</p>' +
                  '<p>' +
                    '<b><br></b>' +
                  '</p>' +
                  '<p>' +
                    '<b><br></b>' +
                  '</p>' +
                  '<p>' +
                    '<b>wo</b>' +
                    'rld' +
                  '</p>';

    var range = document.createRange();
    range.setStart(d.firstChild.firstChild, 0);
    range.setEnd(d.childNodes[1], 1);
    assert(!range.collapsed);
    assert.equal('hello', range.toString());

    var next;
    var iterator = RangeIterator(range, function (node) {
      return 'BR' === node.nodeName;
    });

    next = iterator.next();
    assert.equal(false, next.done);
    assert.equal(next.value.nodeName, 'BR');

    next = iterator.next();
    assert.equal(true, next.done);
  });

});
