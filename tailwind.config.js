/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'rgb(var(--color-brand) / <alpha-value>)',
          dark: 'rgb(var(--color-brand-dark) / <alpha-value>)',
          light: 'rgb(var(--color-brand-light) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          dark: 'rgb(var(--color-accent-dark) / <alpha-value>)',
        },
        cream: 'rgb(var(--color-cream) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        page: 'rgb(var(--color-page) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        'on-page': 'rgb(var(--color-on-page) / <alpha-value>)',
        'on-page-muted': 'rgb(var(--color-on-page-muted) / <alpha-value>)',
        'on-card': 'rgb(var(--color-on-card) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        brown: '#6B4E37', border: 'rgb(var(--color-border) / <alpha-value>)', danger: '#E53935',
      },
    },
  },
  plugins: [],
}
