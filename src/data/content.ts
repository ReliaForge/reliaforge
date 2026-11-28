import type { SnippetLanguage } from "../components/SyntaxCode"

export type Locale = "en" | "zh"

export type ThemeMode = "light" | "dark"

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

export interface TopologyCopy {
  statusNominal: string
  statusAlert: string
  statusGuarding: string
  statusHealed: string
  simulateBtn: string
  replayBtn: string
  restartNowBtn: string
  k8sRestarting: string
  k8sRecovered: string
  pythonNodeTitle: string
}

export interface WidgetsCopy {
  pauseLogs: string
  resumeLogs: string
  restartPod: string
  syncAction: string
  obsTitle: string
  firingState: string
  silencedState: string
  silenceBtn: string
  auditTitle: string
  justNow: string
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
  }
  topology: TopologyCopy
  guardrails: Array<{ title: string; body: string }>
  suite: {
    heading: string
    repoLabel: string
    widgets: WidgetsCopy
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
      console: "Topology",
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
      primaryCta: "Full console demo",
      githubCta: "GitHub",
      pullCommand: "docker pull ghcr.io/reliaforge/reliaforge:latest",
    },
    topology: {
      statusNominal: "All layers nominal · 24/24 pods ready · 0 firing alerts",
      statusAlert: "Alert firing · payments-api OOMKilled (1/3 ready)",
      statusGuarding: "Verifying proxy identity & namespace=payments allowlist...",
      statusHealed: "Rolling restart completed · 3/3 ready · logged to SQLite",
      simulateBtn: "Simulate incident & recovery",
      replayBtn: "Replay incident",
      restartNowBtn: "Run allowlisted restart",
      k8sRestarting: "rolling restart...",
      k8sRecovered: "3/3 ready · healed",
      pythonNodeTitle: "Python Plugin",
    },
    guardrails: [
      {
        title: "Zero browser secrets",
        body: "Proxmox tokens, kubeconfigs, and Argo CD keys stay strictly on the server.",
      },
      {
        title: "Scoped write allowlists",
        body: "Run read-only, or restrict writes to explicit VMIDs and Kubernetes namespaces.",
      },
      {
        title: "Shared SQLite audit",
        body: "Every restart, LXC shell, sync, and alert silence logs who ran what.",
      },
    ],
    suite: {
      heading: "Six built-in plugins. Tap any widget to try.",
      repoLabel: "reliaforge-plugins on GitHub",
      widgets: {
        pauseLogs: "Pause",
        resumeLogs: "Live",
        restartPod: "Restart",
        syncAction: "Sync",
        obsTitle: "Observability",
        firingState: "Alertmanager · firing",
        silencedState: "Silenced for 2h",
        silenceBtn: "Silence 2h",
        auditTitle: "Operations Audit",
        justNow: "now",
      },
    },
    byo: {
      heading: "Bring your existing Python scripts.",
      lead:
        "Wrap a FastAPI router as a plugin and get proxy auth, @reliaforge/plugin-sdk tables, and shared SQLite audit out of the box.",
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
      heading: "Want to see the full sidebar console?",
      cta: "Open full console demo",
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
      console: "拓扑演示",
      plugins: "内置组件",
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
      primaryCta: "全屏控制台演示",
      githubCta: "GitHub",
      pullCommand: "docker pull ghcr.io/reliaforge/reliaforge:latest",
    },
    topology: {
      statusNominal: "全链路正常 · 24/24 Pod 就绪 · 0 条活跃告警",
      statusAlert: "告警触发 · payments-api OOMKilled (1/3 就绪)",
      statusGuarding: "正在校验代理身份头与 namespace=payments 白名单...",
      statusHealed: "滚动重启已完成 · 3/3 恢复就绪 · 已写入 SQLite 审计",
      simulateBtn: "模拟一次告警自愈",
      replayBtn: "再演一次",
      restartNowBtn: "执行白名单重启",
      k8sRestarting: "滚动重启中...",
      k8sRecovered: "3/3 已恢复",
      pythonNodeTitle: "自研 Python 插件",
    },
    guardrails: [
      {
        title: "浏览器零密钥",
        body: "Proxmox Token、Kubeconfig 与 Argo CD 密钥只留在后端进程。",
      },
      {
        title: "写操作走白名单",
        body: "默认只读，也可仅对指定 VMID 与 K8s 命名空间放开写权限。",
      },
      {
        title: "共享 SQLite 审计",
        body: "重启、打开 LXC 终端、GitOps 同步与告警静默全部落盘可查。",
      },
    ],
    suite: {
      heading: "内置六个官方插件，直接点卡片就能试。",
      repoLabel: "reliaforge-plugins 源码",
      widgets: {
        pauseLogs: "暂停",
        resumeLogs: "实时",
        restartPod: "重启",
        syncAction: "同步",
        obsTitle: "可观测性",
        firingState: "Alertmanager · 触发中",
        silencedState: "已静默 2 小时",
        silenceBtn: "静默 2h",
        auditTitle: "操作审计流",
        justNow: "刚刚",
      },
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
      heading: "想看带完整侧边栏的 1:1 控制台？",
      cta: "打开全屏在线演示",
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
