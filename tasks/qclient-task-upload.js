'use strict';

var Q = require('q');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var qUtil = require('../lib/util');
var request = require('../lib/request');

module.exports = function(grunt) {

	grunt.registerMultiTask('qclient-task-upload', 'Upload file to cdn', function() {
		var done = this.async();
		var target = this.target;
		var options = this.options({
			tuchuang_sync : 'http://tuchuang.com/sync',
			tuchuang_async : 'http://tuchuang.com/async',
			tuchaung_query : 'http://tuchuang.com/query',
			jingchaung_sync : 'http://jingchuan.com/sync'
		});

		var promises = this.files.map(function(file) {

			var list = file.src;
			if (list.length == 0) {
				grunt.log.writeln('There is no file to upload');
				return Q();
			}

			var promise;

			if (target == 'img') {
				promise = upload.file(list, options.tuchuang_sync);
			} else {
				promise = upload.code(list, options.jingchaung_sync);
			}

			return promise
				.then(function(data) {
					grunt.file.write(file.dest, JSON.stringify(data));
					grunt.log.writeln(chalk.green('✔ ') + 'Upload ' + list.join() + ' success!');
				}, function() {
					grunt.fail.warn('Upload ' + list.join() + ' failed');
				});
		});

		Q.allSettled(promises).then(done);
	});


	var upload = {
		file: function(list, api) {

			var allowExts = ['png', 'jpg', 'jpeg', 'gif', 'cur'];
			list.forEach(function(fp) {
				var ext = path.extname(fp).substr(1).toLowerCase();
				if (allowExts.indexOf(ext) == -1) {
					grunt.fail.warn('Error image type ' + ext + ' file:' + fp);
				}
			});

			var data = {
				EFFECTIVE : 1,
				RULES : {
					optimize: []
				},
				IMGSTREAM : arrToObj(list.map(function(v) {
					return qUtil.urlencode(grunt.file.read(v, {encoding: 'binary'}));
				}))
			};

			return request.post(api, data)
				.then(function(html) {
					var data = JSON.parse(html);
					var result = {};
					list.forEach(function(pic, i) {
						var d = data[i].DATA.optimize,
							server = d.KEY.charCodeAt(10) % 10;
						result[path.join(pic)] = d.URL[server];
					});
					return result;
				});
		},

		code: function(list, api) {
			var allowExts = ['css', 'js'];
			var result = {};
			var promises = list.map(function(fp) {
				var ext = path.extname(fp).substr(1).toLowerCase();
				if (allowExts.indexOf(ext) == -1) {
					grunt.fail.warn('Error file type ' + ext + ' file:' + fp);
				}

				var fc = grunt.file.read(fp);

				var data = {
					code : fc,
					type : ext
				};

				return request.post(api, data)
					.then(function(response) {
						var data = JSON.parse(response);
						if (data.errno > 0) {
							grunt.fail.fatal('Upload ' + fp + ' failed. ' + data.errmsg);
						}
						var name = path.basename(fp, '.min' + path.extname(fp));
						result[name] = data.result;
					});
			});

			return Q.all(promises).thenResolve(result);
		}
	}
};

var arrToObj = function(arr) {
	var obj = {};
	arr.forEach(function(v, k) {
		obj[k] = v;
	});
	return obj;
};

