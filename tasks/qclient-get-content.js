'use strict';

var request = require('../lib/request');

module.exports = function(grunt) {

	grunt.registerMultiTask('qclient-get-content', 'get qcms html content', function() {
		var done = this.async();
		var id = this.data.id;
		var token = this.data.token;
		var operation = this.data.operation;
		var object = this.data.object;
		var dest = this.data.dest;
		var baseUrl = 'http://qcms.corp.qihoo.net:8360/api/v2/';
		var data = {
			token: token,
			object: object,
			operation: operation,
			ids: id
		};

		request.get(baseUrl, {data: data}).then(function(html) {
			var result = JSON.parse(html);
			grunt.write(dest, result.data.codes);
		}).then(done);

	});
};





