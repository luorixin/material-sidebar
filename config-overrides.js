const { override, fixBabelImports, addLessLoader, addWebpackAlias } = require("customize-cra");

const path = require('path')

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd-mobile",
    style: 'css',
  }),
  addLessLoader({
    strictMath: true,
    noIeCompat: true,
    javascriptEnabled: true,
    modifyVars: {
      "@primary-color": "#1DA57A",
    },
    cssLoaderOptions: {
    },
    cssModules: {
      localIdentName: "[path][name]__[local]--[hash:base64:5]",
    },
  }),
  addWebpackAlias({
    "@": path.resolve(__dirname, "src")
  }),
);
