
/**
 * Module dependencies.
 */

import NodeIterator from 'node-iterator';
import normalize from 'range-normalize';

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

  let r = normalize(range.cloneRange());
  let startContainer = r.startContainer;
  let endContainer = r.endContainer;
  let start = r.commonAncestorContainer;
  let doc = start.ownerDocument;
  r = null;

  function acceptNode (node) {
    if (!withinRange(node)) return NodeFilter.FILTER_REJECT;
    if (!filter) return NodeFilter.FILTER_ACCEPT;
    return filter(node);
  }

  function withinRange(node) {
    if (node === startContainer || node === endContainer) return true;
    let s = node.compareDocumentPosition(startContainer);
    let e = node.compareDocumentPosition(endContainer);
    return (
      (s & Node.DOCUMENT_POSITION_PRECEDING || s & Node.DOCUMENT_POSITION_CONTAINS)
        &&
      (e & Node.DOCUMENT_POSITION_FOLLOWING || e & Node.DOCUMENT_POSITION_CONTAINS)
    );
  }

  return NodeIterator(start, whatToShow, acceptNode, entityReferenceExpansion);
}

/**
 * Module exports.
 */

module.exports = RangeIterator;
