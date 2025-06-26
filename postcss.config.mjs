const config = {
  plugins: ["@tailwindcss/postcss"],
  darkmode: 'class',
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
};

export default config;
