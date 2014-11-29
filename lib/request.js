'use strict';

var Q = require('q');
var url = require('url');
var path = require('path');
var http = require('http');
var https = require('https');
var querystring = require('querystring');
var BufferHelper = require('bufferhelper');
var urlParse = url.parse;
var extend = require('../lib/util').extend;

var Request = function(url, data, headers) {
	this.url = url;
	this.data = data;
	this.headers = headers;
};

extend(Request.prototype, {
	get url() {
		return this._url;
	},

	set url(url) {
		this._url = url;
		this.ishttps = url.indexOf('https') == 0;
		this.http = this.ishttps ? https : http;
	},

	get data() {
		return this._data;
	},

	set data(data) {
		this._data = data;
	},

	get headers() {
		return this._headers;
	},

	set headers(headers) {
		if (!headers) {
			this._headers = {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36'
			};
		} else {
			extend(this._headers, headers);
		}
	},

	request : function(method, url, opt) {
		method = ['get', 'post', 'put', 'delete'].indexOf(method.toLocaleLowerCase()) ? method : 'get';
		method = method.toUpperCase();

		if (typeof url == 'object') {
			opt = url;
			url = null;
		}

		opt = opt || {};

		var data = opt.data || this._data || {};
		var key, type;
		if (!opt.raw) {
			for (key in data) {
				type = typeof data[key];
				if (data.hasOwnProperty(key) && (type == 'object' || type == 'array')) {
					data[key] = JSON.stringify(data[key]);
				}
			}
			data = querystring.encode(data);
		}

		var headers = {};

		url = url || opt.url || this._url;

		if (method == 'GET' && data) {
			url += url.indexOf('?') > 0 ? '&' : '?';
			url += data;
		} else if (method == 'POST') {
			var ext = {
				'Content-Length': data.length
			};
			if (!opt.raw) {
				ext['Content-Type'] = 'application/x-www-form-urlencoded';
			}
			extend(headers, ext);
		}

		var urlInfo = urlParse(url);

		var options = {
			hostname: urlInfo.hostname,
			port: urlInfo.port,
			path: urlInfo.path,
			headers: extend(headers, this._headers, opt.headers),
			method: method
		};

		if (this.ishttps) {
			extend(options, {
				rejectUnauthorized: false
			});
		}

		var defer = Q.defer();

		var bufferHelper = new BufferHelper();

		var req = this.http.request(options, function(res) {
			res.on('data', function (chunk) {
				bufferHelper.concat(chunk);
			});
			res.on('end', function () {
				var contentType = res.headers['content-type'] || 'text/plain';
				var result = bufferHelper.toBuffer();
				if (contentType.match(/^text|javascript|json/)) {
					result = result.toString();
				}
				defer.resolve(result);
			});
		});

		req.on('error', function(error) {
			defer.reject(error);
		});

		req.setTimeout(opt.timeout || 10*1000, function() {
			defer.reject(new Error('Request Time Out'));
		});

		if (method == 'POST' && data) {
			req.write(data);
		}

		req.end();

		return defer.promise;
	}
});

var get = function(url, opts) {
	return new Request(url).request('get', opts);
};

var post = function(url, data, opts) {
	return new Request(url, data).request('post', opts);
};

module.exports = {
	Request: Request,
	get: get,
	post: post
};

