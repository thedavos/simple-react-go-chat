const path = require("path");
const merge = require("webpack-merge");

const parts = require("./webpack.parts");

const PATHS = {
  app: path.resolve(__dirname, "src/app/index.js"),
  build: path.resolve(__dirname, "../public")
};

const commonConfig = merge([
  {
    output: {
      path: PATHS.build,
      filename: "js/[name].js"
    }
  },
  parts.generateSourceMaps({ type: "source-map" }),
  parts.loadJavaScript({ exclude: /(node_modules)/ })
]);

const productionConfig = merge([
  {
    performance: {
      hints: "warning", // "error" or false are valid too
      maxEntrypointSize: 150000, // in bytes, default 250k
      maxAssetSize: 450000 // in bytes
    }
  },
  {
    output: {
      chunkFilename: "js/[name].[chunkhash:4].js",
      filename: "js/[name].[chunkhash:4].js"
    }
  },
  parts.clean(PATHS.build),
  parts.minifyJavaScript(),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true
      },
      // Run cssnano in safe mode to avoid
      // potentially unsafe transformations.
      safe: true
    }
  }),
  parts.extractCSS({
    use: ["css-loader", parts.autoprefix()]
  }),
  parts.loadImages({
    options: {
      limit: 1000000,
      fallback: "file-loader",
      name: "[name].[hash:4].[ext]",
      publicPath: "images/"
    }
  }),
  {
    optimization: {
      splitChunks: {
        chunks: "initial"
      }
    }
  }
]);

const developmentConfig = merge([
  parts.devServer({
    // Customize host/port here if needed
    port: 9000
  }),
  parts.loadCSS(),
  parts.loadImages()
]);

module.exports = mode => {
  const pages = [
    parts.page({
      entry: {
        app: PATHS.app
      }
    })
  ];

  const config = mode === "production" ? productionConfig : developmentConfig;

  return merge([commonConfig, config, { mode }].concat(pages));
};
