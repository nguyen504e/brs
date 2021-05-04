const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const WebpackBar = require('webpackbar')

const conditionList = inCase => (defaultList = [], inCaseList = []) => {
  if (inCase) {
    defaultList.push(...inCaseList)
  }

  return defaultList
}

module.exports = (env, argv) => {
  const isDevelopment = argv.mode !== 'production'
  const inDevConditionList = conditionList(isDevelopment)

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
                ['@babel/preset-env', { modules: false, targets: 'last 2 Chrome versions' }],
                '@babel/preset-react',
              ],
              plugins: inDevConditionList(
                [
                  ['prismjs', { languages: ['markdown'], theme: 'default', css: true }],
                  ['babel-plugin-graphql-tag', { strip: true }],
                ],
                ['react-refresh/babel']
              ),
            },
          },
          exclude: /node_modules/,
          resolve: { extensions: ['.js', '.jsx'] },
        },
        { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      ],
    },
    devServer: { contentBase: '../dist/client' },
    plugins: inDevConditionList(
      [
        new HtmlWebpackPlugin({ appMountId: 'app', template: './src/client/index.html', title: 'DEMO' }),
        new CleanWebpackPlugin(),
        new WebpackBar({ profile: true }),
      ],
      [new webpack.HotModuleReplacementPlugin(), new ReactRefreshWebpackPlugin()]
    ),
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
