// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        "primary-light": "var(--color-primary-light)",
        secondary: "var(--color-secondary)",
        success: "var(--color-success)",
        info: "var(--color-info)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        dark: "var(--color-dark)",
        "theme-black": "var(--color-black)",
        "theme-white": "var(--color-white)",
        body: "var(--color-body)",
        medical: {
          50: "var(--color-medical-50)",
          100: "var(--color-medical-100)",
          500: "var(--color-medical-500)",
          600: "var(--color-medical-600)",
          700: "var(--color-medical-700)",
        },
        gray: {
          50: "var(--color-gray-50)",
          100: "var(--color-gray-100)",
          200: "var(--color-gray-200)",
          300: "var(--color-gray-300)",
          400: "var(--color-gray-400)",
          500: "var(--color-gray-500)",
          600: "var(--color-gray-600)",
          700: "var(--color-gray-700)",
          800: "var(--color-gray-800)",
          900: "var(--color-gray-900)",
        },
        blue: {
          50: "var(--color-blue-50)",
          500: "var(--color-blue-500)",
        },
      },
      fontFamily : {
        work: ['WorkSans', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        montserratBold: ['Montserrat-Bold', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        sans: ['Roboto', 'sans-serif'],
      },
      fontSize: {
        // Heading sizes (already done)
        heading: ["3.75rem", { lineHeight: "4rem" }], // 60px
        "heading-sm": ["3rem", { lineHeight: "3.5rem" }], // 48px
        "heading-md": ["2.5rem", { lineHeight: "3rem" }], // 40px
        "heading-lg": ["2rem", { lineHeight: "2.5rem" }], // 32px

        // Small text responsive sizes
        "small-text": ["10.75rem", { lineHeight: "1rem" }], // 12px (base)
        "small-text-sm": ["10.625rem", { lineHeight: "0.875rem" }], // 10px (sm)
        "small-text-md": ["10.6875rem", { lineHeight: "1rem" }], // 11px (md)
        "small-text-lg": ["10.75rem", { lineHeight: "1.125rem" }], // 12px (lg)

        // Image label responsive sizes
        "image-label": ["3.75rem", { lineHeight: "4rem" }], // 60px base
        "image-label-sm": ["3rem", { lineHeight: "3.5rem" }], // 48px sm
        "image-label-md": ["2.5rem", { lineHeight: "3rem" }], // 40px md
        "image-label-lg": ["2rem", { lineHeight: "2.5rem" }], // 32px lg
      },
    },
  },
  plugins: [],
};
