/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: '/',
    src: '/dist',
  },
  plugins: [
    '@snowpack/plugin-typescript',
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-postcss',
    '@snowpack/plugin-sass',
  ],
  packageOptions: {
    knownEntrypoints: ['react', 'react-dom'],
  },
  alias: {
    tailwindcss: './node_modules/tailwindcss',
  },
};
