# sketchSearchMobi

基于多点触摸的三维模型草图检索原型应用

A Prototype System of Sketch-Based 3D Model Retrieval Based on Multi-Touch

### 采用的技术

-  `Node.js` 构建服务器
-   `requirejs` 进行模块化开发
-   `jQuery` 进行DOM操作
-   `HTML5 Canvas` 实现画布功能
-   `D3.js` 实现草图可视化
-   `Three.js` 实现模型展示

### 环境配置

- `Node.js`：[官网](https://nodejs.org/zh-cn/)
- SDK（opencv、boost）：[下载地址](http://pan.baidu.com/s/1slwbV1V)，密码 w5d2

	把 SDK 放到目录 `E:\sketchsearch-dll\SDK` 下（任何目录均可），然后配置一下环境变量，即创建一个新的环境变量`SKETCHSEARCH_SDK`，将目录路径作为值添加：

	![配置SDK环境变量](http://i2.muimg.com/1949/0db42e592ef8191d.png)
	

- 安装 node-gyp 及 Phton 环境：[Node调用C++（dll）](http://www.cnblogs.com/Ruth92/p/6209953.html)、[Python官网](https://www.python.org/)

		npm install node-gyp -g
    
    > 注意： 根据 node-gyp 的GitHub显示，请务必保证你的 python 版本介于 2.5.0 和 3.0.0 之间。

### 目录结构

- /bin
	- www --------------------------------- 配置监听端口号，目前端口号为：3000
- /include -------------------------------- 特征提取算法所需的相关库文件，链接库需要
- /public
	- /css -------------------------------- css样式文件
	- /img -------------------------------- 图片文件（[百度云](http://pan.baidu.com/s/1c2H0G3A)）
		- /traindata-nobg ----------------- 透明背景的训练数据图片 **（从百度云上下载）**
		- /traindata-nobg-small ----------- 透明背景的训练数据小图片 **（从百度云上下载）**
		- /traindata-small ---------------- 非透明背景的训练数据小图片 **（从百度云上下载）**
	- /js
		- /app
			- main.js --------------------- 主文件
			- painter.js ------------------ 绘画容器
			- basePlate.js ---------------- 绘画底板
			- displayer.js ---------------- 视图容器
			- container.js ---------------- 检索容器
			- historyBar.js --------------- 单独卡片历史记录
			- historyCva.js --------------- 画布卡片历史记录
			- objDisplay.js --------------- 模型展示
			- sketchGallery.js ------------ 草图库可视化
			- data.js --------------------- 草图可视化数据
		- /common
			- global.js ------------------- 全局对象（可调整至/app文件夹）
			- listener.js ----------------- 事件监听器
		- /lib
		- app.js
	- /supply（[百度云]()）
		- /102_shrec2012png ---------------- 线画图 **（从百度云上下载）**
		- /models -------------------------- obj 格式模型 **（从百度云上下载）**
		- params.json ---------------------- 参数配置
- /router
	- index.js ---------------------------- 页面路由，读取txt文件中的路径，并返回
	- result.txt
- /views
	- error.ejs
	- index.ejs --------------------------- 页面视图
- app.js
- package.json ----------------------------- 所需的依赖包配置文件
- params.json ------------------------------ 检索算法（链接库）所需参数，已改为相对路径，在静态资源/supply中
- query.js ---------------------------------
- upload.js -------------------------------- 必须放在和 query.js 及链接库等同目录下，用于调用链接库实现检索功能
- imagesearcherdll.dll
- imagesercherdll.lib

> 注意：静态资源中 `/img` 和 `/supply` 中的图片和模型数据需从[百度云盘]()上进行下载后放置到对应目录中。

### 启动服务

#### `npm install`：

安装相关包

#### `npm start`：

在浏览器输入：`localhost:3000`，并切换至移动模式，则可使用该应用。

#### 问题解决

`npm install` 时遇到的问题：

	if not defined npm_config_node_gyp

请参考 [Node调用C++（dll）](http://www.cnblogs.com/Ruth92/p/6209953.html)，需要配置
