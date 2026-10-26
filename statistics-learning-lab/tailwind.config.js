/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        teal: '#0D9488',
        background: '#F8FAFC',
        card: '#FFFFFF',
        textDark: '#1E293B',
        textMuted: '#64748B',
        success: '#16A34A',
        warning: '#D97706',
        danger: '#DC2626',
        border: '#E2E8F0',
      },
    },
  },
  plugins: [],
}
