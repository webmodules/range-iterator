/// <reference path='types.d.ts' />

/**
 * TypeScript dependencies.
 */

import DomIterator = require('dom-iterator');

/**
 * A DOM Iterator that traverses between the start and end points
 * of a `Range` instance.
 *
 * @class
 * @public
 */

class RangeIterator extends DomIterator {
  startContainer: Node;
  endContainer: Node;

  constructor(range: Range) {
    if (!range) throw new TypeError('a Range instance is required!');

    this.startContainer = range.startContainer;
    this.endContainer = range.endContainer;

    var start = range.commonAncestorContainer;

    // if a TextNode is selected, then grab the text node's
    // parent as the start node
    if (start.nodeType === 3 /* TEXT_NODE */) {
      start = start.parentNode;
    }

    super(start, null);
  }

  /**
   * `selects()` override function to ensure that `node` is within the
   * Range selection. We need to override instead of appending to the "selects"
   * list because the list is a OR list, and in this case we want AND logic.
   *
   * @param {Node} node
   * @param {Boolean} peek
   * @return {Boolean}
   * @public
   */

  public selects (node: Node, peek: boolean): boolean {
    return this.withinRange(node) && super.selects(node, peek);
  }

  /**
   * Returns `true` when `node` is within the range's selection,
   * returns `false` otherwise.
   *
   * @param {Node} node
   * @return {Boolean}
   * @public
   */

  public withinRange (node: Node): boolean {
    return node === this.startContainer ||
      node === this.endContainer ||
      (Boolean(node.compareDocumentPosition(this.startContainer) & Node.DOCUMENT_POSITION_PRECEDING)
        &&
      Boolean(node.compareDocumentPosition(this.endContainer) & Node.DOCUMENT_POSITION_FOLLOWING));
  }
}

export = RangeIterator;
