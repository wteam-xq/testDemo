/*!
 * JRaiser 2 Javascript Library
 * dom-attr - v1.0.0 (2014-05-06T10:56:52+0800)
 * http://jraiser.org/ | Released under MIT license
 */
define(function(require, exports, module) { 'use strict';

/**
 * 本模块提供节点属性、特性操作接口
 * @module dom/1.0.x/dom-attribute
 * @catgory Infrastructure
 * @ignore
 */

var $base = require('./dom-base');


// 特殊属性名映射
var attrMap = !document.documentElement.hasAttribute ? {
	'for': 'htmlFor',
	'class': 'className'
} : {
	'htmlFor': 'for',
	'className': 'class'
};

// 特殊属性访问
var attrHooks = { };
if ('cssText' in document.documentElement.style) {
	attrHooks.style = {
		get: function(node) { return node.style.cssText; },
		set: function(node, val) { node.style.cssText = val; }
	};
}

// 修复属性名
function fixAttrName(node, name) {
	if ( !$base.isXMLNode(node) ) { name = name.toLowerCase(); }
	return attrMap[name] || name;
}

/**
 * 获取节点属性值
 * @method getAttr
 * @param {Element} node 节点
 * @param {String} name 属性名
 * @return {String} 属性值
 */
function getAttr(node, name) {
	var trueName = fixAttrName(node, name), result = (attrHooks[trueName] || 0).get;
	if (result) {
		return result(node);
	} else {
		result = node.getAttribute(trueName);
		return typeof result === 'boolean' ? (result ? name.toLowerCase() : '') : result;
	}
}

/**
 * 设置节点属性值
 * @method setAttr
 * @param {Element} node 节点
 * @param {String} name 属性名
 * @param {String} val 属性值
 */
function setAttr(node, name, val) {
	var trueName = fixAttrName(node, name), hook = (attrHooks[trueName] || 0).set;
	if (hook) {
		return hook(node, val);
	} else {
		var isRemove;
		if (typeof val === 'boolean') {
			setProp(node, name, val);
			if (val) {
				name = name.toLowerCase();
			} else {
				isRemove = true;
			}
		}

		if (isRemove) {
			removeAttr(node, [name], true);
		} else {
			node.setAttribute(trueName, val);
		}
	}
}

/**
 * 移除节点属性
 * @method removeAttr
 * @param {Element} node 节点
 * @param {String|Array<String>} names 属性名。多个属性名用空格隔开，或者以数组传入
 */
// isPass参数主要用于循环调用时，忽略对属性名的重复解析
function removeAttr(node, names, isPass) {
	if (!isPass) { names = $base.splitBySpace(names); }

	names.forEach(function(name) {
		node.removeAttribute( fixPropName(node, name) );
	});
}


// 特性映射
var propMap = {
	'tabindex': 'tabIndex',
	'readonly': 'readOnly',
	'maxlength': 'maxLength',
	'cellspacing': 'cellSpacing',
	'cellpadding': 'cellPadding',
	'rowspan': 'rowSpan',
	'colspan': 'colSpan',
	'usemap': 'useMap',
	'frameborder': 'frameBorder',
	'contenteditable': 'contentEditable',
	'for': 'htmlFor',
	'class': 'className'
};

// 是否支持特性访问
function isSupportProp(node) { return !$base.isXMLNode(node) && node.nodeType === 1; }

// 修复特性名
function fixPropName(node, name) { return propMap[name] || name; }

/**
 * 获取节点特性值
 * @method getProp
 * @param {Element} node 节点
 * @param {String} name 特性名
 * @return {Any} 特性值
 */
function getProp(node, name) {
	return isSupportProp(node) ? node[fixPropName(node, name)] : null;
}

/**
 * 设置节点特性值
 * @method setProp
 * @param {Element} node 节点
 * @param {String} name 特性名
 * @param {Any} val 特性值
 */
function setProp(node, name, val) {
	if ( isSupportProp(node) ) { node[fixPropName(node, name)] = val; }
}

/**
 * 移除节点特性
 * @method removeProp
 * @param {Element} node 节点
 * @param {String|Array<String>} names 特性名。多个特性名用空格隔开，或者以数组传入
 */
// isPass参数主要用于循环调用时，忽略对特性名的重复解析
function removeProp(node, names, isPass) {
	if (!isPass) { names = $base.splitBySpace(names); }

	names.forEach(function(name) {
		try {
			delete node[fixPropName(node, name)];
		} catch(e) { }
	});
}


/**
 * 获取节点文本内容
 * @method getText
 * @param {Element} node 节点
 * @return {String} 文本内容
 */
var getText;
/**
 * 设置节点文本内容
 * @method setText
 * @param {Element} node 节点
 * @param {String} 新文本内容
 */
var setText;

if ('textContent' in document.documentElement) {
	getText = function(node) { return node.textContent; };
	setText = function(node, content) { node.textContent = content; };
} else {
	getText = function(node) { return node.innerText || node.nodeValue; };
	setText = function(node, content) {
		if ('innerText' in node) {
			node.innerText = content;
		} else if ('nodeValue' in node) {
			node.nodeValue = content;
		}
	};
}


return {
	// See line 42
	getAttr: getAttr,

	// See line 59
	setAttr: setAttr,

	// See line 89
	removeAttr: removeAttr,

	// See line 126
	getProp: getProp,

	// See line 137
	setProp: setProp,

	// See line 148
	removeProp: removeProp,

	// See line 166
	getText: getText,

	// See line 173
	setText: setText,

	shortcuts: {
		/**
		 * 获取当前节点集合中第一个节点的属性值
		 * @method attr
		 * @for NodeList
		 * @param {String} name 属性名
		 * @return {String} 属性值
		 */
		/**
		 * 设置当前所有节点的属性值
		 * @method attr
		 * @for NodeList
		 * @param {String} name 属性名
		 * @param {String} val 属性值
		 * @return {NodeList} 当前节点集合
		 */
		/**
		 * 设置当前所有节点的属性值
		 * @method attr
		 * @for NodeList
		 * @param {Object} attrs 属性字典
		 * @return {NodeList} 当前节点集合
		 */
		attr: function(name, val) {
			return $base.access(this, name, val, true, {
				get: getAttr,
				set: setAttr
			});
		},

		/**
		 * 移除当前所有节点的指定属性
		 * @method removeAttr
		 * @for NodeList
		 * @param {String|Array<String>} names 属性名。多个属性名用空格隔开，或者以数组传入
		 * @return {NodeList} 当前节点集合
		 */
		removeAttr: function(names) {
			names = $base.splitBySpace(names);

			this.forEach(function(node) {
				removeAttr(node, names);
			});

			return this;
		},

		/**
		 * 获取当前节点集合中第一个节点的特性值
		 * @method prop
		 * @for NodeList
		 * @param {String} name 特性名
		 * @return {Any} 特性值
		 */
		/**
		 * 设置当前所有节点的特性值
		 * @method prop
		 * @for NodeList
		 * @param {String} name 特性名
		 * @param {Any} val 特性值
		 * @return {NodeList} 当前节点集合
		 */
		/**
		 * 设置当前所有节点的特性值
		 * @method prop
		 * @for NodeList
		 * @param {Object} props 特性字典
		 * @return {NodeList} 当前节点集合
		 */
		prop: function(name, val) {
			return $base.access(this, name, val, true, {
				get: getProp,
				set: setProp
			});
		},

		/**
		 * 移除当前所有节点的指定特性
		 * @method removeProp
		 * @for NodeList
		 * @param {String|Array<String>} names 特性名。多个特性名用空格隔开，或者以数组传入
		 * @return {NodeList} 当前节点集合
		 */
		removeProp: function(names) {
			names = $base.splitBySpace(names);

			this.forEach(function(node) {
				removeProp(node, names);
			});

			return this;
		},

		/**
		 * 获取当前节点集合中第一个节点的文本内容
		 * @method text
		 * @for NodeList
		 * @return {String} 文本内容
		 */
		/**
		 * 设置当前所有节点的文本内容
		 * @method text
		 * @for NodeList
		 * @param {String|Function} content 新文本内容
		 * @return {NodeList} 当前节点集合
		 */
		text: function(content) {
			return $base.access(this, null, content, true, {
				get: getText,
				set: function(node, k, v) { setText(node, v); }
			});
		},

		/**
		 * 获取当前节点集合中第一个节点的innerHTML
		 * @method html
		 * @for NodeList
		 * @return {String} innerHTML
		 */
		/**
		 * 设置当前所有节点的innerHTML
		 * @method html
		 * @for NodeList
		 * @param {String|Function} 新innerHTML
		 * @return {NodeList} 当前节点集合
		 */
		html: function(content) {
			return $base.access(this, null, content, true, {
				get: function(node, k) { return node.innerHTML; },
				set: function(node, k, v) { node.innerHTML = v; }
			});
		},

		/**
		 * 获取当前节点集合中第一个节点的value属性值
		 * @method val
		 * @for NodeList
		 * @return {String} value属性值
		 */
		/**
		 * 设置当前所有节点的value属性值
		 * @method val
		 * @for NodeList
		 * @param {String|Function} val 新value属性值
		 * @return {NodeList} 当前节点集合
		 */
		val: function(val) {
			return $base.access(this, null, val, true, {
				get: function(node, k) { return node.value; },
				set: function(node, k, v) { node.value = v; }
			});
		}
	}
};

});