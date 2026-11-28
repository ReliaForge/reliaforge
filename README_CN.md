# ReliaForge 产品官网

[English](README.md)

本仓库用于构建并发布 [reliaforge.dev](https://reliaforge.dev/) 产品官网。完整 SRE 部署与开发文档独立托管于 [`reliaforge-docs`](https://github.com/ReliaForge/reliaforge-docs)（[docs.reliaforge.dev](https://docs.reliaforge.dev/zh/)）。

- [产品官网](https://reliaforge.dev/)
- [在线文档](https://docs.reliaforge.dev/zh/)
- [只读在线演示](https://demo.reliaforge.dev/?lang=zh)
- [Python 后端](https://github.com/ReliaForge/reliaforge-backend)
- [React 控制台与插件 SDK](https://github.com/ReliaForge/reliaforge-frontend)
- [官方基础设施插件套件](https://github.com/ReliaForge/reliaforge-plugins)

## 本地预览

需要 Node.js 22.12+ 和 npm 10+。

```bash
npm ci
npm run dev
```

## 验证改动

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
