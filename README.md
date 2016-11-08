# AnG 动态创意模板
## 背景
&emsp;&emsp;为了让动态创意模板工程化，提高开发效率以及优化流程，才有了该项目

## 项目依赖
- [Yeoman](http://yeoman.io/) 建立 webapp 脚手架
- [Bower](https://bower.io/) 进行前端资源包管理
- [Gulp](http://gulpjs.com/) 进行打包压缩打码等的自动化构建工具
- [Python](https://www.python.org) Version 3.5.* 用于上传到搜狐云静态文件的脚本语言

## 目录结构

├── gulpfile.js                  // gulp 打包文件
├── package.json                 // npm 包依赖文件
├── bower.json                   // bower 包依赖文件
├──app                           // 主要开发目录
│   ├── styles                   // css 样式文件目录
│   │   └── base.css
│   ├── scripts                  // js 脚本文件目录
│   │   └── base.js
│   ├── images                   // 静态图片存放目录
│   │   └── base.png
│   ├── fonts                    // 字体文件存放目录
│   │   └── base.eot
│   └── index.html               // html 页面文件
├── dist                         // 打包压缩好的发布文件 (执行 gulp build 才会生成)
│    ├──styles                   // 压缩后的 css 文件
│    ├──script                   // 压缩后的 js 文件
│    ├──images                   // 压缩处理后的图片
│    ├──fonts                    // 字体文件
│    └──index.html               // 压缩后的 html 文件
├──sync.py                       // 上传搜狐云 CDN 文件的 python 脚本文件
├──node_modules                  // npm 包依赖安装后的目录 (执行 npm install 才会生成)
├──bower_components              // bower 包依赖安装后的目录 (执行 bower install 才会生成)
└──test                          // 前端自动化测试目录 mocha

## 项目运行

## 项目说明

## P.S.
