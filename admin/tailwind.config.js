/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          600: "#2563eb",
          700: "#1d4ed8",
        },
        sidebar: "#0f172a",
        sidebarHover: "#1e293b",
      },
    },
  },
  plugins: [],
};
