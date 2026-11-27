# 仓库

ReliaForge 由四个仓库组成。可以通过下表定位对应的源码和文档。

| 仓库 | 包含内容 |
| --- | --- |
| [`reliaforge`](https://github.com/ReliaForge/reliaforge) | 项目网站、快速开始、跨仓库架构概览、安全概览和路线图 |
| [`reliaforge-backend`](https://github.com/ReliaForge/reliaforge-backend) | Python 运行时、管理 API、WebSocket/SSE 代理认证、示例插件、插件脚手架和详细后端文档 |
| [`reliaforge-frontend`](https://github.com/ReliaForge/reliaforge-frontend) | React 控制台、运行时 ESM 插件宿主、`@reliaforge/plugin-sdk`、界面测试和只读在线演示 |
| [`reliaforge-plugins`](https://github.com/ReliaForge/reliaforge-plugins) | 官方全栈基础设施插件套件（`infra_overview`、`proxmox`、`kubernetes`、`gitops_argocd`、`observability`、`ops_audit`）及单容器镜像构建 |

需要确认具体运行时或 SDK 契约时，请查阅代码所在仓库内的文档。各仓库独立维护版本号与 GitHub Releases。
