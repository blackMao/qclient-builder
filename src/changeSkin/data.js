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