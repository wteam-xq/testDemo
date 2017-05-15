/*!
 * Bowl.js
 * Javascript module loader for browser - v1.1.1 (2017-02-18T03:00:16Z)
 * http://jraiser.org/ | Released under MIT license
 */
!function(e,t){"use strict";function r(e,t){g.logs.push("["+e+"]"+t)}function n(e){for(var t in e)if(e.hasOwnProperty(t))return!1;return!0}function a(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);return e}function o(e){return null==e?"":String(e).replace(/^\s+/,"").replace(/\s+$/,"")}function i(e){return w(e)?e:[e]}function s(e,t){return e=o(e),e&&e.charAt(0)!=t?t+e:e}function u(e,t){return e=o(e),e&&e.charAt(e.length-1)!==t?e+t:e}function c(e){return/^(?:[a-z]+:)?\/{2,}/i.test(e)}function d(e){var t=b.createElement("div");return t.innerHTML='<a href="'+e+'"></a>',t}function l(e){var t=d(e);return e=t.firstChild.href,t=null,e}function f(e){var t=d(e),r=t.firstChild;r.href=r.href;var n=this;switch(n.protocol=r.protocol,n.protocol){case"http:":n.host=r.host.replace(/:80$/,"");break;case"https:":n.host=r.host.replace(/:443$/,"")}n.hostname=r.hostname,n.port=r.port,n.pathname=s(r.pathname,"/"),n.search=r.search,n.hash=r.hash,t=r=null}function h(e,t){return/^\//.test(e)?(t=m.appPath,e=e.substr(1)):/^\./.test(e)||(t=m.libPath),l(t+e)}function p(e,t){var r=e=o(e),n=!/^\./.test(e);if(n&&x[r])return x[r];var a="";e=e.replace(/(?:\?.*)?(?:#.*)?$/,function(e){return a=e,""}).replace(/([^\\\/]+)@([^\\\/]+)/g,function(e,t,r){return t+"/"+r+"/"+t}).split("/");var i,s=e.pop()||"index",u=s.lastIndexOf(".");u!==-1&&(i=s.substr(u+1),s=s.substr(0,u)),i=i||"js";var d=/-debug$/;m.debug&&!d.test(s)?s+="-debug":!m.debug&&d.test(s)&&(s=s.replace(d,"")),e.push(s+"."+i);var l=e.join("/")+a;c(l)||(l=h(l,t||"")),l=new f(l);var p=m.map;if(p)for(var v=0;v<p.length;v++)p[v](l);return l=l.toString(),n&&(x[r]=l),l}function v(e){var t,r=/(?:^|[^.$])\brequire\s*\(\s*(["'])([^"'\s\)]+)\1\s*\)/g,n=[];for(e=e.replace(/^\s*\/\*[\s\S]*?\*\/\s*$/gm,"").replace(/^\s*\/\/.*$/gm,"");t=r.exec(e);)t[2]&&n.push(t[2]);return n}function y(e,t,n,a){this._factory=t,this._deps=n,this._dirname=a,r("Module(constructor)",e||""),e?this.setId(e):y.anonymous=this}if(!e.bowljs){var g=e.bowljs={version:"1.1.1",logs:[]},m={},b=e.document,_=e.attachEvent&&!(null!=e.opera&&"[object Opera]"===e.opera.toString()),w=Array.isArray||function(){var e=Object.prototype.toString;return function(t){return"[object Array]"===e.call(t)}}();f.prototype.toString=function(){return u(this.protocol,":")+"//"+this.host+s(this.pathname,"/")+s(this.search,"?")+s(this.hash,"#")};var x={},R=function(){var e,t,n="onload"in b.createElement("script")?"onload":"onreadystatechange",a=b.head||b.getElementsByTagName("head")[0],o={},i=[];return{getCurrentScript:function(){if(e)return e;if(t&&"interactive"===t.readyState)return t;for(var r=0;r<i.length;r++)if("interactive"===i[r].readyState)return t=i[r]},load:function(s,u){var c=o[s];if(r("scriptLoader.load","src("+s+"), status("+c+")"),c)2===c&&u&&u();else{o[s]=1;var d=b.createElement("script");switch(typeof m.charset){case"function":d.charset=m.charset(s);break;case"string":d.charset=m.charset}d.async=!0,d.src=s,d[n]=d.onerror=function(){var e=d.readyState;if(!e||"loaded"===e||"complete"===e){o[s]=2,r("scriptLoader.load(onload)",s),d[n]=d.onerror=null,a.removeChild(d);for(var c=i.length-1;c>=0;c--)if(i[c]===d){i.splice(c,1);break}d=t=null,u&&u()}},i.push(d),e=d,a.insertBefore(d,a.firstChild),e=null}}}}(),S=function(){var e={};return{add:function(t,n){r("dependentChain.add","moduleId("+t+"), depId("+n+")");var a=e[n]=e[n]||[];a.push(t)},get:function(t){return e[t]},clear:function(t){r("dependentChain.remove","depId("+t+")"),delete e[t]}}}(),k=function(){function e(){return n++,"#"+n+"#"}function r(){for(var e;(e=a[0])&&e.isReady();)a.shift(),delete y.all[e.id()],e.execute()}var n=0,a=[],o={init:function(){for(var e=this,t=m.preload.slice(),n=0,a=0,o=0;o<t.length;o++)t[o]&&(a++,R.load(p(t[o]),function(){n++,n>=a&&(delete e._scripts,r())}));a&&(e._scripts=t)},id:function(){return"#preload#"},isReady:function(){return this._scripts===t},execute:function(){}};return{add:function(t){m.preload||(o=null),o&&(a.push(o),o.init(),o=null),a.push(t),t.setId(e())},tryExecute:r}}(),P=e.require=function(e,t){r("globalRequire",e),k.add(new y(null,t,i(e)))};P.resolve=function(e){return p(e)},a(y,{require:function(e){var t=y.all[e];if(t)return t.exports();throw new Error('module "'+e+'" does not exist')},isReady:function(e){var t=y.all[e];return t&&t.isReady()},load:function(e){y.all[e]||(r("Module.load",e),R.load(e,function(){if(!y.all[e]&&(!_&&y.anonymous&&y.anonymous.setId(e),!y.all[e]))throw new Error('module "'+e+'" lost')}))},all:{}}),a(y.prototype,{setId:function(e){var t=this;if(t._id)throw new Error("module id cannot be changed");if(r("module.setId",e),t._id=e,y.anonymous===t&&delete y.anonymous,!y.all[e]){y.all[e]=t,t._dirname=t._dirname||(t.isTask()?"":e.substr(0,e.lastIndexOf("/")+1));var a=t._deps;if(a){for(var o,i=t._readyStates={},s=0;s<a.length;s++)a[s]&&(t._deps[s]=o=p(a[s],t._dirname),y.isReady(o)||(S.add(e,o),i[o]=!0,r("module(depNotReady)","id("+e+"), dep("+o+")"),y.load(o)));n(i)&&delete t._readyStates}t._checkReady()}},_checkReady:function(){var e=this.isReady(),t=this.id();if(r("module._checkReady","id("+t+"), isReady("+e+")"),e)if(this.isTask())k.tryExecute();else{var n=S.get(t);if(n){for(var a,o=n.length-1;o>=0;o--)a=y.all[n[o]],a&&(a.notifyReady(t),r("module(notifyTo)","from("+t+"), to("+n[o]+")"));S.clear(t)}}},id:function(){return this._id},isTask:function(){return/^#\d+#$/.test(this._id)},isReady:function(){return this._readyStates===t},notifyReady:function(e){var t=this._readyStates;t&&(delete t[e],n(t)&&delete this._readyStates),this._checkReady()},execute:function(){r("module.execute",this.id());for(var e=this._deps,t=[],n=e.length-1;n>=0;n--)t[n]=y.all[e[n]].exports();this._factory&&this._factory.apply(window,t)},exports:function(){var e=this,t=e._executedModule;if(!t){if(t={id:e.id()},r("module.exports",t.id),"function"==typeof e._factory){t.exports={};var n=function(t){return y.require(p(t,e._dirname))};n.async=function(t,n){r("asyncRequire","require("+t+"), moduleId("+e.id()+")"),k.add(new y(null,n,i(t),e._dirname))},n.resolve=function(t){return p(t,e._dirname)};var a=e._factory.call(window,n,t.exports,t);a&&(t.exports=a)}else t.exports=e._factory;e._executedModule=t}return t.exports}}),e.define=function(){var e,t,n,a=arguments;switch(a.length){case 1:n=a[0],t=v(n.toString());break;case 2:t=a[0],n=a[1];break;case 3:e=p(a[0]),t=a[1],n=a[2]}if(!e&&_){var o=R.getCurrentScript();o&&(e=o.src)}r("globalDefine",e||""),new y(e,n,i(t))},e.define.amd={},g.config=function(t){var r=function(e){return c(e)||(e=l(e)),u(e,"/")};t.libPath&&(m.libPath=r(t.libPath)),t.appPath&&(m.appPath=r(t.appPath));var n=e.location.search;/[?|&]debug(&|$)/.test(n)?m.debug=!0:/[?|&]nondebug(&|$)/.test(n)?m.debug=!1:null!=t.debug&&(m.debug=!!t.debug),t.map&&(m.map=(m.map||[]).concat(t.map)),m.charset=t.charset,m.preload=t.preload},g.config({libPath:"./",appPath:"./",debug:!1}),r("bowljs(ready)","version("+g.version+")")}}(window);

/**
 * loader config
 */
!function(w) {
	var l = w.location, b = w.bowljs, libHost, appHost,
		LIB_TIMESTAMP = '20170512',
		COM_TIMESTAMP = '20170420a',
		PAGE_TIMESTAMP = (w.___script___ && w.___script___.TIMESTAMP) ? w.___script___.TIMESTAMP : '20160526',
		PRO_TIMESTAMP = (w.___script___ && w.___script___.PRO_TIMESTAMP) ? w.___script___.PRO_TIMESTAMP : '20160526';

	if (l.href.indexOf('useSuperLink') !== -1) {
		libHost = appHost = l.host + '/fefiles';
	} else {
		libHost = 'file.qf.56.com/f';
		appHost = 'file.qf.56.com/f';
	}

	b.config({
		libPath: 'https://'+ libHost +'/modjs/lib',
		appPath: 'https://'+ appHost +'/modjs/app',
		charset: 'utf-8',
		map: [
			function(u) {
				var TIMESTAMP = '20170327a', s = u.pathname;

				if (/modjs\/lib\//.test(s)) {
					TIMESTAMP = LIB_TIMESTAMP;
				} else if (/modjs\/app\/common\//.test(s)) {
					TIMESTAMP = COM_TIMESTAMP;
				} else if (/modjs\/app\/page\/live\/promotion\//.test(s)) {
					TIMESTAMP = PRO_TIMESTAMP;
				} else if (/modjs\/app\/page\//.test(s)) {
					TIMESTAMP = PAGE_TIMESTAMP;
				}

				u.search = TIMESTAMP;
			}
		],
		preload: [
			Function.prototype.bind ? '' : 'compatibility/es5-shim',
			window.JSON ? '' : 'compatibility/json2'
		]
	});

}(window);
