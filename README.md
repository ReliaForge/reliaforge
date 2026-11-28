# ReliaForge website

[简体中文](README_CN.md)

Source for [reliaforge.dev](https://reliaforge.dev/). Documentation lives in [`reliaforge-docs`](https://github.com/ReliaForge/reliaforge-docs) ([docs.reliaforge.dev](https://docs.reliaforge.dev/)).

- [reliaforge.dev](https://reliaforge.dev/)
- [docs.reliaforge.dev](https://docs.reliaforge.dev/)
- [demo.reliaforge.dev](https://demo.reliaforge.dev/)
- [`reliaforge-backend`](https://github.com/ReliaForge/reliaforge-backend)
- [`reliaforge-frontend`](https://github.com/ReliaForge/reliaforge-frontend)
- [`reliaforge-plugins`](https://github.com/ReliaForge/reliaforge-plugins)

## Local dev

Requires Node.js 22.12+ and npm 10+.

```bash
npm ci
npm run dev
```

## Checks

```bash
npm run typecheck
npm run lint
npm run test:unit
npm run build
npm run test:e2e
npm run check:hygiene
npm audit --audit-level=high
```

## License

MIT © 2026 Sajo Luo. See [LICENSE](LICENSE).
