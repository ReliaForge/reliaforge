# Architecture

ReliaForge hosts operations plugins inside one Python backend process and pairs them with a React
console shell. The backend owns discovery, dependency ordering, configuration schemas, proxy
authentication, and lifecycle hooks; plugins own their domain APIs, shared services, and optional
ESM console views.

```text
Browser console -> /api/v1/*           -> management API & plugin manager
                -> /api/v1/plugins/*   -> plugin HTTP, SSE, WebSocket, and ESM UI assets
API clients     -> /api/v1/plugins/*   -> plugin FastAPI routers & shared services
```

## Discovering and validating plugins

Before importing Python code, the backend discovers plugins from `RELIAFORGE_PLUGIN_PATHS` and
installed Python `entry_points` (`reliaforge.plugins`), applies `enabled_plugins` and
`disabled_plugins` filters, and validates every `manifest.json`. It checks IDs, SemVer ranges,
missing required providers, and dependency cycles, then imports valid plugins in topological order.

Malformed manifests or invalid dependency graphs stop backend startup immediately. If a valid
plugin raises an error during code import or startup, the backend records a structured failure and
blocks required dependents while keeping unrelated plugins and `/api/v1` management routes online.

## Lifecycle, services, and events

The plugin manager serializes start, stop, and restart transitions. Each plugin receives a scoped
context for registering typed Python services (`capabilities`) and in-process event subscriptions.
When a plugin stops, its shutdown hook releases external clients and background tasks, including
after partial initialization, before the manager clears its registered services and audit metadata.

Initialization and startup run under bounded timeouts. Health endpoints return current in-memory or
cached upstream snapshots without mutating external infrastructure. In-process events coordinate
loaded plugins and are not a durable job queue.

## Console host and runtime UI

The backend exposes liveness, readiness, platform status, plugin catalogs, schemas, lifecycle
actions, and plugin-owned HTTP/SSE/WebSocket routes under unified authentication. When a plugin
declares `frontend.ui_mode = "esm"`, the console imports its bundle from
`/api/v1/plugins/{id}/ui/*` and shares React and `@reliaforge/plugin-sdk` components through an
error-isolated boundary.

```text
Console host -> API client & runtime loader -> live ReliaForge backend
                                            \-> saved demo dataset
```

The hosted demo loads saved fixtures and disables write actions; deployments connect to the live
backend API.

## Production topology

Run ReliaForge behind an authenticating reverse proxy (such as Envoy/Cilium Gateway, Nginx, Caddy,
or Cloudflare Access) on a single origin. Set `RELIAFORGE_CONSOLE_DIR` so the backend serves the
built console assets directly alongside `/api/v1`, SSE log streams, and WebSocket terminals, keeping
upstream credentials and proxy secrets strictly on the server.

See the backend's
[architecture reference](https://github.com/SajoLuo/reliaforge-backend/blob/main/docs/architecture.md)
for state machine transitions and error recovery rules.
