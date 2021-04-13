/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: '/',
    src: '/dist',
  },
  plugins: [
    '@snowpack/plugin-typescript',
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-sass',
    '@snowpack/plugin-postcss'
  ],
  packageOptions: {
    knownEntrypoints: ['react', 'react-dom'],
  },
};
