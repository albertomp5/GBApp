module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    devServer: {
      historyApiFallback: true
    }
  }
}
