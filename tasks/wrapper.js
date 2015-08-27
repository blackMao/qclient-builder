var config = require('../config');
var path = require('path');
var chalk = require('chalk');

var parseConf = function(conf) {
	if (typeof conf == 'object') {
		Object.keys(conf).forEach(function(k) {
			conf[k] = parseConf(conf[k]);
		});
		return conf;
	} else {
		return conf.replace(/<%=\s*([\w_.$]+)*\s*%>/ig, function(f, k) {
			return k.split('.').reduce(function(o, k) {
				return o[k];
			}, config);
		});
	}
};

config = parseConf(config);

module.exports = function(grunt) {

	//js规范检测
	grunt.registerTask('qclient_jshint', function() {

		grunt.loadNpmTasks('grunt-contrib-jshint');

		grunt.config('jshint', {
			files: ['Gruntfiles.js', config.src.jsDir+'/*.js'],
			options: {
				"noarg": true,
				"noempty": true,
				"eqeqeq": false,
				expr: true,
				"devel": true,
				"jquery": true,
				"browser": true
			}
		});

		grunt.task.run('jshint');
	});

	//css规范检测
	grunt.registerTask('qclient_csslint', function() {

		grunt.loadNpmTasks('grunt-css');

		grunt.config('csslint', {
			check: {
				src: config.src.cssDir+"/*.css",
				rules: {
					'box-model': false,
					'adjoining-classes': false
				}
			}
		});

		grunt.task.run('csslint');
	});

	// 拼接文件
	grunt.registerTask('qclient_concat', function(task) {

		grunt.loadNpmTasks('grunt-contrib-concat');

		grunt.config('concat', {
			css: {
				src: config.list.cssList,
				dest: config.dest.cssFullFile
			},
			jsBase: {
				src: config.list.jsBaseList,
				dest: config.dest.jsBaseFullFile
			},
			jsProject: {
				src: config.list.jsProjectList,
				dest: config.dest.jsProjectFullFile
			}
		});

		grunt.task.run('concat' + (task ? ':' + task : ''));
	});

	// 压缩混淆代码
	grunt.registerTask('qclient_compress', function() {

		grunt.loadNpmTasks('grunt-css');
		grunt.loadNpmTasks('grunt-contrib-uglify');

		grunt.config('cssmin', {
			default: {
				src: config.dest.cssFullFile,
				dest: config.dest.cssMinFile
			}
		});
		grunt.config('uglify', {
			base: {
				src: config.dest.jsBaseFullFile,
				dest: config.dest.jsBaseMinFile
			},
			project: {
				src: config.dest.jsProjectFullFile,
				dest: config.dest.jsProjectMinFile
			}
		});

		grunt.task.run('cssmin');
		grunt.task.run('uglify:base');
		grunt.task.run('uglify:project');
	});

	//`watch状态
	grunt.registerTask('qclient_watch', function() {

		grunt.loadNpmTasks('grunt-contrib-watch');

		grunt.config('watch', {
			files: [config.src.jsDir+'/*.js', config.src.cssDir+'/*.css',  config.src.base+'/*.html'],
			tasks: [
				'qclient_clean',
				'qclient_jshint',
//				'qclient_csslint',
				'qclient_copy:src',
				'qclient_list',
				'qclient_listimg',
				'qclient_upload:img',
				'qclient_replaceimg',
				'qclient_concat',
				'qclient_buildhtml',
				'qclient_copy:html'
			]
		});

		grunt.task.run('watch');
	});

	//测试
	grunt.registerTask('qclient_test', function() {

		grunt.loadNpmTasks('grunt-contrib-connect');
		grunt.loadNpmTasks('grunt-contrib-qunit');

		grunt.config('connect', {
			options: {
				port: 8000,
				hostname: 'localhost',
				keepalive: true
			},
			server: {
				options: {
					open: true,
					base: '.'
				}
			}
		});

		grunt.config('qunit', {
			files: config.test
		});

		//grunt.task.run('qunit');
		grunt.task.run('connect:server');
	});

	//检出js、css文件
	grunt.registerTask('qclient_list', function() {

		grunt.config('qclient-task-list', {
			css: {
				src: path.resolve(config.tmp.src, config.src.cssDir),
				dest: config.tmp.listCss
			},
			js: {
				src: path.resolve(config.tmp.src, config.src.jsDir),
				dest: config.tmp.listJs
			}
		});

		grunt.task.run('qclient-task-list');
	});


	// 获取图片列表
	grunt.registerTask('qclient_listimg', function() {

		grunt.config('qclient-task-listimg', {
			default: {
				src: [
					grunt.file.readJSON(path.resolve(config.tmp.listCss, "full")),
					grunt.file.readJSON(path.resolve(config.tmp.listJs, "full"))
				],
				dest: path.resolve(config.tmp.listImg, 'full')
			}
		});

		grunt.task.run('qclient-task-listimg');
	});

	// 上传图片
	grunt.registerTask('qclient_upload', function(task) {

		grunt.config('qclient-task-upload', {
			img: {
				src: grunt.file.readJSON(path.resolve(config.tmp.listImg, 'full')),
				dest: path.resolve(config.tmp.uploadImg)
			}
		});

		grunt.task.run('qclient-task-upload' + (task ? ':' + task : ''));
	});

	// 替换图片地址
	grunt.registerTask('qclient_replaceimg', function() {

		grunt.config('qclient-task-replaceimg', {
			options: {
				imgMap: grunt.file.readJSON(config.tmp.uploadImg)
			},
			default: {
				expand: true,
				src: [
					grunt.file.readJSON(path.resolve(config.tmp.listCss, "full")),
					grunt.file.readJSON(path.resolve(config.tmp.listJs, "full"))
				],
				dest: ''
			}
		});

		grunt.task.run('qclient-task-replaceimg');
	});

	//复制文件
	grunt.registerTask('qclient_copy', function(task) {

		grunt.loadNpmTasks('grunt-contrib-copy');

		grunt.config('copy', {
			src: {
				expand: true,
				src: [config.src.jsDir+'/**', config.src.cssDir+'/**', config.src.imgDir+'/**', config.src.htmlList],
				dest: config.tmp.src
			},
			html: {
				expand: true,
				cwd: config.tmp.src,
				src: 'build.html',
				dest: config.dest.base,
				filter: 'isFile'
			}
		});

		grunt.task.run('copy' + (task ? ':' + task : ''));
	});

	// 清理环境
	grunt.registerTask('qclient_clean', function() {

		grunt.loadNpmTasks('grunt-contrib-clean');

		grunt.config('clean', {
			default: {
				src: ['.tmp', config.tmp.base + '/**']
			}
		});

		grunt.task.run('clean');
	});

	//生成html
	grunt.registerTask('qclient_buildhtml', function() {

		grunt.config('qclient-task-buildhtml', {
			index: {
				css: config.dest.cssFullFile,
				jsBase: config.dest.jsBaseFullFile,
				jsProject: config.dest.jsProjectFullFile,
				html: config.tmp.html,
				buildHtml: config.tmp.buildHtml,
				publishHtml: config.tmp.publishHtml
			}
		});

		grunt.task.run('qclient-task-buildhtml');
	});

	//测试获取qcms内容
	grunt.registerTask('qclient_get_content', function() {

		grunt.config('qclient-get-content', {
			htmlContent: {
				token: config.token,
				object: 'page',
				operation: 'retrieve',
				id: config.htmlID,
				dest: path.resolve(config.tmp.cacheHtml)
			}
		});

		grunt.task.run('qclient-get-content');
	});

	//更新QCMS文件
	grunt.registerTask('qclient_update', function(task) {

		grunt.task.requires('qclient_buildhtml');

		grunt.config('qclient-task-update', {
			//todo qcms接口不支持
			/*css: {
				token: config.token,
				object: 'style',
				operation: 'retrieve',
				id: config.cssID,
				src: path.resolve(config.dest.cssFullFile)
			},
			js: {
				token: config.token,
				object: 'script',
				operation: 'update',
				id: config.jsID,
				src: path.resolve(config.dest.jsProjectFullFile)
			},*/
			html: {
				token: config.token,
				object: 'page',
				operation: 'update',
				id: config.htmlID,
				src: config.tmp.publishHtml
			}
		});

		grunt.task.run('qclient-task-update'+ (task ? ':' + task : ''));
	});

	//上线测试环境和线上环境
	grunt.registerTask('qclient_publish', function(task) {

		grunt.task.requires('qclient_update:html');

		grunt.config('qclient-task-pubilsh', {
			test: {
				token: config.token,
				object: 'page',
				operation: 'publish',
				id: config.htmlID,
				dest : 'test',
				source : 'page'
			},
			online: {
				token: config.token,
				object: 'page',
				operation: 'publish',
				id: config.htmlID,
				dest : 'online',
				source : 'page'
			}
		});

		grunt.task.run('qclient-task-pubilsh'+ (task ? ':' + task : ''));
	});
};

