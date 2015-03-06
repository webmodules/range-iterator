
let assert = require('assert');
let DomIterator = require('dom-iterator');
let RangeIterator = require('../');

describe('RangeIterator', function () {

  let d = document.createElement('div');

  d.style.display = 'none';
  document.body.appendChild(d);

  beforeEach(function () {
    // default HTML for the tests
    d.innerHTML =
      '<p>' +
        'hello ' +
        '<b>world</b>' +
        '.' +
      '</p>' +
      '<p>' +
        'foo' +
      '</p>';
  });

  after(function () {
    // clean up
    document.body.removeChild(d);
  });

  it('should create a `RangeIterator` instance', function () {
    let range = document.createRange();
    range.setStart(d.firstChild.firstChild, 2);
    range.setEnd(d.firstChild.firstChild, 2);
    assert(range.collapsed);

    let iterator = new RangeIterator(range);
    assert(iterator instanceof RangeIterator);
  });

  it('should be a subclass of `DomIterator`', function () {
    let range = document.createRange();
    range.setStart(d.firstChild.firstChild, 2);
    range.setEnd(d.firstChild.firstChild, 2);
    assert(range.collapsed);

    let iterator = new RangeIterator(range);
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
    let range = document.createRange();
    range.setStart(d.firstChild.firstChild, 2);
    range.setEnd(d.lastChild.firstChild, 2);
    assert.equal('llo world.fo', range.toString());

    let next;
    let iterator = new RangeIterator(range)
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
    let range = document.createRange();
    range.setStart(d.firstChild.firstChild, 0);
    range.setEnd(d.lastChild, 0);
    assert.equal('hello world.', range.toString());

    let next;
    let iterator = new RangeIterator(range)
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
    let range = document.createRange();
    range.setStart(d.firstChild.firstChild, 2);
    range.setEnd(d.lastChild.firstChild, 2);
    assert.equal('llo world.fo', range.toString());

    let next;
    let iterator = new RangeIterator(range)
      .revisit(false)
      .select('nodeName === "B"');

    next = iterator.next();
    assert(next.nodeName === 'B');
    assert(next.firstChild.nodeValue === 'world');

    next = iterator.next();
    assert(!next);
  });

  it('should iterate over the TextNode within a collapsed Range', function () {
    let range = document.createRange();
    range.setStart(d.lastChild.firstChild, 2);
    range.setEnd(d.lastChild.firstChild, 2);
    assert(range.collapsed);

    let next;
    let iterator = new RangeIterator(range)
      .select(3 /* Node.TEXT_NODE */);

    next = iterator.next();
    assert(next.nodeValue === 'foo');

    next = iterator.next();
    assert(!next);
  });

  it('should iterate over the TextNodes and BR elements within a Range with multiple blocks', function () {
    d.innerHTML = '<p>hel<b>lo</b></p><p><b><br></b></p><p><b><br></b></p><p><b>wo</b>rld</p>';

    let range = document.createRange();
    range.setStart(d.firstChild.firstChild, 0);
    range.setEnd(d.lastChild.lastChild, 3);
    assert(!range.collapsed);
    assert.equal('helloworld', range.toString());

    let next;
    let iterator = new RangeIterator(range)
      .revisit(false)
      .select(3 /* Node.TEXT_NODE */)
      .select(function (node) {
        return 'BR' === node.nodeName;
      });

    next = iterator.next();
    assert(next.nodeValue === 'hel');

    next = iterator.next();
    assert(next.nodeValue === 'lo');

    next = iterator.next();
    assert(next.nodeName === 'BR');

    next = iterator.next();
    assert(next.nodeName === 'BR');

    next = iterator.next();
    assert(next.nodeValue === 'wo');

    next = iterator.next();
    assert(next.nodeValue === 'rld');

    next = iterator.next();
    assert(!next);
  });

  it('should iterate over the TextNodes within a Range that ends with the beginning of a P', function () {
    d.innerHTML = '<p>foo</p><p>bar</p>';

    let range = document.createRange();
    range.setStart(d.firstChild.firstChild, 0);
    range.setEnd(d.lastChild, 0);
    assert(!range.collapsed);
    assert.equal('foo', range.toString());

    let next;
    let iterator = new RangeIterator(range)
      .revisit(false)
      .select(3 /* Node.TEXT_NODE */);

    next = iterator.next();
    assert(next.nodeValue === 'foo');

    next = iterator.next();
    assert(!next);
  });

  describe('@@iterator', function () {

    it('should be an ES6 Iterable', function () {
      d.innerHTML = '<p>one</p><p>two</p><p>three</p>';

      let range = document.createRange();
      range.setStart(d.firstChild.firstChild, 0);
      range.setEnd(d.lastChild.firstChild, 5);
      assert(!range.collapsed);
      assert.equal('onetwothree', range.toString());

      let iterator = new RangeIterator(range)
        .revisit(false)
        .select(3 /* Node.TEXT_NODE */);

      // `Array.from()` and `[...iterator]` don't
      // work in babelify for some reason :(
      let count = 0;
      for (let node of iterator) {
        count++;
        switch (count) {
          case 1:
            assert.equal('one', node.nodeValue);
            continue;
          case 2:
            assert.equal('two', node.nodeValue);
            continue;
          case 3:
            assert.equal('three', node.nodeValue);
            continue;
          default:
            assert(0, 'should not happen');
            continue;
        }
      }
      assert.equal(3, count);
    });

  });

});
