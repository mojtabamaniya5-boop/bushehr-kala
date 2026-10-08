/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2E7D32',
          dark: '#185C28',
          light: '#E8F5E9',
        },
        accent: '#F8C02D',
        cream: '#FFF8E8',
        brown: '#6B4E37',
        ink: '#243024',
        muted: '#777777',
        border: '#E9E5D8',
        danger: '#E53935',
      },
    },
  },
  plugins: [],
}
