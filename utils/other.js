
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
})()