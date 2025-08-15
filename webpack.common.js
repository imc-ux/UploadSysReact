const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");
const rootDir = process.cwd();

const babelOptions = {
  presets: [
    [
      "@babel/preset-react",
      {
        // development: process.env.NODE_ENV === "development",
        //   pragma: "dom", // default pragma is React.createElement (only in classic runtime)
        //   pragmaFrag: "DomFrag", // default is React.Fragment (only in classic runtime)
        //   throwIfNamespace: false, // defaults to true
        // runtime: "automatic", // defaults to classic
        //   // "importSource": "custom-jsx-library" // defaults to react (only in automatic runtime)
      },
    ],
  ],
  plugins: [
    process.env.NODE_ENV === "development"
      ? "@babel/plugin-transform-react-jsx-development"
      : [
          "@babel/plugin-transform-react-jsx",
          {
            runtime: "automatic",
          },
        ],
  ],
};

module.exports = function () {
  return import("@unocss/webpack").then((m) => {
    const UnoCSS = m.default;
    return {
      entry: {
        // menu: "./src/entry/menuIndex.tsx",
        // tools: "./src/entry/toolsIndex.tsx",
        main: "./src/entry/index.tsx",
      },
      output: {
        filename: "js/[name].[chunkhash].bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
      },
      cache: false,
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: "babel-loader",
                options: babelOptions,
              },
              {
                loader: "ts-loader",
              },
            ],
          },
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: babelOptions,
            },
          },

          {
            test: /\.(sa|sc|c)ss$/i,
            use: [
              {
                loader: ExtractCssChunks.loader,
                options: {
                  publicPath:
                    process.env.NODE_ENV === "development"
                      ? "http://localhost:8898/"
                      : "http://109.14.6.43:6636/cusys/react/",
                },
              },
              "css-loader",
              "sass-loader",
            ],
          },
          {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: "asset",
            generator: {
              filename: "images/[hash][ext][query]",
            },
          },
        ],
      },
      resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
          "@": [
            path.resolve(__dirname, "src"),
            path.resolve(rootDir, "../advancedcommon/src"),
          ],
          Static: path.resolve(__dirname, "static"),
          View: path.resolve(__dirname, "src/view"),
          ViewMenu: path.resolve(__dirname, "src/view/menu"),
          Style: path.resolve(__dirname, "src/style"),
          Router: path.resolve(__dirname, "src/router"),
          Common: path.resolve(__dirname, "src/common"),
          Context: path.resolve(__dirname, "src/common/context"),
          Action: path.resolve(__dirname, "src/common/action"),
          Reducer: path.resolve(__dirname, "src/common/reducer"),
          Helper: path.resolve(__dirname, "src/common/helper"),
          Remote: path.resolve(__dirname, "src/common/remote"),
          Service: path.resolve(__dirname, "src/common/service"),
          Components: path.resolve(__dirname, "src/common/components"),
          Vo: path.resolve(__dirname, "src/common/vo"),
        },
      },
      plugins: [
        new DefinePlugin({
          DEBUG: process.env.NODE_ENV !== "production",
        }),
        new HtmlWebpackPlugin({
          title: "UploadSys",
          template: "index.html",
          filename: "index.html",
        }),
        // new BundleAnalyzerPlugin(),
        new ExtractCssChunks({
          filename:
            process.env.NODE_ENV === "development"
              ? "styles/[name].css"
              : "styles/[name].[contenthash].css",
          chunkFilename:
            process.env.NODE_ENV === "development"
              ? "styles/[id].css"
              : "styles/[id].[contenthash].css",
        }),
        UnoCSS(),
      ],
      optimization: {
        moduleIds: "deterministic",
        realContentHash: true,
        minimizer: [new CssMinimizerPlugin()],
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: "vendor",
              chunks: "all",
            },
            // common: {
            //   test(module) {
            //     const path = require("path");
            //     return (
            //       module.resource &&
            //       module.resource.includes(
            //         `${path.sep}advancedcommon${path.sep}`
            //       )
            //     );
            //   },
            // },
          },
        },
      },
    };
  });
};
