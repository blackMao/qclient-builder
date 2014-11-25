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
