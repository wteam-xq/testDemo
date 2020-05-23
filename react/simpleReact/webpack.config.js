"use strict";
const path = require("path");
//Happypack 加速代码构建(多线程)
const HappyPack = require("happypack");
const os = require("os");
//创建进程池
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const CleanWebpackPlugin = require("clean-webpack-plugin");
const config = {
  entry: {
    // 入口起点，可以指定多个入口起点
    react_hook_demo: "./src/react_hook_demo.js",
  },
  output: {
    // 输出，只可指定一个输出配置
    filename: "[name].js", // 输出文件名
    path: path.resolve(__dirname, "dist/js") // 输出文件所在的目录
  },
  module: {
    // 如何处理项目中不同类型的模块
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
        ]
      },
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
          }
        ]
      },
      {
        // 增加加载图片的规则
        test: /\.(png|svg|jpg|gif|svga|mp3)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "dist/img/",
              publicPath: "dist/img/",
              name: "[name][hash].[ext]"
            }
          }
        ]
      },
      // 增加 js ES6 解析规则
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader?cacheDirectory=true",
          query: {
            presets: ["es2015", "stage-0", "react"]
          }
        }
      },
    ]
  },
  resolve: {
    extensions: [".js", ".json"],
    alias: {
      "@": path.resolve(__dirname, "src/")
    }
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  },
};

module.exports = (env, argv) => {
  if (Object.is(argv.mode, "development")) {
    config.devtool = "#eval-source-map";
    config.devServer = {
      lazy: true,
      hotOnly: true,
      contentBase: [
        path.resolve(__dirname, "dist/js"),
        path.resolve(__dirname, "dist/img")
      ],
      disableHostCheck: true,
      compress: true,
      port: 7103,
      clientLogLevel: "warning"
    };
    config.plugins = [
      new HappyPack({
        id: "happyBabel",
        // 指定进程池
        threadPool: happyThreadPool,
        loaders: ["babel-loader?cacheDirectory"]
      }),
    ];
  } else {
    config.devtool = "false";
    config.mode = "production";
    config.plugins = [
      new CleanWebpackPlugin({cleanAfterEveryBuildPatterns: ["app/public/webpack/js"]}),
    ];
  }
  return config;
};
