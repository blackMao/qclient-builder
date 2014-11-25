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