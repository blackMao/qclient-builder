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
