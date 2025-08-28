import typography from '@tailwindcss/typography';

const config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/providers/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        mainColor: '#7667EB',
        grayColor: '#a5a5a5',
        primaryColor: '#BDC4FB',
        secondaryColor: '#bdc4fd',
        surfaces: 'var(--surfaces)',
        border: 'hsl(var(--solv-border))',
        textColor: 'hsl(var(--solv-text))',
        textActiveColor: 'hsl(var(--solv-active-text))',
        errorColor: 'hsl(var(--solv-alert-500))',
        brand: {
          DEFAULT: '#7667EB', // main
          50: '#D8E0FD',
          100: '#BDC4FB',
          200: '#A7AAF9',
          300: '#9391F8',
          400: '#837AF3',
          500: '#7667EB',
          600: '#5F4EC6',
          700: '#47399A',
          800: '#2F256E',
          900: '#1F1949',
          950: '#0E0C1B', // deep
        },
        black: {
          DEFAULT: '#000000',
          700: '#4D4D4D',
          800: '#363636',
          900: '#202020',
          950: '#161616',
          1000: '#010101',
        },
        gray: {
          DEFAULT: '#202020',
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E8E8E8',
          300: '#D6D6D6',
          400: '#575757',
          500: '#202020',
        },
      },
      fontFamily: {
        'MatterSQ-Bold': ['MatterSQ-Bold'],
        'MatterSQ-Light': ['MatterSQ-Light'],
        'MatterSQ-Regular': ['MatterSQ-Regular'],
        'MatterSQ-Medium': ['MatterSQ-Medium'],
        'MatterSQ-SemiBold': ['MatterSQ-SemiBold'],
        'Faculty-Glyphic': ['Faculty-Glyphic'],
        'Fusion-Pixel': ['Fusion-Pixel'],
      },
      keyframes: {
        slideUp: {
          '0%': { height: 'auto' },
          '100%': { height: '0px' },
        },
        slideDown: {
          '0%': { height: '0px' },
          '100%': { height: 'auto' },
        },
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease-in-out forwards',
        'slide-down': 'slideDown 0.5s ease-in-out forwards',
      },
      screens: {
        xs: '280px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1441px',
        '3xl': '1536px',
        '4xl': '1700px',
        '5xl': '1880px',
      },
    },
  },
  plugins: [typography],
};

export default config;
