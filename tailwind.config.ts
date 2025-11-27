import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
      colors: {
        console: {
          body: '#080808',
          chassis: '#111111',
          panel: '#161616',
          surface: '#1E1E1E',
          inset: '#0a0a0a',
          text: '#E0E0E0',
          subtext: '#555555',
          accent: '#F5A623',
          blue: '#0094FF',
          led: '#4DFF91',
        }
      },
      boxShadow: {
        'chassis': '0 20px 50px -10px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
        'panel': 'inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px rgba(0,0,0,1)',
        'knob': '0 4px 10px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
        'btn': '0 3px 6px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(0,0,0,0.5)',
        'btn-active': 'inset 0 2px 10px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(0,0,0,0.8)',
        'screen': 'inset 0 2px 20px rgba(0,0,0,1)',
        'slot': 'inset 0 2px 5px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.03)',
      },
      backgroundImage: {
        'metal': "url('data:image/svg+xml,%3Csvg viewBox=%220 0 512 512%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.03%22/%3E%3C/svg%3E')",
      }
    },
  },
  plugins: [],
};
export default config;

