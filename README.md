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
- SDK：opencv、boost（需要进行编译并进行环境配置，补充。。。）

### 目录结构

- /bin
	- www --------------------------------- 配置监听端口号，目前端口号为：3000
- /include -------------------------------- 特征提取算法所需的相关库文件，链接库需要
- /public
	- /css -------------------------------- css样式文件
	- /img -------------------------------- 图片文件（[百度云](http://pan.baidu.com/s/1c2H0G3A)）
		- /traindata-nobg ----------------- 透明背景的训练数据图片**（从百度云上下载）**
		- /traindata-nobg-small ----------- 透明背景的训练数据小图片**（从百度云上下载）**
		- /traindata-small ---------------- 非透明背景的训练数据小图片**（从百度云上下载）**
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
			- global.js ------------------- 全局对象
			- listener.js ----------------- 事件监听器
		- /lib
		- app.js
	- /supply（[百度云](http://pan.baidu.com/s/1c2H0G3A)）
		- 102_shrec2012png ---------------- 线画图**（从百度云上下载）**
		- models -------------------------- off 格式模型**（从百度云上下载）**
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

> 注意：静态资源中 `/img` 和 `/supply` 中的图片和模型数据需从[百度云盘](http://pan.baidu.com/s/1c2H0G3A)上进行下载后放置到对应目录中。

### 启动服务

#### `npm install`：

安装相关包

#### `npm start`：

在浏览器输入：`localhost:3000`，并切换至移动模式，则可使用该应用。
