/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-lato)'],
        serif: ['var(--font-playfair)'],
        cormorant: ['var(--font-cormorant)'],
      },
      colors: {
        earth: {
          light: '#e6e2d3',  // Light sand/beige
          beige: '#d4c8a8',  // Warm beige
          sand: '#c2b091',   // Sand
          tan: '#9c8c6e',    // Tan
          brown: '#7d6c55',  // Earth brown
          clay: '#5f5242',   // Clay
          bark: '#483c32',   // Dark bark/wood
          soil: '#3b2f2f',   // Rich soil
          moss: '#4a5d23',   // Moss green
          leaf: '#6a7f40',   // Leaf green
          forest: '#3f4a3c',  // Forest green
          ocean: '#5b7065',   // Deep ocean green
          slate: '#6b7b72',   // Slate gray with green undertone
          terracotta: '#c87d56', // Terracotta/clay pot
          rust: '#a45a52',    // Rust/burnt sienna
          sunset: '#c97c5d',   // Sunset orange/terracotta
        }
      },
    },
  },
  plugins: [],
} 