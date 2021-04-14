const colors = require('tailwindcss/colors');

module.exports = {
  theme: {
    colors: {
      ...colors,
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      borderRadius: ['first', 'last', 'not', 'child'],
    },
  },
  plugins: [
    function({ addVariant, e }) {
      addVariant('child', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`child${separator}${className}`)} >*`
        })
      })
      addVariant('first', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`first${separator}${className}`)} >*:first-child`
        })
      })
      addVariant('last', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`last${separator}${className}`)} >*:last-child`
        })
      })
      addVariant('not', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`not${separator}${className}`)} > :not(*)`
        })
      })
    }
  ],
};
