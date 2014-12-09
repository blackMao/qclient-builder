# grunt-qclient-builder

## 开始
安装所需依赖
```shell
	npm install
```
*下文以changeSkin为例*

## 使用方法
### 修改配置
修改config.js中的project（项目名）和directory（目录名）
```js
	module.exports = {
    	project: 'changeSkin', //css、js名
    	directory: 'changeSkin', //工程目录名
    	token: '', //从QCMS获取
		//cssID: '',  //QCMS样式ID
		//jsID: '',   //QCMS脚本ID
		htmlID: '',   //QCMS页面ID
    	...
    }
```

### 目录规范
采用燕尾服目录规范
```js
	changeSkin
		- js //存放功能JS资源
		- css //存放页面样式资源
		- img //存放图片资源
		index.html //客户端单页
```
生成目录
```js
	//本地测试使用
	build
		QClient.changeSkin.css //图片会上传静床并替换
		QClient.base.js //QClient 基础js
		QClient.changeSkin.js //换肤功能JS
		build.html //替换css和js资源为待上线地址
```

### 运行命令
#### grunt watch
监听js/css/html变化，并生成待上线文件，执行该命令会执行下列任务
```js
	[
		'qclient_clean',
		'qclient_jshint',
//		'qclient_csslint',
		'qclient_copy:src',
		'qclient_list',
		'qclient_listimg',
		'qclient_upload:img',
		'qclient_replaceimg',
		'qclient_concat',
		'qclient_buildhtml',
		'qclient_copy:html',
		'qclient_result'
	]
```

#### grunt check
检测js/css是否符合规范，执行该命令会执行下列任务
```js
	[
		'qclient_jshint',
		'qclient_csslint'
	]
```

#### grunt clean
清除tmp目录内容

#### grunt builder
生成待上线目录
```js
	[
		'clean',
		'check',
		'qclient_image',
		'qclient_concat',
//		'qclient_compress',
		'qclient_buildhtml',
		'qclient_copy:html',
		'qclient_result'
	]
```

#### grunt update
更新页面到QCMS

```js
	[
		'builder',
		'qclient_buildhtml',
		'qclient_update:html'
	]
```

#### grunt publish-test
发布到测试环境

```js
	[
		'builder',
		'qclient_buildhtml',
		'qclient_update:html',
		'qclient_publish:test'
	]
```

#### grunt publish-online
发布到线上环境

```js
	[
		'builder',
		'qclient_buildhtml',
		'qclient_update:html',
		'qclient_publish:online'
	]
```
