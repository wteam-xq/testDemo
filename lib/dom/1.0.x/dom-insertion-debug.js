/*!
 * JRaiser 2 Javascript Library
 * dom-insertion - v1.0.0 (2014-07-15T12:35:11+0800)
 * http://jraiser.org/ | Released under MIT license
 */
define(function(require, exports, module) { 'use strict';

/**
 * dom-Insertion模块提供创建、插入节点的相关接口
 * @module dom/1.0.x/dom-insertion
 * @catgory Infrastructure
 * @ignore
 */

var base = require('base/1.0.x/'),
	$base = require('./dom-base'),
	$data = require('./dom-data'),
	$event = require('./dom-event'),
	Sizzle = require('./sizzle');


// 检测克隆节点的时候是否会克隆扩展属性
var willCloneExpando = (function() {
	var span = document.createElement('span');
	span._expando_ = 1;
	var result = '_expando_' in span.cloneNode(false);
	span = null;

	return result;
})();

// 如果会克隆扩展属性，就要通过outerHTML克隆，以避免克隆节点编号
var cloneNode = willCloneExpando ? function(node) {
	var html;
	if (node.nodeType === 11) {
		html = '';
		var child = node.firstChild;
		while (child) {
			html += child.outerHTML;
			child = child.nextSibling;
		}
	} else {
		html = node.outerHTML;
	}

	var div = node.ownerDocument.createElement('div');
	div.innerHTML = html;

	var result;
	if (div.firstChild !== div.lastChild) {
		result = node.ownerDocument.createDocumentFragment();
		while (div.firstChild) {
			result.appendChild(div.firstChild);
		}
	} else {
		result = div.removeChild(div.firstChild);
	}
	div = null;

	return result;
} : function(node) { return node.cloneNode(true) };

/**
 * 根据HTML创建节点
 * @method create
 * @param {String} html HTML代码
 * @param {Document} [ownerDocument] 节点所属文档对象，默认为当前文档对象
 * @return {Array<Element>} 节点数组
 */
function createNodes(html, ownerDocument) {
	var div = (ownerDocument || document).createElement('div'), result = [ ];
	div.innerHTML = html;

	var child = div.firstChild;
	while (child) {
		result.push( child.cloneNode(true) );
		child = child.nextSibling;
	}

	div = null;

	return result;
}

/**
 * 创建包含指定节点的文档片段
 * @method buildFragment
 * @param {Array<Element>} nodes 文档片段包含的节点
 * @param {Document} [ownerDocument] 文档片段所属的文档对象，默认为当前文档对象
 * @return {DocumentFragment} 文档片段
 */
function buildFragment(nodes, ownerDocument) {
	var frag = (ownerDocument || document).createDocumentFragment();
	nodes = base.toArray(nodes);
	for (var i = 0; i < nodes.length; i++) {
		frag.appendChild(nodes[i]);
	}

	return frag;
}

// 如果有多个节点，返回包含这几个节点的文档片段；
// 如果只有一个节点，则返回此节点
function explainNodes(target, ownerDocument) {
	if (typeof target === 'string') {
		target = createNodes(target, ownerDocument);
	} else if ( $base.isNode(target) ) {
		return target;
	}

	return target.length > 1 ? buildFragment(target, ownerDocument) : target[0];
}


/**
 * 把目标节点插入为参考节点的最后一个子节点
 * @method appendChild
 * @param {String|Element|Array<Element>|DocumentFragment} targetNodes 目标节点
 * @param {Element} parentNode 参考节点
 * @return {Element|DocumentFragment} 目标节点
 */
// isPass参数仅用于在循环调用中忽略对目标节点的重复解析
function appendChild(targetNodes, parentNode, isPass) {
	if (!parentNode) { return; }
	if (!isPass) { targetNodes = explainNodes(targetNodes, parentNode.ownerDocument); }

	parentNode.appendChild(targetNodes);

	return targetNodes;
}

/**
 * 把目标节点插入为参考节点的第一个子节点
 * @method preprendChild
 * @param {String|Element|Array<Element>|DocumentFragment} targetNodes 目标节点
 * @param {Element} parentNode 参考节点
 * @return {Element|DocumentFragment} 目标节点
 */
// isPass参数仅用于在循环调用中忽略对目标节点的重复解析
function prependChild(targetNodes, parentNode, isPass) {
	if (!parentNode) { return; }
	if (!isPass) { targetNodes = explainNodes(targetNodes, parentNode.ownerDocument); }

	var firstChild = parentNode.firstChild;
	if (firstChild) {
		parentNode.insertBefore(targetNodes, firstChild);
	} else {
		parentNode.appendChild(targetNodes);
	}

	return targetNodes;
}

/**
 * 在参考节点之前插入目标节点
 * @method insertBefore
 * @param {String|Element|Array<Element>|DocumentFragment} targetNodes 目标节点
 * @param {Element} refNode 参考节点
 * @return {Element|DocumentFragment} 目标节点
 */
// isPass参数仅用于在循环调用中忽略对目标节点的重复解析
function insertBefore(targetNodes, refNode, isPass) {
	if (!isPass) { targetNodes = explainNodes(targetNodes, refNode.ownerDocument); }
	if (!refNode.parentNode) { return; }

	refNode.parentNode.insertBefore(targetNodes, refNode);

	return targetNodes;
}

/**
 * 在参考节点之后插入目标节点
 * @method insertAfter
 * @param {String|Element|Array<Element>|DocumentFragment} targetNodes 目标节点
 * @param {Element} refNode 参考节点
 * @return {Element|DocumentFragment} 目标节点
 */
// isPass参数仅用于在循环调用中忽略对目标节点的重复解析
function insertAfter(targetNodes, refNode, isPass) {
	var parentNode = refNode.parentNode;
	if (!parentNode) { return; }
	if (!isPass) { targetNodes = explainNodes(targetNodes, refNode.ownerDocument); }

	var nextSibling = refNode.nextSibling;
	if (nextSibling) {
		parentNode.insertBefore(targetNodes, nextSibling);
	} else {
		parentNode.appendChild(targetNodes);
	}

	return targetNodes;
}

/**
 * 把参考节点替换成目标节点
 * @method replaceWith
 * @param {String|Element|Array<Element>|DocumentFragment} targetNodes 目标节点
 * @param {Element} refNode 参考节点
 * @return {Element|DocumentFragment} 目标节点
 */
// isPass参数仅用于在循环调用中忽略对目标节点的重复解析
function replaceWith(targetNodes, refNode, isPass) {
	if (!isPass) { targetNodes = explainNodes(targetNodes, refNode.ownerDocument); }
	if (!refNode.parentNode) { return; }

	refNode.parentNode.replaceChild(targetNodes, refNode);
}

// 对指定节点进行操作
function doWithGivenNodes(nodes, givenNodes, fn, condition) {
	var targetNodes, refNode;

	for (var i = 0; i < nodes.length; i++) {
		if (!condition || condition.call(nodes, nodes[i], i) !== false) {
			if (!targetNodes) { targetNodes = explainNodes(givenNodes); }
			fn.call(nodes,
				i < nodes.length - 1 ? cloneNode(targetNodes) : targetNodes, nodes[i]
			);
		}
	}

	targetNodes = null;

	return nodes;
}

// 对当前节点进行操作
function doWithCurrentNodes(nodes, currentNodes, fn, condition) {
	var result = [ ], targetNodes;

	if (typeof nodes === 'string') {
		nodes = Sizzle(nodes);
	} else if ( $base.isNode(nodes) ) {
		nodes = [nodes];
	} else {
		nodes = base.toArray(nodes);
	}

	for (var i = 0; i < nodes.length; i++) {
		if (!condition || condition.call(nodes, nodes[i], i) !== false) {
			targetNodes = i < nodes.length - 1 ? currentNodes.clone() : currentNodes;
			targetNodes.forEach(function(node) {
				result.push(node);
			});
			fn.call(nodes, buildFragment(targetNodes), nodes[i]);
		}
	}

	return Sizzle.uniqueSort(result);
}

// 清理节点数据
function clearData(node) {
	var id = $base.uniqueId(node, false);
	if (id) {
		$data.removeData(node);
		$event.off(node);
		$base.removeUniqueId(node);
	}
}


return {
	// See line 63
	create: createNodes,

	// See line 85
	buildFragment: buildFragment,

	// See line 115
	appendChild: appendChild,

	// See line 132
	prependChild: prependChild,

	// See line 154
	insertBefore: insertBefore,

	// See line 171
	insertAfter: insertAfter,

	// See line 194
	replaceWith: replaceWith,

	shortcuts: {
		/**
		 * 在当前所有节点的最后一个子节点后插入目标节点（或其克隆节点）
		 * @method append
		 * @for NodeList
		 * @param {String|Element|Array<Element>|DocumentFragment} nodes 目标节点
		 * @return {NodeList} 当前节点集合
		 */
		append: function(nodes) {
			return doWithGivenNodes(this, nodes, function(targetNodes, refNode) {
				appendChild(targetNodes, refNode, true);
			}, function(refNode) {
				return refNode.nodeType === 1;
			});
		},

		/**
		 * 在目标节点的最后一个子节点后插入当前所有节点（或其克隆节点）
		 * @method appendTo
		 * @for NodeList
		 * @param {String|Element|Array<Element>|DocumentFragment} nodes 目标节点
		 * @return {NodeList} 当前节点集合
		 */
		appendTo: function(nodes) {
			return new this.constructor(
				doWithCurrentNodes(nodes, this, function(targetNodes, refNode) {
					appendChild(targetNodes, refNode, true);
				}, function(refNode) {
					return refNode.nodeType === 1;
				})
			);
		},

		/**
		 * 在当前所有节点的第一个子节点前插入目标节点（或其克隆节点）
		 * @method prepend
		 * @for NodeList
		 * @param {String|Element|Array<Element>|DocumentFragment} nodes 目标节点
		 * @return {NodeList} 当前节点集合
		 */
		prepend: function(nodes) {
			return doWithGivenNodes(this, nodes, function(targetNodes, refNode) {
				prependChild(targetNodes, refNode, true);
			}, function(refNode) {
				return refNode.nodeType === 1;
			});
		},

		/**
		 * 在目标节点的第一个子节点前插入当前所有节点（或其克隆节点）
		 * @method prependTo
		 * @for NodeList
		 * @param {String|Element|Array<Element>|DocumentFragment} nodes 目标节点
		 * @return {NodeList} 当前节点集合
		 */
		prependTo: function(nodes) {
			return new this.constructor(
				doWithCurrentNodes(nodes, this, function(targetNodes, refNode) {
					prependChild(targetNodes, refNode, true);
				}, function(refNode) {
					return refNode.nodeType === 1;
				})
			);
		},

		/**
		 * 在当前所有节点之后插入目标节点（或其克隆节点）
		 * @method after
		 * @for NodeList
		 * @param {String|Element|Array<Element>|DocumentFragment} nodes 目标节点
		 * @return {NodeList} 当前节点集合
		 */
		after: function(nodes) {
			return doWithGivenNodes(this, nodes, function(targetNodes, refNode) {
				insertAfter(targetNodes, refNode, true);
			});
		},

		/**
		 * 把当前节点插入到目标节点之后
		 * @method insertAfter
		 * @for NodeList
		 * @param {String|Element|Array<Element>|DocumentFragment} nodes 目标节点
		 * @return {NodeList} 当前节点集合
		 */
		insertAfter: function(nodes) {
			return new this.constructor(
				doWithCurrentNodes(nodes, this, function(targetNodes, refNode) {
					insertAfter(targetNodes, refNode, true);
				})
			);
		},

		/**
		 * 在当前所有节点之前插入目标节点（或其克隆节点）
		 * @method before
		 * @for NodeList
		 * @param {String|Element|Array<Element>|DocumentFragment} nodes 目标节点
		 * @return {NodeList} 当前节点集合
		 */
		before: function(nodes) {
			return doWithGivenNodes(this, nodes, function(targetNodes, refNode) {
				insertBefore(targetNodes, refNode, true);
			});
		},

		/**
		 * 把当前节点插入到目标节点之前
		 * @method insertBefore
		 * @for NodeList
		 * @param {String|Element|Array<Element>|DocumentFragment} nodes 目标节点
		 * @return {NodeList} 当前节点集合
		 */
		insertBefore: function(nodes) {
			return new this.constructor(
				doWithCurrentNodes(nodes, this, function(targetNodes, refNode) {
					insertBefore(targetNodes, refNode, true);
				})
			);
		},

		/**
		 * 把当前节点替换为目标节点（或其克隆节点）
		 * @method replaceWith
		 * @for NodeList
		 * @param {String|Element|Array<Element>|DocumentFragment} nodes 目标节点
		 * @return {NodeList} 当前节点集合
		 */
		replaceWith: function(nodes) {
			return doWithGivenNodes(this, nodes, function(targetNodes, refNode) {
				replaceWith(targetNodes, refNode, true);
			});
		},

		/**
		 * 把目标节点替换为当前节点（或其克隆节点）
		 * @method replaceAll
		 * @for NodeList
		 * @param {String|Element|Array<Element>|DocumentFragment} nodes 目标节点
		 * @return {NodeList} 当前节点集合
		 */
		replaceAll: function(nodes) {
			return new this.constructor(
				doWithCurrentNodes(nodes, this, function(targetNodes, refNode) {
					replaceWith(targetNodes, refNode, true);
				})
			);
		},

		/**
		 * 把当前所有节点从其文档树中移除（保留自定义数据和事件回调）
		 * @method detach
		 * @for NodeList
		 * @return {NodeList} 当前节点集合
		 */
		detach: function() {
			this.forEach(function(node) { node.parentNode.removeChild(node); });

			return this;
		},

		/**
		 * 把当前所有节点从其文档树中移除（清除自定义数据和事件回调）
		 * @method remove
		 * @for NodeList
		 * @return {NodeList} 当前节点集合
		 */
		remove: function() {
			this.forEach(function(node) {
				if (node.nodeType === 1) {
					var innerNodes = node.getElementsByTagName('*');
					for (var i = innerNodes.length - 1; i >= 0; i--) {
						clearData(innerNodes[i]);
					}
				}

				clearData(node);
				if (node.parentNode) { node.parentNode.removeChild(node); }
			});

			return this;
		},

		/**
		 * 移除当前所有节点下的所有子节点
		 * @method empty
		 * @for NodeList
		 * @return {NodeList} 当前节点集合
		 */
		empty: function() {
			this.forEach(function(node) {
				if (node.nodeType === 1) {
					var innerNodes = node.getElementsByTagName('*');
					for (var i = innerNodes.length - 1; i >= 0; i--) {
						clearData(innerNodes[i]);
					}
				}

				while (node.firstChild) {
					node.removeChild(node.firstChild);
				}

				// from jQuery:
				//   If this is a select, ensure that it displays empty (#12336)
				//   Support: IE<9
				if (node.options && node.nodeName ===  'SELECT') {
					node.options.length = 0;
				}
			});

			return this;
		},

		/**
		 * 返回当前所有节点的克隆副本
		 * @for NodeList
		 * @return {NodeList} 当前所有节点的克隆副本
		 */
		clone: function() {
			var copy = [ ];
			this.forEach(function(node, i) {
				copy[i] = cloneNode(node);
			});

			return new this.constructor(copy);
		}
	}
};

});