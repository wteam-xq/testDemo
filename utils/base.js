/*by wteam-xq 2015年7月7日， 兼容IE类*/
// 自定义事件
function EventTarget(){
  this.handlers = {};
}
// 自定义事件的原型，给实例的方法
EventTarget.prototype = {
  constructor: EventTarget,
  addHandler: function(type, handler){
      if (typeof this.handlers[type] == "undefined"){
          this.handlers[type] = [];
      }
      this.handlers[type].push(handler);
  },
  fire: function(event){
      if (!event.target){
          event.target = this;
      }
      if (this.handlers[event.type] instanceof Array){
          var handlers = this.handlers[event.type];
          for (var i = 0, len = handlers.length; i < len; i++){
              handlers[i](event);
          }
      }
  },
  removeHandler: function(type, handler){
      if (this.handlers[type] instanceof Array){
          var handlers = this.handlers[type];
          for (var i = 0, len = handlers.length; i < len; i++){
              if (handlers[i] === handler){
                  break;
              }
          }
          handlers.splice(i, 1);
      }
  }
};

// 事件兼容处理公共类
var EventUtil = {
  // 添加事件
  addHandler: function(element, type, handler){
    if (element.addEventListener){
      element.addEventListener(type, handler, false);
    }else if (element.attachEvent){
      element.attachEvent("on" + type, handler);
    }else{
      element["on" + type] = handler;
    }
  },
  getEvent: function(event){
    return event ? event : window.event;
  },
  getTarget: function(event){
    return event.target || event.srcElement;
  },
  // 阻止默认方法
  preventDefault: function(event){
    if (event.preventDefault){
        event.preventDefault();
    }else{
        event.returnValue = false;
    }
  },
  // 移除事件
  removeHandler: function(element, type, handler){
    if (element.addEventListener){
        element.removeEventListener(type, handler, false);
    }else if (element.detachEvent){
        element.detachEvent("on" + type, handler);
    }else{
        element["on" + type] = null;
    }
  },
  // 阻止冒泡
  stopPropagation: function(event){
    if (event.stopPropagation){
        event.stopPropagation();
    }else{
        event.cancelBubble = true;
    }
  }
};

// 根据节点类型、样式名 获得节点列表
function getElementsByClassName(node_type, class_name){
  var i, j, j_len, len, n_item, node_list, item_classes, r = [];
  // 如果浏览器支持该方法直接返回
  if (document.getElementsByClassName) {
    node_list = document.getElementsByClassName(class_name);
    for (i = 0, len = node_list.length; i < len; i++) {
      n_item = node_list[i];
      if (n_item.nodeName.toLocaleLowerCase() == node_type) {
        r.push(n_item);
      }
    }
  } else {
    node_list = document.getElementsByTagName(node_type);
    for (i = 0, len = node_list.length; i < len; i++) {
      n_item = node_list[i];
      item_classes = n_item.getAttribute('class');
      // 通过空格 获得类名数组
      item_classes = !item_classes?[]:item_classes.split(' ');
      for (j = 0, j_len = item_classes.length; j < j_len; j++) {
        if (item_classes[j] === class_name) {
          r.push(n_item);
          break;
        }
      }
    }
  }
  return r;
}
// getElementsByName 该方法不兼容ie6、ie7
if (!document.getElementsByName){
  document.getElementsByName = function(name){
    // 获取
    var result = [], i, len, el, els;
    els = document.getElementsByTagName('*');
    for (i = 0, len = els.length; i < len; i++) {
      el = els[i];
      if (el.name === name) {
        result.push(el);
      }
    }
    return result;
  }
}

// 兼容浏览器 getElementsByClassName 不兼容 ie6、ie7、ie8
if (!document.getElementsByClassName) {
  document.getElementsByClassName = function(cls){
    //定义一个空数组用来存储获取到指定className元素
    var ret = [];
    //获取页面所有元素
    var els = document.getElementsByTagName('*');
    //获取页面元素的className等于传入的那个名字
    for (var i = 0; i < els.length; i++) {
      if (!!els[i].className && (els[i].className === cls
              || els[i].className.indexOf(cls + ' ') >= 0
              || els[i].className.indexOf(' ' + cls + ' ') >= 0
              || els[i].className.indexOf(' ' + cls) >= 0 ) ) {
        //把获取到的元素压入空数组ret【】中
        ret.push(els[i]);
      }
    }
    //返回这个结果集，相当于之前的getElementsByClassName返回的 结果集。
    return ret;
  }
}

if (!document.querySelectorAll) {
  document.querySelectorAll = function (selectors) {
      var style = document.createElement('style'), elements = [], element;
      document.documentElement.firstChild.appendChild(style);
      document._qsa = [];

      style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
      window.scrollBy(0, 0);
      style.parentNode.removeChild(style);

      while (document._qsa.length) {
          element = document._qsa.shift();
          element.style.removeAttribute('x-qsa');
          elements.push(element);
      }
      document._qsa = null;
      return elements;
  };
}

if (!document.querySelector) {
  document.querySelector = function (selectors) {
      var elements = document.querySelectorAll(selectors);
      return (elements.length) ? elements[0] : null;
  };
}
// 判断浏览器是否支持indexOf (indexOf 为ecmaScript5新方法 IE8以下（包括IE8）只支持到ECMAScript3)
if (!Array.prototype.indexOf){
  // 新增indexOf方法
  Array.prototype.indexOf = function(item){
    var result = -1, a_item = null;
    if (this.length == 0){
      return result;
    }
    for(var i = 0, len = this.length; i < len; i++){
      a_item = this[i];
      if (a_item === item){
        result = i;
        break;
      }  
    }
    return result;
  }
}

// 用于在IE6和IE7浏览器中，支持Element.querySelectorAll方法
var qsaWorker = (function () {
  var idAllocator = 10000;

  function qsaWorkerShim(element, selector) {
      var needsID = element.id === "";
      if (needsID) {
          ++idAllocator;
          element.id = "__qsa" + idAllocator;
      }
      try {
          return document.querySelectorAll("#" + element.id + " " + selector);
      }
      finally {
          if (needsID) {
              element.id = "";
          }
      }
  }

  function qsaWorkerWrap(element, selector) {
    return element.querySelectorAll(selector);
  }

  // Return the one this browser wants to use
  return document.createElement('div').querySelectorAll ? qsaWorkerWrap : qsaWorkerShim;
})();


/**
 * 创建类
 * @method createClass
 * @param {Function} constructor 构造函数
 * @param {Object} [methods] 方法
 * @param {Function} [Parent] 父类
 * @param {Function(args)|Array} [parentArgs] 传递给父类的参数，默认与子类构造函数参数一致
 * @return {Function} 类
 */
var createClass = function(constructor, methods, Parent, parentArgs) {
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
};

/**
 * 常用方法: dom 类名操作
 */
function addClass(dom, className) {
  if (!dom) {
    return false;
  }
  var classList = dom.getAttribute('class'),
      i, len, _name, hasClass = false;

  if ( classList ) {
    classList = classList.split(" ");
    for (i = 0, len = classList.length; i < len; i++) {
      _name = classList[i];
      if (_name == className) {
        hasClass = true;
        break;
      }
    }
    if (!hasClass) {
      classList.push(className);
      classList = classList.join(" ");
      dom.setAttribute('class', classList);
    }
  }

}

function removeClass(dom, className) {
  if (!dom) {
    return false;
  }
  var classList = dom.getAttribute('class'),
      i, len, _name, newClassList = [];
  if ( classList ) {
    classList = classList.split(" ");
    for (i = 0, len = classList.length; i < len; i++) {
      _name = classList[i];
      if (_name != className) {
        newClassList.push(_name);
      }
    }
    
    classList = newClassList.join(" ");
    dom.setAttribute('class', classList);
  }

}

// 动态插入脚本(待更新，加入加载完成的回调函数) 待研究：http://www.cnblogs.com/w-y-f/p/3469211.html
function insertScript(url, callback){
    var script = document.createElement("script");
    var scriptOnloadEvent = 'onload' in document.createElement('script') ? 'onload' : 'onreadystatechange';
    var head = document.getElementsByTagName('head')[0];

    var scriptOnload = function() {
        if ( !script.readyState || /loaded|complete/.test(script.readyState) ) {
            script[scriptOnloadEvent] = null;
            // 移除script节点
            // if (script.parentNode) { 
            //     script.parentNode.removeChild(script); 
            // }
            script = null;
            callback();
        }
    };
    script.setAttribute("type",'text/javascript');
    script.src = url;
    script.charset = "UTF-8";
    head.insertBefore(script, head.firstChild);
    script[scriptOnloadEvent] = scriptOnload;
}
