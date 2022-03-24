module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '49%': '49%',
        '50%' : '50%',
        
      }
    },
    screens: {
      'sm': '576px',

      'md': '768px',

      'lg': '1280px',

      'xl': '1536px',

      '2xl': '2160px',
    }
  },
  plugins: [],
}
