const path = require('path')
const webpack = require('webpack')
const glob = require('fast-glob')
const { zipObject } = require('lodash')
const nodeExternals = require('webpack-node-externals')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// const pkg = require('./package.json')
const { resolve } = require('path')
const {
  NODE_ENV = 'production'
} = process.env

const getConfig = async () => ({
  entry: resolve(__dirname, 'src/index.ts'),
  mode: NODE_ENV,
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'action'),
    filename: 'index.js',
    // libraryExport: 'default',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'ts-loader'
        ],
        exclude: /node_modules/
      }
    ]
  },
  externals: [
    nodeExternals({
      allowlist: /^(?!@(?:actions|octokit)\/).+/
    })
  ],
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      // APP_VERSION: JSON.stringify(pkg.version),
      // APP_NAME: JSON.stringify(pkg.name),
      NODE_ENV: JSON.stringify(NODE_ENV)
    })
  ],
  watch: NODE_ENV === 'development',
  devtool: NODE_ENV === 'development' ? 'inline-source-map' : 'source-map'
})

module.exports = getConfig
