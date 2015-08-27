'use strict';

var path = require('path');
var util = require('util');
var chalk = require('chalk');

module.exports = function(grunt) {

	var imgList;

	grunt.registerMultiTask('qclient-task-listimg', 'Validate files before compile', function() {

		imgList = [];

		var re = {
			js: /(src|href)\s*=\s*(['"]?)([^'"\?>]+)\.(js|css)(\?[^>'"\s]*)?\2/ig,
			css: /url\s*\(\s*(['"]?)([\w\-\/\.]+\.(?:png|jpg|gif|jpeg|ico|cur))(\?[^\?'"\)\s]*)?\1\s*\)/ig
		};

		this.files.forEach(function(file) {
			file.src.forEach(function(fp) {
				var ext = path.extname(fp).substr(1),
					fc = grunt.file.read(fp),
					result;

				while(result = re[ext].exec(fc)) {
					var src = result[2].indexOf('http') == 0 ? result[2] : path.join(fp, '..', result[2]);

					if (imgList.indexOf(src) == -1) {
						imgList.push(src);
						if (!grunt.file.exists(src)) {
							var location = getLocation(fc, result.index).join(':'),
								warning = util.format('Cannot found Image file! img:%s source:%s(%s)', src, fp, location);
							grunt.fail.warn(warning);
						}
					}
				}

			});
		});

		saveImgList(this.files[0].dest);
		grunt.log.writeln(chalk.green('✔') + ' list image files success.');
	});

	var saveImgList = function(fp) {
		grunt.file.write(fp, JSON.stringify(imgList));
	};

	var getLocation = function(content, index) {
		var part = content.substr(0, index).split(/\n/),
			line = part.length,
			span = part.pop().length;
		return [line, span];
	};
};


