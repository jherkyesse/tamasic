const colors = require('tailwindcss/colors');

module.exports = {
  theme: {
    colors: {
      ...colors,
    },
    extend: {
      padding: {
        '1px': '1px',
        '2px': '2px',
        '3px': '3px',
        '4px': '4px',
        '5px': '5px',
        '6px': '6px',
        '10px': '10px',
        '15px': '15px',
        '20px': '20px',
        '25px': '25px',
        '30px': '30px',
      },
      margin: {
        '1px': '1px',
        '2px': '2px',
        '3px': '3px',
        '4px': '4px',
        '5px': '5px',
        '6px': '6px',
        '10px': '10px',
        '15px': '15px',
        '20px': '20px',
        '25px': '25px',
        '30px': '30px',
        '-1px': '-1px',
        '-2px': '-2px',
        '-3px': '-3px',
        '-4px': '-4px',
        '-5px': '-5px',
        '-6px': '-6px',
        '-10px': '-10px',
        '-15px': '-15px',
        '-20px': '-20px',
        '-25px': '-25px',
        '-30px': '-30px',
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      borderRadius: ['first', 'last', 'not', 'child'],
    },
  },
  plugins: [
    function ({ addVariant, e }) {
      addVariant('child', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`child${separator}${className}`)} >*`;
        });
      });
      addVariant('first', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`first${separator}${className}`)} >*:first-child`;
        });
      });
      addVariant('last', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`last${separator}${className}`)} >*:last-child`;
        });
      });
      addVariant('not', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`not${separator}${className}`)} > :not(*)`;
        });
      });
    },
  ],
};
