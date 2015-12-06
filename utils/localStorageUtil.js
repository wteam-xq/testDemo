/*20151206 localStorage工具类，低版本ie浏览器中userData模拟实现localStorage*/
var localStorage = {
	userDataFlag: false,
	init: function(){
		try{
			window.localStorage.getItem('xq');
		}catch(e){
			this.userDataFlag = true;
		}
	},
	setItem: function(key, val){
		if (this.userDataFlag) {

		} else{
			localStorage.setItem(key, val);
		}
	},
	getItem: function(key){
		if (this.userDataFlag){

		} else{
			localStorage.getItem(key);
		}
	},
	removeItem: function(key){
		if(this.userDataFlag) {

		} else{
			localStorage.removeItem(key);
		}
	}
};

var IEUserData = {
	
};

localStorage.init();