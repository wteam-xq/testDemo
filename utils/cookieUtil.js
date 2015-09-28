// cookies管理类
var CookieUtil = {
  get: function (name){
    var cookie_name = encodeURIComponent(name) + "=",
    cookie_start = document.cookie.indexOf(cookie_name),
    cookie_value = null;

    if (cookie_start > -1) {
      var cookie_end = document.cookie.indexOf(";", cookie_start);
      if (cookie_end == -1) {
        cookie_end = document.cookie.length;
      }
      cookie_value = decodeURIComponent(document.cookie.substring(cookie_start + cookie_name.length, cookie_end));
    }
    return cookie_value;
  },
  set: function(name, value, expires, path, domain, secure) {
    var cookie_text = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    if (expires instanceof Date) {
      cookie_text += "; expires=" + expires.toGMTString(); 
    } else{
      cookie_text += "; expires=" + new Date().toGMTString(); 
    }
    if (path) {
      cookie_text += "; path=" + path;
    }
    if (domain) {
      cookie_text += "; domain=" + domain;
    }
    if (secure) {
      cookie_text += "; secure";
    }
    document.cookie = cookie_text;
  },
  unset: function (name, path, domain, secure) {
    this.set(name, "", new Date(), path, domain, secure);
  }
};

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


var CookieUtil2 = {
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
    o = base.extend({
      encode: encodeURIComponent
    }, o);

    var expires = o.expires, text = o.encode(name) + '=' + o.encode(value);

    if (typeof expires === 'string') { expires = toTimeSpan(expires); }
    if (typeof expires === 'number') {
      var d = new Date();
      d.setTime(d.getTime() + expires);
      expires = d;
    }
    if ( base.isDate(expires) ) { text += '; expires=' + expires.toUTCString(); }

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
    o = base.extend({
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