const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins'],
      },
      spacing: {
        18: '4.5rem',
        112: '28rem',
        120: '30rem',
      },
      colors: {
        'brand-blue': {
          DEFAULT: '#304B75',
          '50': '#FFFFFF',
          '100': '#FFFFFF',
          '200': '#FFFFFF',
          '300': '#F0F7FC',
          '400': '#CEE3F6',
          '500': '#ABCFF0',
          '600': '#ABCCED',
          '700': '#4C99DF',
          '800': '#257DCE',
          '900': '#257DCE'
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
}
