
var assert = require('assert');
var DomIterator = require('dom-iterator');
var RangeIterator = require('../');

describe('RangeIterator', function () {

  var d = document.createElement('div');
  d.innerHTML =
    '<p>' +
      'hello ' +
      '<b>world</b>' +
      '.' +
    '</p>' +
    '<p>' +
      'foo' +
    '</p>';

  d.style.display = 'none';
  document.body.appendChild(d);

  after(function () {
    // clean up
    document.body.removeChild(d);
  });

  it('should create a `RangeIterator` instance', function () {
    var range = document.createRange();
    range.setStart(d.firstChild.firstChild, 2);
    range.setEnd(d.firstChild.firstChild, 2);
    assert(range.collapsed);

    var iterator = new RangeIterator(range);
    assert(iterator instanceof RangeIterator);
  });

  it('should be a subclass of `DomIterator`', function () {
    var range = document.createRange();
    range.setStart(d.firstChild.firstChild, 2);
    range.setEnd(d.firstChild.firstChild, 2);
    assert(range.collapsed);

    var iterator = new RangeIterator(range);
    assert(iterator instanceof DomIterator);
  });

  it('should throw a TypeError if no Range is given', function () {
    try {
      new RangeIterator(null);
      assert(false); // unreachable
    } catch (e) {
      assert(e);
      assert(e.name === 'TypeError');
    }
  });

  it('should iterate over the TextNodes within a Range', function () {
    var range = document.createRange();
    range.setStart(d.firstChild.firstChild, 2);
    range.setEnd(d.lastChild.firstChild, 2);
    assert.equal('llo world.fo', range.toString());

    var next;
    var iterator = new RangeIterator(range)
      .select(3 /* Node.TEXT_NODE */);

    next = iterator.next();
    assert(next.nodeValue === 'hello ');

    next = iterator.next();
    assert(next.nodeValue === 'world');

    next = iterator.next();
    assert(next.nodeValue === '.');

    next = iterator.next();
    assert(next.nodeValue === 'foo');

    next = iterator.next();
    assert(!next);
  });

  it('should iterate over the TextNodes within a Range selecting beginning of last paragraph', function () {
    var range = document.createRange();
    range.setStart(d.firstChild.firstChild, 0);
    range.setEnd(d.lastChild, 0);
    assert.equal('llo world.', range.toString());

    var next;
    var iterator = new RangeIterator(range)
      .select(3 /* Node.TEXT_NODE */);

    next = iterator.next();
    assert(next.nodeValue === 'hello ');

    next = iterator.next();
    assert(next.nodeValue === 'world');

    next = iterator.next();
    assert(next.nodeValue === '.');

    next = iterator.next();
    assert(!next);
  });

  it('should iterate over the B element within a Range', function () {
    var range = document.createRange();
    range.setStart(d.firstChild.firstChild, 2);
    range.setEnd(d.lastChild.firstChild, 2);
    assert.equal('llo world.fo', range.toString());

    var next;
    var iterator = new RangeIterator(range)
      .revisit(false)
      .select('nodeName === "B"');

    next = iterator.next();
    assert(next.nodeName === 'B');
    assert(next.firstChild.nodeValue === 'world');

    next = iterator.next();
    assert(!next);
  });

  it('should iterate over the TextNode within a collapsed Range', function () {
    var range = document.createRange();
    range.setStart(d.lastChild.firstChild, 2);
    range.setEnd(d.lastChild.firstChild, 2);
    assert(range.collapsed);

    var next;
    var iterator = new RangeIterator(range)
      .select(3 /* Node.TEXT_NODE */);

    next = iterator.next();
    assert(next.nodeValue === 'foo');

    next = iterator.next();
    assert(!next);
  });

});