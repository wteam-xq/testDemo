
/**
 * 从浏览器地址栏获取指定参数
 * new URL 浏览器支持： https://developer.mozilla.org/zh-CN/docs/Web/API/URL/URL
 */
(function(){
  window.URLParamsObj = {
    UrlObj:null,
    UrlOriginObj: null,
    getVal: function(key) {
      let value = "";
      if (this.UrlObj) {
        value = this.URLObj.searchParams.get(key);
      } else if (this.UrlOriginObj) {
        value = this.UrlOriginObj[key];
      }
      return value;
    },
    // 从非浏览器地址栏URL 获取指定参数
    getQueryString: function(name, url) {
      try {
        let URLObj = new URL(url);
        return URLObj.searchParams.get(name);
      } catch (error) {
        let reg = new RegExp("(^|&|\\?)" + name + "=([^&]*)(&|$)", "i");
        let result = url.match(reg);
        if (result != null) return decodeURI(result[2]);
        return null;
      }
    }
  };
  try {
    window.URLParamsObj.URLObj = new URL(window.location.href);
  } catch (error) {
    if (window.location.href.indexOf('?') !== -1) {
      var urlParams = window.location.href.split('?')[1].split('&');
      var _urlObj = {};
      for (var i = 0; i < urlParams.length; i++) {
        var _params = urlParams[i];
        var _key = _params.split("=")[0];
        var _val = _params.split("=")[1];
        _urlObj[_key] = _val;
      }
      window.URLParamsObj.UrlOriginObj = _urlObj;
    }
    console.error("browser not support new URL");
  }

  /**  
   * 网上教程: https://www.cnblogs.com/cc-freiheit/p/10827372.html 
   * lodash方法: https://www.lodashjs.com/docs/lodash.debounce
   * */
  // 防抖函数
  function debounce(fn, wait) {
    var timer = null;
    return function () {
      var context = this
      var args = arguments
      if (timer) {
          clearTimeout(timer);
          timer = null;
      }
      timer = setTimeout(function () {
        fn.apply(context, args)
      }, wait)
    }
  }

  // 节流函数
  function throttle(fn, gapTime) {
    let _lastTime = null;
    return function () {
      let _nowTime = + new Date()
      if (_nowTime - _lastTime > gapTime || !_lastTime) {
        fn();
        _lastTime = _nowTime
      }
    }
  }
})()