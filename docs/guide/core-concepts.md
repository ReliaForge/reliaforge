# Core concepts

ReliaForge runs Python operations tools and optional React workspaces as plugins. Plugin authors
implement the domain logic; the platform validates dependencies, reads configuration, enforces
authentication, and manages startup and shutdown.

## What is a plugin?

A plugin is a directory or installed Python package with a `manifest.json` file. The manifest gives
ReliaForge the plugin ID, version, Python entry point, service capabilities, dependencies, and
optional frontend bundle metadata.

A plugin can expose query and action APIs, stream logs or terminal sessions, run background
collectors, or mount custom pages in the console. Follow [Develop a plugin](./plugin-development.md)
to turn a Python function into an authenticated API.

## What happens when a plugin starts?

The backend validates the plugin's settings, prepares its runtime context, and calls its startup
hook. Required dependencies start first. Stopping a plugin runs its cleanup hook to close HTTP
clients, database handles, and background tasks, then unregisters its shared services and event
subscriptions.

The console reports two independent signals:

| Signal | What it tells you |
| --- | --- |
| Run state | Whether the plugin is `running`, `stopped`, or in `error` |
| Health | Whether a running plugin's upstream target is healthy or `degraded` |

## How do operators and clients use a plugin?

Every plugin mounts its FastAPI router under `/api/v1/plugins/{plugin_id}` (and can examine OpenAPI
schemas at `http://127.0.0.1:8000/api/v1/docs` in local development).

When a plugin also sets `frontend.ui_mode` to `"esm"` in `manifest.json`, the backend serves its
compiled bundle under `/api/v1/plugins/{plugin_id}/ui/*` and the React console mounts its navigation
pages and overview widgets automatically. Plugins without a frontend bundle remain manageable from
the console's Plugins catalog while serving API clients over HTTP.

## How do plugins cooperate?

One plugin can register a typed Python service for peer plugins. For example, `ops_audit` publishes
`ops_audit.writer` and `ops_audit.reader` so `proxmox`, `kubernetes`, `gitops_argocd`, and
`observability` can record state-changing actions without duplicating storage code.

Providers list exported names in `capabilities`. Consumers declare providers in `dependencies`,
marking an integration `"optional": true` when the consumer can still operate without it.

## Where do I configure plugins?

Configure plugins through environment variables before starting the backend:

- Platform selection: `RELIAFORGE_PLUGIN_PATHS`, `RELIAFORGE_PLUGIN_ENTRY_POINTS`,
  `RELIAFORGE_ENABLED_PLUGINS`, and `RELIAFORGE_DISABLED_PLUGINS` control where plugins are
  discovered and which ones load.
- Plugin settings: each plugin's `PluginSettings` class reads `RELIAFORGE_<PLUGIN_ID>_*` variables
  (for example, `RELIAFORGE_SAMPLE_TOOL_MESSAGE`).

The console displays field names, types, and non-secret defaults, never live values or secrets. See
the backend's
[plugin development guide](https://github.com/SajoLuo/reliaforge-backend/blob/main/docs/plugin-development.md)
when defining settings for your own plugin.
