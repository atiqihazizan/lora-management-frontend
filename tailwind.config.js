/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,css}"],
  theme: {
    extend: {
      colors: {
        primary: "#0062cc", // Warna utama (Primary)
        "primary-dark": "#004bb5", // Warna hover utama (Primary Dark)
        secondary: "#6c757d", // Warna sekunder
        "secondary-light": "#5a6268", // Warna hover sekunder
        outline: "#d6d8db", // Warna outline
        "outline-light": "#f8f9fa", // Warna hover outline
        danger: "#dc3545", // Warna merah untuk danger
        "danger-dark": "#c82333", // Warna hover danger
        gray: {
          700: "#3a3a3a",
          800: "#2c2c2c",
          900: "#1f1f1f",
        },
      },
    },
  },
  plugins: [],
};
