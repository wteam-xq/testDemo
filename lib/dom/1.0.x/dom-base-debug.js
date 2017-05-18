/*!
 * JRaiser 2 Javascript Library
 * dom-base - v1.0.1 (2014-08-10T17:28:48+0800)
 * http://jraiser.org/ | Released under MIT license
 */
define(function(require, exports, module) { 'use strict';

/**
 * 本模块提供dom模块的基础接口
 * @module dom/1.0.x/dom-base
 * @catgory Infrastructure
 * @ignore
 */

var ID_ATTR_NAME = '_jRaiserNodeId_',	// 节点ID属性名
	autoId = 0,		// 节点ID递增值
	undefined,
	rMultiSpace = /\s+/;


// get first, set all
function access(elems, key, value, isExec, fns) {
	var len = elems.length, i;

	if (key != null && typeof key === 'object') {
		for (var k in key) {
			access(elems, k, key[k], isExec, fns);
		}
		return elems;
	}

	if (value !== undefined) {
		isExec = isExec && typeof value === 'function';

		i = -1;
		while (++i < len) {
			fns.set.call(elems, elems[i], key, isExec ?
				value.call(elems[i], fns.get.call(elems, elems[i], key), i) : value);
		}

		return elems;
	}

	return len ? fns.get.call(elems, elems[0], key) : null;
}


return {
	/**
	 * 检查对象是否DOM节点
	 * @method isNode
	 * @param {Any} obj 待测对象
	 * @return {Boolean} 待测对象是否DOM节点
	 */
	isNode: function(obj) { return obj.nodeType !== undefined; },

	/**
	 * 检查节点是否XML节点
	 * @method isXMLNode
	 * @param {Element} node 节点
	 * @return {Boolean} 节点是否XML节点
	 */
	isXMLNode: function(node) {
		var docElt = (node.ownerDocument || node).documentElement;
		return docElt ? docElt.nodeName !== 'HTML' : false;
	},

	/**
	 * 检查对象是否window对象
	 * @method isWindow
	 * @param {Any} obj 待测对象
	 * @return {Boolean} 待测对象是否window对象
	 */
	isWindow: function(obj) { return obj != null && obj == obj.window; },

	/**
	 * 获取节点所在的window
	 * @param {Element} node
	 * @return {Window|Boolean} 节点所在的window。如果不存在，则返回false
	 */
	getWindow: function(node) {
		return this.isWindow(node) ? node :
			(node.nodeType === 9 ? node.defaultView || node.parentWindow : false);
	},

	/**
	 * 生成不重复的节点编号
	 * @method uniqueId
	 * @param {Element} node 节点
	 * @param {Boolean} [autoSet=true] 节点id不存在时，是否生成id
	 * @return {Number} 节点编号
	 */
	uniqueId: function(node, autoSet) {
		var id = node[ID_ATTR_NAME];

		if (id === undefined && autoSet !== false) {
			// 在IE6-8，如果设置了一个值属性，则此属性会出现在innerHTML中，但对象属性则不会
			id = node[ID_ATTR_NAME] = new Number(++autoId);
		}

		return id ? id.valueOf() : id;
	},

	/**
	 * 移除节点编号属性
	 * @param {Element} node 节点
	 */
	removeUniqueId: function(node) {
		try {
			delete node[ID_ATTR_NAME];
		} catch(e) {
			node[ID_ATTR_NAME] = null;
		}
	},

	/**
	 * 把指定字符串以（一个或多个）空格为分隔符分割为数组
	 * @method splitBySpace
	 * @param {String|Array<String>} val 字符串（如果传入数组，则不执行分割操作）
	 * @return {Array<String>} 如果数组的长度为0，则返回null，否则返回数组
	 */
	splitBySpace: function(val) {
		if (typeof val === 'string') { val = val.split(rMultiSpace); }

		return val == null || val.length === 0 ? null : val;
	},

	/**
	 * Get First, Set All 访问器
	 * @method access
	 * @param {Any} elems 被访问元素集合
	 * @param {String|Object} key 键名。如果为Object类型，则对每个属性和值递归调用此函数
	 * @param {Any} [value] 值。如果为undefined，则为get first操作，否则为set all操作
	 * @param {Boolean} [isExec=false] 当value为函数时，是否执行函数并以函数返回值作为最终值
	 * @param {Object} fns get、set访问函数
	 *   @param {Function(first,key)} fns.get get操作函数，上下文为被访问元素集合
	 *   @param {Function(current,key,value)} fns.set set操作函数，上下文为被访问元素集合
	 * @return {Any} get first操作返回第一个元素键名对应的值；set all操作返回被访问元素集合
	 */
	access: access
};

});