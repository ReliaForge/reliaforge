# Roadmap

ReliaForge develops the shared runtime and console host for operations plugins. Plugin authors own
their domain APIs, shared services, and workspace views. The platform currently provides:

- plugin discovery from search paths and Python `entry_points`, with `enabled_plugins` and `disabled_plugins` selection;
- manifest validation, required and optional SemVer dependency resolution, and ordered startup;
- start, stop, restart, health reporting, and structured lifecycle audit hooks;
- environment-based plugin settings with secret masking in schema endpoints;
- unified HTTP and WebSocket proxy authentication with Origin CSRF checks;
- runtime-loaded ESM React plugin workspaces and overview widgets powered by `@reliaforge/plugin-sdk`;
- single-process static console hosting via `RELIAFORGE_CONSOLE_DIR` alongside standalone web deployment;
- bundled example plugins, `reliaforge-scaffold`, and the six-plugin [`reliaforge-plugins`](https://github.com/SajoLuo/reliaforge-plugins) infrastructure suite.

## Next priorities

- add fine-grained role-based permissions per plugin route and operational action;
- support multi-cluster and multi-site target profiles within infrastructure plugins;
- provide a built-in OIDC session adapter for deployments that do not terminate identity at an external proxy;
- export OpenTelemetry traces and runtime metrics from the backend and plugin lifecycle hooks.

To discuss a concrete change, open an issue in the repository that owns it:

- [backend issues](https://github.com/SajoLuo/reliaforge-backend/issues);
- [frontend and SDK issues](https://github.com/SajoLuo/reliaforge-frontend/issues);
- [official plugin suite issues](https://github.com/SajoLuo/reliaforge-plugins/issues);
- [site and cross-project issues](https://github.com/SajoLuo/reliaforge/issues).
