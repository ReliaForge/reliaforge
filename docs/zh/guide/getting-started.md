# 快速开始

本指南带你从空目录启动 ReliaForge，验证两个内置示例插件，并用脚手架创建第一个自定义插件。如果只想先浏览界面，无需安装 Python 或 Node.js，直接打开[在线演示](https://demo.reliaforge.dev/?lang=zh)即可。

## 环境要求

- 后端需要 Python 3.11 或更高版本；
- 前端或 ESM 插件界面构建需要 Node.js 20 或更高版本，以及 npm 10 或更高版本；
- Git。

## 1. 启动后端

克隆后端并创建隔离环境：

```bash
git clone https://github.com/ReliaForge/reliaforge-backend.git
cd reliaforge-backend
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"
cp .env.example .env
reliaforge
```

在 Windows PowerShell 中，使用 `.venv\Scripts\Activate.ps1` 激活虚拟环境。

开发服务器默认绑定到回环地址 `127.0.0.1`。

## 2. 检查平台已加载的内容

保持后端运行，另开一个终端查询平台状态、插件列表和示例 API：

```bash
curl http://127.0.0.1:8000/api/v1/status
curl http://127.0.0.1:8000/api/v1/plugins
curl http://127.0.0.1:8000/api/v1/plugins/demo/greeting
curl http://127.0.0.1:8000/api/v1/plugins/runbook/preview
```

前两个请求查看后端状态与已加载插件，后两个请求调用插件自身接口：`demo` 返回问候语，`runbook` 复用 `demo` 导出的 Python 服务生成预览文本。两者都不会执行外部命令或改动系统。

## 3. 用脚手架创建插件

按 Ctrl+C 停止后端，生成并加载新插件：

```bash
reliaforge-scaffold sample_tool --destination ./local-plugins
RELIAFORGE_PLUGIN_PATHS=./local-plugins reliaforge
```

在 PowerShell 中，将最后一行替换为：

```powershell
$env:RELIAFORGE_PLUGIN_PATHS = "./local-plugins"
reliaforge
```

该命令会创建 `local-plugins/sample_tool/`，`RELIAFORGE_PLUGIN_PATHS` 指向存放插件目录的父路径。

保持后端运行，在另一个终端调用新插件：

```bash
curl --fail http://127.0.0.1:8000/api/v1/plugins/sample_tool/message
```

预期返回：

```json
{"message": "Generated plugin is running", "plugin_id": "sample_tool"}
```

现在自定义插件已经跑通。下一步按[开发插件](./plugin-development.md)添加服务归属团队查询接口或挂载控制台界面。

## 4. 启动控制台

在 `reliaforge-backend` 的同级父目录中另开一个终端执行：

```bash
git clone https://github.com/ReliaForge/reliaforge-frontend.git
cd reliaforge-frontend
cp .env.example .env
npm ci
npm run dev
```

打开 `http://127.0.0.1:5530` 查看插件健康状态、启停控制以及运行时加载的 ESM 插件工作区。API 密钥与代理密钥请只放在后端或反向代理中，不要写入浏览器环境变量。

## 5. 选择下一步

| 体验方式 | 数据来源 | 能否执行运维变更 | 适用场景 |
| --- | --- | --- | --- |
| [在线演示](https://demo.reliaforge.dev/?lang=zh) | 预设示例数据 | 不能 | 安装前快速浏览界面布局与导航 |
| 本地开发 | 本地 Python 进程 | 可以（仅限回环地址） | 编写和调试自定义插件 |
| 生产部署 | 已认证后端与 [`reliaforge-plugins`](https://github.com/ReliaForge/reliaforge-plugins) | 可以（须通过代理认证） | 纳管 Proxmox、Kubernetes、GitOps 及团队内部工具 |

进入生产部署前，请先阅读[安全模型](../reference/security.md)与[部署控制台](./deploying-console.md)。
