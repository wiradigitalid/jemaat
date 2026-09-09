/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FAF7F2',
        surface: '#FFFFFF',
        surfaceAlt: '#FFFDFB',
        ink: '#241E1A',
        ink2: '#6B6058',
        ink3: '#9A8F85',
        line: '#E9E1D7',
        lineSoft: '#F1EAE1',
        accent: '#B4562F',
        accentDark: '#8E4224',
        accentTint: '#F6EAE3',
        sage: '#4C6B52',
        sageTint: '#EAF0EA',
        amber: '#9A7223',
        amberTint: '#F7EEDD',
        disabled: '#EFE8DF',
        disabledInk: '#B5AAA0',
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        mark: '6px',
        input: '12px',
        card: '14px',
      },
    },
  },
  plugins: [],
}
