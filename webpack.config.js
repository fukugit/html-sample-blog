const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = {
  mode: 'development',
  entry: {
    index: './src/js/index.js',
    blog: './src/js/blog.js'
  },
  mode: "development",
  devtool: "source-map",
  output: {
      // path: `${__dirname}/docs`,
      path: path.resolve(__dirname, "docs"),
      filename: '[name].js'
  },
  // 共通のライブラリを分離する。 momentなど
  optimization: {
    splitChunks: {
      name: 'commonlib',
      chunks: 'initial',
    }
  },
  devServer: {
      contentBase: './docs'
  },
  module: {
    rules: [
      // HTMLローダー
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            attributes: true
          }
        }
      },
      // sass ローダー
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false // resolve-url-loader を利用するために必要です。
            }
          },
          {
            // SASS内で url()を利用するために必要なローダーです。
            loader: 'resolve-url-loader'
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true, // resolve-url-loader を利用するために必要です。
            }
          }
        ],
      },
      // 画像ローダー
      {
        test: /\.(png|jpg|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './img/[name].[ext]',
            }
          },
        ]
      },
      // Babel ローダー
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                // ES2015以降のコードを変換
                '@babel/preset-env',
              ]
            }
          }
        ],
        exclude: /node_modules/,
      },
      // ESLint
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          fix: false,
          failOnError: true,
        }
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/html/index.html", // 元HTML
      filename: "index.html",  // 出力先HTML
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      template: "./src/html/blog.html",
      filename: "blog.html",
      chunks: ['blog']
    }),
    new MiniCssExtractPlugin({
      filename:'css/[name].css'
    }),
    new CleanWebpackPlugin(),
  ],
};
