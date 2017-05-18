/*!
 * JRaiser 2 Javascript Library
 * base - v1.0.3 (2014-08-24T22:47:21+0800)
 * http://jraiser.org/ | Released under MIT license
 */
define(function(require, exports, module) { 'use strict';

/**
 * 本模块提供最基础、最核心的接口
 * @module base/1.0.x/
 * @category Infrastructure
 */

require('es5-shim/4.0.x/');


/**
 * 把源对象的属性扩展到目标对象
 * @method extend
 * @param {Any} target 目标对象
 * @param {Any*} [source] 源对象。若有同名属性，则后者覆盖前者
 * @return {Any} 目标对象
 */
function extend(target) {
	if (target == null) { throw new Error('target cannot be null'); }

	var i = 0, len = arguments.length, p, src;
	while (++i < len) {
		src = arguments[i];
		if (src != null) {
			for (p in src) { target[p] = src[p]; }
		}
	}

	return target;
}


// 用于对比某变量的值是否undefined
var undefined;
// 用于基本类型判断
var toString = Object.prototype.toString;

/**
 * 检查变量是否Function类型
 * @method isFunction
 * @param {Any} value 待测变量
 * @return {Boolean} 待测变量是否Function类型
 */
function isFunction(value) { return toString.call(value) === '[object Function]'; }


// 记录已经生成的id
var uniqueStrs = { };
function uniqueRndStr(length) {
	var result;
	do {
		result = '';
		while (result.length < length) {
			result += Math.random().toString(36).substr(2);
		}
		result = result.substr(0, length);
	} while ( uniqueStrs.hasOwnProperty(result) );

	uniqueStrs[result] = true;

	return result;
}


return {
	/**
	 * 检查变量是否Array类型
	 * @method isArray
	 * @param {Any} value 待测变量
	 * @return {Boolean} 待测变量是否Array类型
	 */
	isArray: Array.isArray ||
		function(value) { return toString.call(value) === '[object Array]'; },

	// See line 44
	isFunction: isFunction,

	/**
	 * 检查变量是否Date类型
	 * @method isDate
	 * @param {Any} value 待测变量
	 * @return {Boolean} 待测变量是否Date类型
	 */
	isDate: function(value) { return toString.call(value) === '[object Date]'; },

	/**
	 * 检查变量是否Object类型
	 * @method isObject
	 * @param {Any} value 待测变量
	 * @return {Boolean} 待测变量是否Object类型
	 */
	isObject: function(value) { return toString.call(value) === '[object Object]'; },

	/**
	 * 检查对象是否空Object
	 * @method isEmptyObject
	 * @param {Object} obj 待测对象
	 * @return {Boolean} 待测对象是否空Object
	 */
	isEmptyObject: function(obj) {
		if (obj != null) {
			for (var i in obj) { return false; }
		}
		return true;
	},

	/**
	 * 检查变量是否为undefined
	 * @method isUndefined
	 * @param {Any} value 待测变量
	 * @return {Boolean} 待测变量是否为undefined
	 */
	isUndefined: function(value) { return value === undefined; },

	// See line 17
	extend: extend,

	/**
	 * 把源对象的属性扩展到目标对象。与extend相比，mix提供了更多参数
	 * @method mix
	 * @param {Any} target 目标对象
	 * @param {Any} [source] 源对象
	 * @param {Object} [opts] 参数
	 *   @param {Boolean} [opts.overwrite=true] 是否覆盖目标对象的同名属性
	 *   @param {Array<String>} [opts.whiteList] 扩展属性白名单
	 *   @param {Array<String>} [opts.blackList] 扩展属性黑名单
	 *   @param {Boolean} [opts.ignoreNull=false] 是否不扩展null值的属性
	 * @return {Any} 目标对象
	 */
	mix: function(target, source, opts) {
		if (target == null) { throw new Error('target cannot be null'); }

		if (source != null) {
			opts = opts || { };

			for (var i in source) {
				// 是否覆盖属性
				if (opts.overwrite === false && i in target) { continue; }
				// 是否忽略null值的属性
				if (opts.ignoreNull && source[i] == null) { continue; }
				// 白名单检测
				if (opts.whiteList && opts.whiteList.indexOf(i) === -1) { continue; }
				// 黑名单检测
				if (opts.blackList && opts.blackList.indexOf(i) !== -1) { continue; }

				target[i] = source[i];
			}
		}

		return target;
	},

	/**
	 * 对指定对象的每个元素执行指定函数
	 * @method each
	 * @param {Object|Array|ArrayLike} obj 目标对象
	 * @param {Function(value,key,obj)} callback 操作函数，上下文为当前元素。
	 *   当返回值为false时，遍历中断
	 * @return {Object|Array|ArrayLike} 遍历对象
	 */
	each: function(obj, callback) {
		if (obj != null) {
			var i, len = obj.length;
			if ( len === undefined || isFunction(obj) ) {
				for (i in obj) {
					if ( false === callback.call(obj[i], obj[i], i, obj) ) {
						break;
					}
				}
			} else {
				i = -1;
				while (++i < len) {
					if ( false === callback.call(obj[i], obj[i], i, obj) ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	/**
	 * 把源数组中的元素复制到新数组中
	 * @method toArray
	 * @param {Array|ArrayLike} source 源数组
	 * @return {Array} 新数组
	 */
	toArray: function(source) {
		var result;
		try {
			result = Array.prototype.slice.call(source);
		} catch (e) {
			result = [ ];
			var i = source.length;
			while (i) {
				result[--i] = source[i];
			}
		}

		return result;
	},

	/**
	 * 创建类
	 * @method createClass
	 * @param {Function} constructor 构造函数
	 * @param {Object} [methods] 方法
	 * @param {Function} [Parent] 父类
	 * @param {Function(args)|Array} [parentArgs] 传递给父类的参数，默认与子类构造函数参数一致
	 * @return {Function} 类
	 */
	createClass: function(constructor, methods, Parent, parentArgs) {
		var $Class = Parent ? function() {
			Parent.apply(
				this,
				parentArgs ? 
					(typeof parentArgs === 'function' ?
						parentArgs.apply(this, arguments) : parentArgs)
				: arguments
			);
			constructor.apply(this, arguments);
		} : function() { constructor.apply(this, arguments); };

		if (Parent) {
			var $Parent = function() { };
			$Parent.prototype = Parent.prototype;
			$Class.prototype = new $Parent();
			$Class.prototype.constructor = $Class;
		}
		if (methods) {
			for (var m in methods) { $Class.prototype[m] = methods[m]; }
		}
		return $Class;
	},

	/**
	 * 移除全局变量
	 * @method deleteGlobalVar
	 * @param {String} name 变量名
	 */
	deleteGlobalVar: function(name) {
		try {
			delete window[name];
		} catch (e) {
			window[name] = null;
		}
	},

	/**
	 * 生成不重复的随机字符串
	 * @method uniqueRndStr
	 * @param {Number} length 字符串长度
	 * @return {String} 生成的字符串
	 */
	uniqueRndStr: uniqueRndStr,

	/**
	 * 返回一个新函数，使目标函数只执行一次
	 * @method once
	 * @param {Function} fn 目标函数
	 * @return {Function} 新函数
	 */
	once: function(fn) {
		var returnValue;
		return function() {
			if (fn) {
				returnValue = fn.apply(this, arguments);
				fn = null;
			}
			return returnValue;
		};
	},

	/**
	 * 把数组二的元素合并到数组一
	 * @method merge
	 * @param {Array} first 数组一
	 * @param {Array} second 数组二
	 * @return {Array} 合并后的数组一
	 */
	merge: function(first, second) {
		var len = second.length, j = 0, i = first.length;
		while (j < len) {
			first[i++] = second[j++];
		}
		first.length = i;

		return first;
	}
};

});