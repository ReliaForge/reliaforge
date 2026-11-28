/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
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
        obsidian: "rgb(var(--bg-canvas) / <alpha-value>)",
        panel: "rgb(var(--bg-panel) / <alpha-value>)",
        surface: "rgb(var(--bg-surface) / <alpha-value>)",
        hairline: "rgb(var(--border-hairline) / <alpha-value>)",
        "hairline-strong": "rgb(var(--border-hairline-strong) / <alpha-value>)",
        ink: "rgb(var(--text-ink) / <alpha-value>)",
        muted: "rgb(var(--text-muted) / <alpha-value>)",
        subtle: "rgb(var(--text-subtle) / <alpha-value>)",
        signal: "rgb(var(--accent-signal) / <alpha-value>)",
        "signal-hover": "rgb(var(--accent-signal-hover) / <alpha-value>)",
        "signal-ink": "rgb(var(--accent-signal-ink) / <alpha-value>)",
        cyan: "rgb(var(--accent-cyan) / <alpha-value>)",
        "code-bg": "rgb(var(--code-bg) / <alpha-value>)",
        "code-ink": "rgb(var(--code-ink) / <alpha-value>)",
      },
    },
  },
  plugins: [],
}
