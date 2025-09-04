import typography from '@tailwindcss/typography';

const config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/providers/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          neutral: {
            0: 'hsl(var(--solv-neutral-000))',
            100: 'hsl(var(--solv-neutral-100))',
            200: 'hsl(var(--solv-neutral-200))',
            300: 'hsl(var(--solv-neutral-300))',
            400: 'hsl(var(--solv-neutral-400))',
            500: 'hsl(var(--solv-neutral-500))',
            600: 'hsl(var(--solv-neutral-600))',
            700: 'hsl(var(--solv-neutral-700))',
            800: 'hsl(var(--solv-neutral-800))',
            900: 'hsl(var(--solv-neutral-900))',
            950: 'hsl(var(--solv-neutral-950))',
            1000: 'hsl(var(--solv-neutral-1000))',
          },
          primary: {
            0: 'hsl(var(--solv-primary-0))',
            50: 'hsl(var(--solv-primary-50))',
            100: 'hsl(var(--solv-primary-100))',
            200: 'hsl(var(--solv-primary-200))',
            300: 'hsl(var(--solv-primary-300))',
            400: 'hsl(var(--solv-primary-400))',
            500: 'hsl(var(--solv-primary-500))',
            600: 'hsl(var(--solv-primary-600))',
            700: 'hsl(var(--solv-primary-700))',
            800: 'hsl(var(--solv-primary-800))',
            900: 'hsl(var(--solv-primary-900))',
            950: 'hsl(var(--solv-primary-950))',
          },
          secondary: {
            50: 'hsl(var(--solv-secondary-50))',
            100: 'hsl(var(--solv-secondary-100))',
            200: 'hsl(var(--solv-secondary-200))',
            300: 'hsl(var(--solv-secondary-300))',
            400: 'hsl(var(--solv-secondary-400))',
            500: 'hsl(var(--solv-secondary-500))',
            600: 'hsl(var(--solv-secondary-600))',
            700: 'hsl(var(--solv-secondary-700))',
            800: 'hsl(var(--solv-secondary-800))',
            900: 'hsl(var(--solv-secondary-900))',
            950: 'hsl(var(--solv-secondary-950))',
          },
          success: {
            50: 'hsl(var(--solv-success-50))',
            100: 'hsl(var(--solv-success-100))',
            200: 'hsl(var(--solv-success-200))',
            300: 'hsl(var(--solv-success-300))',
            400: 'hsl(var(--solv-success-400))',
            500: 'hsl(var(--solv-success-500))',
            600: 'hsl(var(--solv-success-600))',
            700: 'hsl(var(--solv-success-700))',
            800: 'hsl(var(--solv-success-800))',
            900: 'hsl(var(--solv-success-900))',
            950: 'hsl(var(--solv-success-950))',
          },
          alert: {
            50: 'hsl(var(--solv-alert-50))',
            100: 'hsl(var(--solv-alert-100))',
            200: 'hsl(var(--solv-alert-200))',
            300: 'hsl(var(--solv-alert-300))',
            400: 'hsl(var(--solv-alert-400))',
            500: 'hsl(var(--solv-alert-500))',
            600: 'hsl(var(--solv-alert-600))',
            700: 'hsl(var(--solv-alert-700))',
            800: 'hsl(var(--solv-alert-800))',
            900: 'hsl(var(--solv-alert-900))',
            950: 'hsl(var(--solv-alert-950))',
          },
        },
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
        green: {
          DEFAULT: '#00B42A',
          50: '#E8FFEA', //1
          100: '#AFF0B5', //2
          200: '#7BE188', //3
          300: '#C4FFBD', //4
          400: '#23C343', //5
          500: '#00CB00', //6 tag Fundraising
          600: '#009A29', //7
          700: '#1DFA00', //8
          800: '#16C200', //9
          900: '#108A00', //10
        },
        yellow: {
          DEFAULT: '#F4D27B',
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#FFF6E0',
          300: '#FFEAB8',
          400: '#FFDD8F',
          500: '#FFB340', // tag Pending
          600: '#FFC02E',
          650: '#F5AB00',
          700: '#F5AB00',
          800: '#BD8400',
          900: '#855D00',
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
      maxWidth: {
        xs: '20rem',
        sm: '24rem',
        md: '430px',
        lg: '33rem',
        xl: '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
      },
    },
  },
  plugins: [typography],
};

export default config;
