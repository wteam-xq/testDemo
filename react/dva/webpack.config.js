"use strict";
const path = require("path");
// 测试按需加载，以及 antdesign info, message 方法源码分析
const config = {
  entry: {
    index: "./info_demo/index.js"
  },
  output: {
    // 输出，只可指定一个输出配置
    filename: "[name]_bundle.js", // 输出文件名
    path: path.resolve(__dirname, "info_demo/") // 输出文件所在的目录
  },
  module: {
    // 如何处理项目中不同类型的模块
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: "postcss-loader"
          },
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "less-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "less-loader"
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
              outputPath: "./img/",
              publicPath: "./img/",
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
            presets: ["react", "es2015", "stage-0"],
            plugins: [
              [
                "import",
                {
                  libraryName: "antd",
                  libraryDirectory: "es",
                  style: "css"
                }
              ]
            ]
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
        path.resolve(__dirname, "info_demo/"),
        path.resolve(__dirname, "info_demo/")
      ],
      disableHostCheck: true,
      compress: true,
      port: 7001,
      clientLogLevel: "warning"
    };
  }
  return config;
};
