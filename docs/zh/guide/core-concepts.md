# 核心概念

ReliaForge 以插件形式运行 Python 运维服务与可选的 React 控制台工作区。插件作者实现具体领域逻辑；平台负责校验依赖、读取配置、执行身份验证并编排启动与停止。

## 插件是什么？

插件是一个包含 `manifest.json` 的本地目录或已安装 Python 包。清单文件向 ReliaForge 声明插件 ID、版本号、Python 入口类、导出的服务能力、依赖项以及可选的前端模块信息。

插件可以提供查询与变更 API、推送实时日志流或终端会话、运行后台采集任务，也可以在控制台中注册专属运维页面。阅读[开发插件](./plugin-development.md)了解如何把一个 Python 函数封装为受认证保护的接口。

## 启动插件会发生什么？

后端先校验插件配置、初始化运行时上下文，再按拓扑顺序调用启动钩子（必选依赖总是先启动）。停止插件时会执行清理钩子以关闭上游客户端、数据库连接和后台任务，随后注销该插件注册的共享服务与事件订阅。

控制台区分展示两类状态信号：

| 状态信号 | 含义说明 |
| --- | --- |
| 运行状态 | 插件处于运行中（`running`）、已停止（`stopped`）或异常（`error`） |
| 健康状态 | 运行中的插件与上游系统的连接是否正常，上游受阻时会报告降级（`degraded`） |

## 怎样使用插件提供的能力？

每个插件都在 `/api/v1/plugins/{plugin_id}` 下挂载自己的 FastAPI 路由；本地开发模式下可访问 `http://127.0.0.1:8000/api/v1/docs` 查阅和调试接口。

如果插件在 `manifest.json` 中将 `frontend.ui_mode` 设为 `"esm"`，后端会在 `/api/v1/plugins/{plugin_id}/ui/*` 下托管其构建产物，React 控制台会自动在侧边栏挂载工作区页面并在首页渲染概览组件。未附带前端界面的纯 API 插件同样可在控制台的插件列表中查看状态和执行启停。

## 插件之间怎样协作？

插件可以向同进程内的其他插件注册带类型的 Python 共享服务。例如，`ops_audit` 导出 `ops_audit.writer` 与 `ops_audit.reader`，供 `proxmox`、`kubernetes`、`gitops_argocd` 和 `observability` 记录变更审计，无需在每个插件中重复维护存储实现。

服务提供者在 `capabilities` 中声明能力名；调用方在 `dependencies` 中声明提供者版本范围，若缺少该依赖仍可降级运行，可将其标记为 `"optional": true`。

## 在哪里修改配置？

启动后端前通过环境变量完成平台与插件配置：

- 平台发现与筛选：通过 `RELIAFORGE_PLUGIN_PATHS`、`RELIAFORGE_PLUGIN_ENTRY_POINTS`、`RELIAFORGE_ENABLED_PLUGINS` 和 `RELIAFORGE_DISABLED_PLUGINS` 控制插件搜索来源及实际启用的插件列表。
- 插件业务参数：每个插件的 `PluginSettings` 类自动读取 `RELIAFORGE_<PLUGIN_ID>_*` 前缀的环境变量（如 `RELIAFORGE_SAMPLE_TOOL_MESSAGE`）。

控制台仅展示配置项名称、类型与非敏感默认值，从不返回当前实际值或密钥内容。自定义配置定义方式详见后端仓库的[插件开发指南](https://github.com/ReliaForge/reliaforge-backend/blob/main/docs/zh/plugin-development.md)。
