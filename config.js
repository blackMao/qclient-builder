module.exports = {
	project: 'changeSkin', //css、js名
	directory: 'changeSkin', //工程目录名
	token: '', //从QCMS获取
	//cssID: '',  //QCMS样式ID
	//jsID: '',   //QCMS脚本ID
	htmlID: '',   //QCMS页面ID
	base : '../<%= directory %>',
	// 临时目录配置
	tmp : {
		// 临时目录根目录
		base : 'tmp',
		src : '<%= tmp.base %>/src/<%= directory%>',
		list: '<%= tmp.base %>/list',
		// CSS文件列表目录
		listCss : '<%= tmp.list %>/css',
		// JS文件列表目录
		listJs : '<%= tmp.list %>/js',
		// 图片文件列表目录
		listImg : '<%= tmp.list %>/img',
		// 图片上传结果列表文件
		uploadImg : '<%= tmp.listImg %>/img.json',
		html: '<%= tmp.src %>/index.html',
		buildHtml: '<%= tmp.src %>/build.html',
		publishHtml: '<%= tmp.src%>/publish.html'
	},
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
		jsProjectMinFile: '<%= dest.base %>/QClient.<%= project %>.min.js',
		html: '<%= dest.base %>/index.html'
	},
	// 源文件配置
	src : {
		base: '<%= base %>',
		// JS汇总文件目录
		jsDir : '<%= base %>/js',
		// CSS汇总文件目录
		cssDir : '<%= base %>/css',
		// 图片目录
		imgDir : '<%= base %>/img',
		//html文件
		htmlList: '<%= base %>/*.html'
	},
	//list
	list: {
		jsList: '<%= tmp.src %>/js/*.js',
		jsBaseList: ['base_js/core.js', 'base_js/utils.js', 'base_js/logic_factory.js', 'base_js/data.js'],
		jsProjectList: ['<%= tmp.src %>/js/utils.js', '<%= tmp.src %>/js/data.js', '<%= tmp.src %>/js/logic.js', '<%= tmp.src %>/js/ui.js'],
		cssList: '<%= tmp.src %>/css/*.css'
	},
	test: ['test/*.html']
};
