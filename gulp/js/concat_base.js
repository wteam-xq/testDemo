(function($, win, doc, undefined){

	//声明命名空间
	$ = {};
	$.browser = {
		msie: /*@cc_on 1 || @*/ 0 ? (doc.documentMode || (doc.compatMode == "CSS1Compat" ? "XMLHttpRequest" in win ? 7 : 6 : 5)) : undefined,
		gecko: win.netscape && nav.product == "Gecko",
		opera: win.opera ? win.opera.version() : "",
		webkit: !!win.WebKitPoint
	};

	$.each = function( obj, fun ){
		if(obj.length >= 0 ){
			for( var i = 0; i< obj.length; i++ ){
				if(fun.call(obj[i], i) == false){
					return;
				}
			}
		}else{
			for( var key in obj ){
				if(fun.call(obj[key], key) == false){
					return;
				}
			}
		}
	}

	$.nameFix = {
		//IE使用，其他使用e.style.styleFloat
		//其他浏览器使用e.style.cssFloat
		"float": $.browser.msie < 9 ? "styleFloat" : "cssFloat"
	}

	if($.browser.msie < 8){
		$.nameFix = {
			"class": "className",
			"for": "htmlFor"
		};
	}else if($.browser.gecko){
		$.nameFix["mousewhee"] = "DOMMouseScroll";
		$.nameFix["innerText"] = "textContent";
	}

	$.attr = function(elm, name, val){
		name = $.nameFix[name] || name;
		if(val == undefined){
			return elm[name] || elm.getAttribute(name);
		}else{
			elm[name] = val;
			elm.setAttribute(name, val);
			return elm;
		}
	}

	$.getClass = function(elm){
		return $.attr(elm, "class") || "";
	}
	$.addClass = function(elm, name){
		return $.attr(elm, "class", $.getClass(elm) + " " + name );;
	}

	$.delClass = function(elm, name){
		return $.attr(elm, "class", $.getClass(elm).replace(new RegExp( "\\s*\\b" + name + "\\b", "g" ), ""));
	}

	$.findPos = function(obj) {
		var curleft = obj.offsetLeft || 0;
		var curtop = obj.offsetTop || 0;
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
		return {x:curleft,y:curtop};
	}

	if (!doc.getElementsByClassName){
		//为document添加getElementsByClassName方法
		doc.getElementsByClassName = function(selector){
			return this.querySelectorAll( "." + selector );
		}
		//为Element的原型添加getElementsByClassName方法
		if(win.Element){
			Element.prototype.getElementsByClassName = doc.getElementsByClassName;
		}
	}

	/*@cc_on @if (@_jscript)
		if($.browser.msie < 9){
			$.eventFix = function(elm){
				if(elm.addEventListener == undefined){
					elm.addEventListener = function (eventType, fun) {
						var me = this;
						me.attachEvent("on" + eventType, function() {
							//获得标准的event
							var e = win.event;
							e.charCode = (e.type == 'keypress') ? e.keyCode: 0;
							e.eventPhase = 2;
							e.isChar = (e.charCode > 0);
							e.pageX = e.x;
							e.pageY = e.y;
							e.preventDefault = function() {
								e.returnValue = false;
							};
							if (e.type == 'mouseout') { 
								e.relatedTarget = e.toElement;
							} else if (e.type == 'mouseover') {
								e.relatedTarget = e.fromElement;
							}
							e.stopPropagation = function() {
								e.cancelBubble = true;
							};
							e.target = e.srcElement;
							e.timeStamp = (new Date()).getTime();
							return fun.call(me, e);
						});
					}
				}
				return elm;
			}

			//为IE的window对象添加W3C标准方法getComputedStyle
			//该方法用于获取对象的推演样式
			win.getComputedStyle = function(elm){
				return elm.currentStyle;
			}

			//为IE的document对象添加W3C标准属性defaultView
			doc.defaultView = win;

			//为document对象添加addEventListener方法
			$.eventFix(doc);

			//HTML5
			//doc.writeln('<!–[if lt IE 9]><script src="'+location.protocol+'//html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]–>');

			if($.browser.msie < 8){

				//修改一个element，使其某个方法返回的对象获得新标准
				$.queryFunFix = function(elm, fun){
					var oldFun = elm[fun];
					elm[fun] = function(args){
						try{
							return $.domFix(oldFun.apply(this, arguments));
						}catch(ex){
							return $.domFix(oldFun(args));
						}
					}
				}

				$.queryFix = function(elm){
					if(!elm.querySelectorAll){
						//为elm对象添加querySelectorAll方法
						elm.querySelectorAll = function( selector ){
							$.addClass(this, "querySelectorAll");
							var rest = doc.querySelectorAll( ".querySelectorAll " + selector );
							$.delClass(this, "querySelectorAll");
							return rest;
						}
						//为elm对象添加getElementsByClassName方法
						elm.getElementsByClassName = doc.getElementsByClassName;

						//为elm对象添加querySelector方法
						elm.querySelector = doc.querySelector;

						//修改elm对象的getElementById方法，使其获得的对象符合新标准
						$.queryFunFix(elm, "getElementById");

					}
					return elm;
				}

				$.domFix = function(elm){
					if(elm.parentNode){
						$.eventFix($.queryFix(elm.parentNode));
					}
					return $.eventFix($.queryFix(elm));;
				}

				//修改document对象的createElement方法，使其生成的对象符合新标准
				$.queryFunFix(doc, "createElement");

				//修改document对象的getElementById方法，使其生成的对象符合新标准
				$.queryFunFix(doc, "getElementById");

				//为document对象添加querySelector方法
				doc.querySelector = function( selector ){
					return this.querySelectorAll( selector )[0];
				}

				//为document对象添加querySelectorAll方法
				doc.querySelectorAll = function( selector ){
					var style = doc.createStyleSheet(),
						elms = [];
					style.addRule(selector, "query:querySelectorAll");
					$.each(this.all, function(){
						if (this.currentStyle.query == "querySelectorAll") {
							elms[elms.length] = $.domFix(this);
						}
					});
					style.owningElement.parentNode.removeChild(style.owningElement);
					return elms;
				}

				$.domFix(doc.documentElement);
				doc.attachEvent("onreadystatechange", function (e){
					$.domFix(doc.body);
				});

				//修复IE背景缓存问题
				doc.execCommand("BackgroundImageCache", false, true);

				//屏蔽报错
				win.onerror=function(ex){
					return true;
				};
			} else {
				//为Element的原型添加addEventListener方法
				$.eventFix(Element.prototype);
			}
		}
	/*@end @*/
	
	document.realy = function(fun){
		if(/loaded|complete/.test(doc.readyState)){
			fun($);
		} else if($.browser.msie < 9){
			var timer = setInterval(function () {
				try {
					doc.body.doScroll('left');
					clearInterval(timer);
					fun($);
				} catch(exp) {};
			},0);
		} else {
			document.addEventListener("DOMContentLoaded", function(){fun($);}, false);
		}
	};
	win.xq = $;

})(window.xq, window, document);