# AnG 动态创意模板
## 背景
&emsp;&emsp;为了让动态创意模板工程化，提高开发效率以及优化流程，才有了该项目

## 项目依赖
- [Yeoman](http://yeoman.io/) 建立 webapp 脚手架
- [Bower](https://bower.io/) 进行前端资源包管理
- [Gulp](http://gulpjs.com/) 进行打包压缩打码等的自动化构建工具
- [Python](https://www.python.org) Version 3.5.* 用于上传到搜狐云静态文件的脚本语言

## 目录结构

├── gulpfile.js                  // gulp 打包文件 <br>
├── package.json                 // npm 包依赖文件 <br>
├── bower.json                   // bower 包依赖文件 <br>
├──app                           // 主要开发目录 <br>
│   ├── styles                   // css 样式文件目录 <br>
│   │   └── base.css <br>
│   ├── scripts                  // js 脚本文件目录 <br>
│   │   └── base.js <br>
│   ├── images                   // 静态图片存放目录 <br>
│   │   └── base.png <br>
│   ├── fonts                    // 字体文件存放目录 <br>
│   │   └── base.eot <br>
│   └── index.html               // html 页面文件 <br>
├── dist                         // 打包压缩好的发布文件 (执行 gulp build 才会生成) <br>
│    ├──styles                   // 压缩后的 css 文件 <br>
│    ├──script                   // 压缩后的 js 文件 <br>
│    ├──images                   // 压缩处理后的图片 <br>
│    ├──fonts                    // 字体文件 <br>
│    └──index.html               // 压缩后的 html 文件 <br>
├──sync.py                       // 上传搜狐云 CDN 文件的 python 脚本文件 <br>
├──node_modules                  // npm 包依赖安装后的目录 (执行 npm install 才会生成) <br>
├──bower_components              // bower 包依赖安装后的目录 (执行 bower install 才会生成) <br>
└──test                          // 前端自动化测试目录 mocha <br>

## 项目运行

1. 初始化

```
    npm install
```

2. web 包初始化

```
    bower install
```

3. 自动化打包

```
    gulp build
```

> python 依赖于 python 3.5.* 版本，需要安装 [scs-vulpo-python3](http://38b0db0bc4be2.cdn.sohucs.com/scs-vulpo-python3.zip) 包才可以上传搜狐云


## 项目说明


## P.S.
