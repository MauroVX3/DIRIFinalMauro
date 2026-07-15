import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172936',
        paper: '#f2f8fc',
        accent: '#0b84c6',
        moss: '#47788f',
      },
    },
  },
  plugins: [],
}

export default config
