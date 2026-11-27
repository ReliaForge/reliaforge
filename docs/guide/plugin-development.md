# Develop a plugin

Start with a Python function your team already uses, expose it as an authenticated FastAPI endpoint,
and optionally attach a React workspace. The backend's
[step-by-step tutorial](https://github.com/ReliaForge/reliaforge-backend/blob/main/docs/plugin-development.md)
builds a service-ownership lookup API with copy-ready files.

## What you will build

After completing the tutorial, you can query:

```bash
curl "http://127.0.0.1:8000/api/v1/plugins/sample_tool/owner?service_name=payments"
```

Response:

```json
{"service": "payments", "team": "payments-ops"}
```

The tutorial uses two preset records so you can verify routing and lifecycle behavior locally before
connecting an external API or database.

## Which files do I change?

Generate `sample_tool` from [Getting started](./getting-started.md), then update:

| Step | File or setting | What to do |
| --- | --- | --- |
| Add domain logic | `ownership.py` | Implement the service-to-team lookup function |
| Expose HTTP routes | `router.py` | Validate query parameters, call the function, and return JSON |
| Load locally | `RELIAFORGE_PLUGIN_PATHS` | Point to `./local-plugins` and restart `reliaforge` |
| Add optional UI | `manifest.json` (`frontend`) | Bundle an ESM workspace with `@reliaforge/plugin-sdk` when operators need custom tables, drawers, or terminals |

The scaffolded `plugin.py` already wires startup and shutdown hooks. Read the
[complete tutorial and runtime rules](https://github.com/ReliaForge/reliaforge-backend/blob/main/docs/plugin-development.md)
when your plugin manages async HTTP clients, WebSockets, or background tasks.

## Verify lifecycle behavior

Test three requests in order: a valid service lookup (`200`), an unknown service (`404`), and the
same lookup while the plugin is stopped (`503`). Starting the plugin again restores `200` responses
without restarting the backend process.

During local development, inspect generated schemas at `http://127.0.0.1:8000/api/v1/docs` and test
start, stop, and restart transitions from the console.

## Package and distribute

You can ship plugins in two ways:

- **Python package (recommended for reusable suites)**: declare an entry point under
  `[project.entry-points."reliaforge.plugins"]` in `pyproject.toml` and install the package into the
  backend environment. See [`reliaforge-plugins`](https://github.com/ReliaForge/reliaforge-plugins) for
  full-stack Python + `@reliaforge/plugin-sdk` examples.
- **Directory path**: copy the plugin directory onto the host, install its Python dependencies, and
  include its parent path in `RELIAFORGE_PLUGIN_PATHS`.

The bundled [demo](https://github.com/ReliaForge/reliaforge-backend/tree/main/reliaforge/plugins/demo)
and [runbook](https://github.com/ReliaForge/reliaforge-backend/tree/main/reliaforge/plugins/runbook)
plugins also show minimal service sharing between two plugins.
