# 架构

ReliaForge 在单个 Python 后端进程内托管多个运维插件，并配合统一的 React 控制台宿主运行。后端负责插件发现、依赖拓扑排序、配置结构校验、反向代理认证与生命周期编排；各插件负责自身的领域 API、共享服务以及可选的 ESM 控制台视图。

```text
Browser console -> /api/v1/*           -> management API & plugin manager
                -> /api/v1/plugins/*   -> plugin HTTP, SSE, WebSocket, and ESM UI assets
API clients     -> /api/v1/plugins/*   -> plugin FastAPI routers & shared services
```

## 插件发现与前置校验

导入任何插件代码前，后端先从 `RELIAFORGE_PLUGIN_PATHS` 目录与已安装 Python 包的 `entry_points`（`reliaforge.plugins` 组）收集候选插件，按 `enabled_plugins` 与 `disabled_plugins` 过滤后逐一校验 `manifest.json`。平台会检查插件 ID、SemVer 范围、缺失的必选依赖及循环依赖，确认无误后再按拓扑顺序导入代码。

清单格式错误或依赖图非法会直接阻止后端启动，避免带病运行。通过元数据校验后，若单个插件在代码导入或启动阶段抛出异常，后端会记录结构化错误并阻断其必选下游插件，其余无关插件与 `/api/v1` 管理接口保持正常服务。

## 生命周期、共享服务与事件

插件管理器串行控制启动、停止和重启状态流转。每个插件获取独立作用域上下文，用于注册带类型的 Python 服务（`capabilities`）与进程内事件订阅。插件停止时先执行作者定义的清理钩子（即使初始化中途失败也会触发），释放外部连接与后台任务，再由平台统一回收其服务注册项。

初始化与启动均受超时时间约束。健康检查接口只返回内存状态或缓存快照，不触发外部修复动作；进程内事件总线仅用于插件间轻量通知，不承担持久化任务队列职责。

## 控制台宿主与运行时前端

后端在统一认证保护下提供存活、就绪、平台状态、插件目录、配置结构、启停接口以及插件自身的 HTTP、SSE 与 WebSocket 路由。当插件声明 `frontend.ui_mode = "esm"` 时，控制台从 `/api/v1/plugins/{id}/ui/*` 动态加载前端模块，在独立的错误边界内共享宿主 React 实例与 `@reliaforge/plugin-sdk` 组件库。

```text
Console host -> API client & runtime loader -> live ReliaForge backend
                                            \-> saved demo dataset
```

公开在线演示使用预设静态数据并关闭写操作；实际部署环境连接实时后端接口。

## 生产部署拓扑

生产环境推荐在同源域名下通过具备身份认证能力的反向代理（如 Envoy/Cilium Gateway、Nginx、Caddy 或 Cloudflare Access）对外暴露服务。配置 `RELIAFORGE_CONSOLE_DIR` 即可由后端单进程同时提供控制台静态资源、`/api/v1` 接口、SSE 日志流与 WebSocket 终端，确保所有上游凭据和代理共享密钥仅保留在服务端。

状态机流转与故障隔离细则详见后端仓库的[架构文档](https://github.com/ReliaForge/reliaforge-backend/blob/main/docs/zh/architecture.md)。
