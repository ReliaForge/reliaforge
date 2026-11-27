---
layout: home

hero:
  text: 用插件构建统一的运维平台。
  tagline: 将 Python 接口、共享服务与 React 工作区封装为插件，由同一套后端完成依赖校验、权限控制与控制台托管。
  image:
    src: /console-preview.png
    alt: ReliaForge 控制台总览，展示 Proxmox、Kubernetes、GitOps、可观测性与服务健康状态
  actions:
    - theme: brand
      text: 在线体验
      link: https://demo.reliaforge.dev/?lang=zh
    - theme: alt
      text: 开始使用
      link: /zh/guide/getting-started

heroPreview:
  src: /console-preview.png
  alt: ReliaForge 控制台总览，展示 Proxmox、Kubernetes、GitOps、可观测性与服务健康状态
  href: https://demo.reliaforge.dev/?lang=zh
  label: 打开 ReliaForge 只读在线演示

features:
  - title: 全栈插件契约
    details: 在同一个插件目录或 Python 包中交付 FastAPI 路由、共享 Python 服务，以及按需加载的 ESM React 工作区。
  - title: 依赖校验与有序启停
    details: 导入代码前先校验清单与 SemVer 服务依赖；单个插件加载失败时，无关插件与管理接口保持可用。
  - title: 受控变更与审计记录
    details: 通过反向代理统一认证 HTTP 与 WebSocket 请求，对高影响变更执行二次确认，并记录结构化审计轨迹。
  - title: 单进程一体化交付
    details: 支持从本地目录或 Python entry points 发现插件，由单个后端容器同时托管控制台、API、SSE 日志流与终端。
---

<section class="home-section">
<div class="arch-split">
<div>

## 一份契约贯通后端服务与控制台

无需为每个内部运维工具单独维护一套微服务和前端工程。每个插件通过 `manifest.json` 声明依赖关系、环境变量配置、后端路由以及可选的控制台界面。

<div class="arch-ledger">
  <div class="arch-row">
    <strong>后端运行时</strong>
    <span>校验插件清单与依赖图，统一执行 HTTP 与 WebSocket 代理身份验证，并按依赖顺序编排插件的启动、停止与重启。</span>
  </div>
  <div class="arch-row">
    <strong>插件包</strong>
    <span>在 <code>/api/v1/plugins/{id}</code> 下提供业务 API，向其他插件发布带类型的 Python 共享服务，并可附带前端 ESM 模块。</span>
  </div>
  <div class="arch-row">
    <strong>控制台与 SDK</strong>
    <span>在运行时挂载插件工作区与首页概览组件，复用 <code>@reliaforge/plugin-sdk</code> 提供的表格、抽屉、日志流与终端组件。</span>
  </div>
</div>

<p>阅读<a href="./guide/architecture.html">架构概览</a>了解运行边界，或按照<a href="./guide/plugin-development.html">开发插件</a>将现有 Python 函数接入平台。</p>

</div>
<div class="arch-code">

```json
{
  "id": "kubernetes",
  "name": "Kubernetes",
  "version": "1.0.0",
  "api_version": "v1",
  "entrypoint": "plugin:Plugin",
  "capabilities": [
    "kubernetes.inventory",
    "kubernetes.logs",
    "kubernetes.actions"
  ],
  "dependencies": [
    { "id": "ops_audit", "version": "^1.0.0", "optional": true }
  ],
  "frontend": {
    "category": "Infrastructure",
    "ui_mode": "esm"
  }
}
```

</div>
</div>
</section>

<section class="home-section">

## 开箱即用的核心基础设施套件

除了接入团队自研工具，也可以直接部署官方 [`reliaforge-plugins`](https://github.com/ReliaForge/reliaforge-plugins) 插件套件，按环境实际需求启用所需集成并禁用其余插件。

<div class="suite-grid">
  <div class="suite-cell">
    <strong>基础设施总览 <code>infra_overview</code></strong>
    <p>在首页联动宿主机节点、集群容量、GitOps 同步状态、活跃告警与业务服务目录健康度。</p>
  </div>
  <div class="suite-cell">
    <strong>Proxmox VE <code>proxmox</code></strong>
    <p>查看节点 RRD 负载趋势、存储池、QEMU 虚拟机与 LXC 容器，支持白名单电源操作与 LXC 网页终端抽屉。</p>
  </div>
  <div class="suite-cell">
    <strong>Kubernetes <code>kubernetes</code></strong>
    <p>按命名空间检索工作负载、节点与事件，通过 SSE 实时追踪 Pod 日志、打开容器终端并执行滚动重启。</p>
  </div>
  <div class="suite-cell">
    <strong>Argo CD 持续交付 <code>gitops_argocd</code></strong>
    <p>追踪应用同步状态、已部署 Git 版本、健康度与资源树，支持受控触发刷新与同步操作。</p>
  </div>
  <div class="suite-cell">
    <strong>可观测性 <code>observability</code></strong>
    <p>集中查询 Prometheus 指标与 Loki 日志流，查看 Alertmanager 触发中的告警规则并创建或解除静默。</p>
  </div>
  <div class="suite-cell">
    <strong>运维审计 <code>ops_audit</code></strong>
    <p>向其他插件提供共享 SQLite 审计服务，完整记录虚拟机电源变更、工作负载重启、同步与告警静默操作。</p>
  </div>
</div>

</section>

<section class="home-section">
<div class="closing-split">
<div>

## 在浏览器直接体验，或几分钟内本地拉起

无需安装任何环境，即可通过[只读在线演示](https://demo.reliaforge.dev/?lang=zh)使用预设数据浏览界面。需要实际测试插件启停或编写自定义集成时，执行四条命令即可启动本地后端。

<div class="closing-action">
  <a class="cta-button" href="./guide/getting-started.html">阅读快速开始</a>
</div>

</div>
<div class="arch-code">

```bash
git clone https://github.com/ReliaForge/reliaforge-backend.git
cd reliaforge-backend
python -m venv .venv && source .venv/bin/activate
python -m pip install -e ".[dev]" && reliaforge
```

</div>
</div>
</section>
