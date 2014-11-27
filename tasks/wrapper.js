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
			files: ['Gruntfiles.js', config.src.jsDir+'/*.js', 'tasks/*.js'],
			options: {
				"noarg": true,
				"noempty": true,
				"eqeqeq": false,
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

	//watch状态
	grunt.registerTask('qclient_watch', function() {

		grunt.loadNpmTasks('grunt-contrib-watch');

		grunt.config('watch', {
			files: [config.src.jsDir+'/*.js', config.src.cssDir+'/*.css'],
			tasks: ['qclient_jshint', 'qclient_csslint', 'qclient_concat', 'qclient_compress']
		});

		grunt.task.run('watch');
	});

	//日志
	grunt.registerTask('qclient_result', function() {
		grunt.log.writeln('QClient-builder result:');
		grunt.log.writeln(chalk.green('✔ ') + 'QClient.'+config.project+'.css: '+config.dest.cssFullFile);
		grunt.log.writeln(chalk.green('✔ ') + 'QClient.base.js: '+config.dest.jsBaseFullFile);
		grunt.log.writeln(chalk.green('✔ ') + 'QClient.'+config.project+'.js: '+config.dest.jsProjectFullFile);
		grunt.log.writeln(chalk.green('✔ ') + 'QClient.'+config.project+'.min.css: '+config.dest.cssMinFile);
		grunt.log.writeln(chalk.green('✔ ') + 'QClient.base.min.js: '+config.dest.jsBaseMinFile);
		grunt.log.writeln(chalk.green('✔ ') + 'QClient.'+config.project+'.min.js: '+config.dest.jsProjectMinFile);
	});
};

