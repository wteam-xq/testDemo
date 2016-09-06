// dom 节点加载完成后执行脚本
window.onload = function(){
	var oriDom = document.getElementById('original_txt'),
		countDownWrap = document.getElementById('txt_count_down'),
		finalDom = document.getElementById('final_txt');
	var txtCountTimer = null,
		txtCountVal = 10;

	init();

	function init(){
		// 5秒后文本变化
		txtCountTimer = setTimeout(changeTxt, 1000);
	}

	// 5秒后原始文本消失，最新文本变空；
	function changeTxt(){
		var spanDom = null;
		clearTimeout(txtCountTimer);
		spanDom = getChildNodes(countDownWrap)[0];
		txtCountVal--;
		spanDom.innerHTML = '' + txtCountVal;
		if (txtCountVal <= 0) {
			oriDom.style.display = 'none';
			countDownWrap.style.display = 'none';
			finalDom.innerHTML = '这是5秒后出现的新文本';
			return true;
		}
		txtCountTimer = setTimeout(changeTxt, 1000);
	}

	// 获得元素的子节点（元素）
	function getChildNodes(p_nodes){
	    var i, _len, _node_item, _child_nodes, _result = [];
	    _child_nodes = p_nodes.childNodes;
	    for (i = 0, _len = _child_nodes.length; i < _len; i++) {
	      _node_item = _child_nodes[i];
	      // nodeType 返回节点类型：元素 1， 属性 2， 文本 3， 注释 4， 文档 9
	      if (_node_item.nodeType === 1) {
	        _result.push(_node_item);
	        // 在IE浏览器中nodeName返回的是小写， 而在chrome返回的是大写，
	        // toLocaleLowerCase方法统一返回值
	        // console.log(_node_item.nodeName.toLocaleLowerCase());
	      }
	    }
	    return _result;
	}
}