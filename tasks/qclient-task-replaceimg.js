'use strict';

var path = require('path');
var util = require('util');
var chalk = require('chalk');

module.exports = function(grunt) {

	grunt.registerMultiTask('qclient-task-replaceimg', 'Replace image src with cdn url', function() {

		var re = {
			js: /(src|href)\s*=\s*(['"]?)([^'"\?>]+)\.(js|css)(\?[^>'"\s]*)?\2/ig,
			css: /url\s*\(\s*(['"]?)([\w\-\/\.]+\.(?:png|jpg|gif|jpeg|ico|cur))(\?[^\?'"\)\s]*)?\1\s*\)/ig
		};

		var options = this.options();

		this.files.forEach(function(file) {
			file.src.forEach(function(fp) {
				var ext = path.extname(fp).substr(1),
					fc = grunt.file.read(fp),
					found = false;

				fc = fc.replace(re[ext], function() {
					var src = arguments[2];
					src = src.indexOf('http') == 0 ? src : path.join(fp, '..', src);
					var img = options.imgMap[src];
					found = true;
					if (img) {
						return arguments[0].replace(arguments[2], img);
					}

					grunt.fail.warn(chalk.grey(src + ' has not been uploaded.'));
				});

				found && grunt.file.write(file.dest, fc);
			});
		});

		grunt.log.writeln(chalk.green('✔') + ' replace image src success.');
	});
};


