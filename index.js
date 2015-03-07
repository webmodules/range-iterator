
/**
 * Module dependencies.
 */

import NodeIterator from 'node-iterator';

/**
 * Returns an ES6 Iterator that traverses between the start and end points
 * of a `Range` instance.
 *
 * @param {Range} range - Range instance to iterator over selected Nodes
 * @param {Number} [whatToShow] - Bitwise OR'd list of Filter specification constants from the NodeFilter DOM interface
 * @param {NodeFilter} [filter] - An object implementing the NodeFilter interface
 * @param {Boolean} [entityReferenceExpansion] - A flag that specifies whether entity reference nodes are expanded
 * @public
 */

function RangeIterator(range, whatToShow, filter, entityReferenceExpansion) {
  if (!range) throw new TypeError('a Range instance must be given');

  let startContainer = range.startContainer;
  let endContainer = range.endContainer;
  let start = range.commonAncestorContainer;
  let doc = start.ownerDocument;

  function acceptNode (node) {
    if (!withinRange(node)) return NodeFilter.FILTER_REJECT;
    if (!filter) return NodeFilter.FILTER_ACCEPT;
    return filter(node);
  }

  function withinRange(node) {
    return node === startContainer ||
      node === endContainer ||
      (Boolean(node.compareDocumentPosition(startContainer) & Node.DOCUMENT_POSITION_PRECEDING)
        &&
      Boolean(node.compareDocumentPosition(endContainer) & Node.DOCUMENT_POSITION_FOLLOWING));
  }

  return NodeIterator(start, whatToShow, acceptNode, entityReferenceExpansion);
}

/**
 * Module exports.
 */

module.exports = RangeIterator;
