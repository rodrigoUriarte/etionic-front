module.exports = {
  devServer: {
    proxy: 'http://localhost:8080',
    host: 'localhost'
  },
  transpileDependencies: ['vuetify']
}