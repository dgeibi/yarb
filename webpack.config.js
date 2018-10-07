const PrerenderPlugin = require('simple-prerender-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
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

const routes = ['/', '/about/']

module.exports = ({ env } = {}) => {
  const IS_DEV = env === 'development'
  const IS_PROD = env === 'production'
  const sourceMap = true

  const getJSRules = forNode => {
    const target = forNode
      ? {
          node: 'current',
        }
      : {
          browsers: 'last 2 versions',
        }

    const ssr = {
      compiler: 'simple-prerender-webpack-plugin',
      parser: {
        node: {
          console: false,
          global: false,
          process: false,
          __filename: false,
          __dirname: false,
          Buffer: false,
          setImmediate: false,
          module: false,
        },
      },
    }

    return [
      {
        ...(forNode && ssr),
        loader: 'babel-loader',
        include: path.join(__dirname, 'src'),
        options: {
          cacheDirectory: true,
          babelrc: false,
          plugins: [
            !forNode && 'react-hot-loader/babel',
            ['emotion', { sourceMap: IS_DEV }],
          ].filter(x => x),
          presets: [
            [
              '@dgeibi/babel-preset-react-app',
              {
                targets: target,
              },
            ],
          ],
        },
      },
      {
        ...(forNode && ssr),
        loader: 'babel-loader',
        exclude: /node_modules[\\/]react(-dom)?[\\/]/,
        options: {
          cacheDirectory: true,
          babelrc: false,
          presets: [
            [
              '@dgeibi/babel-preset-react-app/dependencies',
              {
                targets: target,
              },
            ],
          ],
        },
      },
    ]
  }

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
      chunkFilename: IS_PROD ? '[id].[contenthash:8].js' : '[id].js',
      filename: IS_PROD ? '[name].[contenthash:8].js' : '[name].js',
    },
    entry: './src/client.js',
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
        chunkFilename: '[id].[contenthash:8].css',
      }),
      ...['index.html', 'about/index.html'].map(
        filename =>
          new HtmlWebpackPlugin({
            filename,
            template: './src/index.ejs',
            title: 'YARB',
          })
      ),
      new PrerenderPlugin({
        entry: './src/ssr.js',
        writeToDisk: true,
      }),
      define({
        'process.env.routes': routes,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          oneOf: [
            {
              compiler: 'simple-prerender-webpack-plugin',
              loader: 'css-loader/locals',
            },
            new HandleCSSLoader({
              minimize: IS_PROD,
              extract: IS_PROD,
              sourceMap,
              cssModules: false,
            }).css(),
          ],
        },
        {
          test: /\.js$/,
          oneOf: [...getJSRules(true), ...getJSRules()],
        },
      ].filter(Boolean),
    },
  }
}
