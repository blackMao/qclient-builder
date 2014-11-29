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

	//测试
	grunt.registerTask('test', [
		'qclient_test'
	]);

	//处理图片
	grunt.registerTask('qclient_image', [
		'qclient_copy:src',
		'qclient_list',
		'qclient_listimg',
		'qclient_upload:img',
		'qclient_replaceimg'
	]);

	//生成可上线的文件
	grunt.registerTask('builder', [
		'clean',
		'check',
		'qclient_image',
		'qclient_concat',
//		'qclient_compress',
		'qclient_buildhtml',
		'qclient_copy:html',
		'qclient_result'
	]);

	//清理环境
	grunt.registerTask('clean', [
		'qclient_clean'
	]);
};
