// postcss.config.js

module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
    'postcss-preset-env': {
      features: {
        'nesting-rules': false,
      },
    },
  },
};
