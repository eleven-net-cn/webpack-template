const isEnvDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  presets: [
    [
      require.resolve('babel-preset-react-app'),
      {
        runtime: 'automatic', // 'automatic' or 'classic'
      },
    ],
  ],
  plugins: [
    [
      require.resolve('babel-plugin-named-asset-import'),
      {
        loaderMap: {
          svg: {
            ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]',
          },
        },
      },
    ],
    // isEnvDevelopment && require.resolve('react-refresh/babel'),
  ].filter(Boolean),
};
