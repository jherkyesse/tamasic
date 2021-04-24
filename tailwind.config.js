const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');
const pluginImportant = require('tailwindcss-important');
const { omit, flatMap } = require('lodash');
const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette')
  .default;

module.exports = {
  purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx}'],
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
      },
      zIndex: {
        1: 1,
        33: 33,
        35: 35,
        60: 60,
        70: 70,
        80: 80,
        90: 90,
        100: 100,
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active', 'disabled'],
      borderRadius: ['first', 'last', 'not', 'child'],
      borderWidth: ['child', 'not-first', 'not-last'],
      padding: ['child', 'first'],
      margin: ['child', 'first', 'not-first', 'last'],
      overflow: ['important'],
      opacity: ['disabled'],
      cursor: ['disabled'],
      pointerEvents: ['disabled'],
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
      addVariant('not-first', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(
            `not-first${separator}${className}`,
          )} > :not(:first-child)`;
        });
      });
      addVariant('not-last', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(
            `not-last${separator}${className}`,
          )} > :not(:last-child)`;
        });
      });
    },
    plugin(function ({ addUtilities, e, theme, variants }) {
      const colors = flattenColorPalette(theme('borderColor'));
      const utilities = flatMap(omit(colors, 'default'), (value, modifier) => ({
        [`.${e(`border-t-${modifier}`)}`]: { borderTopColor: `${value}` },
        [`.${e(`border-r-${modifier}`)}`]: { borderRightColor: `${value}` },
        [`.${e(`border-b-${modifier}`)}`]: { borderBottomColor: `${value}` },
        [`.${e(`border-l-${modifier}`)}`]: { borderLeftColor: `${value}` },
      }));
      addUtilities(utilities, variants('borderColor'));
    }),
    plugin(function ({ addUtilities }) {
      const utilities = {
        '.width-calc-full-2px': {
          width: 'calc(100% + 2px)',
        },
        '.height-calc-full-2px': {
          height: 'calc(100% + 2px)',
        },
      };
      addUtilities(utilities);
    }),
    pluginImportant(),
  ],
};
