---
layout: home

hero:
  text: Run your operations stack as plugins.
  tagline: Package Python APIs, shared services, and React workspaces into plugins. ReliaForge validates dependencies, enforces authentication, and hosts them in one console.
  image:
    src: /console-preview.png
    alt: ReliaForge console overview showing Proxmox, Kubernetes, GitOps, observability, and service health
  actions:
    - theme: brand
      text: Try the demo
      link: https://demo.reliaforge.dev/
    - theme: alt
      text: Get started
      link: /guide/getting-started

heroPreview:
  src: /console-preview.png
  alt: ReliaForge console overview showing Proxmox, Kubernetes, GitOps, observability, and service health
  href: https://demo.reliaforge.dev/
  label: Open the read-only ReliaForge demo

features:
  - title: Full-stack plugin contract
    details: Ship FastAPI routes, shared Python services, and runtime ESM React workspaces from one plugin directory or Python package.
  - title: Dependency-checked startup
    details: Validate manifests and SemVer service dependencies before importing code, while keeping unrelated plugins online when one fails to load.
  - title: Guarded operational actions
    details: Authenticate HTTP and WebSocket requests through your proxy, confirm state-changing operations, and record structured audit trails.
  - title: Single-process delivery
    details: Discover plugins from search paths or Python entry points and serve the console, APIs, SSE log streams, and terminals from one container.
---

<section class="home-section">
<div class="arch-split">
<div>

## One contract from Python service to console workspace

Keep infrastructure integrations modular without running a separate microservice and UI repo for every internal tool. Each plugin declares its dependencies, settings, routes, and optional console views in `manifest.json`.

<div class="arch-ledger">
  <div class="arch-row">
    <strong>Backend runtime</strong>
    <span>Validates manifests, resolves plugin dependencies, enforces HTTP and WebSocket proxy authentication, and manages start, stop, and restart hooks.</span>
  </div>
  <div class="arch-row">
    <strong>Plugin package</strong>
    <span>Owns domain APIs under <code>/api/v1/plugins/{id}</code>, publishes typed Python services to peer plugins, and optionally bundles an ESM frontend module.</span>
  </div>
  <div class="arch-row">
    <strong>Console and SDK</strong>
    <span>Loads plugin workspaces and overview widgets at runtime with shared tables, drawers, log viewers, and terminal components from <code>@reliaforge/plugin-sdk</code>.</span>
  </div>
</div>

<p>Read the <a href="./guide/architecture.html">architecture overview</a> or follow <a href="./guide/plugin-development.html">Develop a plugin</a> to turn a Python function into an authenticated service.</p>

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

## Operate core infrastructure out of the box

Start with your own internal tools or deploy the official [`reliaforge-plugins`](https://github.com/SajoLuo/reliaforge-plugins) suite. Enable only the integrations your environment uses and keep unused plugins disabled.

<div class="suite-grid">
  <div class="suite-cell">
    <strong>Infrastructure cockpit <code>infra_overview</code></strong>
    <p>Correlates hypervisor nodes, cluster capacity, GitOps sync health, active alerts, and your service catalog on the home screen.</p>
  </div>
  <div class="suite-cell">
    <strong>Proxmox VE <code>proxmox</code></strong>
    <p>Inspects node RRD trends, storage pools, QEMU VMs, and LXC containers with allowlisted power controls and an interactive LXC terminal drawer.</p>
  </div>
  <div class="suite-cell">
    <strong>Kubernetes <code>kubernetes</code></strong>
    <p>Browses workloads, nodes, and events across namespaces, streams live Pod logs over SSE, opens container shells, and triggers rolling restarts.</p>
  </div>
  <div class="suite-cell">
    <strong>Argo CD GitOps <code>gitops_argocd</code></strong>
    <p>Tracks application sync status, deployed Git revisions, health states, and resource trees with guarded refresh and sync triggers.</p>
  </div>
  <div class="suite-cell">
    <strong>Observability <code>observability</code></strong>
    <p>Queries Prometheus metrics and Loki log streams side by side, inspects firing Alertmanager rules, and creates or expires alert silences.</p>
  </div>
  <div class="suite-cell">
    <strong>Operations audit <code>ops_audit</code></strong>
    <p>Provides a shared SQLite audit service to peer plugins so VM power changes, workload restarts, syncs, and silences leave a searchable record.</p>
  </div>
</div>

</section>

<section class="home-section">
<div class="closing-split">
<div>

## Evaluate in the browser or run locally in minutes

Inspect the [read-only online demo](https://demo.reliaforge.dev/) with preset data before installing anything. When you are ready to test plugin lifecycle controls or build your own integration, start the local backend in four commands.

<div class="closing-action">
  <a class="cta-button" href="./guide/getting-started.html">Read the quick start</a>
</div>

</div>
<div class="arch-code">

```bash
git clone https://github.com/SajoLuo/reliaforge-backend.git
cd reliaforge-backend
python -m venv .venv && source .venv/bin/activate
python -m pip install -e ".[dev]" && reliaforge
```

</div>
</div>
</section>
