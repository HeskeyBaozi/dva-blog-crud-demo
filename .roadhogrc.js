export default {
  "entry": "src/index.js",
  "disableCSSModules": false,
  "autoprefixer": null,
  "extraBabelPlugins": [
    "transform-runtime",
    [
      "import",
      {
        "libraryName": "antd",
        "style": true
      }
    ]
  ],
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr"
      ]
    }
  },
  "proxy": {
    "/api": {
      "target": "http://localhost:5858/api/v1",
      "changeOrigin": true,
      "pathRewrite": {
        "^/api": ""
      }
    }
  },
  "theme": "./src/theme.js"
}