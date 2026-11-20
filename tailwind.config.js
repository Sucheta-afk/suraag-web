/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          50: '#FFF9ED',
          100: '#FEF1DA',
          200: '#F7DDB3',
          300: '#EBC58A',
          400: '#E7AD5B',
          500: '#D99A42',
          600: '#B87A31',
          700: '#8F5D27',
          800: '#6F4722',
          900: '#422315',
          950: '#422315',
        },
        // Suraag.in brand palette
        cream: {
          50: '#fdfbf7',
          100: '#F8EFDF', // warm ivory / main app background
          150: '#f7f1e6',
          200: '#f2e8d9', // active navigation pill / hover
          300: '#e8d9c2',
          400: '#d7c2a4',
          500: '#bfa482',
        },
        // Rich Golden Yellows & Ambers
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#D99A42',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Warm Wood, Bronze & Espresso Browns
        espresso: {
          50: '#f9f6f3',
          100: '#f2eae3',
          200: '#e5d5c6',
          300: '#d1b9a2',
          400: '#b8997c',
          500: '#9b7c5e',
          600: '#7d6148',
          700: '#5e4835',
          800: '#3d2e22',
          900: '#422315', // deep espresso / primary dark text
          950: '#19110c',
        },
        // Royal Plum / Aubergine from Banner in Image
        plum: {
          500: '#64377d',
          600: '#512c66',
          700: '#3e2150',
          800: '#321941',
          900: '#2b1638', // banner background
          950: '#1e0d28',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 1.2s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { height: '20%' },
          '50%': { height: '100%' },
        }
      }
    },
  },
  plugins: [],
}
