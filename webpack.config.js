const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = (_, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: path.resolve(__dirname, 'src/main.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? 'assets/js/[name].[contenthash:8].js' : 'assets/js/[name].js',
      assetModuleFilename: 'assets/media/[name].[contenthash:8][ext][query]',
      clean: true,
      publicPath: 'auto',
    },
    devtool: isProduction ? false : 'eval-cheap-module-source-map',
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'public'),
      },
      client: {
        overlay: true,
      },
      compress: true,
      historyApiFallback: true,
      hot: true,
      open: false,
      port: 8080,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        vue$: 'vue/dist/vue.runtime.esm.js',
      },
      extensions: ['.js', '.vue', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        },
        {
          test: /\.css$/i,
          use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|webp|avif|svg)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024,
            },
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name].[contenthash:8][ext][query]',
          },
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        inject: 'body',
      }),
      isProduction &&
        new MiniCssExtractPlugin({
          filename: 'assets/css/[name].[contenthash:8].css',
          chunkFilename: 'assets/css/[id].[contenthash:8].css',
        }),
    ].filter(Boolean),
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    performance: {
      hints: isProduction ? 'warning' : false,
    },
  };
};
