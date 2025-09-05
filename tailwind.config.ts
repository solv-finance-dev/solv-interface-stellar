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
        background: {
          DEFAULT: 'hsl(var(--solv-background-default))',
          elevation1: 'hsl(var(--solv-background-color1))',
          elevation2: 'hsl(var(--solv-background-color2))',
          elevation3: 'hsl(var(--solv-background-color3))',
          elevation4: 'hsl(var(--solv-background-color4))',
        },

        borderColor: {
          DEFAULT: 'hsl(var(--solv-border-default))',
          defaultHover: 'hsl(var(--solv-border-default-hover))',
          dividers: 'hsl(var(--solv-borders-dividers))',
          dividersBlank: 'hsl(var(--solv-borders-dividers-blank))',
          grayColor: 'hsl(var(--solv-gray-color))',
        },
        textColor: {
          DEFAULT: 'hsl(var(--solv-text-primary))',
          secondary: 'hsl(var(--solv-text-secondary))',
          tertiary: 'hsl(var(--solv-text-tertiary))',
          purplePrimary: 'hsl(var(--solv-text-purple-primary))',
          heading: 'hsl(var(--solv-text-heading))',
          placeholder: 'hsl(var(--solv-text-placeholder))',
          disabled: 'hsl(var(--solv-text-disabled))',
          gain: 'hsl(var(--solv-text-gain))',
          loss: 'hsl(var(--solv-text-loss))',
        },
        base: {
          neutral: {
            0: 'hsl(var(--solv-neutral-000))', // #FFFFFF
            50: 'hsl(var(--solv-neutral-050))', // #F7F7F7
            100: 'hsl(var(--solv-neutral-100))', // #F5F5F5
            200: 'hsl(var(--solv-neutral-200))', // #E8E8E8
            300: 'hsl(var(--solv-neutral-300))', // #D6D6D6
            400: 'hsl(var(--solv-neutral-400))', // #A5A5A5
            500: 'hsl(var(--solv-neutral-500))', // #767676
            600: 'hsl(var(--solv-neutral-600))', // #575757
            700: 'hsl(var(--solv-neutral-700))', // #4D4D4D
            800: 'hsl(var(--solv-neutral-800))', // #363636
            900: 'hsl(var(--solv-neutral-900))', // #202020
            950: 'hsl(var(--solv-neutral-950))', // #161616
            1000: 'hsl(var(--solv-neutral-1000))', // #010101
          },
          primary: {
            50: 'hsl(var(--solv-primary-50))', // #D8E0FD
            100: 'hsl(var(--solv-primary-100))', //#BDC4FB
            200: 'hsl(var(--solv-primary-200))', // #A7AAF9
            300: 'hsl(var(--solv-primary-300))', // #9391F8
            400: 'hsl(var(--solv-primary-400))', // #837AF3
            500: 'hsl(var(--solv-primary-500))', // #7667EB
            600: 'hsl(var(--solv-primary-600))', // #5F4EC6
            700: 'hsl(var(--solv-primary-700))', // #47399A
            800: 'hsl(var(--solv-primary-800))', // #2F256E
            900: 'hsl(var(--solv-primary-900))', // #1F1949
            950: 'hsl(var(--solv-primary-950))', // #0E0C1B
          },
          secondary: {
            50: 'hsl(var(--solv-secondary-50))', // #FFF8ED
            100: 'hsl(var(--solv-secondary-100))', // #FFF0D4
            200: 'hsl(var(--solv-secondary-200))', // #FFDDA8
            300: 'hsl(var(--solv-secondary-300))', // #FFC470
            400: 'hsl(var(--solv-secondary-400))', // #FF9F37
            500: 'hsl(var(--solv-secondary-500))', // #FF8C21
            600: 'hsl(var(--solv-secondary-600))', // #F06706
            700: 'hsl(var(--solv-secondary-700))', // #C74D07
            800: 'hsl(var(--solv-secondary-800))', // #9E3C0E
            900: 'hsl(var(--solv-secondary-900))', // #7F340F
            950: 'hsl(var(--solv-secondary-950))', // #451805
          },
          success: {
            50: 'hsl(var(--solv-success-50))', // #D9FFDC
            100: 'hsl(var(--solv-success-100))', // #D9FFDC
            200: 'hsl(var(--solv-success-200))', // #B5FDBB
            300: 'hsl(var(--solv-success-300))', // #7BFA87
            400: 'hsl(var(--solv-success-400))', // #4FEF5F
            500: 'hsl(var(--solv-success-500))', // #11D626
            600: 'hsl(var(--solv-success-600))', // #08B119
            700: 'hsl(var(--solv-success-700))', // #0A8B18
            800: 'hsl(var(--solv-success-800))', // #0E6D19
            900: 'hsl(var(--solv-success-900))', // #0E5918
            950: 'hsl(var(--solv-success-950))', // #013208
          },
          alert: {
            50: 'hsl(var(--solv-alert-50))', // #FFF1F1
            100: 'hsl(var(--solv-alert-100))', // #FFE0E0
            200: 'hsl(var(--solv-alert-200))', // #FFC6C6
            300: 'hsl(var(--solv-alert-300))', //#FF9E9E
            400: 'hsl(var(--solv-alert-400))', // #FF6666
            500: 'hsl(var(--solv-alert-500))', // #FD4040
            600: 'hsl(var(--solv-alert-600))', // #EB1717
            700: 'hsl(var(--solv-alert-700))', // #C60F0F
            800: 'hsl(var(--solv-alert-800))', //#A31111
            900: 'hsl(var(--solv-alert-900))', // #871515
            950: 'hsl(var(--solv-alert-950))', // #4A0505
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
