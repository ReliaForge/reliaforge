# ReliaForge 网站源码

[English](README.md)

[reliaforge.dev](https://reliaforge.dev/?lang=zh) 的站点源码。部署与开发文档独立存放在 [`reliaforge-docs`](https://github.com/ReliaForge/reliaforge-docs)（[docs.reliaforge.dev](https://docs.reliaforge.dev/zh/)）。

- [reliaforge.dev](https://reliaforge.dev/?lang=zh)
- [docs.reliaforge.dev](https://docs.reliaforge.dev/zh/)
- [demo.reliaforge.dev](https://demo.reliaforge.dev/?lang=zh)
- [`reliaforge-backend`](https://github.com/ReliaForge/reliaforge-backend)
- [`reliaforge-frontend`](https://github.com/ReliaForge/reliaforge-frontend)
- [`reliaforge-plugins`](https://github.com/ReliaForge/reliaforge-plugins)

## 本地运行

需要 Node.js 22.12+ 和 npm 10+。

```bash
npm ci
npm run dev
```

## 检查项

```bash
npm run typecheck
npm run lint
npm run test:unit
npm run build
npm run test:e2e
npm run check:hygiene
npm audit --audit-level=high
```

## 许可证

MIT © 2026 Sajo Luo。详见 [LICENSE](LICENSE)。
