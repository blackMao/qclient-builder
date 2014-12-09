'use strict';

var path = require('path');
var fs = require('fs');
var chalk = require('chalk');

module.exports = function(grunt) {

	grunt.registerMultiTask('qclient-task-buildhtml', 'build html', function() {

		var htmlFile = this.data.html;
		var publishHtmlFile = this.data.publishHtml;
		var buildHtmlFile = this.data.buildHtml;
		var cssFile = path.resolve(this.data.css);
		var jsBaseFile = path.resolve(this.data.jsBase);
		var jsProjectFile = path.resolve(this.data.jsProject);
		var cssReg = /(?:\<\!--@css start--\>)(\s+.*\s+)+(?:\<\!--@css end--\>)/i;
		var jsReg = /(?:\<\!--@js start--\>)(\s+.*\s+)+(?:\<\!--@js end--\>)/i;
		var html, cacheHtml;

		cacheHtml = html = grunt.file.read(path.resolve(htmlFile))

		var buildHtml = html.replace(cssReg, '<link rel="stylesheet" href="'+cssFile+'"').replace(jsReg, '<script type="text/javascript" src="'+jsBaseFile+'"></script><script type="text/javascript" src="'+jsProjectFile+'"></script>');

		var publishHtml = cacheHtml.replace(cssReg, '<style>\r\n'+grunt.file.read(cssFile)+'\r\n</style>').replace(jsReg, '<script type="text/javascript">\r\n'+grunt.file.read(jsBaseFile)+'\r\n</script><script type="text/javascript">\r\n'+grunt.file.read(jsProjectFile)+'\r\n</script>')

		grunt.file.write(buildHtmlFile, buildHtml);
		grunt.file.write(publishHtmlFile, publishHtml);
	});
};


