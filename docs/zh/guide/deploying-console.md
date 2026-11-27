# 部署控制台

React 控制台统一承载平台状态、插件生命周期管理以及运行时动态加载的 ESM 插件工作区。界面语言自动跟随浏览器语言（支持中英文，也可通过 `?lang=` 参数显式指定），浅色与深色主题自动跟随系统 `prefers-color-scheme`。

## 单进程容器一体化部署

生产环境推荐构建一次前端静态产物，直接交给 `reliaforge-backend` 在同一来源下托管：

```bash
npm ci && npm run build
RELIAFORGE_CONSOLE_DIR=/srv/reliaforge/console reliaforge
```

将 `RELIAFORGE_CONSOLE_DIR` 指向构建生成的 `dist/` 目录后，单个后端容器即可同时提供前端路由、`/api/v1` 接口、插件前端 ESM 资源、SSE 实时日志流与 WebSocket 终端。完整的多阶段镜像构建示例可参考 [`reliaforge-plugins`](https://github.com/ReliaForge/reliaforge-plugins) 中的 `deploy/Dockerfile`。

## 独立静态服务器部署

如果使用独立的 Nginx 或 Caddy 托管 `dist/` 静态文件，请为前端路由配置 `index.html` 回退，并将同源下的 `/api/v1` 转发至后端（注意为日志流关闭代理缓冲，并透传 WebSocket `Upgrade` 请求头）。

切勿将任何上游 API 令牌或代理共享密钥写入 `VITE_*` 变量，这类变量会被直接打包进公开的浏览器脚本中。

## 本地开发

连接本地后端启动前端开发服务器：

```bash
cp .env.example .env
npm ci
npm run dev
```

仅当前后端运行在不同来源时才需要设置 `VITE_RELIAFORGE_API_URL`（客户端会自动追加 `/api/v1`），同时需将该前端来源加入后端 CORS 允许列表。

## 只读演示构建

```bash
npm run build:demo
```

`build:demo` 使用 Hash 路由与静态示例数据构建 `demo.reliaforge.dev`，完全在浏览器端离线运行，不包含后端或写操作。

## 生产环境认证

启用 `proxy` 代理认证模式时，后端仅接受来自可信代理网段且携带正确代理共享密钥的操作者身份请求头，并对浏览器变更请求与 WebSocket 升级执行 `Origin` 校验。生产配置缺失时后端会直接拒绝启动。

对外暴露控制台前请先核对[安全模型](../reference/security.md)。前端与 SDK 的完整构建测试命令详见 [`reliaforge-frontend`](https://github.com/ReliaForge/reliaforge-frontend)。
