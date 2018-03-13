const HtmlWebpackPlugin = require('html-webpack-plugin')
const PrerenderPlugin = require('simple-prerender-webpack-plugin')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

const getConfig = ({ command = 'build', isForPrerender } = {}) => {
  const isDev = command === 'dev'
  const isClientBuild = !isDev && !isForPrerender
  const mode = isDev ? 'development' : 'production'

  const htmlPluginOpts = {
    template: './src/index.ejs',
    title: 'Prerender Demo',
  }

  if (!isForPrerender) {
    // set NODE_ENV for Node Runtime
    process.env.NODE_ENV = mode
  }

  return {
    ...(!isForPrerender && {
      optimization: {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
        },
      },
    }),

    output: {
      publicPath: '/',
    },

    mode,
    devtool: isDev ? 'cheap-module-source-map' : 'source-map',

    entry: path.join(__dirname, 'src/index.js'),

    plugins: [
      isDev && new HtmlWebpackPlugin(htmlPluginOpts),
      isClientBuild && new MiniCssExtractPlugin(),
      isClientBuild &&
        new PrerenderPlugin({
          routes: ['/', '/about/'],
          entry: path.join(__dirname, 'src/ssr.js'),
          config: getConfig({ command, isForPrerender: true }),
          getHtmlWebpackPluginOpts: content => ({ ...htmlPluginOpts, content }),
        }),
      new webpack.DefinePlugin({
        'process.env.isSSR': isForPrerender ? 'true' : 'false',
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
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        isDev && {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
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
              'emotion',
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
