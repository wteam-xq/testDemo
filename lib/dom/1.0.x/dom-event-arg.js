/*!
 * JRaiser 2 Javascript Library
 * dom-event-arg - v1.0.0 (2013-11-23T10:49:54+0800)
 * http://jraiser.org/ | Released under MIT license
 */
define("dom/1.0.x/dom-event-arg",["base/1.0.x/",null],function(e){"use strict";function t(){return!1}function n(){return!0}var a=e("base/1.0.x/");return a.createClass(function(e,a){var r=this;if(e&&e.type){r.originalEvent=e,r.type=e.type;var i;r.isDefaultPrevented=e.defaultPrevented||e.defaultPrevented===i&&(e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault())?n:t}else r.type=e;if(a)for(var o in a)"function"!=typeof a[o]&&(r[o]=a[o]);r.timeStamp=e&&e.timeStamp||+new Date},{preventDefault:function(){this.isDefaultPrevented=n;var e=this.originalEvent;e&&(e.preventDefault?e.preventDefault():e.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=n;var e=this.originalEvent;e&&(e.stopPropagation?e.stopPropagation():e.cancelBubble=!0)},isDefaultPrevented:t,isPropagationStopped:t})});