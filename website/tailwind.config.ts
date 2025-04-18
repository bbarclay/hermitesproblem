import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // You can extend the theme here
      colors: {
        background: {
          DEFAULT: "#f8fafc", // light background
          dark: "#18181b"     // dark background
        },
        foreground: {
          DEFAULT: "#18181b", // light text
          dark: "#f8fafc"     // dark text
        }
      },
    },
  },
  plugins: [],
}

export default config 