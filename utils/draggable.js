/**
 * 拖动功能组件（依赖jq） 原控件依赖较多，抽离依赖，整理成只依赖jq控件；
 * wteam-xq 2016-01-23
 * @module 
 * @category Widget
 */
var $window = $(window),
	$document = $(document);
var startWhen, endWhen, moveWhen;
	// Draggable = null;
// 检测设备类型
if ( isMobile() && hasTouch() ) {
	// 触摸屏
	startWhen = 'touchstart';
	endWhen = 'touchend';
	moveWhen = 'touchmove';
} else {
	// 鼠标
	startWhen = 'mousedown';
	endWhen = 'mouseup';
	moveWhen = 'mousemove';
}
/**
 * 拖动功能组件类
 * @class Draggable
 * @constructor
 * @extends widget/1.0.x/{WidgetBase}
 * @exports
 * @param {Object} options 组件设置
 *   @param {NodeList} options.wrapper 拖动元素
 *   @param {NodeList|Object|String} [options.boundary] 拖动边界，
 *     'parent'时为父节点，'window'时为窗口
 */
function Draggable(options){
	var t = this;
	t._wrapper = options.wrapper;
	t._dragTrigger = t._wrapper.find('.draggable-trigger');
	t._options = options;
	// 没有指定触发节点时，由wrapper进行触发
	if (!t._dragTrigger.length) { t._dragTrigger = t._wrapper; }
	// 调用初始化函数
	t._init(options);
}
Draggable.prototype._init = function(options){
	var t = this;
	/*
	 * 拖动过程
	 * @method drag
	 * @for Draggable
	 * @param {EventArg} e 事件对象
	 */
	t.drag = function(e) {
		var startPos = t._startPos;

		if (!startPos || e.pageX == null || e.pageY == null) { return; }

		var newPos = {
			left: e.pageX - startPos.left,
			top: e.pageY - startPos.top
		};

		if (t._isFixedPosition) {
			newPos.left -= $window.scrollLeft();
			newPos.top -= $window.scrollTop();
		}

		var boundary = t._boundary;
		if (boundary) {
			// 计算是否超出边界
			var size = t._wrapperSize, newOffset, parentOffset;
			if (t._isFixedPosition) {
				newOffset = $.extend({ }, newPos);
			} else {
				newOffset = t._wrapper.offset();
				newOffset.left += (newPos.left - t._oldPos.left);
				newOffset.top += (newPos.top - t._oldPos.top)
				parentOffset = t._wrapper.offsetParent().offset();
			}
			newOffset.right = newOffset.left + size.width;
			newOffset.bottom = newOffset.top + size.height;
			parentOffset = parentOffset || { top: 0, left: 0 };

			if (boundary.right != null && newOffset.right > boundary.right) {
				newPos.left = boundary.right - size.width - parentOffset.left;
			}
			if (boundary.left != null && newOffset.left < boundary.left) {
				newPos.left = boundary.left - parentOffset.left;
			}
			if (boundary.bottom != null && newOffset.bottom > boundary.bottom) {
				newPos.top = boundary.bottom - size.height - parentOffset.top;
			}
			if (boundary.top != null && newOffset.top < boundary.top) {
				newPos.top = boundary.top - parentOffset.top;
			}
		}

		t._wrapper.css(newPos);
		t._oldPos = newPos;

		/**
		 * 拖动到新位置后触发
		 * @event drag
		 * @for Draggable
		 * @param {Object} e 事件对象
		 *   @param {Object} e.position 新位置（top、left）
		 */
		t.trigger('drag', mix({
			position: newPos
		}, e, {
			overwrite: false
		}));
	};
	/*
	 * 终止拖动
	 * @method end
	 * @for Draggable
	 * @param {EventArg} e 事件对象
	 */
	t.end = function(e) {
		if (!t._startPos || e.pageX == null || e.pageY == null) { return; }

		t._wrapper.each(function(node) {
			if (node.releaseCapture) {
				node.releaseCapture();
			}
		});

		$document.off(moveWhen, t.drag);
		if (endWhen) { $document.off(endWhen, t.end); }
		$window.off('blur', t.end);

		delete t._startPos;
		delete t._oldPos;
		delete t._wrapperSize;
		delete t._boundary;
		delete t._isFixedPosition;

		/**
		 * 拖动结束后触发
		 * @event dragend
		 * @for Draggable
		 */
		t.trigger('dragend', e);
	};
	/*
	 * 开始拖动
	 * @method start
	 * @for Draggable
	 * @param {EventArg} e 事件对象
	 */
	t.start = function(e) {
		/**
		 * 拖动开始前触发
		 * @event dragstart
		 * @for Draggable
		 * @param {Object} e 事件对象
		 *   @param {Function} e.preventDefault() 如果调用了此方法，则拖动不会开始
		 */
		if ( t._startPos || e.pageX == null || e.pageY == null ||
				t.trigger('dragstart', e).isDefaultPrevented() ) { return; }

		// 防止选择文字、拖动页面（触摸屏）
		e.preventDefault();

		var wrapper = t._wrapper, wrapperPos = wrapper.position();
		// 修正节点的position值
		var cssPosition = wrapper.css('position');
		if (cssPosition !== 'fixed' && cssPosition !== 'absolute') {
			cssPosition = 'absolute';
			wrapper.css('position', cssPosition);
		}
		t._isFixedPosition = cssPosition === 'fixed';

		if (t._isFixedPosition) {
			wrapper.css({
				top: wrapperPos.top - $window.scrollTop(),
				left: wrapperPos.left - $window.scrollLeft()
			});
		} else {
			wrapper.css(wrapperPos);
		}

		// 计算方式：newWrapperLeft = newPageX - oldPageX + wrapperLeft
		//                          = newPageX - (oldPageX - wrapperLeft)
		t._startPos = {
			left: e.pageX - wrapperPos.left,
			top: e.pageY - wrapperPos.top
		};

		t._oldPos = wrapperPos;

		// 计算本次拖动的边界值
		var boundary = t._options.boundary;
		if (boundary) {
			if (boundary === 'window') {	// 窗口范围
				var doc = document.documentElement;
				t._boundary = t._isFixedPosition ? {
					left: 0,
					top: 0,
					right: doc.clientWidth,
					bottom: doc.clientHeight
				} : {
					left: 0,
					top: 0,
					right: Math.max(doc.scrollWidth, doc.clientWidth),
					bottom: Math.max(doc.scrollHeight, doc.clientHeight)
				};
			} else if (boundary === 'parent' && !t._isFixedPosition) {	// 父节点范围
				var offsetParent = t._wrapper.offsetParent();
				if (offsetParent.length) {
					t._boundary = {
						left: offsetParent.offset().left,
						right: offsetParent.offset().left + offsetParent.innerWidth(),
						top: offsetParent.offset().top,
						bottom: offsetParent.offset().top + offsetParent.innerHeight()
					};
				}
			} else if (typeof boundary.offset === 'function') {	// 指定某个元素
				t._boundary = boundary.offset();
				t._boundary.right = t._boundary.left + boundary.innerWidth();
				t._boundary.bottom = t._boundary.top + boundary.innerHeight();
			} else {
				t._boundary = boundary;
			}

			t._wrapperSize = {
				width: t._wrapper.outerWidth(),
				height: t._wrapper.outerHeight()
			};
		}

		wrapper.each(function(node) {
			if (node.setCapture) { node.setCapture(); }
		});

		$document.on(moveWhen, t.drag);
		if (endWhen) { $document.on(endWhen, t.end); }
		$window.on('blur', t.end);
	};
	t._dragTrigger.on(startWhen, t.start);
}
Draggable.prototype._destroy = function(options){
	var t = this;
	// 停止正在进行的拖动
	if (t._startPos) { t.end(); }
	t._dragTrigger.off(startWhen, t.start);
	delete t.drag;
	delete t.end;
	delete t.start;
}
Draggable.prototype.handlers = {};
/**
 * 触发事件
 * @method trigger
 * @for EventDriven
 * @param {String} type 事件类型
 * @param {Object} [props] 事件参数属性
 * @return {Object} 事件参数
 */
Draggable.prototype.trigger = function(type, props){
	var theHandlers = this.handlers[type], e = new EventArg(type, props);
	if (theHandlers) {
		for (var i = 0; i < theHandlers.length; i++) {
			theHandlers[i].call(this, e);
		}
	}
	return e;
}
/**
 * 注册事件监听
 * @method on
 * @for EventDriven
 * @param {String} type 事件类型
 * @param {Function(e)} handler 回调函数
 * @return {Object} 当前对象
 */
Draggable.prototype.on = function(type, handler) {
	this.handlers[type] = this.handlers[type] || [ ];
	this.handlers[type].push(handler);
	return this;
}
/**
 * 移除事件监听
 * @method off
 * @for EventDriven
 * @param {String} [type] 通知类型。如不指定，则取消所有订阅
 * @param {Function} [handler] 回调函数。如不指定，则取消指定类型的所有订阅
 * @return {Object} 当前对象
 */
Draggable.prototype.off = function(type, handler) {
	var handlers = this.handlers;
	if (!arguments.length) {
		this.handlers = { };
	} else if (!handler) {
		delete handlers[type];
	} else {
		var theHandlers = handlers[type];
		if (theHandlers) {
			for (var i = theHandlers.length - 1; i >= 0; i--) {
				if (theHandlers[i] === handler) {
					theHandlers.splice(i, 1);
				}
			}
			if (!theHandlers.length) {
				delete handlers[type];
			}
		}
	}

	return this;
}
/**
 * 事件参数类
 * @class EventArg
 * @constructor
 * @exports
 * @param {Object|String} src 源事件对象或事件类型
 * @param {Object} [props] 要扩展的属性
 */
function EventArg(src, props){
	var t = this;

	if (src && src.type) {
		t.originalEvent = src;
		t.type = src.type;
		var undefined;
		t.isDefaultPrevented = src.defaultPrevented ||
			src.defaultPrevented === undefined && (
			// Support: IE < 9
			src.returnValue === false ||
			// Support: Android < 4.0
			src.getPreventDefault && src.getPreventDefault()
		) ? returnTrue : returnFalse;
	} else {
		t.type = src;
	}

	if (props) {
		for (var p in props) {
			// 不复制方法
			if (typeof props[p] !== 'function') { t[p] = props[p]; }
		}
	}
	// 生成时间戳
	t.timeStamp = src && src.timeStamp || +new Date;
}
/**
 * 阻止事件默认行为
 * @for EventArg
 * @method preventDefault
 */
EventArg.prototype.preventDefault = function(){
	this.isDefaultPrevented = returnTrue;
	var e = this.originalEvent;
	if (!e) { return; }

	if (e.preventDefault) {
		e.preventDefault();
	} else {
		e.returnValue = false;
	}
}
/**
 * 停止冒泡
 * @for EventArg
 * @method stopPropagation
 */
EventArg.prototype.preventDefault = function(){
	this.isPropagationStopped = returnTrue;
	var e = this.originalEvent;
	if (!e) { return; }

	if (e.stopPropagation) {
		e.stopPropagation();
	} else {
		e.cancelBubble = true;
	}
}
/**
 * 获取是否已阻止事件默认行为
 * @for EventArg
 * @method isDefaultPrevented
 * @return {Boolean} 是否已阻止默认事件行为
 */
EventArg.prototype.isDefaultPrevented = function(){
	return false;
}
/**
 * 获取是否已停止冒泡
 * @for EventArg
 * @method isPropagationStopped
 * @return {Boolean} 是否已停止冒泡
 */
EventArg.prototype.isPropagationStopped = function(){
	return false;
}
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
function mix(target, source, opts) {
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
}

function hasTouch(){
	return ('ontouchstart' in document) || !!(window.PointerEvent || window.MSPointerEvent)
}
// 检测设备
function isMobile(){
	var ua = window.navigator.userAgent,
		_result = false,
		// 设备对象
		result = {
			device: { },
			os: { },
			layoutEngine: { },
			browser: { }
		};
	var os = null, device = null, browser = null;

	// 设备识别
	execRules([
		['ipad', /iPad(?:.*OS\s([\d_]+))?/],
		['ipod', /iPod(?:.*OS\s([\d_]+))?/],
		['iphone', /iPhone(?:\sOS\s([\d_]+))?/],
		['mac', /Macintosh/],
		['kindle', /Kindle/],
		['playbook', /PlayBook/],
		['blackberry', /BlackBerry/],
		['bb10', /BB10/],
		['nokia', /nokia/i]
	], 'device', true);

	// 系统识别
	execRules([
		['windowsphone', /Windows\sPhone\s([\d.]+)/],
		['windowsmobile', /Windows\sMobile/],
		['windowsce', /Windows\sCE/],
		['windows', /Windows\sNT\s([\d.]+)/],
		['macosx', /Mac\sOS\sX\s([\d_.]+)/],
		['android', /Android;?[\s\/]+([\d.]+)?/],
		['symbian', /Symbian(?:OS)?\/([\d.]+)/],
		['linux', /Linux/]
	], 'os', true);

	// 浏览器排版引擎识别
	execRules([
		['trident', /Trident\/([\d.]+)/],
		['webkit', /Web[kK]it[\/]?([\d.]+)/],
		['gecko', /Gecko\/([\d.]+)/],
		['presto', /Presto\/([\d.]+)/]
	], 'layoutEngine', true);

	// 浏览器识别
	execRules([
		['ie', /MSIE\s([\d.]+)/],
		['ie', /Trident\/.*;\srv:([\d.]+)/],
		['firefox', /Firefox\/([\d.]+)/],
		['operamini', /Opera\sMini\/([\d.]+)/],
		['opera', /Opera\/.*Version\/([\d.]+)/],
		['opera', /Opera\/([\d.]+)/],
		['opera', /OPR\/([\d.]+)/],
		['chrome', /Chrome\/([\d.]+)/],
		['chrome', /CriOS\/([\d.]+)/],
		['safari', /Version\/([\d.]+).*Safari/]
	], 'browser', true);

	device = result.device;
	os = result.os;
	browser = result.browser;

	device.tablet = !os.windows && !!(
		device.ipad || device.playbook || ( os.android && !ua.match(/Mobile/) ) ||
		( browser.firefox && /Tablet/.test(ua) ) ||
		( browser.ie && !/Phone/.test(ua) && /Touch/.test(ua) )
	);
	device.phone = !os.windows && !!(
		!device.tablet && (
			os.android || device.iphone || device.ipod ||
			device.blackberry || device.bb10 ||
			os.windowsce || os.windowsmobile || os.windowsphone || 
			( browser.chrome && /Android/.test(ua) ) || ( browser.chrome && /CriOS\/[\d.]+/.test(ua) ) ||
			( browser.firefox && /Mobile/.test(ua) ) || ( browser.ie && /Touch/.test(ua) )
		)
	);

	_result = !os.windows && ( device.tablet || device.phone ||
	/mobile/i.test(ua) || /tablet/i.test(ua) || /phone/i.test(ua) );

	// 执行规则匹配
	function execRules(rules, type, breakWhenMatch) {
		var i, match;
		for (i = 0; i < rules.length; i++) {
			match = ua.match(rules[i][1]);
			if (match) {
				result[type][rules[i][0]] = true;
				result[type].version = match[1] || '';
				if (breakWhenMatch) { break; }
			}
		}
		return match != null;
	}
}