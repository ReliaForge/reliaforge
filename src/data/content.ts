export type Locale = "en" | "zh"

export type WorkspaceViewId = "overview" | "proxmox" | "kubernetes" | "gitops" | "observability"

export interface WorkspaceView {
  id: WorkspaceViewId
  label: string
  route: string
  src: string
  alt: string
  caption: string
}

export interface SafetyScenario {
  id: string
  label: string
  steps: Array<{
    stage: string
    detail: string
    code: string
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
  language: string
  code: string
}

export interface DeployTab {
  id: string
  label: string
  code: string
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
  }
  hero: {
    title: string
    tagline: string
    primaryCta: string
    secondaryCta: string
    openDemoHint: string
  }
  workspaces: WorkspaceView[]
  opsStory: {
    heading: string
    lead: string
    rails: Array<{ title: string; detail: string }>
    scenarios: SafetyScenario[]
  }
  suite: {
    heading: string
    lead: string
    repoLabel: string
    inspectView: string
    plugins: PluginEntry[]
  }
  byo: {
    heading: string
    lead: string
    points: Array<{ title: string; detail: string }>
    docsCta: string
    tabs: CodeTab[]
  }
  deploy: {
    heading: string
    lead: string
    facts: Array<{ title: string; detail: string }>
    tabs: DeployTab[]
  }
  closing: {
    heading: string
    lead: string
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
    "payments": "payments-ops",
    "checkout": "edge-sre",
}

@router.get("/owner")
async def lookup_owner(service: str) -> dict[str, str]:
    team = OWNERS.get(service)
    if not team:
        raise HTTPException(status_code=404, detail="Service not found")
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
    code: `import { DataTable, PageHeader, Status, usePluginApi } from "@reliaforge/plugin-sdk"

export default function OwnershipPage() {
  const { data, refresh } = usePluginApi<OwnerRow[]>("/owner/list")

  return (
    <div className="space-y-4">
      <PageHeader title="Service Ownership" onRefresh={refresh} />
      <DataTable
        rows={data ?? []}
        columns={[
          { key: "service", header: "Service" },
          { key: "team", header: "Owning team" },
          { key: "state", header: "Status", render: (r) => <Status value={r.state} /> },
        ]}
      />
    </div>
  )
}`,
  },
]

const DEPLOY_TABS: Record<Locale, DeployTab[]> = {
  en: [
    {
      id: "docker",
      label: "Single container",
      code: `git clone https://github.com/ReliaForge/reliaforge-plugins.git
cd reliaforge-plugins
docker build -f deploy/Dockerfile -t reliaforge-suite:local .

docker run --rm -p 8000:8000 \\
  -e RELIAFORGE_AUTH_MODE=proxy \\
  -e RELIAFORGE_TRUSTED_PROXIES='["198.51.100.0/24"]' \\
  -e RELIAFORGE_PROXY_AUTH_SECRET="replace-with-strong-secret" \\
  -e RELIAFORGE_PROXMOX_API_URL=https://pve.example.com:8006/api2/json \\
  -v reliaforge-data:/data \\
  reliaforge-suite:local`,
    },
    {
      id: "local",
      label: "Local Python dev",
      code: `git clone https://github.com/ReliaForge/reliaforge-backend.git
cd reliaforge-backend
python -m venv .venv && source .venv/bin/activate
python -m pip install -e ".[dev]"

# Generate your first plugin and start on 127.0.0.1:8000
reliaforge-scaffold my_tool --destination ./local-plugins
RELIAFORGE_PLUGIN_PATHS=./local-plugins reliaforge`,
    },
  ],
  zh: [
    {
      id: "docker",
      label: "单容器部署",
      code: `git clone https://github.com/ReliaForge/reliaforge-plugins.git
cd reliaforge-plugins
docker build -f deploy/Dockerfile -t reliaforge-suite:local .

docker run --rm -p 8000:8000 \\
  -e RELIAFORGE_AUTH_MODE=proxy \\
  -e RELIAFORGE_TRUSTED_PROXIES='["198.51.100.0/24"]' \\
  -e RELIAFORGE_PROXY_AUTH_SECRET="replace-with-strong-secret" \\
  -e RELIAFORGE_PROXMOX_API_URL=https://pve.example.com:8006/api2/json \\
  -v reliaforge-data:/data \\
  reliaforge-suite:local`,
    },
    {
      id: "local",
      label: "本地 Python 开发",
      code: `git clone https://github.com/ReliaForge/reliaforge-backend.git
cd reliaforge-backend
python -m venv .venv && source .venv/bin/activate
python -m pip install -e ".[dev]"

# 用脚手架生成自定义插件并在 127.0.0.1:8000 启动
reliaforge-scaffold my_tool --destination ./local-plugins
RELIAFORGE_PLUGIN_PATHS=./local-plugins reliaforge`,
    },
  ],
}

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
    },
    hero: {
      title: "One console for your servers, clusters, and scripts.",
      tagline:
        "Check Proxmox VMs, stream Kubernetes logs, track Argo CD syncs, and silence alerts in one place. Drop in your Python scripts and keep your sanity.",
      primaryCta: "Try live demo",
      secondaryCta: "Read the docs",
      openDemoHint: "Open interactive demo",
    },
    workspaces: [
      {
        id: "overview",
        label: "Overview",
        route: "/",
        src: "/views/view-overview.png",
        alt: "ReliaForge dark-mode overview showing Proxmox capacity, Kubernetes pods, GitOps sync health, topology, and service catalog",
        caption:
          "Hypervisor capacity, VM-to-Kubernetes node topology, GitOps sync health, and your service catalog in one glance.",
      },
      {
        id: "proxmox",
        label: "Proxmox VE",
        route: "/p/proxmox",
        src: "/views/view-proxmox.png",
        alt: "ReliaForge Proxmox VE workspace showing RRD performance graphs, storage pools, and QEMU/LXC inventory",
        caption:
          "Node RRD sparklines, storage pools, QEMU/LXC search, allowlisted power controls, and a browser LXC shell.",
      },
      {
        id: "kubernetes",
        label: "Kubernetes",
        route: "/p/kubernetes",
        src: "/views/view-kubernetes.png",
        alt: "ReliaForge Kubernetes workspace showing cluster nodes, workloads, GitOps linkage, and container images",
        caption:
          "Cluster nodes, deployments, pods, events, live SSE pod logs, container exec, and rolling restarts.",
      },
      {
        id: "gitops",
        label: "Argo CD",
        route: "/p/gitops_argocd",
        src: "/views/view-gitops.png",
        alt: "ReliaForge GitOps workspace listing Argo CD applications, sync states, health, and Git revisions",
        caption:
          "Argo CD application sync states, deployed Git SHAs, resource trees, and guarded manual sync triggers.",
      },
      {
        id: "observability",
        label: "Observability",
        route: "/p/observability",
        src: "/views/view-observability.png",
        alt: "ReliaForge Observability workspace querying Loki log streams alongside Prometheus and Alertmanager health",
        caption:
          "Loki log queries, Prometheus metrics, and Alertmanager alert silences without opening three separate dashboards.",
      },
    ],
    opsStory: {
      heading: "Stop tab-hopping at 2 a.m.",
      lead:
        "When an alert wakes you up, the worst part is juggling Proxmox in tab one, kubectl in a terminal, Argo CD in tab three, and three forgotten Flask scripts nobody dares touch. ReliaForge folds daily infrastructure ops and your own Python tools behind one login, with safety rails on every write.",
      rails: [
        {
          title: "One proxy, zero browser secrets",
          detail:
            "Proxmox tokens, kubeconfigs, and Argo CD keys live strictly on the backend. The browser never sees an upstream credential.",
        },
        {
          title: "Explicit blast-radius allowlists",
          detail:
            "Keep clusters read-only or allow writes only on specific VMIDs and Kubernetes namespaces. Accidental clicks stay harmless.",
        },
        {
          title: "Every write leaves an audit trail",
          detail:
            "Power actions, rolling restarts, GitOps syncs, and alert silences require short-lived confirmation and log who ran what in SQLite.",
        },
      ],
      scenarios: [
        {
          id: "restart",
          label: "Restart Deployment",
          steps: [
            {
              stage: "Operator request",
              detail: "Console triggers a rolling restart intent from the Kubernetes workloads table.",
              code: "POST /api/v1/plugins/kubernetes/workloads/payments/payments-api/restart",
            },
            {
              stage: "Proxy auth and origin check",
              detail: "Backend verifies trusted proxy CIDR, shared secret, operator header, and same-origin headers.",
              code: "X-ReliaForge-User: oncall@example.com  Sec-Fetch-Site: same-origin",
            },
            {
              stage: "Namespace allowlist and confirmation",
              detail: "Checks payments is in ALLOWED_ACTION_NAMESPACES and redeems the short-lived confirmation token.",
              code: "allowlist=payments  intent_token=verified  risk=medium",
            },
            {
              stage: "SQLite audit recorded",
              detail: "Patches Kubernetes pod template annotation and writes an append-only row into ops_audit.",
              code: "ops_audit -> actor=oncall  action=k8s.rollout_restart  outcome=succeeded",
            },
          ],
        },
        {
          id: "lxc",
          label: "Open LXC Shell",
          steps: [
            {
              stage: "WebSocket upgrade",
              detail: "Terminal drawer opens an authenticated WebSocket session to an LXC container.",
              code: "WS /api/v1/plugins/proxmox/nodes/pve-prod-01/lxc/201/terminal",
            },
            {
              stage: "Unified WebSocket proxy auth",
              detail: "Validates proxy peer IP, shared secret, and Origin header before accepting the upgrade.",
              code: "peer=198.51.100.10  origin=https://ops.example.com  status=accepted",
            },
            {
              stage: "VMID policy and ticket exchange",
              detail: "Verifies VMID 201 is allowlisted and requests a short-lived PVE termproxy ticket server-side.",
              code: "vmid=201  pve_ticket=server_only  termproxy=connected",
            },
            {
              stage: "Session logged",
              detail: "Streams xterm.js I/O cleanly and records session open and close timestamps in ops_audit.",
              code: "ops_audit -> actor=oncall  action=proxmox.lxc_terminal  target=lxc/201",
            },
          ],
        },
        {
          id: "sync",
          label: "Sync Argo CD App",
          steps: [
            {
              stage: "Operator request",
              detail: "Triggers a manual sync on an OutOfSync application directly from the GitOps workspace.",
              code: "POST /api/v1/plugins/gitops_argocd/applications/payments-api/sync",
            },
            {
              stage: "Proxy auth and origin check",
              detail: "Authenticates the operator at the backend boundary without exposing the Argo CD API token.",
              code: "X-ReliaForge-User: oncall@example.com  argo_token=server_only",
            },
            {
              stage: "Read-only guard and confirmation",
              detail: "Verifies write actions are enabled and checks confirmation intent before calling Argo CD.",
              code: "read_only=false  prune=false  intent_token=verified",
            },
            {
              stage: "Sync tracked and audited",
              detail: "Submits sync to Argo CD and stores revision, target app, and operator in ops_audit.",
              code: "ops_audit -> actor=oncall  action=argocd.sync  rev=8f4c2a1",
            },
          ],
        },
        {
          id: "silence",
          label: "Silence Alert",
          steps: [
            {
              stage: "Operator request",
              detail: "Creates a 2-hour maintenance silence straight from a firing Alertmanager alert.",
              code: "POST /api/v1/plugins/observability/silences",
            },
            {
              stage: "Proxy auth and origin check",
              detail: "Attributes the silence creator directly to the authenticated proxy identity.",
              code: "createdBy=oncall@example.com  Sec-Fetch-Site: same-origin",
            },
            {
              stage: "Matcher validation",
              detail: "Validates alert matchers, duration bounds, and non-empty comment before posting upstream.",
              code: "alertname=NodeDiskMaintenance  duration=2h  comment=verified",
            },
            {
              stage: "Silence active and audited",
              detail: "Returns the Alertmanager silence ID and logs the mutation into ops_audit.",
              code: "ops_audit -> actor=oncall  action=observability.silence_create",
            },
          ],
        },
      ],
    },
    suite: {
      heading: "Six official plugins. Keep what you run, disable the rest.",
      lead:
        "Deploy the official infrastructure suite as one package, or disable anything you do not run with RELIAFORGE_DISABLED_PLUGINS.",
      repoLabel: "Browse reliaforge-plugins on GitHub",
      inspectView: "Preview screen",
      plugins: [
        {
          id: "infra_overview",
          title: "Infrastructure Cockpit",
          summary:
            "Links Proxmox hosts, Kubernetes nodes, Argo CD apps, active alerts, and your custom service bookmarks on the landing page.",
          viewId: "overview",
        },
        {
          id: "proxmox",
          title: "Proxmox VE",
          summary:
            "Tracks node RRD metrics, storage pools, QEMU VMs, and LXC containers with allowlisted power actions and a built-in LXC web shell.",
          viewId: "proxmox",
        },
        {
          id: "kubernetes",
          title: "Kubernetes",
          summary:
            "Inspects nodes, workloads, pods, and events, streams live SSE pod logs, opens container exec shells, and triggers rolling restarts.",
          viewId: "kubernetes",
        },
        {
          id: "gitops_argocd",
          title: "Argo CD GitOps",
          summary:
            "Shows application sync states, deployed Git SHAs, and resource trees so you can spot drift and trigger guarded syncs fast.",
          viewId: "gitops",
        },
        {
          id: "observability",
          title: "Observability",
          summary:
            "Queries Prometheus metrics and Loki logs side by side, lists firing Alertmanager rules, and creates or expires silences.",
          viewId: "observability",
        },
        {
          id: "ops_audit",
          title: "Operations Audit",
          summary:
            "Shared SQLite audit service used by every sibling plugin so every restart, power toggle, sync, and silence stays searchable.",
        },
      ],
    },
    byo: {
      heading: "Turn your Python scripts into real team tools.",
      lead:
        "Most internal SRE scripts die in a git repo because nobody wants to maintain login flows, CORS rules, health endpoints, and React tables for a 50-line helper. Package it as a ReliaForge plugin and let the platform carry the boring plumbing.",
      points: [
        {
          title: "Keep your plain Python code",
          detail:
            "Mount a FastAPI router and a Pydantic settings class. ReliaForge handles startup ordering, env loading, and clean shutdown hooks.",
        },
        {
          title: "Attach a UI only when you need one",
          detail:
            "Pure API plugins work out of the box with start/stop controls. Need a custom screen? Bundle an ESM view with @reliaforge/plugin-sdk.",
        },
        {
          title: "Share services inside one process",
          detail:
            "Expose typed Python helpers between plugins (like ops_audit) without spinning up extra microservices or queues.",
        },
      ],
      docsCta: "Follow the plugin tutorial",
      tabs: CODE_TABS,
    },
    deploy: {
      heading: "One container. No cluster required to manage your cluster.",
      lead:
        "Built to run comfortably on a single homelab node or inside a small Kubernetes deployment without dragging in Kafka, Elasticsearch, or an external database.",
      facts: [
        {
          title: "Single-process static console hosting",
          detail:
            "Point RELIAFORGE_CONSOLE_DIR at the compiled frontend and one Python container serves the UI, REST APIs, SSE logs, and WebSockets on one origin.",
        },
        {
          title: "Bring your existing auth gateway",
          detail:
            "Sits behind Envoy, Cilium Gateway, Nginx, Caddy, or Cloudflare Access with trusted CIDR checks and constant-time shared secrets.",
        },
        {
          title: "Zero mandatory external state",
          detail:
            "Audit logs persist to a single mounted SQLite file. Back it up with a file copy or run completely stateless if you disable ops_audit.",
        },
      ],
      tabs: DEPLOY_TABS.en,
    },
    closing: {
      heading: "Kick the tires in the browser, then run it on your stack.",
      lead:
        "The online demo runs on preset data with zero setup. When you are ready to hook up Proxmox, Kubernetes, or your own Python plugin, grab the docs.",
      cta: "Open read-only demo",
    },
    footer: {
      docs: "Documentation",
      demo: "Live demo",
      org: "GitHub organization",
      license: "MIT License · Copyright © 2026 Sajo Luo",
    },
    copyButton: {
      copy: "Copy",
      copied: "Copied",
    },
  },
  zh: {
    nav: {
      console: "控制台",
      plugins: "官方插件",
      build: "自定义扩展",
      deploy: "部署",
      docs: "文档",
      github: "GitHub",
      docsUrl: "https://docs.reliaforge.dev/zh/",
      demoUrl: "https://demo.reliaforge.dev/?lang=zh",
    },
    hero: {
      title: "一个控制台，管完集群和你的脚本。",
      tagline:
        "Proxmox 虚拟机、Kubernetes 实时日志、Argo CD 同步与告警静默一屏看齐。团队自己写的 Python 运维脚本放进来，顺手自带鉴权、界面和审计。",
      primaryCta: "在线体验",
      secondaryCta: "阅读文档",
      openDemoHint: "打开在线演示",
    },
    workspaces: [
      {
        id: "overview",
        label: "全局总览",
        route: "/",
        src: "/views/view-overview.png",
        alt: "ReliaForge 暗色总览界面，展示 Proxmox 容量、Kubernetes Pod 状态、GitOps 同步健康度、拓扑与服务目录",
        caption: "宿主机容量、虚拟机到 K8s 节点的映射拓扑、GitOps 同步健康度与常用服务入口一屏汇总。",
      },
      {
        id: "proxmox",
        label: "Proxmox VE",
        route: "/p/proxmox",
        src: "/views/view-proxmox.png",
        alt: "ReliaForge Proxmox VE 工作区，展示 RRD 趋势图、存储池与 QEMU/LXC 列表",
        caption: "节点 RRD 曲线、存储池余量、QEMU/LXC 检索、白名单电源操作，以及网页直连 LXC 终端。",
      },
      {
        id: "kubernetes",
        label: "Kubernetes",
        route: "/p/kubernetes",
        src: "/views/view-kubernetes.png",
        alt: "ReliaForge Kubernetes 工作区，展示节点负载、Deployment 工作负载、GitOps 关联与镜像版本",
        caption: "节点与工作负载巡检、SSE 实时追踪 Pod 日志、打开容器 Exec 终端以及受控滚动重启。",
      },
      {
        id: "gitops",
        label: "Argo CD",
        route: "/p/gitops_argocd",
        src: "/views/view-gitops.png",
        alt: "ReliaForge GitOps 工作区，展示 Argo CD 应用同步状态、健康度与 Git 提交哈希",
        caption: "集中查看 Argo CD 应用同步状态、线上 Git Revision 与资源树，发现漂移随时触发受控同步。",
      },
      {
        id: "observability",
        label: "日志与告警",
        route: "/p/observability",
        src: "/views/view-observability.png",
        alt: "ReliaForge 可观测性工作区，集中查询 Loki 日志流并查看 Prometheus 与 Alertmanager 状态",
        caption: "在同一个页面查 Loki 日志、看 Prometheus 指标并管理 Alertmanager 告警静默，告别来回切面板。",
      },
    ],
    opsStory: {
      heading: "凌晨两点排障，别在八个标签页里横跳。",
      lead:
        "半夜被告警叫醒时，最耗心神的往往不是修问题本身，而是在 Proxmox、终端、Argo CD、日志面板以及三个没人敢随便重启的内部脚本之间疯狂切窗口。ReliaForge 把日常基础设施视图和团队 Python 工具收进同一道认证门后，所有高危写操作都带防手滑护栏。",
      rails: [
        {
          title: "一层代理鉴权，浏览器零密钥",
          detail: "Proxmox Token、Kubeconfig 与 Argo CD 令牌全部留在服务端，浏览器端拿不到任何上游凭据。",
        },
        {
          title: "按白名单收紧爆炸半径",
          detail: "支持全局只读，也支持只对指定 VMID 或 K8s 命名空间放开写权限，排障困倦时也不怕误操作。",
        },
        {
          title: "每次动手都有迹可循",
          detail: "电源切换、滚动重启、GitOps 同步与告警静默必须经过短时二次确认，并在本地 SQLite 留存完整审计记录。",
        },
      ],
      scenarios: [
        {
          id: "restart",
          label: "滚动重启工作负载",
          steps: [
            {
              stage: "发起操作意图",
              detail: "值班人员在 Kubernetes 工作负载列表中对异常服务发起滚动重启。",
              code: "POST /api/v1/plugins/kubernetes/workloads/payments/payments-api/restart",
            },
            {
              stage: "代理鉴权与来源校验",
              detail: "后端核验可信代理网段、代理共享密钥、用户身份头与浏览器同源请求头。",
              code: "X-ReliaForge-User: oncall@example.com  Sec-Fetch-Site: same-origin",
            },
            {
              stage: "命名空间白名单与二次确认",
              detail: "校验 payments 位于 ALLOWED_ACTION_NAMESPACES 白名单内并核销短时确认令牌。",
              code: "allowlist=payments  intent_token=verified  risk=medium",
            },
            {
              stage: "落库 SQLite 审计",
              detail: "更新 Pod 模板触发滚动重启，并向 ops_audit 写入只追加审计记录。",
              code: "ops_audit -> actor=oncall  action=k8s.rollout_restart  outcome=succeeded",
            },
          ],
        },
        {
          id: "lxc",
          label: "打开 LXC 终端",
          steps: [
            {
              stage: "发起 WebSocket 握手",
              detail: "在 Proxmox 页面抽屉中一键打开目标 LXC 容器的网页终端连接。",
              code: "WS /api/v1/plugins/proxmox/nodes/pve-prod-01/lxc/201/terminal",
            },
            {
              stage: "统一 WebSocket 代理鉴权",
              detail: "在同意协议升级前完成代理对端 IP、共享密钥与 Origin 来源校验。",
              code: "peer=198.51.100.10  origin=https://ops.example.com  status=accepted",
            },
            {
              stage: "VMID 策略与服务端换票",
              detail: "确认 VMID 201 在白名单内后，仅由后端向 PVE 申请短时 termproxy 票据。",
              code: "vmid=201  pve_ticket=server_only  termproxy=connected",
            },
            {
              stage: "会话留痕",
              detail: "通过 xterm.js 转发终端交互，并在 ops_audit 中记录会话建立与关闭时间。",
              code: "ops_audit -> actor=oncall  action=proxmox.lxc_terminal  target=lxc/201",
            },
          ],
        },
        {
          id: "sync",
          label: "触发 Argo CD 同步",
          steps: [
            {
              stage: "发起同步请求",
              detail: "在 GitOps 页面发现配置漂移后，直接触发单应用同步。",
              code: "POST /api/v1/plugins/gitops_argocd/applications/payments-api/sync",
            },
            {
              stage: "代理鉴权与凭据隔离",
              detail: "后端确认操作者身份后代发上游请求，前端全程不接触 Argo CD Token。",
              code: "X-ReliaForge-User: oncall@example.com  argo_token=server_only",
            },
            {
              stage: "只读开关与确认校验",
              detail: "确认未处于只读模式并校验二次确认令牌，默认不触发误删资源的 prune。",
              code: "read_only=false  prune=false  intent_token=verified",
            },
            {
              stage: "记录交付审计",
              detail: "调用 Argo CD 同步并将提交哈希、目标应用与操作人记入 ops_audit。",
              code: "ops_audit -> actor=oncall  action=argocd.sync  rev=8f4c2a1",
            },
          ],
        },
        {
          id: "silence",
          label: "创建告警静默",
          steps: [
            {
              stage: "发起静默请求",
              detail: "维护窗口期间在触发中的告警旁直接创建 2 小时 Alertmanager 静默。",
              code: "POST /api/v1/plugins/observability/silences",
            },
            {
              stage: "操作者身份绑定",
              detail: "静默创建人自动绑定到代理认证头中的真实操作者身份，无法冒填。",
              code: "createdBy=oncall@example.com  Sec-Fetch-Site: same-origin",
            },
            {
              stage: "匹配规则与备注校验",
              detail: "校验标签匹配器、时长上限与静默原因，拦截过于宽泛的误静默。",
              code: "alertname=NodeDiskMaintenance  duration=2h  comment=verified",
            },
            {
              stage: "静默生效并审计",
              detail: "返回 Alertmanager Silence ID，同时在本地审计表留下变更记录。",
              code: "ops_audit -> actor=oncall  action=observability.silence_create",
            },
          ],
        },
      ],
    },
    suite: {
      heading: "六款官方插件，按需启用，告别全家桶。",
      lead: "可直接整套部署官方基础设施插件包，用不到的模块写进 RELIAFORGE_DISABLED_PLUGINS 就能干净关掉。",
      repoLabel: "查看 reliaforge-plugins 源码",
      inspectView: "切换预览画面",
      plugins: [
        {
          id: "infra_overview",
          title: "基础设施总览",
          summary: "在首页串联 Proxmox 宿主机、K8s 节点、Argo CD 应用、活跃告警以及团队自定义服务书签。",
          viewId: "overview",
        },
        {
          id: "proxmox",
          title: "Proxmox VE",
          summary: "查看节点 RRD 性能曲线、存储池、QEMU 虚拟机与 LXC 容器，支持白名单电源操作和网页 LXC 终端。",
          viewId: "proxmox",
        },
        {
          id: "kubernetes",
          title: "Kubernetes",
          summary: "按命名空间检索节点、工作负载、Pod 与事件，支持 SSE 实时日志流、容器 Exec 终端与滚动重启。",
          viewId: "kubernetes",
        },
        {
          id: "gitops_argocd",
          title: "Argo CD 持续交付",
          summary: "实时盯紧应用同步状态、线上 Git SHA 与资源树，配置漂移一眼可见，随时发起受控同步。",
          viewId: "gitops",
        },
        {
          id: "observability",
          title: "日志与告警",
          summary: "同屏查 Prometheus 指标与 Loki 日志，查看 Alertmanager 触发中的告警并一键创建或解除静默。",
          viewId: "observability",
        },
        {
          id: "ops_audit",
          title: "运维操作审计",
          summary: "面向同进程所有插件共享的 SQLite 审计服务，电源变更、重启、同步与告警静默全部可检索。",
        },
      ],
    },
    byo: {
      heading: "把压箱底的 Python 脚本，变成团队顺手的工具。",
      lead:
        "内部运维脚本大多烂尾在个人电脑或文档里，因为没人愿意为了 50 行查询逻辑重新写一遍登录鉴权、跨域配置、健康检查和前端表格。做成 ReliaForge 插件，脏活累活直接交给底座扛。",
      points: [
        {
          title: "直接复用现有 Python 代码",
          detail: "写一个 FastAPI 路由和 Pydantic 配置类即可接入；依赖校验、环境变量读取与优雅停机由运行时接管。",
        },
        {
          title: "需要界面时再挂前端工作区",
          detail: "纯接口插件默认就能在控制台查看状态与启停；需要可视化交互时，用 @reliaforge/plugin-sdk 拼出抽屉和表格即可。",
        },
        {
          title: "同进程直接复用共享服务",
          detail: "插件间可直接调用带类型的 Python 服务（如审计写入器），不用为了解耦再起一堆微服务和消息队列。",
        },
      ],
      docsCta: "查看插件编写教程",
      tabs: CODE_TABS,
    },
    deploy: {
      heading: "单个容器跑完，不需要为了管集群再搭一套集群。",
      lead:
        "既适合跑在自建 Homelab 单机，也适合放进精简的 Kubernetes 命名空间，不强绑 Kafka、Elasticsearch 或外部重型数据库。",
      facts: [
        {
          title: "前后端单进程同源托管",
          detail: "设置 RELIAFORGE_CONSOLE_DIR 后，一个 Python 容器就能同时提供页面、REST API、SSE 日志流与 WebSocket 终端。",
        },
        {
          title: "无缝对接现有认证网关",
          detail: "直接放进 Envoy、Cilium Gateway、Nginx、Caddy 或 Cloudflare Access 后面，内置可信网段与共享密钥校验。",
        },
        {
          title: "零强制外部状态依赖",
          detail: "运维审计仅落盘单个 SQLite 文件，拷贝即可备份；关闭 ops_audit 插件甚至可以完全无状态运行。",
        },
      ],
      tabs: DEPLOY_TABS.zh,
    },
    closing: {
      heading: "先去在线演示逛两分钟，顺手就能在自己环境拉起。",
      lead: "只读演示使用预设数据，打开即看；准备接入自己的 Proxmox、Kubernetes 或自研 Python 工具时，直接照着文档跑起来。",
      cta: "打开只读演示",
    },
    footer: {
      docs: "在线文档",
      demo: "在线演示",
      org: "GitHub 组织",
      license: "MIT 许可证 · Copyright © 2026 Sajo Luo",
    },
    copyButton: {
      copy: "复制",
      copied: "已复制",
    },
  },
}
