/*!
 * JRaiser 2 Javascript Library
 * dom-style - v1.0.1 (2014-10-28T14:47:12+0800)
 * http://jraiser.org/ | Released under MIT license
 */
define(function(require, exports, module) { 'use strict';

/**
 * 本模块提供节点样式操作接口
 * @module dom/1.0.x/dom-style
 * @catgory Infrastructure
 * @ignore
 */

var base = require('base/1.0.x/'), $base = require('./dom-base');


// 检查节点是否支持样式操作
function isSupportStyle(node) {
	return !($base.isWindow(node) || $base.isXMLNode(node) || node.nodeType !== 1);
}


// 特性测试元素
var testElt = document.documentElement;

// 探测是否支持classList
var supportClassList = 'classList' in testElt;

// 特殊属性名
var cssProps = {
	'float': 'cssFloat' in testElt.style ? 'cssFloat' : 'styleFloat'
};

// 不以px为单位的数值样式
var cssNumber = {
	fillOpacity: true,
	fontWeight: true,
	lineHeight: true,
	opacity: true,
	orphans: true,
	widows: true,
	zIndex: true,
	zoom: true
};

// 特殊样式访问
var cssHooks = { };
if ( !('opacity' in testElt.style) ) {
	var OPACITY_VALUE = /opacity=([^)]*)/, ALPHA_FILTER = /alpha\([^)]*\)/i;
	
	// 获取/设置透明度，Only For IE<9
	cssHooks.opacity = {
		get: function(node) {
			return OPACITY_VALUE.test(node.currentStyle.filter || '') ?
				parseFloat(RegExp.$1) / 100 + '' : '';
		},
		set: function(node, val) {
			var filter = node.currentStyle.filter || '', style = node.style;

			val = parseFloat(val);
			
			style.zoom = 1;

			if (isNaN(val) && filter.replace(ALPHA_FILTER, '').trim() === '') {
				style.removeAttribute('filter');
			} else {
				var opacity = 'alpha(opacity=' + Math.min(1, val) * 100 + ')';
				style.filter = ALPHA_FILTER.test(filter) ?
					filter.replace(ALPHA_FILTER, opacity) : filter + ' ' + opacity;
			}
		}
	};
}

testElt = null;

// 获取当前样式
var getCurrentStyle = 'getComputedStyle' in window ? function(node, name) {
	return node.ownerDocument.defaultView.getComputedStyle(node, null)[name] || '';
} : function(node, name) {
	return (node.currentStyle[name] || '').toLowerCase();
};

var rDash = /-([a-z])/g;
// 修复样式名 font-weight -> fontWeight
function fixStyleName(name) {
	return cssProps[name] || name.replace(rDash, function($0, $1) {
		return $1.toUpperCase();
	});
}
// 修复样式值
function fixStyleValue(name, val) {
	// 数字默认加上px单位（如果该样式能以px为单位）
	return cssNumber[name] || '' === val || isNaN(val) ? val : val + 'px';
}

/**
 * 获取节点当前样式
 * @method getStyle
 * @param {Element} node 节点
 * @param {String} name 样式名
 * @return {String} 样式值
 */
function getStyle(node, name) {
	if ( !isSupportStyle(node) ) { return null; }
	
	name = fixStyleName(name);
		
	var hook = (cssHooks[name] || 1).get;
	if (hook) {
		return hook(node);
	} else {
		if (name in node.style) { return getCurrentStyle(node, name); }
	}
}

var rRelNumber = /^([+-])=(\d+(?:\.\d+)?)$/;

/**
 * 设置节点样式
 * @method setStyle
 * @param {Element} node 节点
 * @param {String} name 样式名
 * @param {String|Number} val 样式值
 */
function setStyle(node, name, val) {
	if ( !isSupportStyle(node) ) { return; }

	name = fixStyleName(name);

	// 计算相对值，例如 +=5
	if ( rRelNumber.test(val) ) {
		var curVal = parseFloat(getStyle(node, name), 10);
		if ( !isNaN(curVal) ) { val = curVal + parseFloat(RegExp.$1 + RegExp.$2, 10); }
	}

	val = fixStyleValue(name, val);

	var hook = (cssHooks[name] || 1).set;
	if (hook) {
		hook(node, val);
	} else {
		if (name in node.style) { node.style[name] = val; }
	}
}


var explainClassName = $base.splitBySpace;

var _hasClass, _addClass, _removeClass, _toggleClass;
if (supportClassList) {
	_hasClass = function(node, className) { return node.classList.contains(className); };
	_addClass = function(node, classes) {
		var i = -1, len = classes.length;
		while (++i < len) { node.classList.add(classes[i]); }
	};
	_removeClass = function(node, classes) {
		var i = -1, len = classes.length;
		while (++i < len) { node.classList.remove(classes[i]); }
	};
	_toggleClass = function(node, classes) {
		var i = -1, len = classes.length;
		while (++i < len) {
			if ( node.classList.contains(classes[i]) ) {
				node.classList.remove(classes[i]);
			} else {
				node.classList.add(classes[i]);
			}
		}
	};
} else {
	// 检查是否包含以空格隔开的子字符串
	var hasString = function(value, input) {
		var i = value.indexOf(input);
		return i != -1 &&
			(value.charCodeAt(i - 1) || 32) === 32 &&
			(value.charCodeAt(i + input.length) || 32) === 32;
	};
	_hasClass = function(node, className) { return hasString(node.className, className); };
	_addClass = function(node, classes) {
		var oldClassName = node.className,
			className = oldClassName,
			i = -1, len = classes.length;
		while (++i < len) {
			if ( !hasString(className, classes[i]) ) { className += (' ' + classes[i]); }
		}
		className = className.trim();
		if (oldClassName !== className) { node.className = className; }
	};
	_removeClass = function(node, classes) {
		var oldClassName = node.className,
			className = ' ' + oldClassName + ' ',
			i = -1, len = classes.length;
		while (++i < len) {
			className = className.replace(' ' + classes[i] + ' ', ' ');
		}
		className = className.trim();
		if (oldClassName !== className) { node.className = className; }
	};
	_toggleClass = function(node, classes) {
		var className = ' ' + node.className + ' ', i = -1, len = classes.length, temp;
		while (++i < len) {
			temp = ' ' + classes[i] + ' ';
			if ( -1 === className.indexOf(temp) ) {
				className += (classes[i] + ' ');
			} else {
				className = className.replace(temp, ' ');
			}
		}
		node.className = className.trim();
	};
}

/**
 * 检查节点是否包含指定样式类
 * @method hasClass
 * @param {Element} node 节点
 * @param {String} className 样式类
 * @return {Boolean} 节点是否包含指定样式类
 */
function hasClass(node, className) {
	if (!className) { throw new Error('classname is not specified'); }
	return isSupportStyle(node) ? _hasClass(node, className) : false;
}

/**
 * 为节点添加样式类
 * @method addClass
 * @param {Element} node 节点
 * @param {String|Array<String>} classes 样式类。多个样式类用空格隔开，或者以数组传入
 */
// isPass参数主要用于循环调用时，忽略对样式类名的重复解析
function addClass(node, classes, isPass) {
	if ( !isSupportStyle(node) ) { return; }

	if (!isPass) { classes = explainClassName(classes); }

	if (classes) { _addClass(node, classes); }
}

/**
 * 为节点移除样式类
 * @method removeClass
 * @param {Element} node 节点
 * @param {String|Array<String>} classes 样式类。多个样式类用空格隔开，或者以数组传入
 */
// isPass参数主要用于循环调用时，忽略对样式类名的重复解析
function removeClass(node, classes, isPass) {
	if ( !isSupportStyle(node) ) { return; }

	if (!isPass) { classes = explainClassName(classes); }

	if (node.className) {
		if (classes) {
			_removeClass(node, classes);
		} else {
			node.className = '';
		}
	}
}

/**
 * 如果节点包含样式类，则移除；如果节点不包含样式类，则添加
 * @method toggleClass
 * @param {Element} node 节点
 * @param {String|Array<String>} classes 样式类。多个样式类用空格隔开，或者以数组传入
 */
// isPass参数主要用于循环调用时，忽略对样式类名的重复解析
function toggleClass(node, classes, isPass) {
	if ( !isSupportStyle(node) ) { return; }

	if (!isPass) { classes = explainClassName(classes); }

	if (classes) { _toggleClass(node, classes) }
}


/**
 * 获取节点尺寸
 * @method getSize
 * @param {Element} node 节点
 * @param {String} which 宽度（width）或高度（height）
 * @param {String} extra 额外部分：填充（padding），边距（margin），边框（border）。
 *   多个参数用空格隔开
 * @return {Number} 尺寸值
 */
function getSize(node, which, extra) {
	// 首字母大写
	which = which.toLowerCase().replace(/^[a-z]/, function($0) {
		return $0.toUpperCase();
	});

	if ( $base.isWindow(node) ) {	// window对象，直接取浏览器可用范围
		return node.document.documentElement['client' + which];
	} else if (node.nodeType === 9) {		// 根节点
		return node.documentElement['scroll' + which];
	} else if ( !node.ownerDocument || node.nodeType !== 1 || $base.isXMLNode(node) ) {
		return null;
	}

	// 获取节点尺寸（包含padding、border）
	// IE下，如果未设置宽高，clientWidth/Height的值为0，所以要用offsetWidth/Height
	var size = node['offset' + which];

	// 计算额外部分
	extra = extra || '';
	var borderStyle = getStyle(node, 'borderStyle');
	(which === 'Width' ? ['Left', 'Right'] : ['Top', 'Bottom']).forEach(function(direction) {
		if (extra.indexOf('padding') === -1) {
			size -= parseFloat( getStyle(node, 'padding' + direction) ) || 0;
		}
		if (extra.indexOf('border') === -1) {
			if (borderStyle && borderStyle !== 'none') {
				size -= parseFloat( getStyle(node, 'border' + direction + 'Width') ) || 0;
			}
		}
		if (extra.indexOf('margin') !== -1) {
			size += parseFloat( getStyle(node, 'margin' + direction) ) || 0;
		}
	});

	return size;
}


var scrollMap = {
	'scrollTop': 'pageYOffset',
	'scrollLeft': 'pageXOffset'
};

function fixScrollDirection(direction) {
	// 首字母大写，其余小写
	return 'scroll' + direction.toLowerCase().replace(/^[a-z]/, function($0) {
		return $0.toUpperCase();
	});
}

/**
 * 获取指定节点内已滚动的距离
 * @method getScroll
 * @param {Element} node 节点
 * @param {String} direction 方向，top或left
 * @return {Number} 已滚动的距离
 */
function getScroll(node, direction) {
	var win = $base.getWindow(node);
	direction = fixScrollDirection(direction);

	return win && win === node ?
		(scrollMap[direction] in win ?
			win[ scrollMap[direction] ] : win.document.documentElement[direction]) :
		node[direction];
}

/**
 * 设置节点内滚动距离
 * @method setScroll
 * @param {Element} node 节点
 * @param {String} direction 方向，top或left
 * @param {Number} val 滚动距离
 */
function setScroll(node, direction, val) {
	var win = $base.getWindow(node);
	direction = fixScrollDirection(direction);

	if (win === node) {
		switch (direction) {
			case 'scrollTop':
				window.scrollTo( getScroll(node, 'left'), val );
				break;

			case 'scrollLeft':
				window.scrollTo( val, getScroll(node, 'top') );
				break;
		}
	} else {
		node[direction] = val;
	}
}


var defaultDisplay = {
	_cache: { },
	// 获取元素默认display值
	get: function(nodeName) {
		if (!this._cache[nodeName]) {
			var node = document.createElement(nodeName);
			document.body.appendChild(node);

			var val = getStyle(node, 'display');
			if (val === 'none') { val = 'block'; }
			this._cache[nodeName] = val;

			node.parentNode.removeChild(node);
			node = null;
		}

		return this._cache[nodeName];
	}
};


return {
	// See line 98
	getStyle: getStyle,

	// See line 120
	setStyle: setStyle,

	// See line 215
	hasClass: hasClass,

	// See line 227
	addClass: addClass,

	// See line 243
	removeClass: removeClass,

	// See line 263
	toggleClass: toggleClass,

	// See line 279
	getSize: getSize,

	// See line 339
	getScroll: getScroll,

	// See line 356
	setScroll: setScroll,

	shortcuts: {
		/**
		 * 获取当前节点集合中第一个节点的样式值
		 * @method css
		 * @for NodeList
		 * @param {String} name 样式名
		 * @return {String} 样式值
		 */
		/**
		 * 设置当前所有节点的样式值
		 * @method css
		 * @for NodeList
		 * @param {String} name 样式名
		 * @param {String|Number} val 样式值
		 * @return {NodeList} 当前节点集合
		 */
		/**
		 * 设置当前所有节点的样式值
		 * @method css
		 * @for NodeList
		 * @param {Object} cssProps 样式字典
		 * @return {NodeList} 当前节点集合
		 */
		css: function(name, val) {
			return $base.access(this, name, val, true, {
				get: getStyle,
				set: setStyle
			});
		},

		/**
		 * 检查当前节点集合中是否至少有一个节点包含指定CSS样式类
		 * @method hasClass
		 * @for NodeList
		 * @param {String} className 样式类
		 * @return {Boolean} 是否有节点包含指定CSS样式类
		 */
		hasClass: function(className) {
			var result = false;
			this.each(function(node) {
				result = result || hasClass(node, className);
				return !result;
			});

			return result;
		},

		/**
		 * 为当前所有节点添加CSS样式类
		 * @method addClass
		 * @for NodeList
		 * @param {String|Array<String>} className 样式类。多个样式类用空格隔开，或者以数组传入
		 * @return {NodeList} 当前节点集合
		 */
		addClass: function(className) {
			className = explainClassName(className);
			this.forEach(function(node) {
				addClass(node, className, true);
			});

			return this;
		},

		/**
		 * 为当前所有节点移除CSS样式类
		 * @method removeClass
		 * @for NodeList
		 * @param {String|Array<String>} className 样式类。如果为空，则移除所有样式类；
		 *   多个样式类用空格隔开，或者以数组传入
		 * @return {NodeList} 当前节点集合
		 */
		removeClass: function(className) {
			className = explainClassName(className);
			this.forEach(function(node) {
				removeClass(node, className, true);
			});

			return this;
		},

		/**
		 * 如果节点包含样式类，则移除；如果节点不包含样式类，则添加
		 * @method toggleClass
		 * @for NodeList
		 * @param {String|Array<String>} className 样式类。多个样式类用空格隔开，或者以数组传入
		 * @param {Boolean} [addOrRemove] 如果值为true，则强制添加样式类；
		 *   如果值为false，则强制移除样式类
		 * @return {NodeList} 当前节点集合
		 */
		toggleClass: function(className, addOrRemove) {
			switch (addOrRemove) {
				case true:
					return this.addClass(className);
				case false:
					return this.removeClass(className);
			}

			className = explainClassName(className);
			this.forEach(function(node) {
				toggleClass(node, className, true);
			});

			return this;
		},

		/**
		 * 获取当前第一个节点的宽度
		 * @method width
		 * @for NodeList
		 * @return {Number} 节点宽度
		 */
		/**
		 * 设置当前所有节点的宽度
		 * @method width
		 * @for NodeList
		 * @param {Number|String} val 宽度值
		 * @return {NodeList} 当前节点集合
		 */
		width: function(val) {
			return val != null ?
				this.css('width', val) : getSize(this[0], 'Width');
		},

		/**
		 * 获取当前第一个节点的高度
		 * @method height
		 * @for NodeList
		 * @return {Number} 节点高度
		 */
		/**
		 * 设置当前所有节点的高度
		 * @method height
		 * @for NodeList
		 * @param {Number|String} val 高度值
		 * @return {NodeList} 当前节点集合
		 */
		height: function(val) {
			return val != null ?
				this.css('height', val) : getSize(this[0], 'Height');
		},

		/**
		 * 获取当前第一个节点的内部宽度（包含padding）
		 * @method innerWidth
		 * @for NodeList
		 * @return {Number} 内部宽度
		 */
		innerWidth: function() {
			return getSize(this[0], 'Width', 'padding');
		},

		/**
		 * 获取当前第一个节点的内部高度（包含padding）
		 * @method innerHeight
		 * @for NodeList
		 * @return {Number} 内部高度
		 */
		innerHeight: function() {
			return getSize(this[0], 'Height', 'padding');
		},

		/**
		 * 获取当前第一个节点的外部宽度（包含padding、border）
		 * @method outerWidth
		 * @for NodeList
		 * @param {Boolean} [includeMargin=false] 是否包含margin
		 * @return {Number} 外部宽度
		 */
		outerWidth: function(includeMargin) {
			return getSize( this[0], 'Width',
				'padding border' + (includeMargin ? ' margin' : '') );
		},

		/**
		 * 获取当前第一个节点的外部高度（包含padding、border）
		 * @method outerHeight
		 * @for NodeList
		 * @param {Boolean} [includeMargin=false] 是否包含margin
		 * @return {Number} 外部高度
		 */
		outerHeight: function(includeMargin) {
			return getSize( this[0], 'Height',
				'padding border' + (includeMargin ? ' margin' : '') );
		},

		/**
		 * 获取当前第一个节点内已滚动的垂直距离
		 * @method scrollTop
		 * @for NodeList
		 * @return {Number} 已滚动的距离
		 */
		/**
		 * 设置当前所有节点内已滚动的垂直距离
		 * @method scrollTop
		 * @for NodeList
		 * @param {Number} val 滚动距离
		 * @return {NodeList} 当前节点集合
		 */
		scrollTop: function(val) {
			return $base.access(this, 'top', val, true, {
				get: getScroll,
				set: setScroll
			});
		},

		/**
		 * 获取当前第一个节点内已滚动的水平距离
		 * @method scrollLeft
		 * @for NodeList
		 * @return {Number} 已滚动的距离
		 */
		/**
		 * 设置当前所有节点内已滚动的水平距离
		 * @method scrollLeft
		 * @for NodeList
		 * @param {Number} val 滚动距离
		 * @return {NodeList} 当前节点集合
		 */
		scrollLeft: function(val) {
			return $base.access(this, 'left', val, true, {
				get: getScroll,
				set: setScroll
			});
		},

		/**
		 * 显示当前所有节点
		 * @method show
		 * @for NodeList
		 * @return {NodeList} 当前节点集合
		 */
		show: function() {
			this.forEach(function(node) {
				if (node.style.display === 'none') {
					node.style.display = '';
				}
				if (getStyle(node, 'display') === 'none') {
					node.style.display = defaultDisplay.get(node.nodeName);
				}
			});

			return this;
		},

		/**
		 * 隐藏当前所有节点
		 * @method hide
		 * @for NodeList
		 * @return {NodeList} 当前节点集合
		 */
		hide: function() { return this.css('display', 'none'); },

		/**
		 * 如果第一个节点是隐藏的，则显示所有节点，否则隐藏所有节点
		 * @method toggle
		 * @for NodeList
		 * @param  {Boolean} [showOrHide] 如果此值为true，则强制显示所有节点；
		 *   如果此值为false，则强制隐藏所有节点
		 * @return {NodeList} 当前节点集合
		 */
		toggle: function(showOrHide) {
			if (typeof showOrHide !== 'boolean') {
				showOrHide = this.css('display') === 'none';
			}
			if (showOrHide) {
				this.show();
			} else {
				this.hide();
			}

			return this;
		}
	}
};

});