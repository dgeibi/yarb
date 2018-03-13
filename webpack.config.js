const HtmlWebpackPlugin = require('html-webpack-plugin')
const PrerenderPlugin = require('simple-prerender-webpack-plugin')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const PreloadWebpackPlugin = require('preload-webpack-plugin')

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

const getConfig = ({ command = 'build', isForPrerender } = {}) => {
  const isDev = command === 'dev'
  const isClientBuild = !isDev && !isForPrerender
  const mode = isDev ? 'development' : 'production'

  const htmlPluginOpts = {
    template: './src/index.ejs',
    title: 'YARB',
  }

  const routes = ['/', '/about/']

  if (!isForPrerender) {
    // set NODE_ENV for Node Runtime
    process.env.NODE_ENV = mode
  }

  return {
    ...(isDev && {
      devtool: 'cheap-module-source-map',
    }),
    ...(!isForPrerender && {
      optimization: {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
        },
      },
    }),

    mode,
    output: {
      publicPath: '/',
    },
    entry: path.join(__dirname, 'src/index.js'),

    plugins: [
      isDev && new HtmlWebpackPlugin(htmlPluginOpts),
      isClientBuild && new MiniCssExtractPlugin(),
      isClientBuild &&
        new PrerenderPlugin({
          routes,
          entry: path.join(__dirname, 'src/ssr.js'),
          config: getConfig({ command, isForPrerender: true }),
          getHtmlWebpackPluginOpts: content => ({ ...htmlPluginOpts, content }),
          friends: [
            new PreloadWebpackPlugin({
              rel: 'prefetch',
            }),
          ],
        }),
      define({
        'process.env.isSSR': Boolean(isForPrerender),
        'process.env.routes': routes,
      }),
    ].filter(Boolean),

    module: {
      rules: [
        isForPrerender && {
          test: /\.css$/,
          loader: 'css-loader/locals',
        },
        isClientBuild && {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                minimize: true,
              },
            },
          ],
        },
        isDev && {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: path.join(__dirname, 'src'),
          options: {
            cacheDirectory: true,
            babelrc: false,
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-syntax-dynamic-import',
              'react-hot-loader/babel',
              ['emotion', { sourceMap: isDev }],
            ],
            presets: [
              [
                '@babel/env',
                {
                  modules: false,
                  targets: isForPrerender
                    ? {
                        node: 'current',
                      }
                    : {
                        browsers: 'last 2 versions',
                      },
                  useBuiltIns: isForPrerender ? false : 'usage',
                  shippedProposals: true,
                },
              ],
              '@babel/react',
            ],
          },
        },
      ].filter(Boolean),
    },
  }
}

module.exports = getConfig
