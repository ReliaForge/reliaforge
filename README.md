# ReliaForge

[简体中文](README_CN.md)

ReliaForge is a plugin-based operations platform for SRE and platform teams. Package Python APIs,
shared services, and runtime React workspaces as plugins, then run and govern them in one
authenticated backend and console.

The backend validates manifests and SemVer dependencies, enforces HTTP and WebSocket proxy
authentication, and manages plugin start, stop, and restart hooks. Plugins can ship domain APIs on
their own or attach ESM console views built with `@reliaforge/plugin-sdk`.

- [Documentation](https://reliaforge.dev/)
- [Read-only demo](https://demo.reliaforge.dev/)
- [Python backend](https://github.com/SajoLuo/reliaforge-backend)
- [React console and Plugin SDK](https://github.com/SajoLuo/reliaforge-frontend)
- [Official infrastructure plugins](https://github.com/SajoLuo/reliaforge-plugins)

This repository contains the project website and shared documentation.

## Run the website locally

You need Node.js 22.12 or newer and npm 10 or newer.

```bash
npm ci
npm run dev
```

Open `http://127.0.0.1:5173/`.

## Verify a change

```bash
npm run typecheck
npm run lint
npm run test:unit
npm run check:i18n
npm run build
npm run test:e2e
npm run check:hygiene
npm audit --audit-level=high
```

## License

MIT © 2026 Sajo Luo. See [LICENSE](LICENSE).
