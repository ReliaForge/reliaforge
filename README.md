# ReliaForge Website

[简体中文](README_CN.md)

This repository builds the product landing page published at [reliaforge.dev](https://reliaforge.dev/).
Full SRE and developer documentation lives in
[`reliaforge-docs`](https://github.com/ReliaForge/reliaforge-docs) ([docs.reliaforge.dev](https://docs.reliaforge.dev/)).

- [Product website](https://reliaforge.dev/)
- [Documentation](https://docs.reliaforge.dev/)
- [Read-only demo](https://demo.reliaforge.dev/)
- [Python backend](https://github.com/ReliaForge/reliaforge-backend)
- [React console and Plugin SDK](https://github.com/ReliaForge/reliaforge-frontend)
- [Official infrastructure plugins](https://github.com/ReliaForge/reliaforge-plugins)

## Run locally

Requires Node.js 22.12+ and npm 10+.

```bash
npm ci
npm run dev
```

## Verify a change

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
