const PrerenderPlugin = require('simple-prerender-webpack-plugin')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const PreloadWebpackPlugin = require('preload-webpack-plugin')
const HandleCSSLoader = require('webpack-handle-css-loader')

const define = (opts = {}) => {
  const keys = Object.keys(opts)
  if (keys.length < 1) return null

  const definitions = {}
  keys.forEach(key => {
    const value = JSON.stringify(opts[key])
    definitions[key] = value
  })

  return new webpack.DefinePlugin(definitions)
}

const getConfig = ({ env, IS_PRERENDER } = {}) => {
  const IS_DEV = env === 'development'
  const IS_PROD = env === 'production'
  const IS_PROD_CLIENT = IS_PROD && !IS_PRERENDER
  const sourceMap = true
  const htmlPluginOpts = {
    template: './src/index.ejs',
    title: 'YARB',
  }
  const routes = ['/', '/about/']

  return {
    devtool: IS_DEV ? 'cheap-module-source-map' : 'source-map',
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
      },
    },
    mode: IS_PROD ? 'production' : 'development',
    output: {
      publicPath: '/',
      chunkFilename: IS_PROD_CLIENT ? '[id].[contenthash:8].js' : '[id].js',
      filename: IS_PROD_CLIENT ? '[name].[contenthash:8].js' : '[name].js',
    },
    entry: path.join(__dirname, 'src/entry.js'),
    plugins: [
      IS_PROD_CLIENT &&
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash:8].css',
          chunkFilename: '[id].[contenthash:8].css',
        }),
      !IS_PRERENDER &&
        new PrerenderPlugin({
          routes,
          config: getConfig({ env, IS_PRERENDER: true }),
          customizeHtmlWebpackPluginOpts: htmlPluginOpts,
          friends: [
            new PreloadWebpackPlugin({
              rel: 'preload',
              include: 'initial',
            }),
            new PreloadWebpackPlugin({
              rel: 'prefetch',
            }),
          ],
        }),
      define({
        'process.env.routes': routes,
      }),
    ].filter(Boolean),
    module: {
      rules: [
        IS_PRERENDER && {
          test: /\.css$/,
          loader: 'css-loader/locals',
        },
        !IS_PRERENDER &&
          new HandleCSSLoader({
            minimize: IS_PROD,
            extract: IS_PROD,
            sourceMap,
            cssModules: false,
          }).css(),
        {
          test: /\.js$/,
          oneOf: [
            {
              loader: 'babel-loader',
              include: path.join(__dirname, 'src'),
              options: {
                cacheDirectory: true,
                babelrc: false,
                plugins: ['react-hot-loader/babel', ['emotion', { sourceMap }]],
                presets: [
                  [
                    '@dgeibi/babel-preset-react-app',
                    {
                      targets: IS_PRERENDER
                        ? {
                            node: 'current',
                          }
                        : {
                            browsers: 'last 2 versions',
                          },
                      useBuiltIns: IS_PRERENDER ? false : 'usage',
                    },
                  ],
                ],
              },
            },
            {
              loader: 'babel-loader',
              exclude: /node_modules[\\/]react(-dom)?[\\/]/,
              options: {
                cacheDirectory: true,
                babelrc: false,
                presets: [
                  [
                    '@babel/env',
                    {
                      modules: false,
                    },
                  ],
                ],
              },
            },
          ],
        },
      ].filter(Boolean),
    },
  }
}

module.exports = getConfig
