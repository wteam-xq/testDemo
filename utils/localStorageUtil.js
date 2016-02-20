/*20151206 localStorage工具类， userData 相关教程：http://www.cnblogs.com/QLeelulu/archive/2008/03/29/1129322.html
 * 低版本ie浏览器中userData模拟实现localStorage
 * 低版本浏览器（ie6 ie7）使用userData注意事项：清除浏览器缓存时无法清除userData数据，需手动到系统目录清除对应的xml文件；
 * userData在 XP系统中的位置： C盘 关键字“userData”搜索即可。
 */

var localStorage = window.localStorage, 
		useDataFlag = localStorage == null;

if ( useDataFlag ) {
	// IE下通过UserData模拟localStorage
	localStorage = {
		init: function() {
			var input = this._input = document.createElement('input');
			input.type = 'hidden';
			input.addBehavior('#default#userData');
			document.body.insertBefore(input, document.body.firstChild);

			this._filename = window.location.hostname;
			input.load(this._filename);
		},
		_save: function(expires) {
			if (!expires) {
				// 默认过期时间为1年
				expires = new Date();
				expires.setFullYear(expires.getFullYear() + 1);
			}
			this._input.expires = expires.toUTCString();
			this._input.save(this._filename);
		},
		getItem: function(key) { 
			return this._input.getAttribute(key); 
		},
		setItem: function(key, val) {
			this._input.setAttribute(key, val);
			this._save();
		},
		removeItem: function(key) {
			this._input.removeAttribute(key);
			this._save();
		},
		clear: function() {
			// 1979年12月31日23时59分59秒
			// 这是删除UserData的最靠前的一个有效expires时间了
			this._save( new Date(315532799000) );
			this._input.load(this._filename);
		}
	};

	localStorage.init();
}
