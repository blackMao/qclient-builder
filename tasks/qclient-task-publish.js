'use strict';

var request = require('../lib/request');
var chalk = require('chalk');
var path = require('path');

module.exports = function(grunt) {

	grunt.registerMultiTask('qclient-task-pubilsh', 'publish html', function() {
		var done = this.async();
		var id = this.data.id;
		var token = this.data.token;
		var operation = this.data.operation;
		var object = this.data.object;
		var dest = this.data.dest;
		var source = this.data.source;
		var baseUrl = 'http://xxx.com?token='+token+'&object='+object+'&operation='+operation+'&ids='+id;

		request.post(baseUrl, {
			control: {
				dest : dest,
				source : source
			}
		}, {
			headers: {
				'Content-Type': 'application/json'
			},
			isJSON: true
		}).then(function(result) {
				result = JSON.parse(result);
				if(result.errno == 0) {
					grunt.log.writeln(chalk.green('✔ ') + 'Publish success!');
				}else {
					grunt.fail.fatal(result.errmsg);
				}
			},function () {
				grunt.fail.fatal('timeout, try again');
			}).then(done);

	});
};





