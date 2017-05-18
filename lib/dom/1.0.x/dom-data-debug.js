/*!
 * JRaiser 2 Javascript Library
 * dom-data - v1.0.0 (2014-05-06T10:57:25+0800)
 * http://jraiser.org/ | Released under MIT license
 */
define(function(require, exports, module) { 'use strict';

/**
 * 本模块提供节点自定义数据存取接口
 * @module dom/1.0.x/dom-data
 * @catgory Infrastructure
 * @ignore
 */

var base = require('base/1.0.x/'),
	$base = require('./dom-base'),
	uniqueId = $base.uniqueId;


// 存放自定义节点数据
var nodeData = { };

/**
 * 获取节点自定义数据
 * @method getData
 * @param {Element} node 节点
 * @param {String} key 数据名
 * @return {Any} 数据值
 */
function getData(node, key) {
	var id = uniqueId(node);
	return nodeData[id] ? nodeData[id][key] : null;
}

/**
 * 设置节点自定义数据
 * @method setData
 * @param {Element} node 节点
 * @param {String} key 数据名
 * @param {Any} val 数据值
 */
function setData(node, key, val) {
	var id = uniqueId(node), data = nodeData[id] = nodeData[id] || { };
	data[key] = val;
}

/**
 * 移除节点自定义数据
 * @method removeData
 * @param {Element} node 节点
 * @param {String|Array<String>} key 数据名。如果为空，则移除所有自定义数据；
 *   多个数据名用空格隔开，或者以数组传入
 */
// isPass参数主要用于循环调用时，忽略对数据名的重复解析
function removeData(node, key, isPass) {
	if ( base.isEmptyObject(nodeData) ) { return; }

	var id = uniqueId(node);
	if (key == null || key === '') {
		delete nodeData[id];
	} else {
		var data = nodeData[id];
		if (data) {
			if (!isPass) { key = $base.splitBySpace(key); }
			key.forEach(function(k) {
				delete data[k];
			});
			if ( base.isEmptyObject(data) ) {
				delete nodeData[id];
			}
		}
	}
}


return {
	// See line 23
	getData: getData,

	// See line 35
	setData: setData,

	// See line 47
	removeData: removeData,

	shortcuts: {
		/**
		 * 获取当前节点集合中第一个节点的自定义数据
		 * @method data
		 * @for NodeList
		 * @param {String} key 数据名
		 * @return {Any} val 数据值
		 */
		/**
		 * 设置当前所有节点的自定义数据
		 * @method data
		 * @for NodeList
		 * @param {String} key 数据名
		 * @param {Any} val 数据值
		 * @return {NodeList} 当前节点集合
		 */
		/**
		 * 设置当前所有节点的自定义数据
		 * @method data
		 * @for NodeList
		 * @param {Object} data 数据字典
		 * @return {NodeList} 当前节点集合
		 */
		data: function(key, val) {
			return $base.access(this, key, val, true, {
				get: getData,
				set: setData
			});
		},

		/**
		 * 移除当前所有节点的指定自定义数据
		 * @method removeData
		 * @for NodeList
		 * @param {String|Array<String>} [keys] 数据名。如果为空，则移除所有自定义数据；
		 *   多个数据名用空格隔开，或者以数组传入
		 * @return {NodeList} 当前节点集合
		 */
		removeData: function(keys) {
			keys = $base.splitBySpace(keys);

			this.forEach(function(node) {
				removeData(node, keys, true);
			});

			return this;
		}
	}
};

});