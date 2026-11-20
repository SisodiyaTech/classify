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
          50: '#F0F7F5',
          100: '#D9ECE7',
          200: '#B5DDD4',
          300: '#87C6B8',
          400: '#52A796',
          500: '#176B5B', // Primary #176B5B
          600: '#125649',
          700: '#12483F', // Secondary #12483F
          800: '#103932',
          900: '#102A2A', // Dark #102A2A
          950: '#081717',
        },
        surface: {
          DEFAULT: '#F8F7F2', // Background #F8F7F2
          card: '#FFFFFF',
          muted: '#F3F2EB',
          subtle: '#FAF9F5',
        },
        content: {
          primary: '#1F2937',
          body: '#344054', // Text #344054
          muted: '#667085',
          subtle: '#98A2B3',
        },
        accent: {
          DEFAULT: '#D9BC83', // Accent #D9BC83
          light: '#F5EEDD',
          hover: '#C7A76A',
          dark: '#9E7D3B',
        },
        edge: {
          DEFAULT: '#E5E7EB', // Border #E5E7EB
          light: '#F2F4F7',
          dark: '#D0D5DD',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(16, 42, 42, 0.05), 0 1px 2px -1px rgba(16, 42, 42, 0.05)',
        'card': '0 4px 6px -1px rgba(16, 42, 42, 0.04), 0 2px 4px -2px rgba(16, 42, 42, 0.03)',
        'elevated': '0 10px 15px -3px rgba(16, 42, 42, 0.06), 0 4px 6px -4px rgba(16, 42, 42, 0.04)',
        'dropdown': '0 20px 25px -5px rgba(16, 42, 42, 0.08), 0 8px 10px -6px rgba(16, 42, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
