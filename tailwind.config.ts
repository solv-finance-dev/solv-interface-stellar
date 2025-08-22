import typography from "@tailwindcss/typography";

const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/providers/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        mainColor: "#7667EB",
        grayColor: "#a5a5a5",
        primaryColor: "#BDC4FB",
        secondaryColor: "#bdc4fd"
      },
      fontFamily: {
        "MatterSQ-Bold": ["MatterSQ-Bold"],
        "MatterSQ-Light": ["MatterSQ-Light"],
        "MatterSQ-Regular": ["MatterSQ-Regular"],
        "MatterSQ-Medium": ["MatterSQ-Medium"],
        "MatterSQ-SemiBold": ["MatterSQ-SemiBold"],
        "Faculty-Glyphic": ["Faculty-Glyphic"],
        "Fusion-Pixel": ["Fusion-Pixel"]
      },
      keyframes: {
        slideUp: {
          "0%": { height: "auto" },
          "100%": { height: "0px" }
        },
        slideDown: {
          "0%": { height: "0px" },
          "100%": { height: "auto" }
        }
      },
      animation: {
        "slide-up": "slideUp 0.5s ease-in-out forwards",
        "slide-down": "slideDown 0.5s ease-in-out forwards"
      },
      screens: {
        xs: "280px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1441px",
        "3xl": "1536px",
        "4xl": "1700px",
        "5xl": "1880px"
      }
    }
  },
  plugins: [typography]
};

export default config;
