export default {
  plugins: [
    ['umi-plugin-mobx', {
      modelName: 'store', // or "stores", defaults to "store", you can set "model" like dva.
      exclude: [/^\$/]
    }],
    ['umi-plugin-routes', {
      exclude: [/stores/] // ignore **/stores/**/*.*, you can set /models/ like dva.
    }]
  ]
}
