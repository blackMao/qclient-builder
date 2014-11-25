/**
 * @Overview 核心模块
 * 1.创建命名空间
 * 2.初始化公共事件
 */
(function(window) {
	'use strict';

	var QClient = window.QClient = {
		//框架类型
		$ : jQuery,
		//工具类
		utils: {},
		//UI集合
		ui: {},
		//数据集合
		data: {},
		//事件
		events: {},
		//调试模式
		DEBUG: false
	};
	
})(window);
/**
 * @Overview  逻辑模块工厂
 * 1.定义各功能公用的功能
 * 2.单功能间数据缓存
 */
(function(Q) {
	//'use strict';

	var $ = Q.$;
	var $events = $(Q.events);

	var Logic = function(props) {
		this.name = 'func_' + Q.utils.getGuid();
		this.extend(props);

		this._initFlag = false;
		this._data = {};
	};

	$.extend(Logic.prototype, {
		/**
		 * 初始化函数
		 */
		init : function() {
			var self = this;
			if (!self._initFlag) {
				self._initFlag = true;
				Q.ui[self.name].init(self);
				self.initJsBind();
			}
			return self;
		},
		/**
		 * 获取是否已经初始化的标记
		 * @returns {boolean}
		 */
		isInit: function() {
			return this._initFlag;
		},
		/**
		 * 获取数据
		 * @param {String} key
		 * @param {*} defaultValue
		 * @returns {*}
		 */
		get : function(key, defaultValue) {
			var value = this._data[key];
			return value !== undefined ? value : defaultValue;
		},
		/**
		 * 设置数据
		 * @param {String|Object} key
		 * @param {*} value
		 */
		set : function(key, value) {
			if ($.isPlainObject(key)) {
				$.extend(this._data, key);
			} else {
				this._data[key] = value;
			}
			return this;
		},
		/**
		 * 清理数据
		 */
		clear : function() {
			this._data = {};
			return this;
		},
		/**
		 * 客户端调用页面JS
		 */
		initJsBind: function () {
			var self = this;
			window.jsBind = function(funcName) {
				var args = [].slice.apply(arguments, [1]);
				return self[funcName].apply(self, args);
			};
		},
		
		/**
		 * 扩展实例方法
		 * @param {...object} - 待mixin的对象
		 */
		extend : function() {
			var args = [].slice.apply(arguments);
			args.unshift(this);
			$.extend.apply(null, args);
		}
	});
	
	$.each(['on', 'off', 'one', 'trigger'], function(i, type) {
		Logic.prototype[type] = function() {
			$.fn[type].apply($events, arguments);
			return this;
		};
	});

	Q.getLogic = function(props) {
		return new Logic(props);
	};
})(QClient);
/**
 * @Overview  数据接口模块
 * 数据交互，如果接口很少可以放到logic中
 */
(function(Q){

	var $ = Q.$;

    /**
     * 交互类
     * @param {object} param 要提交的数据
     * @param {Object} [ajaxOpt] ajax配置
     * @constructor
     */
    var Sync = function(param, ajaxOpt) {
		if(!param) {
            return;
        }
        var protocol = this.protocol = 'http';
 
        var ajaxOptDefault = {
            url: protocol + '://'+location.host,
            type: 'GET',
            dataType: 'jsonp',
            timeout: 20000
        };
 
        this.protocol = protocol;
        this.param = $.extend({}, param);
        this.ajaxOpt = $.extend({data: this.param}, ajaxOptDefault, ajaxOpt);
        this.HOST = protocol + '://'+location.host;
    };
	
	/* 示例：window.external.getSID(arg0)需要改为 external_call("getSID",arg0) 的形式进行调用 */
	function external_call(extName,arg0,arg1,arg2){
		var args = arguments, fun = args.callee, argsLen = args.length, funLen = fun.length;
		if(argsLen>funLen){
			throw new Error("window.external_call仅接受"+funLen+"个形参，但当前(extName:"+extName+")传入了"+argsLen+"个实参，请适当调整external_call，以保证参数正常传递，避免丢失！");
		}
		if(window.external_call_test){
			return window.external_call_test.apply(null,[].slice.apply(args));
		}
		/* 这里的参数需要根据external_call的形参进行调整，以保证正常传递
		 *   IE系列external方法不支持apply、call...
		 *   甚至部分客户端对参数长度也要求必须严格按约定传入
		 *   所以保证兼容性就必须人肉维护下面这么一坨..
		*/
		if(argsLen==1)return window.external[extName]();  
		if(argsLen==2)return window.external[extName](arg0);  
		if(argsLen==3)return window.external[extName](arg0,arg1);  
		if(argsLen==4)return window.external[extName](arg0,arg1,arg2);  
	}
 
    $.extend(Sync.prototype, {
        /**
         * 通过get方式(jsonp)提交
         * @param {String} [url] 请求链接
         * @return {Object} promise对象
         */
        get: function(url) {
            var self = this;
            var send = $.ajax(url, this.ajaxOpt);
            return send.then(this.done, function(statues) {
                return self.fail(statues);
            });
        },
		/**
		 * 通知客户端
		 */
		informClient: function() {
			var self = this;
			var deferred = $.Deferred();
			var args = [].slice.apply(arguments);
			try {
				var data = external_call.apply(null, args);
				deferred.resolve(data);
			}catch (e) {
				deferred.reject({
					errno: 10000,
					errmsg: '通知客户端异常'
				});
			}
			return deferred.promise()
				.then(self.done, self.fail);
		},
        /**
         * 收到响应时默认回调
         * @param {Object} data 数据
         * @return {Object}
         */
        done: function (data) {
            var deferred = $.Deferred();
			deferred.resolve(data);
            return deferred.promise();
        },
        /**
         * 未收到响应时默认回调
         * @param {Object} error 错误信息
         * @return {Object}
         */
        fail: function(error) {
            var deferred = $.Deferred();
            deferred.reject({
                errno: 999999,
                errmsg: '网络超时，请稍后重试'
            });
            return deferred.promise();
        }
    });
	
	QClient.Sync = Sync;

})(QClient);

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

(function(Q) {
	'use strict';

	var Sync = Q.Sync;
	
	Q.sync = {
		//获取class
		getClassify: function(catgoryConf) {
			var sync = new Sync();
			return sync.informClient('onGetClassify', catgoryConf);
		},
		//获取当前皮肤
		getCurrentSkin: function() {
			var sync = new Sync();
			return sync.informClient('GetCurrentSkinName');
		}
	}
})(QClient);
/**
 * @Overview  逻辑交互
 * 接收UI状态，通知UI新操作
 */
(function(Q){
	'use strict';
	
	var utils = Q.utils;
	
	var logic = Q.getLogic({
		name: 'changeSkin',
		
		run: function(opts){
			var _this = this;
			var catgoryConf = opts.catgoryConf;
			
			_this.init();
			
			Q.sync.getClassify(utils.stringify(catgoryConf));
				
			Q.sync.getCurrentSkin()
				.done(function(data) {
					var currKey = data.extra_info;
					_this.setCurrentSkin( currKey );
				});
		},
		
		setCurrentSkin: function (key) {
			this.trigger('setCurrentSkin', key);
		},
		
		setDownLoadStart: function(key) {
			this.trigger('setDownLoadStart', key);
		},
		
		setDownLoadSuccess: function(key) {
			this.trigger('setDownLoadSuccess', key);
		},
		
		setDownLoadFailed: function(key) {
			this.trigger('setDownLoadFailed', key);
		}
	});

	Q.changeSkin = function(opts) {
		logic.run(opts);
	};

})(QClient);

/**
 * @Overview  UI模块
 * 页面交互，通知状态
 */
(function(Q){
	'use strict';

	var $ = Q.$;
	var $skinlist = $('.skin-list');
	
	var ui = {
		init : function(model) {
			this.model = model;
			this.initEvent();
			this.initModelEvent();
		},
		
		initModelEvent: function() {
			var _this = this;
			
			this.model
				.on('setDownLoadFailed', function( e, key ){
					var $item = _this.getCurrentItem( key );
					_this.stopLoading( $item );
					$item.addClass('err');
				})
				.on('setDownLoadSuccess', function( e, key ){
					var $item = _this.getCurrentItem( key );
					_this.stopLoading( $item );
				})
				.on('setDownLoadStart', function( e, key ){
					var $item = _this.getCurrentItem( key );
					var $loading = $item.find('i span');
					var i = 0;
					$item.addClass('loading').removeClass('err hover');
					$item[0].timer = setInterval(function(){
						i = i >= 12 ? 0 : i;
						var x = -i*32 ;
						$loading.css('left' , x );
						i++;
					},100)
				})
				.on('setCurrentSkin', function( e, key ){
					var $item = _this.getCurrentItem( key );
					_this.stopLoading( $item );
					$item.addClass('selected').siblings().removeClass('selected');
				});
		},
		
		initEvent: function() {
			var _this = this;
			//Q.utils.disabledKey();
			
			$skinlist.on('click','a',function(){
				var $item = $(this).parent();
				if( $item.hasClass('loading') || $item.hasClass('selected')){
					return false;
				}
			});
			
			//hover状态
			$skinlist.on('mouseover','a',function(){
				var $parent = $(this).parent();
				(!$parent.hasClass('loading') && !$parent.hasClass('selected')) && $parent.addClass('hover');
			}).on('mouseout','a',function(){
				$(this).parent().removeClass('hover');
			});

			//图片延迟加载
			var $img = $skinlist.find('img');

			$img.lazyload({
				container: $skinlist
			});

			//初始化滚动条
			_this.scrollBar = new CusScrollBar({
				scrollDir:"y",
				contSelector: $skinlist ,
				scrollBarSelector:".scroll",
				sliderSelector:".slider",
				wheelBindSelector:".wrapper",
				wheelStepSize:151
				
			});
			_this.scrollBar._sliderW.hover(function(){ 
				$(this).addClass('cus-slider-hover');
			}, function(){
				$(this).removeClass('cus-slider-hover');
			})
			_this.scrollBar.on("resizeSlider",function(){
				$(".slider-bd").css("height",this.getSliderSize()-10);
			}).resizeSlider();
		},
		
		reload: function () {
			var _this = this;
			var $cur = [];
			$(".item").each(function(){
				if( $(this).css('display') == 'block' ){
					$cur.push($(this));
				}
			});
			$.each( $cur , function( index ){
				if( index <= 9 ){
					var $img = $(this).find('img');
					$img.attr('src',$img.attr('data-original'));
				}
			});
			if( $cur.length <=6 ){
				$(_this.scrollBar.options.scrollBarSelector).hide();
			}
			else{
				$(_this.scrollBar.options.scrollBarSelector).show();
			}
			$(_this.scrollBar.options.sliderSelector).css('top',0);
			_this.scrollBar.resizeSlider().scrollToAnim(0);
		},
		
		LoadCatgory : function( type ){
			if( type && type!="all" ){
				var $items = $skinlist.find('.item[data-type="'+ type +'"]');
				$skinlist.find('.item').hide();
				$items.fadeIn(100);
			}
			else{
				$skinlist.find('.item').fadeIn(100);
			}
			this.reload();
		},
		
		setErrByLevel : function(){
			console&&console.log('等级不符，快去升级吧！');
		},
		
		getCurrentItem: function( key ){
			return $skinlist.find('.item[data-key="'+ key +'"]');
		},
		
		stopLoading : function( $item ){
			if( $item.hasClass('loading') ){
				clearInterval($item[0].timer);
				$item[0].timer = null;
				$item.removeClass('loading');
				$item.find('i span').css('left','0');
			}
		}
	};

	Q.ui.changeSkin = {
		init : function() {
			ui.init.apply(ui, arguments);
		}
	};
})(QClient);