/*!
 * JRaiser 2 Javascript Library
 * dom-data - v1.0.0 (2014-05-06T10:57:25+0800)
 * http://jraiser.org/ | Released under MIT license
 */
define("dom/1.0.x/dom-data",["base/1.0.x/","dom/1.0.x/dom-base",null],function(t){"use strict";function e(t,e){var n=c(t);return s[n]?s[n][e]:null}function n(t,e,n){var a=c(t),i=s[a]=s[a]||{};i[e]=n}function a(t,e,n){if(!i.isEmptyObject(s)){var a=c(t);if(null==e||""===e)delete s[a];else{var u=s[a];u&&(n||(e=r.splitBySpace(e)),e.forEach(function(t){delete u[t]}),i.isEmptyObject(u)&&delete s[a])}}}var i=t("base/1.0.x/"),r=t("./dom-base"),c=r.uniqueId,s={};return{getData:e,setData:n,removeData:a,shortcuts:{data:function(t,a){return r.access(this,t,a,!0,{get:e,set:n})},removeData:function(t){return t=r.splitBySpace(t),this.forEach(function(e){a(e,t,!0)}),this}}}});