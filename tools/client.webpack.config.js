const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const BabelReactRefresh = require('react-refresh/babel')
const WebpackBar = require('webpackbar')

module.exports = (env, argv) => {
  const isDevelopment = argv.mode !== 'production'
  const babelPlugins = []
  const webpackPlugins = [
    new HtmlWebpackPlugin({ appMountId: 'app', template: './src/client/index.html', title: 'DEMO' }),
    new LodashModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new WebpackBar({ profile: true }),
  ]
  if (isDevelopment) {
    babelPlugins.push(BabelReactRefresh)
    webpackPlugins.push(new webpack.HotModuleReplacementPlugin(), new ReactRefreshWebpackPlugin())
  }

  return {
    entry: './src/client/index.jsx',
    output: {
      path: path.resolve(__dirname, '../dist/client'),
      filename: '[name].[fullhash].js',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: false,
                    targets: 'last 2 Chrome versions',
                  },
                ],
                '@babel/preset-react',
              ],
              plugins: babelPlugins,
            },
          },
          exclude: /node_modules/,
          resolve: {
            extensions: ['.js', '.jsx'],
          },
        },
        { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      ],
    },
    devServer: { contentBase: '../dist/client' },
    plugins: webpackPlugins,
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: { test: /[\\/]node_modules[\\/]/, name: 'vendors', chunks: 'all' },
        },
      },
    },
  }
}
