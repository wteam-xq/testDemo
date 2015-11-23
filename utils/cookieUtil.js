/**
 * 另一cookies库
 */
// 时间单位
var TimeUnit = {
  SEC: 1000,
  MIN: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000
};

// 匹配带单位的时间值
var rTime = /^(\d+(?:\.\d+)?)\s*([a-z]+?)s?$/i;

// 转换为时间数字
function toTimeSpan(val) {
  if ( rTime.test(val) ) {
    var unit = RegExp.$2.toUpperCase();
    // 无此时间单位，抛出异常
    if ( !TimeUnit.hasOwnProperty(unit) ) {
      throw new Error('not such time unit(' + RegExp.$2 + ')');
    }

    return parseFloat(RegExp.$1) * TimeUnit[unit];
  }

  return parseFloat(val) || 0;
}

// 后续放入 公共工具类
var Base = {
  /**
 * 把源对象的属性扩展到目标对象
 * @method extend
 * @param {Any} target 目标对象
 * @param {Any*} [source] 源对象。若有同名属性，则后者覆盖前者
 * @return {Any} 目标对象
 */
  extend: function(target){
    if (target == null) { throw new Error('target cannot be null'); }
    var i = 0, len = arguments.length, p, src;
    while (++i < len) {
      src = arguments[i];
      if (src != null) {
        for (p in src) { target[p] = src[p]; }
      }
    }

    return target;
  },
  /**
   * 判断是否为日期对象
   * underscore.js摘录：
   * // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
    _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
      _['is' + name] = function(obj) {
        return toString.call(obj) === '[object ' + name + ']';
      };
    });
   */
  isDate: function(obj){
    return toString.call(obj) === '[object Date]';
  }
}; 

var CookieUtil = {
  /**
   * 写入cookie
   * @method set
   * @param {String} name cookie名
   * @param {String} value cookie值
   * @param {Object} [o] 参数
   *   @param {String} [o.domain] 所在域
   *   @param {String} [o.path] 所在路径
   *   @param {Date|Number|String} [o.expires] 过期时间。可传入带单位的时间值，例如'1 hour'，
   *     支持的时间单位有sec、min、hour、day，month、year
   *   @param {Boolean} [o.secure] 是否只在https连接中有效
   *   @param {Function(value)} [o.encode=encodeURIComponent] 编码函数
   */
  set: function (name, value, o) {
    o = Base.extend({
      encode: encodeURIComponent
    }, o);

    var expires = o.expires, text = o.encode(name) + '=' + o.encode(value);

    if (typeof expires === 'string') { expires = toTimeSpan(expires); }
    if (typeof expires === 'number') {
      var d = new Date();
      d.setTime(d.getTime() + expires);
      expires = d;
    }
    if ( Base.isDate(expires) ) { text += '; expires=' + expires.toUTCString(); }

    if (o.path) { text += '; path=' + o.path; }
    if (o.domain) { text += '; domain=' + o.domain; }
    if (o.secure === true) { text += '; secure'; }

    document.cookie = text;
  },

  /**
   * 读取cookie
   * @method get
   * @param {String} name cookie名
   * @param {Object} [o] 参数
   *   @param {Function(value)} [o.encode=encodeURIComponent] 编码函数
   *   @param {Function(value)} [o.decode=decodeURIComponent] 解码函数
   * @return {String} cookie值
   */
  get: function(name, o) {
    o = Base.extend({
      encode: encodeURIComponent,
      decode: decodeURIComponent
    }, o);

    name = '; ' + o.encode(name) + '=';
    var cookie = '; ' + document.cookie, beginPos = cookie.indexOf(name), endPos;

    if (beginPos === -1) { return null; }

    beginPos += name.length;
    endPos = cookie.indexOf(';', beginPos);
    if (endPos === -1) { endPos = cookie.length; }

    return o.decode( cookie.substring(beginPos, endPos) );
  },

  /**
   * 移除cookie
   * @method remove
   * @param {String} name cookie名
   * @param {Object} [o] 参数
   *   @param {String} [o.domain] 所在域
   *   @param {String} [o.path] 所在路径
   *   @param {Function(value)} [o.encode=encodeURIComponent] 编码函数
   *   @param {Function(value)} [o.decode=decodeURIComponent] 解码函数
   */
  remove: function (name, o) {
    o = o || { };
    o.expires = new Date(0);

    this.set(name, '', o);
  }
};