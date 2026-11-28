import type { SnippetLanguage } from "../components/SyntaxCode"

export type Locale = "en" | "zh"

export type ThemeMode = "light" | "dark"

export type WorkspaceViewId = "overview" | "proxmox" | "kubernetes" | "gitops" | "observability"

export interface WorkspaceView {
  id: WorkspaceViewId
  label: string
  route: string
  srcLight: string
  srcDark: string
  alt: string
}

export interface SafetyScenario {
  id: string
  label: string
  steps: Array<{
    stage: string
    code: string
    latencyMs: number
  }>
}

export interface PluginEntry {
  id: string
  title: string
  summary: string
  viewId?: WorkspaceViewId
}

export interface CodeTab {
  id: string
  filename: string
  language: SnippetLanguage
  code: string
}

export interface DeployTab {
  id: string
  label: string
  language: SnippetLanguage
  code: string
}

export interface StudioCopy {
  uiTab: string
  panelTitle: string
  searchPlaceholder: string
  colService: string
  colTeam: string
  colAction: string
  verifyAction: string
  verifiedLabel: string
}

export interface DeploySectionCopy {
  heading: string
  lead: string
  archProxyTitle: string
  archContainerSub: string
  archTargetsTitle: string
  specs: Array<{ label: string; value: string }>
  composeLink: string
  prodGuideLink: string
  tabs: DeployTab[]
}

export interface SiteCopy {
  nav: {
    console: string
    plugins: string
    build: string
    deploy: string
    docs: string
    github: string
    docsUrl: string
    demoUrl: string
    switchToLight: string
    switchToDark: string
  }
  hero: {
    title: string
    tagline: string
    primaryCta: string
    githubCta: string
    pullCommand: string
    openDemoHint: string
    liveToggle: string
    snapshotToggle: string
    clickToInteract: string
  }
  workspaces: WorkspaceView[]
  opsStory: {
    heading: string
    lead: string
    replayTrace: string
    rails: string[]
    scenarios: SafetyScenario[]
  }
  suite: {
    heading: string
    repoLabel: string
    inspectView: string
    plugins: PluginEntry[]
  }
  byo: {
    heading: string
    lead: string
    docsCta: string
    tabs: CodeTab[]
    studio: StudioCopy
  }
  deploy: DeploySectionCopy
  closing: {
    heading: string
    cta: string
  }
  footer: {
    docs: string
    demo: string
    org: string
    license: string
  }
  copyButton: {
    copy: string
    copied: string
  }
}

const CODE_TABS: CodeTab[] = [
  {
    id: "router",
    filename: "router.py",
    language: "python",
    code: `from fastapi import APIRouter, HTTPException

router = APIRouter()

OWNERS = {
    "payments-api": "payments-ops",
    "checkout-worker": "edge-sre",
    "ingress-gateway": "platform-net",
}

@router.get("/owner")
async def lookup_owner(service: str) -> dict[str, str]:
    team = OWNERS.get(service)
    if not team:
        raise HTTPException(status_code=404, detail="Not found")
    return {"service": service, "team": team}`,
  },
  {
    id: "manifest",
    filename: "manifest.json",
    language: "json",
    code: `{
  "id": "service_owner",
  "name": "Service Ownership",
  "version": "1.0.0",
  "api_version": "v1",
  "entrypoint": "plugin:Plugin",
  "dependencies": [
    { "id": "ops_audit", "version": "^1.0.0", "optional": true }
  ],
  "frontend": {
    "category": "Operations",
    "ui_mode": "esm"
  }
}`,
  },
  {
    id: "workspace",
    filename: "workspace.tsx",
    language: "tsx",
    code: `import { DataTable, PageHeader, useLocale, apiFetch } from "@reliaforge/plugin-sdk"

export default function OwnershipPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Service Ownership" />
      <DataTable
        searchable
        rows={rows}
        rowKey={(r) => r.service}
        columns={columns}
      />
    </div>
  )
}`,
  },
]

const COMPOSE_YAML = `services:
  reliaforge:
    image: ghcr.io/reliaforge/reliaforge:latest
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      RELIAFORGE_ENVIRONMENT: production
      RELIAFORGE_HOST: 0.0.0.0
      RELIAFORGE_AUTH_MODE: proxy
      RELIAFORGE_PROXY_TRUSTED_NETWORKS: '["198.51.100.0/24"]'
      RELIAFORGE_PROXY_SHARED_SECRET: "replace-with-32-char-random-secret-here"
      RELIAFORGE_OPS_AUDIT_DB_PATH: /data/audit.sqlite3
      RELIAFORGE_PROXMOX_API_URL: https://pve.example.com:8006
    volumes:
      - reliaforge-data:/data

volumes:
  reliaforge-data:`

const LOCAL_DEV_BASH = `git clone https://github.com/ReliaForge/reliaforge-backend.git
cd reliaforge-backend
python -m venv .venv && source .venv/bin/activate
python -m pip install -e ".[dev]"

reliaforge-scaffold my_tool --destination ./local-plugins
RELIAFORGE_PLUGIN_PATHS=./local-plugins reliaforge`

export const COPY: Record<Locale, SiteCopy> = {
  en: {
    nav: {
      console: "Console",
      plugins: "Plugins",
      build: "Extend",
      deploy: "Deploy",
      docs: "Docs",
      github: "GitHub",
      docsUrl: "https://docs.reliaforge.dev/",
      demoUrl: "https://demo.reliaforge.dev/",
      switchToLight: "Switch to light mode",
      switchToDark: "Switch to dark mode",
    },
    hero: {
      title: "Self-hosted console for your infrastructure and Python ops tools.",
      tagline:
        "Inspect Proxmox hosts, tail Kubernetes logs, sync Argo CD apps, and silence alerts in one place. Mount your own Python scripts as plugins without building another login flow or frontend.",
      primaryCta: "Live demo",
      githubCta: "GitHub",
      pullCommand: "docker pull ghcr.io/reliaforge/reliaforge:latest",
      openDemoHint: "Full screen",
      liveToggle: "Interactive mode",
      snapshotToggle: "Static view",
      clickToInteract: "Click to interact live",
    },
    workspaces: [
      {
        id: "overview",
        label: "Overview",
        route: "/",
        srcLight: "/views/view-overview-light.png",
        srcDark: "/views/view-overview.png",
        alt: "ReliaForge overview showing Proxmox capacity, Kubernetes pods, GitOps sync status, topology, and service catalog",
      },
      {
        id: "proxmox",
        label: "Proxmox VE",
        route: "/p/proxmox",
        srcLight: "/views/view-proxmox-light.png",
        srcDark: "/views/view-proxmox.png",
        alt: "ReliaForge Proxmox VE workspace showing RRD performance graphs, storage pools, and QEMU/LXC inventory",
      },
      {
        id: "kubernetes",
        label: "Kubernetes",
        route: "/p/kubernetes",
        srcLight: "/views/view-kubernetes-light.png",
        srcDark: "/views/view-kubernetes.png",
        alt: "ReliaForge Kubernetes workspace showing cluster nodes, workloads, GitOps linkage, and container images",
      },
      {
        id: "gitops",
        label: "Argo CD",
        route: "/p/gitops_argocd",
        srcLight: "/views/view-gitops-light.png",
        srcDark: "/views/view-gitops.png",
        alt: "ReliaForge GitOps workspace listing Argo CD applications, sync states, health, and Git revisions",
      },
      {
        id: "observability",
        label: "Observability",
        route: "/p/observability",
        srcLight: "/views/view-observability-light.png",
        srcDark: "/views/view-observability.png",
        alt: "ReliaForge Observability workspace querying Loki log streams alongside Prometheus and Alertmanager health",
      },
    ],
    opsStory: {
      heading: "Read-only by default. Guarded when you write.",
      lead:
        "Put cluster views and internal Python tools behind your existing auth proxy. Upstream credentials stay on the server, and write actions only run where you explicitly allow them.",
      replayTrace: "Replay",
      rails: [
        "Proxmox tokens, kubeconfigs, and Argo CD keys stay on the backend and never reach the browser.",
        "Run strictly read-only, or restrict writes to specific VMIDs and Kubernetes namespaces.",
        "Power controls, rolling restarts, syncs, and silences require confirmation and log to local SQLite.",
      ],
      scenarios: [
        {
          id: "restart",
          label: "Rolling restart",
          steps: [
            {
              stage: "Operator request",
              code: "POST /api/v1/plugins/kubernetes/workloads/payments/payments-api/restart",
              latencyMs: 3,
            },
            {
              stage: "Proxy auth & origin check",
              code: "X-ReliaForge-Identity: oncall@example.com  Sec-Fetch-Site: same-origin",
              latencyMs: 2,
            },
            {
              stage: "Namespace allowlist & confirmation",
              code: "allowlist=payments  intent_token=verified",
              latencyMs: 4,
            },
            {
              stage: "SQLite audit write",
              code: "ops_audit -> actor=oncall  action=k8s.rollout_restart  outcome=succeeded",
              latencyMs: 14,
            },
          ],
        },
        {
          id: "lxc",
          label: "LXC shell",
          steps: [
            {
              stage: "WebSocket upgrade",
              code: "WS /api/v1/plugins/proxmox/nodes/pve-prod-01/lxc/201/terminal",
              latencyMs: 4,
            },
            {
              stage: "Proxy peer & Origin check",
              code: "peer=198.51.100.10  origin=https://ops.example.com  status=accepted",
              latencyMs: 2,
            },
            {
              stage: "VMID policy & PVE termproxy ticket",
              code: "vmid=201  pve_ticket=server_only  termproxy=connected",
              latencyMs: 22,
            },
            {
              stage: "Session audit",
              code: "ops_audit -> actor=oncall  action=proxmox.lxc_terminal  target=lxc/201",
              latencyMs: 5,
            },
          ],
        },
        {
          id: "sync",
          label: "Argo CD sync",
          steps: [
            {
              stage: "Sync request",
              code: "POST /api/v1/plugins/gitops_argocd/applications/payments-api/sync",
              latencyMs: 3,
            },
            {
              stage: "Proxy auth",
              code: "X-ReliaForge-Identity: oncall@example.com  argo_token=server_only",
              latencyMs: 2,
            },
            {
              stage: "Read-only check & confirmation",
              code: "read_only=false  prune=false  intent_token=verified",
              latencyMs: 4,
            },
            {
              stage: "Revision recorded",
              code: "ops_audit -> actor=oncall  action=argocd.sync  rev=8f4c2a1",
              latencyMs: 18,
            },
          ],
        },
        {
          id: "silence",
          label: "Alert silence",
          steps: [
            {
              stage: "Create silence",
              code: "POST /api/v1/plugins/observability/silences",
              latencyMs: 3,
            },
            {
              stage: "Bind proxy identity",
              code: "createdBy=oncall@example.com  Sec-Fetch-Site: same-origin",
              latencyMs: 2,
            },
            {
              stage: "Validate matchers & duration",
              code: "alertname=NodeDiskMaintenance  duration=2h  comment=verified",
              latencyMs: 3,
            },
            {
              stage: "Audit recorded",
              code: "ops_audit -> actor=oncall  action=observability.silence_create",
              latencyMs: 11,
            },
          ],
        },
      ],
    },
    suite: {
      heading: "Six built-in plugins. Disable what you don't use.",
      repoLabel: "reliaforge-plugins on GitHub",
      inspectView: "Show screen",
      plugins: [
        {
          id: "infra_overview",
          title: "Overview",
          summary: "Proxmox hosts, Kubernetes nodes, GitOps sync status, active alerts, and service links.",
          viewId: "overview",
        },
        {
          id: "proxmox",
          title: "Proxmox VE",
          summary: "Node RRD graphs, storage pools, QEMU/LXC inventory, power controls, and LXC web shell.",
          viewId: "proxmox",
        },
        {
          id: "kubernetes",
          title: "Kubernetes",
          summary: "Nodes, workloads, pods, events, live SSE pod logs, container exec, and rolling restarts.",
          viewId: "kubernetes",
        },
        {
          id: "gitops_argocd",
          title: "Argo CD",
          summary: "Application sync status, deployed Git revisions, resource trees, and manual sync triggers.",
          viewId: "gitops",
        },
        {
          id: "observability",
          title: "Observability",
          summary: "Prometheus metrics, Loki log queries, and Alertmanager alert silences.",
          viewId: "observability",
        },
        {
          id: "ops_audit",
          title: "Operations Audit",
          summary: "Local SQLite audit log shared across plugins in the same process.",
        },
      ],
    },
    byo: {
      heading: "Bring your existing Python scripts.",
      lead:
        "Wrap a FastAPI router as a plugin and get proxy auth, console UI primitives, and shared SQLite audit out of the box.",
      docsCta: "Plugin development guide",
      tabs: CODE_TABS,
      studio: {
        uiTab: "Rendered UI",
        panelTitle: "Service Ownership",
        searchPlaceholder: "Filter services...",
        colService: "Service",
        colTeam: "Team",
        colAction: "Check",
        verifyAction: "Verify",
        verifiedLabel: "OK",
      },
    },
    deploy: {
      heading: "One container. No external database.",
      lead:
        "Pull the prebuilt GHCR image and run it with Docker Compose behind your reverse proxy.",
      archProxyTitle: "Your Auth Proxy",
      archContainerSub: "FastAPI + React console + 6 official plugins",
      archTargetsTitle: "Upstreams & SQLite",
      specs: [
        { label: "Image", value: "ghcr.io/reliaforge/reliaforge:latest" },
        { label: "Process", value: "Single Python container (UI + REST + SSE + WS)" },
        { label: "Persistence", value: "/data/audit.sqlite3 (optional)" },
        { label: "License", value: "MIT Open Source" },
      ],
      composeLink: "deploy/compose.yaml on GitHub",
      prodGuideLink: "Production deployment guide",
      tabs: [
        { id: "compose", label: "compose.yaml", language: "yaml", code: COMPOSE_YAML },
        { id: "local", label: "Local Python dev", language: "bash", code: LOCAL_DEV_BASH },
      ],
    },
    closing: {
      heading: "Try the interactive demo in your browser.",
      cta: "Open live demo",
    },
    footer: {
      docs: "Docs",
      demo: "Demo",
      org: "GitHub",
      license: "MIT License · © 2026 Sajo Luo",
    },
    copyButton: {
      copy: "Copy",
      copied: "Copied",
    },
  },
  zh: {
    nav: {
      console: "界面预览",
      plugins: "内置插件",
      build: "接入脚本",
      deploy: "部署",
      docs: "文档",
      github: "GitHub",
      docsUrl: "https://docs.reliaforge.dev/zh/",
      demoUrl: "https://demo.reliaforge.dev/?lang=zh",
      switchToLight: "切换到浅色模式",
      switchToDark: "切换到深色模式",
    },
    hero: {
      title: "自托管的基础设施与运维工具台。",
      tagline:
        "在同一个网页里看 Proxmox、查 K8s 日志、同步 Argo CD、静默告警；手头现成的 Python 运维脚本也能直接挂进来跑，不用再单写登录和前端。",
      primaryCta: "在线演示",
      githubCta: "GitHub",
      pullCommand: "docker pull ghcr.io/reliaforge/reliaforge:latest",
      openDemoHint: "全屏演示",
      liveToggle: "框内实操",
      snapshotToggle: "静态截图",
      clickToInteract: "点击直接在框内交互",
    },
    workspaces: [
      {
        id: "overview",
        label: "总览",
        route: "/",
        srcLight: "/views/view-overview-light.png",
        srcDark: "/views/view-overview.png",
        alt: "ReliaForge 总览界面，展示 Proxmox 容量、Kubernetes Pod 状态、GitOps 同步状态、拓扑与服务目录",
      },
      {
        id: "proxmox",
        label: "Proxmox VE",
        route: "/p/proxmox",
        srcLight: "/views/view-proxmox-light.png",
        srcDark: "/views/view-proxmox.png",
        alt: "ReliaForge Proxmox VE 工作区，展示 RRD 趋势图、存储池与 QEMU/LXC 列表",
      },
      {
        id: "kubernetes",
        label: "Kubernetes",
        route: "/p/kubernetes",
        srcLight: "/views/view-kubernetes-light.png",
        srcDark: "/views/view-kubernetes.png",
        alt: "ReliaForge Kubernetes 工作区，展示节点负载、Deployment 工作负载、GitOps 关联与镜像版本",
      },
      {
        id: "gitops",
        label: "Argo CD",
        route: "/p/gitops_argocd",
        srcLight: "/views/view-gitops-light.png",
        srcDark: "/views/view-gitops.png",
        alt: "ReliaForge GitOps 工作区，展示 Argo CD 应用同步状态、健康度与 Git 提交哈希",
      },
      {
        id: "observability",
        label: "可观测性",
        route: "/p/observability",
        srcLight: "/views/view-observability-light.png",
        srcDark: "/views/view-observability.png",
        alt: "ReliaForge 可观测性工作区，查询 Loki 日志流并查看 Prometheus 与 Alertmanager 状态",
      },
    ],
    opsStory: {
      heading: "默认只读，写操作走白名单。",
      lead:
        "把日常基础设施面板和内部 Python 接口收进同一个反向代理入口。上游密钥只放后端，重启和同步这类写操作按白名单放行。",
      replayTrace: "重放",
      rails: [
        "Proxmox Token、Kubeconfig 与 Argo CD 密钥只保存在服务端，不进浏览器。",
        "可设为全局只读，或仅对指定 VMID 与 K8s 命名空间开放写权限。",
        "电源控制、滚动重启、GitOps 同步与告警静默均需二次确认，并写入本地 SQLite。",
      ],
      scenarios: [
        {
          id: "restart",
          label: "滚动重启",
          steps: [
            {
              stage: "发起请求",
              code: "POST /api/v1/plugins/kubernetes/workloads/payments/payments-api/restart",
              latencyMs: 3,
            },
            {
              stage: "代理鉴权与同源校验",
              code: "X-ReliaForge-Identity: oncall@example.com  Sec-Fetch-Site: same-origin",
              latencyMs: 2,
            },
            {
              stage: "命名空间白名单与确认令牌",
              code: "allowlist=payments  intent_token=verified",
              latencyMs: 4,
            },
            {
              stage: "写入 SQLite 审计",
              code: "ops_audit -> actor=oncall  action=k8s.rollout_restart  outcome=succeeded",
              latencyMs: 14,
            },
          ],
        },
        {
          id: "lxc",
          label: "LXC 终端",
          steps: [
            {
              stage: "WebSocket 升级",
              code: "WS /api/v1/plugins/proxmox/nodes/pve-prod-01/lxc/201/terminal",
              latencyMs: 4,
            },
            {
              stage: "代理对端与 Origin 校验",
              code: "peer=198.51.100.10  origin=https://ops.example.com  status=accepted",
              latencyMs: 2,
            },
            {
              stage: "VMID 白名单与服务端换票",
              code: "vmid=201  pve_ticket=server_only  termproxy=connected",
              latencyMs: 22,
            },
            {
              stage: "记录终端会话",
              code: "ops_audit -> actor=oncall  action=proxmox.lxc_terminal  target=lxc/201",
              latencyMs: 5,
            },
          ],
        },
        {
          id: "sync",
          label: "Argo CD 同步",
          steps: [
            {
              stage: "发起同步",
              code: "POST /api/v1/plugins/gitops_argocd/applications/payments-api/sync",
              latencyMs: 3,
            },
            {
              stage: "代理鉴权",
              code: "X-ReliaForge-Identity: oncall@example.com  argo_token=server_only",
              latencyMs: 2,
            },
            {
              stage: "只读检查与确认令牌",
              code: "read_only=false  prune=false  intent_token=verified",
              latencyMs: 4,
            },
            {
              stage: "记录同步版本",
              code: "ops_audit -> actor=oncall  action=argocd.sync  rev=8f4c2a1",
              latencyMs: 18,
            },
          ],
        },
        {
          id: "silence",
          label: "告警静默",
          steps: [
            {
              stage: "创建静默",
              code: "POST /api/v1/plugins/observability/silences",
              latencyMs: 3,
            },
            {
              stage: "绑定代理身份",
              code: "createdBy=oncall@example.com  Sec-Fetch-Site: same-origin",
              latencyMs: 2,
            },
            {
              stage: "校验匹配标签与时长",
              code: "alertname=NodeDiskMaintenance  duration=2h  comment=verified",
              latencyMs: 3,
            },
            {
              stage: "写入审计记录",
              code: "ops_audit -> actor=oncall  action=observability.silence_create",
              latencyMs: 11,
            },
          ],
        },
      ],
    },
    suite: {
      heading: "内置六个官方插件，用不到的直接关掉。",
      repoLabel: "reliaforge-plugins 源码",
      inspectView: "查看界面",
      plugins: [
        {
          id: "infra_overview",
          title: "基础设施总览",
          summary: "聚合 Proxmox 宿主机、K8s 节点、GitOps 状态、活跃告警与常用服务入口。",
          viewId: "overview",
        },
        {
          id: "proxmox",
          title: "Proxmox VE",
          summary: "节点 RRD 指标、存储池、QEMU/LXC 列表、电源控制与 LXC 网页终端。",
          viewId: "proxmox",
        },
        {
          id: "kubernetes",
          title: "Kubernetes",
          summary: "节点与工作负载列表、Pod SSE 实时日志、容器 Exec 终端与滚动重启。",
          viewId: "kubernetes",
        },
        {
          id: "gitops_argocd",
          title: "Argo CD",
          summary: "应用同步状态、线上 Git 提交哈希、资源树查看与手动同步。",
          viewId: "gitops",
        },
        {
          id: "observability",
          title: "可观测性",
          summary: "Prometheus 指标查询、Loki 日志检索与 Alertmanager 告警静默。",
          viewId: "observability",
        },
        {
          id: "ops_audit",
          title: "操作审计",
          summary: "本地 SQLite 审计表，供同一进程内的其他插件直接调用记录。",
        },
      ],
    },
    byo: {
      heading: "手头的 Python 脚本，加个路由就能挂进来。",
      lead:
        "把 FastAPI 路由包成插件，直接复用反向代理认证、@reliaforge/plugin-sdk 表格原语与共享审计库。",
      docsCta: "插件开发指南",
      tabs: CODE_TABS,
      studio: {
        uiTab: "渲染界面",
        panelTitle: "服务归属目录",
        searchPlaceholder: "筛选服务...",
        colService: "服务",
        colTeam: "负责组",
        colAction: "巡检",
        verifyAction: "核验",
        verifiedLabel: "已核验",
      },
    },
    deploy: {
      heading: "单容器运行，不绑外部数据库。",
      lead: "直接拉取 GHCR 预构建镜像，用一份 compose.yaml 挂在现有反向代理后面即可上线。",
      archProxyTitle: "认证反向代理",
      archContainerSub: "单进程承载 React 前端 + FastAPI + 六个插件",
      archTargetsTitle: "上游集群与本地审计",
      specs: [
        { label: "官方镜像", value: "ghcr.io/reliaforge/reliaforge:latest" },
        { label: "运行形态", value: "单 Python 容器（同源页面 / REST / SSE / WS）" },
        { label: "持久化", value: "/data/audit.sqlite3（可选）" },
        { label: "开源协议", value: "MIT License" },
      ],
      composeLink: "查看 deploy/compose.yaml",
      prodGuideLink: "生产部署指南",
      tabs: [
        { id: "compose", label: "compose.yaml", language: "yaml", code: COMPOSE_YAML },
        { id: "local", label: "本地开发", language: "bash", code: LOCAL_DEV_BASH },
      ],
    },
    closing: {
      heading: "先在浏览器里试一圈内置演示。",
      cta: "打开在线演示",
    },
    footer: {
      docs: "文档",
      demo: "在线演示",
      org: "GitHub",
      license: "MIT License · © 2026 Sajo Luo",
    },
    copyButton: {
      copy: "复制",
      copied: "已复制",
    },
  },
}
