import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const MyPreset = definePreset(Aura, {
  semantic: {
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
  },
  components: {
    button: {
      root: {
        fontSize: '14px',
        sm: {
          fontSize: '14px',
          paddingX: '20px',
        },
      },
      colorScheme: {
        light: {
          text: {
            primary: {
              hoverBackground: 'transparent',
              activeBackground: 'transparent',
              color: '#000',
            },
          },
        },
      },
    },
  },
});
