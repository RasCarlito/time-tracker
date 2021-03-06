const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const production = process.env.NODE_ENV === 'production'

const entry = {
  index: path.resolve(__dirname, 'src/index.js')
}
const html = {
  template: path.resolve(__dirname, 'src/index.html'),
  favicon: path.resolve(__dirname, 'src/favicon.png')
}
let plugins = [
  new webpack.NoEmitOnErrorsPlugin(),
  new HtmlWebpackPlugin(html),
  new ServiceWorkerWebpackPlugin({
    entry: path.resolve(__dirname, 'src/sw.js')
  }),
  new webpack.optimize.OccurrenceOrderPlugin()
]

if (production) {
  delete html.favicon

  plugins = plugins.concat([
    new FaviconsWebpackPlugin({
      logo: path.resolve(__dirname, 'src/favicon.png'),
      emitStats: false
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    }),
    // @TODO Re-activate
    // new webpack.optimize.UglifyJsPlugin({
    //   minimize: true,
    //   output: { comments: false },
    //   compress: { warnings: false, drop_console: false }
    // }),
    new CompressionPlugin()
  ])
} else {
  entry['dev-server'] = 'webpack/hot/dev-server'
  entry['dev-server-client'] = 'webpack-dev-server/client?http://localhost:3000/'

  plugins = plugins.concat([
    new webpack.HotModuleReplacementPlugin()
  ])
}

module.exports = {
  module: {
    rules: [
      // pre loaders

      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   enforce: 'pre',
      //   loader: 'standard-loader'
      // },

      // loaders
      {
        test: /\.(css|scss|sass)$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [['es2015', { modules: false }]],
            plugins: ['syntax-dynamic-import']
          }
        }]
      },
      {
        test: /.html$/,
        loaders: [
          'html-loader'
        ]
      },
      {
        test: /manifest.json$/,
        loader: 'file-loader?name=manifest.json!web-app-manifest-loader'
      },
      {
        test: /\.(ttf|eot|svg|jpg|jpeg|png|gif)(\?[\s\S]+)?$/, loader: 'file-loader'
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader'
      }
    ]
  },
  resolve: {
    modules: [
      'node_modules',
      'src'
    ]
  },
  plugins,
  // @TODO Re-activate
  // devtool: production ? '' : 'source-map',
  devtool: 'source-map',
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, '.tmp/public')
  },
  entry
}
