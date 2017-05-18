/*!
 * JRaiser 2 Javascript Library
 * dom-animation - v1.0.1 (2014-06-09T16:51:32+0800)
 * http://jraiser.org/ | Released under MIT license
 */
define(function(require, exports, module) { 'use strict';

/**
 * 本模块提供节点动画接口
 * @module dom/1.0.x/dom-animation
 * @catgory Infrastructure
 * @ignore
 */

var base = require('base/1.0.x/'),
	$base = require('./dom-base'),
	$style = require('./dom-style');


var animationQueue = [ ],	// 动画队列
	animationTimerId;		// 执行动画的setInterval返回的timerid

// 把动作加入动画队列，并执行队列（如果未执行）
function doAnimation(action) {
	var actionId = animationQueue.push(action) - 1;

	if (!animationTimerId) {
		animationTimerId = setInterval(function() {
			for (var i = 0; i < animationQueue.length; i++) {
				animationQueue[i] && animationQueue[i]();
			}
		}, 13);
	}

	// 返回在队列中的序号
	return actionId;
}

// 把动作从动画队列中移除
function clearAnimation(id) {
	animationQueue[id] = null;

	if (animationQueue.length) {
		var isEmpty = true;
		for (var i = animationQueue.length - 1; i >= 0; i--) {
			if (animationQueue[i] != null) {
				isEmpty = false;
				break;
			}
		}
		// 没有动画，可以清理动画队列
		if (isEmpty) {
			animationQueue = [ ];
			if (animationTimerId) {
				clearInterval(animationTimerId);
				animationTimerId = null;
			}
		}
	}
}


var rNumber = /^[+-]?\d+(?:\.\d+)?[^\s]*$/,
	rRelNumber = /^([+-])=(\d+(?:\.\d+)?)$/,
	rColor = /color$/i,
	rSharpColor = /^#[a-f0-9]{6}$/i,
	rRGBColor = /^rgb\((\d+),\s(\d+),\s(\d+)\)$/,
	rScroll = /^scroll/,
	defaultStyleValues = { opacity: 1 };

// 转换样式值为可用于动画运算的数值
function parseStyleValue(val) {
	if (typeof val === 'string') {
		if ( rNumber.test(val) ) {
			val = parseFloat(val, 10) || 0;
		} else if ( rSharpColor.test(val) ) {
			// #开头的16进制颜色值转RGB数组
			val = [
				parseInt(val.substr(1, 2), 16),
				parseInt(val.substr(3, 2), 16),
				parseInt(val.substr(5, 2), 16)
			];
		} else if ( rRGBColor.test(val) ) {
			// rgb(R,G,B) 格式的10进制颜色值转为数字数组
			val = [
				parseInt(RegExp.$1, 10),
				parseInt(RegExp.$2, 10),
				parseInt(RegExp.$3, 10)
			];
		} else {
			val = val.toLowerCase();
		}
	}

	return val;
}

// 修正最终样式
function parseFinalStyles(finalStyles, curStyles) {
	var n, style, result = { };
	for (n in finalStyles) {
		style = finalStyles[n];
		result[n] = rRelNumber.test(style) ?
			curStyles[n] + parseFloat(RegExp.$1 + RegExp.$2, 10) :
			parseStyleValue(style);
	}
	return result;
}

// 获取与最终样式相对应的初始样式值
function getRelatedStyles(node, finalStyles) {
	var curStyles = { }, val;
	for (var n in finalStyles) {
		if (n === 'width' || n === 'height') {
			val = $style.getSize(node, n);
		} else if ( rScroll.test(n) ) {
			val = $style.getScroll( node, n.replace(rScroll, '') );
		} else {
			val = parseStyleValue( $style.getStyle(node, n) );
		}

		if ( val === '' && defaultStyleValues[n] != null ) {
			val = defaultStyleValues[n];
		}

		curStyles[n] = val;
	}

	return curStyles;
}


// 检查节点是否支持动画操作
function isSupportAnimation(node) {
	return $base.isWindow(node) || ( node.nodeType === 1 && !$base.isXMLNode(node) );
}

// 运动方程
var easings = {
	linear: function(initVal, diff, progress, escapedTime) {
		return initVal + diff * progress;
	},
	swing: function(initVal, diff, progress, escapedTime) {
		return ( ( -Math.cos( progress * Math.PI ) / 2 ) + 0.5 ) * diff + initVal;
	}
};

// 计算动画过程中的下一个值
function calculateVal(cVal, fVal, easing, progress) {
	var nVal;

	if (typeof cVal === 'number') {
		if (typeof fVal === 'number') {
			nVal = cVal + (fVal - cVal) * easing(0, 1, progress);
			// 防止超出界限值
			if ( (fVal > cVal && nVal > fVal) || (fVal < cVal && nVal < fVal) ) {
				nVal = fVal;
			}
		}
	} else if ( base.isArray(cVal) && base.isArray(fVal) ) {
		nVal = [ ];
		cVal.forEach(function(v, i) {
			nVal[i] = parseInt(calculateVal(v, fVal[i], easing, progress), 10);
		});
	}

	return nVal || fVal;
}


// 存放节点id以及对应的动画动作id
var animationSpace = { };

/**
 * 对指定节点执行动画
 * @method start
 * @param {Element} node 节点
 * @param {Object} finalStyles 最终样式
 * @param {Object} [options] 其他参数
 *   @param {Number} [options.duration=400] 动画时长
 *   @param {Function|String} [options.easing='linear'] 动画过渡效果
 *   @param {Function} [options.callback] 动画结束后的回调
 */
function startAnimation(node, finalStyles, options) {
	if ( !isSupportAnimation(node) ) { return; }

	options = base.mix({
		duration: 400,
		easing: 'linear'
	}, options, { ignoreNull: true });

	var easing = options.easing;
	if (typeof easing === 'string') { easing = easings[easing]; }
	if (!easing) { throw new Error('please specify easing'); }

	// 获取节点的当前样式
	var curStyles = getRelatedStyles(node, finalStyles);

	// 修正最终样式的样式值
	finalStyles = parseFinalStyles(finalStyles, curStyles);

	// 停止已有的动画，防止冲突
	stopAnimation(node);

	// 先设为可见，不然看不到动画效果
	if (finalStyles.visibility === 'visible') {
		$style.setStyle(node, 'visibility', 'visible');
	}
	if (finalStyles.display === 'block') {
		$style.setStyle(node, 'display', 'block');
	}

	var nodeId = $base.uniqueId(node), startTime = +new Date;
	var actionId = doAnimation(function() {
		// 计算动画进度
		var escapedTime = new Date - startTime, progress = escapedTime / options.duration;

		var cVal,	// 当前样式值
			fVal,	// 最终样式值
			nVal;	// 新样式值
		for (var n in finalStyles) {
			if (n === 'visibility' || n === 'display') { continue; }

			cVal = curStyles[n];
			fVal = finalStyles[n];
			if (cVal != fVal) {
				nVal = calculateVal(cVal, fVal, easing, progress);
				if ( rScroll.test(n) ) {
					$style.setScroll(node, n.replace(rScroll, ''), nVal);
				} else {
					$style.setStyle(node, n,
						rColor.test(n) ? 'rgb(' + nVal.join(', ') + ')' : nVal);
				}
			}
		}

		if (escapedTime >= options.duration) {
			stopAnimation(node);
			// 确保最终样式正确
			for (var s in finalStyles) {
				$style.setStyle(node, s,
					rColor.test(s) ? 'rgb(' + finalStyles[s] + ')' : finalStyles[s]);
			}

			// 回调
			options.callback && options.callback.call(node);
		}
	});

	// 记录动画的Id，方便清除
	animationSpace[nodeId] = actionId;
}

/**
 * 停止指定节点的动画
 * @method stop
 * @param {Element} node 节点
 */
function stopAnimation(node) {
	if ( !isSupportAnimation(node) ) { return; }

	var nodeId = $base.uniqueId(node), actionId = animationSpace[nodeId];
	if (actionId != null) {
		clearAnimation(actionId);
		delete animationSpace[nodeId];
	}
}


// See line 173
exports.start = startAnimation;

// See line 253
exports.stop = stopAnimation;

exports.shortcuts = {
	/**
	 * 对当前所有节点执行动画
	 * @method animate
	 * @for NodeList
	 * @param {Object} finalStyles 最终样式
	 * @param {Object} [options] 其他参数
	 *   @param {Number} [options.duration=400] 动画时长
	 *   @param {String|Function} [options.easing='linear'] 动画过渡效果
	 *   @param {Function} [options.callback] 动画结束后的回调
	 * @return {NodeList} 当前节点集合
	 */
	animate: function(finalStyles, options) {
		for (var n in finalStyles) {
			finalStyles[n] = parseStyleValue(finalStyles[n]);
		}

		this.forEach(function(node) { startAnimation(node, finalStyles, options); });

		return this;
	},

	/**
	 * 停止当前所有节点的动画
	 * @method stop
	 * @for NodeList
	 * @return {NodeList} 当前节点集合
	 */
	stop: function() {
		this.forEach(function(node) {
			stopAnimation(node);
		});

		return this;
	}
};

});