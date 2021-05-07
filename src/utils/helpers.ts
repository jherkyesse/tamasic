
const path = require('path');

const { HotModuleReplacementPlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    app: ['./src/index.tsx'],
  },
  output: {
    filename: '[name].[hash:8].bundle.js',
    publicPath: '/',
    path: path.resolve(__dirname, '..', 'dist/public'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      common: path.resolve(__dirname, 'src/common'),
      components: path.resolve(__dirname, 'src/components'),
      constants: path.resolve(__dirname, 'src/constants'),
      i18n: path.resolve(__dirname, 'src/i18n'),
      locales: path.resolve(__dirname, 'src/locales'),
      pages: path.resolve(__dirname, 'src/pages'),
      reducers: path.resolve(__dirname, 'src/reducers'),
      sagas: path.resolve(__dirname, 'src/sagas'),
      store: path.resolve(__dirname, 'src/store'),
      utils: path.resolve(__dirname, 'src/utils'),
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          plugins: [require.resolve('react-refresh/babel')],
          cacheDirectory: true,
          cacheCompression: false,
          compact: false,
        },
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  devServer: {
    contentBase: 'dist/',
    historyApiFallback: true,
    watchContentBase: true,
    hot: true,
    quiet: true,
    progress: true,
    inline: true,
    compress: true,
    overlay: false,
    clientLogLevel: 'none',
    transportMode: 'ws',
    injectClient: false,
    // proxy: {
    //   '/': {
    //     target: 'http://localhost:9070',
    //   },
    // },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `${__dirname}/public/index.html`,
      filename: 'index.html',
      inject: true,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin({
      overlay: {
        entry: require.resolve('react-dev-utils/webpackHotDevClient'),
        module: require.resolve('react-dev-utils/refreshOverlayInterop'),
        sockIntegration: false,
      },
    }),
  ],
  node: {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    http2: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  performance: false,
};
