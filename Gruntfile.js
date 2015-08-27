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
		'qclient_copy:html'
	]);

	//清理环境
	grunt.registerTask('clean', [
		'qclient_clean'
	]);

	//更新文件到QCMS
	grunt.registerTask('update', [
		'builder',
		'qclient_buildhtml',
		'qclient_update:html'
	]);

	//上传测试环境
	grunt.registerTask('publish-test', [
		'builder',
		'qclient_buildhtml',
		'qclient_update:html',
		'qclient_publish:test'
	]);

	//上传线上环境
	grunt.registerTask('publish-online', [
		'builder',
		'qclient_buildhtml',
		'qclient_update:html',
		'qclient_publish:online'
	]);
};
