/*!
 * JRaiser 2 Javascript Library
 * dom-event - v1.0.0 (2014-03-20T14:40:06+0800)
 * http://jraiser.org/ | Released under MIT license
 */
define(function(require, exports, module) { 'use strict';

/**
 * 本模块提供节点事件操作接口
 * @module dom/1.0.x/dom-event
 * @catgory Infrastructure
 * @ignore
 */

var base = require('base/1.0.x/'),
	Sizzle = require('./sizzle'),
	$base = require('./dom-base'),
	EventArg = require('./dom-event-arg');


// 检查节点是否支持事件操作
function isSupportEvent(node) {
	return $base.isWindow(node) ||
		( !$base.isXMLNode(node) && (node.nodeType === 1 || node.nodeType === 9) );
}

// 识别事件类型中的事件名和名字空间
function normalizeType(type) {
	var pos = type.indexOf('.'), namespace;
	if (pos !== -1) {
		namespace = type.substr(pos + 1);
		type = type.substr(0, pos);
	}

	return [type, namespace];
}

// 解析事件类型参数为数组
var explainEventType = $base.splitBySpace;

// 记录事件类型
var eventTypes = { };

// 事件参数标准化 (modify from jquery)
var eventArgNormalizer = {
	props: 'altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which'.split(' '),

	keyHook: {
		props: 'char charCode key keyCode'.split(' '),
		filter: function(event, original) {
			// Add which for key events
			if (event.which == null) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHook: {
		props: 'button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement touches'.split(' '),
		filter: function(event, original) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement,
				touches = original.touches;

			// Compatible with touchevents
			if (touches && touches.length === 1) {
				event.pageX = touches[0].pageX;
				event.pageY = touches[0].pageY;
			}

			// Calculate pageX/Y if missing and clientX/Y available
			if (event.pageX == null && original.clientX != null) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX +
					(doc && doc.scrollLeft || body && body.scrollLeft || 0) -
					(doc && doc.clientLeft || body && body.clientLeft || 0);
				event.pageY = original.clientY +
					(doc && doc.scrollTop || body && body.scrollTop || 0 ) -
					(doc && doc.clientTop || body && body.clientTop || 0);
			}

			// Add relatedTarget, if necessary
			if (!event.relatedTarget && fromElement) {
				event.relatedTarget = fromElement === event.target ?
					original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && !base.isUndefined(button) ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},
	
	fix: function(e) {
		if (e instanceof EventArg) { return e; }

		var originalEvent = e,
			hook = this[eventTypes[e.type] + 'Hook'],
			props = hook && hook.props ? this.props.concat(hook.props) : this.props;

		e = base.mix(new EventArg(e), originalEvent, {
			whiteList: props
		});

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if (!e.target) {
			e.target = originalEvent.srcElement || document;
		}
		// Target should not be a text node (#504, Safari)
		if (e.target.nodeType === 3) {
			e.target = e.target.parentNode;
		}

		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328; IE6/7/8)
		e.metaKey = !!e.metaKey;

		return hook && hook.filter? hook.filter(e, originalEvent) : e;
	}
};


// 根据特征判断初始化不同浏览器下的事件监听函数
var addEvent, removeEvent;
if (document.addEventListener) {
	addEvent = function(node, type, handler) { node.addEventListener(type, handler, false); };
	removeEvent = function(node, type, handler) { node.removeEventListener(type, handler, false); };
} else if (document.attachEvent) {
	addEvent = function(node, type, handler) { node.attachEvent('on' + type, handler); };
	removeEvent = function(node, type, handler) { node.detachEvent('on' + type, handler); };
}

// 存放回调函数
var eventSpace = { };

// 记录阻止哪些回调函数执行，用于调用trigger时防止回调函数重复执行
var handlerBlocker = {
	_data: { },
	add: function(nodeId, eventType) {
		this._data[nodeId] = this._data[nodeId] || { };
		this._data[nodeId][eventType] = true;
	},
	remove: function(nodeId, eventType) {
		var data = this._data[nodeId];
		if (data) { delete data[eventType]; }
		if ( base.isEmptyObject(data) ) {
			delete this._data[nodeId];
		}
	},
	isBlocked: function(nodeId, eventType) {
		return Boolean( (this._data[nodeId] || { })[eventType] );
	}
};

// 存放各节点的globalHandler
var globalHandlers = { };

// 特殊事件处理
var eventHooks = { };
base.each({
	mouseenter: 'mouseover',
	mouseleave: 'mouseout'
}, function(fix, orig) {
	eventHooks[orig] = {
		bindType: fix,
		handle: function(obj, e) {
			var related = e.relatedTarget, ret;
			if ( !e || !related || ( related !== this && !Sizzle.contains(this, related) ) ) {
				var temp = e.type;
				e.type = orig;
				ret = obj.handler.call(this, e);
				e.type = temp;
			}
			return ret;
		}
	};
});

// 全局处理函数，用于调用某节点某事件类型下的处理函数
function globalHandler(e, namespace) {
	var self = this, nodeId = $base.uniqueId(self);
	if ( handlerBlocker.isBlocked(nodeId, e.type) ||
		( e.target && handlerBlocker.isBlocked($base.uniqueId(e.target), e.type) )
	) {
		return;
	}

	var bindType = eventHooks[e.type] ? eventHooks[e.type].bindType : e.type,
		space = (eventSpace[nodeId] || { })[bindType];
	if (space) {
		if (namespace && typeof namespace !== 'string') { namespace = null; }

		e = eventArgNormalizer.fix(e);
		space.forEach(function(obj) {
			// 检查名字空间
			if (namespace && obj.namespace !== namespace) { return; }

			// 检查是否要触发的事件类型
			if (e.isTrigger && obj.bindType !== e.type) { return; }

			var thisObj;
			// 事件代理
			if (obj.delegator) {
				var delegator = Sizzle(obj.delegator, self), tempTarget = e.target;
				do {
					if (delegator.indexOf(tempTarget) === -1) {
						tempTarget = tempTarget.parentNode;
					} else {
						thisObj = tempTarget;
						e.delegateTarget = self;
						break;
					}
				} while(tempTarget && tempTarget !== self);
				if (!thisObj) { return; }
			} else {
				thisObj = self;
			}

			if ( !e.hasOwnProperty('data') ) { e.data = obj.data; }
			
			var result = obj.handle ?
				obj.handle.call(thisObj, obj, e) : obj.handler.call(thisObj, e);

			if (result === false) { e.preventDefault(); }
			if (e.cancelBubble === true) { e.stopPropagation(); }
		});
	}
}

// 创建事件处理对象
function createHandler(node, space, type, fn, globalHandler, options) {
	var hook = eventHooks[type],
		bindType = hook ? hook.bindType : type,
		spaceByType = space[bindType];

	if (spaceByType) {
		if (options.allowRepeated === false) {
			// 检查重复
			for (var i = spaceByType.length - 1; i >= 0; i--) {
				if (spaceByType[i].handler === fn &&
					spaceByType[i].bindType === bindType) { return; }
			}
		}
	} else {
		space[bindType] = [ ];
		addEvent(node, bindType, globalHandler);
	}

	// 移除冗余数据
	delete options.allowRepeated;

	space[bindType].push( base.mix({
		handler: fn,
		bindType: type,
		handle: hook ? hook.handle : null
	}, options, {
		overwrite: false
	}) );
}

// 移除事件处理对象
function disposeHandler(node, space, type, fn, globalHandler, namespace) {
	var hook = eventHooks[type],
		bindType = hook ? hook.bindType : type;

	if (bindType) {
		var spaceByType = space[bindType];
		if (spaceByType) {
			for (var i = spaceByType.length - 1; i >= 0; i--) {
				if ( type === spaceByType[i].bindType &&
					(fn === spaceByType[i].handler || !fn) &&
					(namespace == null || namespace === spaceByType[i].namespace)
				) {
					spaceByType.splice(i, 1);
				}
			}
			if (!spaceByType.length) {
				delete space[bindType];
				removeEvent(node, bindType, globalHandler);
			}
		}
	} else {	// 移除所有事件类型的回调
		for (var i in space) {
			removeEvent(node, i, globalHandler);
		}
	}
}

/**
 * 在指定节点上注册事件监听
 * @method on
 * @param {Element} node 节点
 * @param {String|Array<String>} types 事件类型。多个事件类型用空格隔开，或者以数组传入
 * @param {Function} fn 回调函数
 * @param {Object} [options] 其他参数
 *   @param {String} [options.delegator] 委托方，可接受后代元素委托的事件
 *   @param {Any} [options.data] 额外传入的数据，可通过事件对象的data属性获得
 *   @param {Boolean} [options.allowRepeated=true] 是否允许重复的回调函数
 */
// isPass参数仅用于在循环调用中忽略对事件类型的重复解析
function on(node, types, fn, options, isPass) {
	if ( !isSupportEvent(node) ) { return; }

	if (!isPass) { types = explainEventType(types); }

	var nodeId = $base.uniqueId(node),
		space = eventSpace[nodeId] = eventSpace[nodeId] || { },
		globalHandlerForNode =
			globalHandlers[nodeId] = globalHandlers[nodeId] || function() {
				globalHandler.apply(node, arguments);
			};

	types.forEach(function(type) {
		type = normalizeType(type);
		createHandler( node, space, type[0], fn, globalHandlerForNode, base.mix({
			namespace: type[1]
		}, options) );
	});
}

/**
 * 在指定节点上移除事件监听
 * @method off
 * @param {Element} node 节点
 * @param {String|Array<String>} [types] 事件类型，如果为空，则移除所有事件类型的监听。
 *   多个事件类型用空格隔开，或者以数组传入
 * @param {Function} [fn] 回调函数，如果为空，则移除指定事件类型的所有监听
 */
// isPass参数仅用于在循环调用中忽略对事件类型的重复解析
function off(node, types, fn, isPass) {
	if ( !isSupportEvent(node) ) { return; }

	if (!isPass) { types = explainEventType(types); }

	var nodeId = $base.uniqueId(node),
		space = eventSpace[nodeId], globalHandlerByNode = globalHandlers[nodeId];

	if (!space || !globalHandlerByNode) { return; }

	var isRemoveSpace;
	if (types) {
		types.forEach(function(type) {
			type = normalizeType(type);
			if (type[0]) {
				disposeHandler(node, space, type[0], fn, globalHandlerByNode, type[1]);
			}
		});
		if ( base.isEmptyObject(space) ) { isRemoveSpace = true; }
	} else {
		disposeHandler(node, space, null, null, globalHandlerByNode);
		isRemoveSpace = true;
	}

	if (isRemoveSpace) {
		delete eventSpace[nodeId];
		delete globalHandlers[nodeId];
	}
}


// 各种事件下的默认参数
var defaultEventArgs = {
	key: {
		view: window,
		ctrlKey: false,
		altKey: false,
		shiftKey: false,
		metaKey: false,
		keyCode: 0,
		charCode: 0
	},

	mouse: {
		view: window,
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		ctrlKey: false,
		altKey: false,
		shiftKey: false,
		metaKey: false,
		button: 0
	},

	ui: {
		view: window
	}
};

// 默认动作触发
var defaultActions = {
	focus: true,
	blur: true,
	click: true,
	reset: true,
	submit: true
};

// 冒泡的事件
var bubbleEvents = {
	scroll: true, resize: true, select: true, error: true,
	reset: true, submit: true, change: true, abort: true
};

/**
 * 模拟事件触发
 * @method trigger
 * @param {Element} node 节点
 * @param {String} type 事件类型
 * @param {Object} [options] 参数设置
 *   @param {Boolean} [options.bubbles] 是否冒泡
 *   @param {Mixed} [options.data] 事件数据
 */
function trigger(node, type, options) {
	if ( !isSupportEvent(node) || !type ) { return; }

	type = normalizeType(type);
	options = options || { };

	var e = eventArgNormalizer.fix(
			base.extend({
				type: type[0],
				target: node
			}, defaultEventArgs[ eventTypes[ type[0] ] ])
		),
		originalNode = node,
		bubbles = options.bubbles != null ? options.bubbles : bubbleEvents[ type[0] ];

	e.isTrigger = true;

	if (options.data != null) { e.data = options.data; }

	// 触发事件并冒泡
	do {
		globalHandler.call(node, e, type[1]);
		node = node.parentNode;
	} while ( bubbles && node && !e.isPropagationStopped() );

	if ( defaultActions[ type[0] ] && !e.isDefaultPrevented() && (type[0] in originalNode) ) {
		// 防止重复执行事件处理函数
		var nodeId = $base.uniqueId(originalNode);
		handlerBlocker.add(nodeId, type[0]);
		originalNode[ type[0] ]();
		handlerBlocker.remove(nodeId, type[0]);
	}
}


module.exports = {
	// See line 298
	on: on,

	// See line 330
	off: off,

	// See line 415
	trigger: trigger,

	shortcuts: {
		/**
		 * 在当前所有节点上注册事件监听
		 * @method on
		 * @for NodeList
		 * @param {String|Array<String>} types 事件类型。多个事件类型用空格隔开，或者以数组传入
		 * @param {Function(e)} fn 回调函数
		 * @param {Object} [options] 其他参数
		 *   @param {String} [options.delegator] 委托方。可接受后代元素委托的事件
		 *   @param {Any} [options.data] 额外传入的数据，可通过事件对象的data属性获得
		 *   @param {Boolean} [options.allowRepeated=true] 是否允许重复的回调函数
		 * @return {NodeList} 当前节点集合
		 */
		on: function(types, fn, options) {
			types = explainEventType(types);
			if (types) {
				this.forEach(function(node) {
					on(node, types, fn, options, true);
				});
			}

			return this;
		},

		/**
		 * 在指定节点上移除事件监听
		 * @method off
		 * @for NodeList
		 * @param {String|Array<String>} [types] 事件类型。如果为空，则移除所有事件类型的监听；
		 *   多个事件类型用空格隔开，或者以数组传入
		 * @param {Function} [fn] 回调函数，如果为空，则移除指定事件类型的所有监听
		 * @return {NodeList} 当前节点集合
		 */
		off: function(types, fn) {
			types = explainEventType(types);
			this.forEach(function(node) {
				off(node, types, fn, true);
			});

			return this;
		},

		/**
		 * 模拟事件触发
		 * @method trigger
		 * @for NodeList
		 * @param {String} type 事件类型
		 * @param {Object} [options] 参数设置
		 *   @param {Boolean} [options.bubbles] 是否冒泡
		 *   @param {Mixed} [options.data] 事件数据
		 * @return {NodeList} 当前节点集合
		 */
		trigger: function(type, options) {
			this.forEach(function(node) {
				trigger(node, type, options);
			});

			return this;
		}
	}
};


var shortcuts = module.exports.shortcuts,
	rkeyEvent = /^key/, rmouseEvent = /^(?:mouse|contextmenu|touch)|click/;
('blur focus load resize scroll unload click dblclick mousedown mouseup mousemove ' +
'mouseover mouseout mouseenter mouseleave touchstart touchmove touchend change select ' +
'submit keydown keypress keyup error contextmenu').split(' ').forEach(function(type) {
	if ( rkeyEvent.test(type) ) {
		bubbleEvents[type] = true;
		eventTypes[type] = 'key';
	} else if ( rmouseEvent.test(type) ) {
		bubbleEvents[type] = true;
		eventTypes[type] = 'mouse';
	}

	// 快捷事件调用
	shortcuts[type] = function(fn, options) {
		return arguments.length ? this.on(type, fn, options) : this.trigger(type);
	};
});
rkeyEvent = null;
rmouseEvent = null;

});