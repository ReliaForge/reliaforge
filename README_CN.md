# ReliaForge

[English](README.md)

ReliaForge 是面向 SRE 与平台团队的插件式运维平台。将 Python 接口、共享服务与按需加载的 React 工作区封装为插件，在统一的后端与控制台中运行和管理。

后端负责校验插件清单与 SemVer 依赖关系、统一认证 HTTP 与 WebSocket 请求，并编排插件的启动、停止与重启。插件既可以仅提供后端 API，也可以使用 `@reliaforge/plugin-sdk` 附带运行时控制台界面。

- [文档](https://reliaforge.dev/zh/)
- [只读在线演示](https://demo.reliaforge.dev/?lang=zh)
- [Python 后端](https://github.com/SajoLuo/reliaforge-backend)
- [React 控制台与插件 SDK](https://github.com/SajoLuo/reliaforge-frontend)
- [官方基础设施插件套件](https://github.com/SajoLuo/reliaforge-plugins)

本仓库包含项目网站和跨仓库共用的文档。

## 本地运行网站

需要 Node.js 22.12 或更高版本，以及 npm 10 或更高版本。

```bash
npm ci
npm run dev
```

打开 `http://127.0.0.1:5173/zh/`。

## 验证改动

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

## 许可证

MIT © 2026 Sajo Luo。详见 [LICENSE](LICENSE)。
