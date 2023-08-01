/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
    colors: {
      'text': 'hsl(197, 78%, 7%)',
      'background': 'hsl(195, 80%, 98%)',
      'primary': 'hsl(17, 79%, 68%)',
      'secondary': 'hsl(47, 80%, 90%)',
      'accent': 'hsl(347, 79%, 50%)',
    }
  },
  plugins: []
}

