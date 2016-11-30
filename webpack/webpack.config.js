var path = require('path');
var SpritesmithPlugin = require('webpack-spritesmith');

module.exports = {
    entry: path.resolve(__dirname, 'app/main.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    plugins: [
        new SpritesmithPlugin({
          src: {
            cwd: path.resolve(__dirname, 'app/images/'),
            glob: '*.png'
          },
          target: {
            image: path.resolve(__dirname, 'build/images/sprite.png'),
            css: path.resolve(__dirname, 'build/css/sprite.css')
          },
          apiOptions: {
            cssImageRef: '../images/sprite.png'
          },
          spritesmithOptions: {
            algorithm: 'top-down'
          }
        })
    ]
};
