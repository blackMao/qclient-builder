// 包装函数
module.exports = function(grunt) {

  // 任务配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfiles.js', 'src/*.js']
    },
    concat: {
      build: {
	src: ['src/core.js', 'src/logic_factory.js', 'src/data.js', 'src/utils.js', 'src/changeSkin/data.js', 'src/changeSkin/logic.js', 'src/changeSkin/ui.js'],
        dest: 'build/QClient.js'
      }
    },
    uglify: {
      build: {
	src: 'build/QClient.js',
	dest: 'build/QClient.min.js'
      }
    },
    qunit: {
      files: ['test/*.html']
    },
    watch: {
      files: ['<%= jshint.files%>'],
      tasks: ['jshint', 'concat', 'uglify']
    },
    connect: {
      server: {
        options: {
          port: 8000,
          base: '.'
        }
      }
    }
  });

  // 任务加载
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat'); 
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch'); 
  grunt.loadNpmTasks('grunt-contrib-connect');

  // 自定义任务
  grunt.registerTask('test', ['connect', 'jshint', 'qunit']);
  grunt.registerTask('builder', ['jshint', 'concat', 'uglify']);

};
