'use strict';

module.exports = function(grunt) {

	grunt.loadTasks('tasks');

	//观察者模式
	grunt.registerTask('watch', [
		'qclient_watch'
	]);

	//js、css检测
	grunt.registerTask('check', [
		'qclient_jshint',
		'qclient_csslint'
	]);

	//生成可上线的文件
	grunt.registerTask('builder', [
		'qclient_concat',
		'qclient_compress',
		'qclient_result'
	]);

};
