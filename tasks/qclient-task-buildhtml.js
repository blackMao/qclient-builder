'use strict';

var path = require('path');
var fs = require('fs');
var chalk = require('chalk');

module.exports = function(grunt) {

	grunt.registerMultiTask('qclient-task-buildhtml', 'build html', function() {

		var htmlFile = this.data.html;
		var cssFile = path.resolve(this.data.css);
		var jsBaseFile = path.resolve(this.data.jsBase);
		var jsProjectFile = path.resolve(this.data.jsProject);
		var html = grunt.file.read(path.resolve(htmlFile));
		var cssReg = /(?:\<\!--@css start--\>)(\s+.*\s+)+(?:\<\!--@css end--\>)/i;
		var jsReg = /(?:\<\!--@js start--\>)(\s+.*\s+)+(?:\<\!--@js end--\>)/i;

		var newHtml = html.replace(cssReg, '<link rel="stylesheet" href="'+cssFile+'"').replace(jsReg, '<script type="text/javascript" src="'+jsBaseFile+'"></script><script type="text/javascript" src="'+jsProjectFile+'"></script>');

		grunt.file.write(htmlFile, newHtml);
	});
};


