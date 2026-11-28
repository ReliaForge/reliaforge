/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "PingFang SC",
          "Microsoft YaHei UI",
          "Noto Sans SC",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "SFMono-Regular",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      colors: {
        obsidian: "#090b0f",
        panel: "#0f1218",
        surface: "#151923",
        hairline: "#202634",
        "hairline-strong": "#30394d",
        ink: "#f2f5fa",
        muted: "#9aa5b8",
        subtle: "#7c879b",
        signal: "#34d399",
        "signal-hover": "#4ade80",
        cyan: "#38bdf8",
      },
    },
  },
  plugins: [],
}
