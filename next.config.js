const withPlugins = require("next-compose-plugins");
const SCSS = require("@zeit/next-sass");

module.exports = {
  future: { webpack5: true, strictPostcssConfiguration: true },
  ...withPlugins([[SCSS]], {
    webpack(config, { isServer }) {
      config.module.rules.push(
        {
          test: /\.(png|eot|otf|ttf|woff|woff2)$/,
          use: {
            loader: "url-loader",
          },
        },
        {
          loader: "sass-loader",
          test: /.scss$/,
          options: {
            sassOptions: {
              outputStyle: "expanded",
              sourceMap: true,
            },
          },
        }
      );

      if (isServer) {
        require("./lib/createSitemap");
      }

      if (!isServer) {
        config.node = {
          fs: "empty",
        };
      }

      config.resolve.extensions = [".ts", ".js", ".jsx", ".tsx", ".svg", ".scss"];
      return config;
    },
  }),
  experimental: {
    optionalCatchAll: true,
  },
  images: {
    domains: ["assets.vercel.com", "avatars1.githubusercontent.com"],
  },
};

module.exports.env = {
  SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
  SHOPIFY_API_PASSWORD: process.env.SHOPIFY_API_PASSWORD,
  SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET,
  SHOPIFY_API_STORE: process.env.SHOPIFY_API_STORE,
  SHOPIFY_API_VERSION: process.env.SHOPIFY_API_VERSION,
};
