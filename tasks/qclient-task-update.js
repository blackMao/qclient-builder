'use strict';

var request = require('../lib/request');
var chalk = require('chalk');
var path = require('path');

module.exports = function(grunt) {

	grunt.registerMultiTask('qclient-task-update', 'update qcms content', function() {

		var done = this.async();
		var id = this.data.id;
		var token = this.data.token;
		var operation = this.data.operation;
		var object = this.data.object;
		var src = path.resolve(this.data.src);
		var baseUrl = 'http://qcms.corp.qihoo.net:8360/api/v2?token='+token+'&object='+object+'&operation='+operation+'&ids='+id;
		
        request.post(baseUrl, {
			data: {
				codes:  grunt.file.read(src)
			}
		}, {
			headers: {
				'Content-Type': 'application/json'
			},
	        isJSON: true
		}).then(function(result) {
			result = JSON.parse(result);
		    if(result.errno == 0) {
			    grunt.log.writeln(chalk.green('✔ ') + 'Update success!');
		    }else {
			    grunt.fail.fatal(result.errmsg);
		    }
		},function () {
		        grunt.fail.fatal('timeout, try again');
        }).then(done);

	});
};





