/*!
 * JRaiser 2 Javascript Library
 * dom - v1.0.0 (2014-08-17T20:25:32+0800)
 * http://jraiser.org/ | Released under MIT license
 */
define(function(require, exports, module) { 'use strict';

/**
 * 本模块提供选择器查询接口及节点集合类型
 * @module dom/1.0.x/
 * @category Infrastructure
 * @includeFor {NodeList} ./dom-animation-debug.js,
 *   ./dom-attr-debug.js,
 *   ./dom-data-debug.js,
 *   ./dom-event-debug.js,
 *   ./dom-insertion-debug.js,
 *   ./dom-offset-debug.js,
 *   ./dom-style-debug.js,
 *   ./dom-traversal-debug.js
 */

var base = require('base/1.0.x/'), Sizzle = require('./sizzle'),
	$base = require('./dom-base'),
	$data = require('./dom-data'),
	$attr = require('./dom-attr'),
	$style = require('./dom-style'),
	$offset = require('./dom-offset'),
	$event = require('./dom-event'),
	$insertion = require('./dom-insertion'),
	$traversal = require('./dom-traversal'),
	$animation = require('./dom-animation'),
	$ready = require('./dom-ready');


var isWindow = $base.isWindow, isNode = $base.isNode;

// 根据选择器以及上下文查找节点
function querySelector(selector, context) {
	if ( context != null && context.length && !isNode(context) && !isWindow(context) ) {
		// 有多个context，逐个对selector进行匹配
		var i = -1, len = context.length, ret = [ ];
		while (++i < len) {
			Sizzle(selector, context[i], ret);
		}
		if (len > 1) {
			// 元素多于一个的情况下，有可能出现重复元素
			Sizzle.uniqueSort(ret);
		}
		return ret;
	} else {
		return Sizzle(selector, context);
	}
}


// 根据选择器以及上下文查找节点（对selector进行重载）
function query(selector, context) {
	var ret;

	if (null == selector) {
		ret = [ ];
	} else if (typeof selector === 'string') {
		ret = selector.charAt(0) === '<' &&
			selector.charAt(selector.length - 1) === '>' &&
			selector.length >= 3 ?
			$insertion.create(selector, context) : querySelector(selector, context);
	} else if ( isNode(selector) || isWindow(selector) ) {
		ret = [selector];
	} else {
		ret = base.toArray(selector);
	}

	return ret;
}


var arrProto = Array.prototype;

/**
 * 节点集合类
 * @class NodeList
 * @constructor
 * @param {Array<Element>|ArrayLike<Element>} nodes 节点（类）数组
 */
var NodeList = base.createClass(function(nodes) {
	var i = -1, len = nodes ? nodes.length : 0;
	while (++i < len) {
		if ( nodes[i] ) { this[i] = nodes[i]; }
	}
	this.length = len;
}, {
	/**
	 * 返回指定位置的节点
	 * @method get
	 * @for NodeList
	 * @param {Number} [i=0] 位置下标。如果为负数，则从集合中的最后一个节点开始倒数
	 * @return {Element} 指定节点
	 */
	get: function(i) {
		i = parseInt(i) || 0;
		return i < 0 ? this[this.length + i] : this[i];
	},

	/**
	 * 返回由指定位置节点组成的NodeList集合
	 * @method eq
	 * @for NodeList
	 * @param {Number} [i=0] 位置下标。如果为负数，则从集合中的最后一个节点开始倒数
	 * @return {NodeList} 由指定节点组成的NodeList集合
	 */
	eq: function(i) {
		var node = this.get.apply(this, arguments);
		return new this.constructor(node ? [node] : null);
	},

	/**
	 * 获取由当前节点集合第一个节点组成的NodeList集合
	 * @method first
	 * @for NodeList
	 * @return {NodeList} 由当前节点集合第一个节点组成的NodeList集合
	 */
	first: function() { return this.eq(0); },

	/**
	 * 获取由当前节点集合最后一个节点组成的NodeList集合
	 * @method last
	 * @for NodeList
	 * @return {NodeList} 由当前节点集合最后一个节点组成的NodeList集合
	 */
	last: function() { return this.eq(-1); },

	/**
	 * 以当前节点集合为上下文，根据选择器匹配节点
	 * @method find
	 * @for NodeList
	 * @param {String} selector 选择器
	 * @return {NodeList} 由匹配到的节点组成的NodeList集合
	 */
	find: function(selector) {
		return new this.constructor( querySelector(selector, this) );
	},

	/**
	 * 从当前节点集合中过滤出符合指定规则的节点
	 * @method filter
	 * @for NodeList
	 * @param {String|Function} selector 选择器或过滤函数
	 * @return {NodeList} 由过滤出的节点组成的NodeList集合
	 */
	filter: function(selector) {
		return new this.constructor(
			typeof selector === 'function' ?
				arrProto.filter.apply(this, arguments) : Sizzle.matches(selector, this)
		);
	},

	/**
	 * 返回包含当前节点及匹配到的新节点的NodeList集合（无重复节点），参数同$函数
	 * @method add
	 * @for NodeList
	 * @return {NodeList} 包含当前节点和新节点的NodeList集合
	 */
	add: function(selector, context) {
		return new this.constructor(
			Sizzle.uniqueSort(
				arrProto.concat.call( arrProto.slice.call(this), query(selector, context) )
			)
		);
	},

	/**
	 * 对当前节点集合进行唯一性筛选并排序
	 * @method uniqueSort
	 * @for NodeList
	 * @return {NodeList} 当前节点集合
	 */
	uniqueSort: function() {
		Sizzle.uniqueSort(this);
		return this;
	},

	/**
	 * 对当前节点集合中的每个节点执行指定操作
	 * @method each
	 * @for NodeList
	 * @param {Function(node,index,nodeList)} fn 操作函数。当函数返回值为false时，遍历中断
	 * @return {NodeList} 当前节点集合
	 */
	each: function(fn) { return base.each(this, fn); },

	/**
	 * 返回由当前节点集合中指定位置之间的节点组成的新NodeList集合
	 * @method slice
	 * @for NodeList
	 * @param {Number} begin 开始位置
	 * @param {Number} [end] 结束位置
	 * @return {NodeList} 新NodeList集合
	 */
	slice: function(begin, end) {
		return new this.constructor( arrProto.slice.apply(this, arguments) );
	},

	/**
	 * 在当前节点集合中搜索指定节点，参数及返回值与Array.prototype.indexOf一致
	 * @method indexOf
	 * @for NodeList
	 */
	indexOf: arrProto.indexOf,

	/**
	 * 对当前节点集合进行排序，参数及返回值与Array.prototype.sort一致
	 * @method sort
	 * @for NodeList
	 */
	sort: arrProto.sort,

	/**
	 * 对当前节点集合中的每个节点执行指定操作，参数及返回值与Array.prototype.forEach一致
	 * @method forEach
	 * @for NodeList
	 */
	forEach: arrProto.forEach
});


// 接口工厂
function exportsFactory(exts, ParentNodeList) {
	var subPrototype = { };
	if (exts && exts.length) {
		exts = exts.slice();
		exts.unshift(subPrototype);
		base.extend.apply(base, exts);
		exts = null;
	}
	var SubNodeList = base.createClass(function() { }, subPrototype, ParentNodeList || NodeList);
	subPrototype = null;

	/**
	 * 根据选择器及上下文匹配节点
	 * @method $
	 * @exports
	 * @param {String} selector 选择器
	 * @param {Element|Array<Element>|ArrayLike<Element>} [context] 上下文
	 * @return {NodeList} 由匹配到的节点组成的NodeList集合
	 */
	/**
	 * 使用指定节点创建NodeList对象
	 * @method $
	 * @exports
	 * @param {Element|Array<Element>|ArrayLike<Element>} nodes 节点
	 * @return {NodeList} 以指定节点创建的NodeList集合
	 */
	/**
	 * 根据HTML创建节点
	 * @method $
	 * @exports
	 * @param {String} html HTML
	 * @param {Document} [ownerDocument] 节点所在文档，默认为document
	 * @return {NodeList} 以指定节点创建的NodeList集合
	 */
	/**
	 * 在DOMReady之后执行指定操作
	 * @method $
	 * @exports
	 * @param {Function} fn 操作函数
	 */
	var $ = function(selector, context) {
		return typeof selector === 'function' ?
			$ready(selector) : new SubNodeList( query(selector, context) );
	};

	return base.extend($, {
		// See line 82
		NodeList: SubNodeList,

		/**
		 * 生成一套包含扩展NodeList类的模块接口
		 * @method plugin
		 * @param {Array<Object>} exts NodeList类的扩展方法
		 * @return {Object} 包含扩展NodeList类的模块接口
		 */
		plugin: function(exts) {
			return exportsFactory(exts, this.NodeList);
		}
	});
}


return exportsFactory(
	[
		$data,
		$attr,
		$style,
		$offset,
		$event,
		$traversal,
		$insertion,
		$animation
	].map(function(module) { return module.shortcuts; })
);

});