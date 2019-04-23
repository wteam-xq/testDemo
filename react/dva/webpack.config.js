"use strict";
// 测试按需加载，以及 antdesign info, message 方法源码分析
const config = {
  entry: {
    base: "./info_demo/index.js",
  },
  output: {
    // 输出，只可指定一个输出配置
    filename: "[name]_bundle.js", // 输出文件名
    path: "./info_demo/"
  },
  module: {
    // 如何处理项目中不同类型的模块
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // 将 JS 字符串生成为 style 节点
          },
          {
            loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
          },
          {
            loader: "sass-loader" // 将 Sass 编译成 CSS
          },
          {
            loader: "postcss-loader"
          }
        ]
      },
      {
        // 增加加载图片的规则
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "./info_demo/",
              publicPath: "./info_demo/",
              name: "[name][hash].[ext]"
            }
          }
        ]
      },
      {
        // 增加 js ES6 解析规则
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader?cacheDirectory=true",
          query: {
            presets: ["es2015", "stage-0", "react"]
          }
        }
      }
    ]
  }
};

module.exports = (env, argv) => {
  if (Object.is(argv.mode, "development")) {
    config.devtool = "#eval-source-map";
    config.devServer = {
      lazy: true,
      hotOnly: true,
      contentBase: [
        "./info_demo/",
        "./info_demo/"
      ],
      disableHostCheck: true,
      compress: true,
      port: 7103,
      clientLogLevel: "warning"
    };
  }
  return config;
};
