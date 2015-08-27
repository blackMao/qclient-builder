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