var path = require('path');
var SpritesmithPlugin = require('webpack-spritesmith');

module.exports = {
    entry: path.resolve(__dirname, 'app/main.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    // plugins: [
    //     new SpritesmithPlugin({
    //         // 目标小图标
    //         src: {
    //             cwd: path.resolve(__dirname, 'app/images/'),
    //             glob: '*.png'
    //         },
    //         // 输出雪碧图文件及样式文件
    //         target: {
    //             image: path.resolve(__dirname, 'build/images/sprite.png'),
    //             css: path.resolve(__dirname, 'build/css/_sprite.scss')
    //             // css: path.resolve(__dirname, 'build/css/sprite.css')
    //         },
    //         // 样式文件中调用雪碧图地址写法
    //         apiOptions: {
    //             cssImageRef: '../images/sprite.png'
    //         },
    //         spritesmithOptions: {
    //             algorithm: 'top-down'
    //         }
    //     })
    // ],
    // 新添加的module属性
	module: {
		loaders: [
            //解析.scss文件,对于用 import 或 require 引入的sass文件进行加载
            { test: /\.scss$/, loader: "style!css!sass" },
            { test:/\.(png|jpg)$/, loader: "url-loader?limit=8192"}
		]
	}
};
