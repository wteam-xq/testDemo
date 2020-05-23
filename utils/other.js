// 从浏览器地址栏获取指定参数
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