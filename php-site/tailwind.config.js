/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./*.php", "./partials/**/*.php", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        // ── Dark Rich Brown ramp ── base: #12100E
        ink: {
          50: "#F7F3F0",
          100: "#EDE7E1",
          200: "#D4C7BC",
          300: "#B8A495",
          400: "#957869",
          500: "#7A5F51",
          600: "#614A3E",
          700: "#4A3630",
          800: "#312320",
          900: "#1F1614",
          950: "#12100E",
        },
        // ── Bright Vibrant Orange ramp ── base: #E8621E
        flame: {
          50: "#FEF4EE",
          100: "#FDE8DA",
          200: "#FAC5A0",
          300: "#F59B65",
          400: "#F07A3D",
          500: "#E8621E",
          600: "#CC4E12",
          700: "#A63C0D",
          800: "#7F2D09",
          900: "#5C2006",
          950: "#3D1504",
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', "sans-serif"],
        body: ['"Inter"', "sans-serif"],
      },
      animation: {
        "scroll-logo": "scrollLogo 35s linear infinite",
        "bounce-slow": "bounce 2s infinite",
      },
      keyframes: {
        scrollLogo: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      boxShadow: {
        "flame-sm": "0 4px 16px rgba(232, 98, 30, 0.25)",
        "flame-md": "0 8px 32px rgba(232, 98, 30, 0.30)",
        "flame-lg": "0 16px 48px rgba(232, 98, 30, 0.35)",
        "flame-glow":
          "0 0 80px rgba(232, 98, 30, 0.20), 0 0 160px rgba(232, 98, 30, 0.08)",
      },
    },
  },
  plugins: [],
};
