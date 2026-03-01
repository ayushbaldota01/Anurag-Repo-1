import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        accent: 'var(--accent)',
        overlay: 'var(--overlay)',
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        accent: ['var(--font-space-grotesk)', 'sans-serif'],
        gothic: ['UnifrakturMaguntia', 'serif'],
      },
      spacing: {
        base: '8px',
      },
      gridTemplateColumns: {
        'split-desktop': '50% 50%',
        'split-asymmetric': '40% 60%',
        'split-asymmetric-reverse': '60% 40%',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scroll-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scroll-line': 'scroll-line 2s cubic-bezier(0.77, 0, 0.175, 1) infinite',
      }
    },
  },
  plugins: [],
};
export default config;
