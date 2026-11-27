# 路线图

ReliaForge 持续演进面向运维插件的公共运行时与控制台宿主，具体业务接口、共享服务和工作区视图由各插件维护。平台当前已提供：

- 支持从搜索路径与 Python `entry_points` 发现插件，并通过 `enabled_plugins` 和 `disabled_plugins` 按需启停加载；
- 清单校验、必选与可选 SemVer 依赖解析，以及按拓扑顺序启动；
- 启动、停止、重启、健康状态报告与结构化生命周期审计钩子；
- 基于环境变量的插件配置，并在配置结构接口中自动隐藏敏感默认值；
- 统一的 HTTP 与 WebSocket 代理身份验证，配合 Origin 来源校验防御跨站请求；
- 基于 `@reliaforge/plugin-sdk` 动态加载的 ESM React 插件工作区与首页概览卡片；
- 支持通过 `RELIAFORGE_CONSOLE_DIR` 单进程托管静态控制台，也可独立部署静态站点；
- 内置示例插件、`reliaforge-scaffold` 脚手架，以及包含六款插件的 [`reliaforge-plugins`](https://github.com/SajoLuo/reliaforge-plugins) 官方基础设施套件。

## 下一步重点

- 为插件接口和高风险运维动作提供细粒度角色权限（RBAC）控制；
- 在基础设施插件中支持多集群与多站点目标切换；
- 提供内置 OIDC 会话认证适配器，降低无外部认证网关场景的接入成本；
- 从后端与插件生命周期钩子导出 OpenTelemetry 链路追踪与运行指标。

讨论具体改动时，请在负责对应代码的仓库中创建 Issue：

- [后端 Issues](https://github.com/SajoLuo/reliaforge-backend/issues)；
- [前端与 SDK Issues](https://github.com/SajoLuo/reliaforge-frontend/issues)；
- [官方插件套件 Issues](https://github.com/SajoLuo/reliaforge-plugins/issues)；
- [站点和跨项目 Issues](https://github.com/SajoLuo/reliaforge/issues)。
