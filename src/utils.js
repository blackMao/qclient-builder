/**
 * @Overview  工具方法
 * 各种子功能方法：cookie、滚动条、屏蔽按键等等
 */
(function(Q){
	'use strict';

	var utils = Q.utils;
	var guid = parseInt(new Date().getTime().toString().substr(4), 10);

	/**
	 * 获取唯一ID
	 * @returns {number}
	 */
	utils.getGuid = function() {
		return guid++;
	};

	/**
	 * 通用回调解析函数
	 * @param {String|Function|Boolean} callback 回调函数 或 跳转url 或 true刷新页面
	 * @returns {Function} 解析后的函数
	 */
	utils.parseCallback = function(callback) {
		if ($.type(callback) == 'function') {
			return callback;
		} else if (callback === true) {
			return function() {
				location.reload();
			};
		} else if ($.type(callback) == 'string' && callback.indexOf('http') === 0) {
			return function() {
				location.href = callback;
			};
		} else {
			return function() {};
		}
	};
	
	/**
	 * 阻止各种按键
	 */
	utils.disabledKey = function() {
		document.onkeydown = function(e){
            //屏蔽刷新  F5  Ctrl + F5  Ctrl + R Ctrl + N
            var event = e || window.event;
            var k = event.keyCode;
            if((event.ctrlKey === true && k == 82) || (event.ctrlKey === true && k == 78) || (k == 116) || (event.ctrlKey === true && k == 116))
            {
                event.keyCode = 0;
                event.returnValue = false;
                event.cancelBubble = true;
                return false;
            }
        };
        document.onclick = function( e ){
            //屏蔽 Shift + click Ctrl + click

            var event = e || window.event;

            var tagName = '';
            try{
                tagName = (event.target || event.srcElement).tagName.toLowerCase();
            }catch(error){}

            if( (event.shiftKey || event.ctrlKey) && tagName == 'a' ){
                event.keyCode = 0;
                event.returnValue = false;
                event.cancelBubble = true;
                return false;
            }
        };
        document.oncontextmenu = function(){
            //屏右键菜单
            return false;
        };
        document.ondragstart = function(){
            //屏蔽拖拽
            return false;
        };
        document.onselectstart = function( e ){
            //屏蔽选择，textarea 和 input 除外
            var event = e || window.event;
            var tagName = '';
            try{
                tagName = (event.target || event.srcElement).tagName.toLowerCase();
            }catch(error){}

            if( tagName != 'textarea' && tagName != 'input'){
                return false;
            }
        };
	};
	/**
	 * 对象转字符串
	 * @param {Object} obj
	 */
	utils.stringify = function(obj) {        
		if ("JSON" in window) {
			return JSON.stringify(obj);
		}

		var t = typeof (obj);
		if (t != "object" || obj === null) {
			// simple data type
			if (t == "string") obj = '"' + obj + '"';

			return String(obj);
		} else {
			// recurse array or object
			var n, v, json = [], arr = (obj && obj.constructor == Array);

			for (n in obj) {
				v = obj[n];
				t = typeof(v);
				if (obj.hasOwnProperty(n)) {
					if (t == "string") {
						v = '"' + v + '"';
					} else if (t == "object" && v !== null){
						v = Safe.stringify(v);
					}

					json.push((arr ? "" : '"' + n + '":') + String(v));
				}
			}

			return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
		}
	};

})(QClient);
