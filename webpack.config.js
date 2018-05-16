const HtmlWebpackPlugin = require('html-webpack-plugin')
const PrerenderPlugin = require('simple-prerender-webpack-plugin')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const PreloadWebpackPlugin = require('preload-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')

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

  const htmlPluginOpts = {
    template: './src/index.ejs',
    title: 'YARB',
  }

  const routes = ['/', '/about/']

  return {
    ...(IS_DEV && {
      devtool: 'cheap-module-source-map',
    }),
    ...(!IS_PRERENDER && {
      optimization: {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
        },
      },
    }),
    mode: IS_PROD ? 'production' : 'development',
    output: {
      publicPath: '/',
    },
    entry: path.join(__dirname, 'src/index.js'),
    plugins: [
      IS_PROD_CLIENT &&
        new ManifestPlugin({
          filter: c => c.isInitial,
        }),
      IS_DEV && new HtmlWebpackPlugin(htmlPluginOpts),
      IS_PROD_CLIENT && new MiniCssExtractPlugin(),
      IS_PROD_CLIENT &&
        new PrerenderPlugin({
          routes,
          entry: path.join(__dirname, 'src/ssr.js'),
          config: getConfig({ env, IS_PRERENDER: true }),
          getHtmlWebpackPluginOpts: content => ({ ...htmlPluginOpts, content }),
          friends: [
            new PreloadWebpackPlugin({
              rel: 'prefetch',
            }),
          ],
        }),
      define({
        'process.env.isSSR': Boolean(IS_PRERENDER),
        'process.env.routes': routes,
      }),
    ].filter(Boolean),

    module: {
      rules: [
        IS_PRERENDER && {
          test: /\.css$/,
          loader: 'css-loader/locals',
        },
        IS_PROD_CLIENT && {
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
        IS_DEV && {
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
          oneOf: [
            {
              test: /\.js$/,
              loader: 'babel-loader',
              include: path.join(__dirname, 'src'),
              options: {
                cacheDirectory: true,
                babelrc: false,
                plugins: [
                  'react-hot-loader/babel',
                  ['emotion', { sourceMap: IS_DEV }],
                ],
                presets: [
                  [
                    'dgeibi-react',
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
              test: /\.js$/,
              loader: 'babel-loader',
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
