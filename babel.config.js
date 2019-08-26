module.exports = {
  presets: [["@babel/preset-env", { targets: { node: "8.9.0" } }]],
  plugins: [
    ["@babel/plugin-transform-typescript", { isTSX: true }],
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    "@babel/plugin-proposal-object-rest-spread"
  ],
  env: {
    production: {
      ignore: [/[/\\.]test\.[tj]sx?$/]
    }
  },
  sourceMaps: "inline"
};
