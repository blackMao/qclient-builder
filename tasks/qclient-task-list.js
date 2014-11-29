'use strict';

var path = require('path');
var fs = require('fs');
var chalk = require('chalk');

module.exports = function(grunt) {

	grunt.registerMultiTask('qclient-task-list', 'List css or js files.', function() {

		var type = this.target;
		var src = this.data.src;
		var dest = this.data.dest+'';
		var srcFiles = [];

		var files = fs.readdirSync(src);
		files.forEach(function(file) {
			srcFiles.push(src+'/'+file);
		});
		var fn = path.join(dest, 'full');
		grunt.file.write(fn, JSON.stringify(srcFiles));
		grunt.log.writeln(chalk.green('✔ ') + type + ' file list generated: ' + fn);
	});
};


