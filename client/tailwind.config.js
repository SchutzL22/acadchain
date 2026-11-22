/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c2d8eb',
          300: '#94bde0',
          400: '#5f9ed0',
          500: '#3882be',
          600: '#2768a3',
          700: '#1f5385',
          800: '#1c466e',
          900: '#0f2942', // Azul marinho profundo acadêmico
          950: '#091a2b',
        },
        accent: {
          50: '#edfcf2',
          500: '#10b981', // Verde validação
          600: '#059669',
          700: '#047857',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
