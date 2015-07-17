/*by wteam-xq 2015年7月7日， 事件工具类*/
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

// 根据节点类型、样式名 获得子类的节点
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