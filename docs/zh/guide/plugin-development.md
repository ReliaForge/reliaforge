# 开发插件

从团队现有的 Python 运维函数出发，将其暴露为受认证保护的 FastAPI 接口，并按需挂载 React 控制台页面。后端仓库的[分步教程](https://github.com/ReliaForge/reliaforge-backend/blob/main/docs/zh/plugin-development.md)以“查询服务归属团队”为例，提供了可直接运行的完整源码。

## 完成后能得到什么？

按教程完成后，可直接调用：

```bash
curl "http://127.0.0.1:8000/api/v1/plugins/sample_tool/owner?service_name=payments"
```

返回结果：

```json
{"service": "payments", "team": "payments-ops"}
```

示例内置两条预设记录，便于在不连接外部数据库或第三方系统的情况下验证路由与启停行为。

## 需要修改哪些文件？

先按[快速开始](./getting-started.md)生成 `sample_tool`，再依次完成：

| 步骤 | 文件或配置 | 具体内容 |
| --- | --- | --- |
| 编写领域逻辑 | `ownership.py` | 实现服务到负责团队的查询函数 |
| 暴露 HTTP 路由 | `router.py` | 校验查询参数、调用业务函数并返回 JSON |
| 本地加载调试 | `RELIAFORGE_PLUGIN_PATHS` | 指向 `./local-plugins` 并重启 `reliaforge` |
| 按需接入前端界面 | `manifest.json`（`frontend`） | 需要专属表格、抽屉或终端时，基于 `@reliaforge/plugin-sdk` 构建 ESM 工作区 |

脚手架生成的 `plugin.py` 已默认配置好启动与停止钩子。当插件需要维护异步 HTTP 客户端、WebSocket 会话或后台任务时，请参考[完整教程与运行时规范](https://github.com/ReliaForge/reliaforge-backend/blob/main/docs/zh/plugin-development.md)。

## 验证启停与状态行为

依次测试三种场景：查询存在的服务（返回 `200`）、查询未知服务（返回 `404`），以及停止插件后再次请求该接口（返回 `503`）。在控制台重新启动插件后，接口应立即恢复 `200` 响应，无需重启后端进程。

本地开发期间，可打开 `http://127.0.0.1:8000/api/v1/docs` 调试接口结构，并在控制台验证启动、停止与重启流转。

## 打包与分发

插件支持两种交付方式：

- **Python 包分发（推荐用于跨环境复用）**：在 `pyproject.toml` 的 `[project.entry-points."reliaforge.plugins"]` 下声明入口并安装到后端环境中。全栈 Python + `@reliaforge/plugin-sdk` 工程结构可参考官方 [`reliaforge-plugins`](https://github.com/ReliaForge/reliaforge-plugins) 仓库。
- **目录挂载分发**：将插件目录放入部署环境，安装所需 Python 依赖，并将父目录加入 `RELIAFORGE_PLUGIN_PATHS`。

内置的 [demo](https://github.com/ReliaForge/reliaforge-backend/tree/main/reliaforge/plugins/demo) 与 [runbook](https://github.com/ReliaForge/reliaforge-backend/tree/main/reliaforge/plugins/runbook) 插件也展示了最小化的跨插件 Python 服务调用方式。
