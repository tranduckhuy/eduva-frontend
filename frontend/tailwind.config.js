module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'dark',
  theme: {
    screens: {
      xxxxxl: { max: '1999.98px' },
      xxxxl: { max: '1799.98px' },
      xxxl: { max: '1599.98px' },
      xxl: { max: '1499.98px' },
      xl: { max: '1399.98px' },
      lg: { max: '1199.98px' },
      md: { max: '991.98px' },
      sm: { max: '767.98px' },
      xs: { max: '575.98px' },
    },
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        fadeInForward: 'fadeInForward 0.5s ease',
        shake: 'shake 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        fadeInForward: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-8px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        shake: {
          '0%': {
            transform: 'translate(0)',
          },
          '25%': {
            transform: 'translate(-8px)',
          },
          '50%': {
            transform: 'translate(8px)',
          },
          '75%': {
            transform: 'translate(-8px)',
          },
          '100%': {
            transform: 'translate(0)',
          },
        },
      },
      boxShadow: {
        filterBox: '0 -4px 32px #0003',
        subjectCard: '0 4px 8px #0000001a',
      },
      colors: {
        primary: {
          DEFAULT: '#2093e7',
          50: '#f0f9ff',
          100: '#d5edfc',
          200: '#aad7f8',
          300: '#7fc0f3',
          400: '#55aaef',
          500: '#2093e7',
          600: '#1976c2',
          700: '#155e9d',
          800: '#104878',
          900: '#0b355a',
          950: '#062538',
        },
        greyText: '#0000008a',
        warningText: '#f33a58',
      },
    },
  },
  plugins: [{ autoprefixer: {} }],
};
