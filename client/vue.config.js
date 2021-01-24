module.exports = {
  productionSourceMap: false, // Whether the production environment generates sourceMap files, it is generally not recommended to open
  transpileDependencies: ['vuetify'],
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Container Photo Upload';
      return args;
    });
  },
};
