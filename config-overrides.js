const { override, fixBabelImports, addLessLoader } = require("customize-cra");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd-mobile",
    style: true,
  }),
  addLessLoader({
    strictMath: true,
    noIeCompat: true,
    modifyVars: {
      "@primary-color": "#1DA57A",
    },
    cssLoaderOptions: {},
    cssModules: {
      localIdentName: "[path][name]__[local]--[hash:base64:5]",
    },
  })
);
