module.exports = {
	project: 'changeSkin',
	base : '../<%= project %>',
	// 输出目录配置
	dest : {
		// 输出目录根目录
		base : '<%= base %>/build',
		// 输出css文件
		cssFullFile: '<%= dest.base %>/QClient.<%= project %>.css',
		cssMinFile: '<%= dest.base %>/QClient.<%= project %>.min.css',
		//输出js文件
		jsBaseFullFile: '<%= dest.base %>/QClient.base.js',
		jsBaseMinFile: '<%= dest.base %>/QClient.base.min.js',
		jsProjectFullFile: '<%= dest.base %>/QClient.<%= project %>.js',
		jsProjectMinFile: '<%= dest.base %>/QClient.<%= project %>.min.js'
	},
	// 源文件配置
	src : {
		// JS汇总文件目录
		jsDir : '<%= base %>/js',
		// CSS汇总文件目录
		cssDir : '<%= base %>/css',
		// 图片目录
		imgDir : '<%= base %>/img'
	},
	//list
	list: {
		jsList: '<%= src.jsDir %>/*.js',
		jsBaseList: ['<%= src.jsDir %>/core.js', '<%= src.jsDir %>/logic_factory.js', '<%= src.jsDir %>/data.js', '<%= src.jsDir %>/utils.js'],
		jsProjectList: ['<%= src.jsDir %>/<%= project %>/utils.js', '<%= src.jsDir %>/<%= project %>/data.js', '<%= src.jsDir %>/<%= project %>/logic.js', '<%= src.jsDir %>/<%= project %>/ui.js'],
		cssList: '<%= src.cssDir %>/*.css'
	}
};
