/*!
 * JRaiser 2 Javascript Library
 * dom-offset - v1.0.0 (2013-08-17T21:28:07+0800)
 * http://jraiser.org/ | Released under MIT license
 */
define(function(require, exports, module) { 'use strict';

/**
 * 本模块提供节点位置接口
 * @module dom/1.0.x/dom-offset
 * @catgory Infrastructure
 * @ignore
 */

var Sizzle = require('./sizzle'),
	$base = require('./dom-base'),
	$style = require('./dom-style');


// 检查body的定位中是否包含margin
var doesNotIncludeMarginInBodyOffset = true;
function checkFeature() {
	var body = document.body;
	if (body) {
		doesNotIncludeMarginInBodyOffset = body.offsetTop === 0;
	} else {
		setTimeout(checkFeature, 5);
	}
}
checkFeature();


/**
 * 获取节点相对于document的位置
 * @method getOffset
 * @param {Element} node 节点
 * @return {Object} 位置（top、left）
 */
function getOffset(node) {
	if ( $base.isWindow(node) || node.nodeType === 9) { return null; }

	var doc = node.ownerDocument, docElt = doc.documentElement, body = doc.body;

	// 检查节点是否在文档中
	if ( !Sizzle.contains(docElt, node) ) {
		return { top: 0, left: 0 };
	}

	if (node === document.body) {
		var top = body.offsetTop, left = body.offsetLeft;

		if (doesNotIncludeMarginInBodyOffset) {
			top  += parseFloat( $style.getStyle(node, 'marginTop') ) || 0;
			left += parseFloat( $style.getStyle(node, 'marginLeft') ) || 0;
		}

		return { top: top, left: left };
	} else {
		var box = node.getBoundingClientRect(), win = $base.getWindow(doc);
		return {
			top: box.top  +
				(win.pageYOffset || docElt.scrollTop)  - (docElt.clientTop || body.clientTop || 0),
			left: box.left +
				(win.pageXOffset || docElt.scrollLeft) - (docElt.clientLeft || body.clientLeft || 0)
		};
	}
}


var rRoot = /^(?:body|html)$/i;

/**
 * 获取离指定节点最近的采用特殊定位的祖先节点
 * @method getOffsetParent
 * @param {Element} node 指定节点
 * @return {Element} 祖先节点
 */
function getOffsetParent(node) {
	var offsetParent = node.offsetParent || document.body;
	while (offsetParent &&
		(!rRoot.test(offsetParent.nodeName) &&
		$style.getStyle(offsetParent, 'position') === 'static')
	) {
		offsetParent = offsetParent.offsetParent;
	}

	return offsetParent || document.body;
}

/**
 * 获取节点相对于offset parent的位置
 * @method getPosition
 * @param {Element} node 节点
 * @return {Object} 位置（top、left）
 */
function getPosition(node) {
	if ( $base.isWindow(node) || node.nodeType === 9) { return null; }

	var offsetParent = getOffsetParent(node),
		offset = getOffset(node),
		parentOffset = rRoot.test(offsetParent.nodeName) ?
			{ top: 0, left: 0 } : getOffset(offsetParent);

	// Subtract element margins
	// note: when an element has margin: auto the offsetLeft and marginLeft
	// are the same in Safari causing offset.left to incorrectly be 0
	offset.top -= parseFloat( $style.getStyle(node, 'marginTop') ) || 0;
	offset.left -= parseFloat( $style.getStyle(node, 'marginLeft') ) || 0;

	// Add offsetParent borders
	parentOffset.top += parseFloat( $style.getStyle(offsetParent, 'borderTopWidth') ) || 0;
	parentOffset.left += parseFloat( $style.getStyle(offsetParent, 'borderLeftWidth') ) || 0;

	// Subtract the two offsets
	return {
		top: offset.top - parentOffset.top,
		left: offset.left - parentOffset.left
	};
}


return {
	// See line 33
	getOffset: getOffset,

	// See line 72
	getOffsetParent: getOffsetParent,

	// See line 90
	getPosition: getPosition,

	shortcuts: {
		/**
		 * 获取当前第一个节点的offsetParent
		 * @method offsetParent
		 * @for NodeList
		 * @return {Element} offsetParent
		 */
		offsetParent: function() {
			if (this[0]) {
				return new this.constructor( [getOffsetParent(this[0])] );
			}
		},

		/**
		 * 获取当前第一个节点相对于document的位置
		 * @method offset
		 * @for NodeList
		 * @return {Object} 位置（top、left）
		 */
		offset: function() {
			if (this[0]) { return getOffset(this[0]); }
		},

		/**
		 * 获取当前第一个节点相对于offset parent的位置
		 * @method position
		 * @for NodeList
		 * @return {Object} 位置（top、left）
		 */
		position: function() {
			if (this[0]) { return getPosition(this[0]); }
		}
	}
};

});