# Versions and API

This page lists the version contracts enforced by the current release.

## Plugin API

Set `api_version` to `"v1"` in `manifest.json`. The backend rejects other values before importing
the plugin's Python entry point.

## Plugin dependencies

Each dependency entry specifies `id`, an accepted SemVer `version` range, and an optional
`optional: true` flag. Before importing plugin code, the backend checks for missing required
providers, incompatible versions, and dependency cycles.

The provider plugin's SemVer describes the contract of the Python services it registers. Consumers
call `context.get_service(...)` for required providers or `context.try_get_service(...)` for
optional providers.

## Console and Plugin SDK

The console talks to `/api/v1` and loads runtime plugin bundles when `frontend.ui_mode` is set to
`"esm"` in `manifest.json`. Build ESM plugin workspaces against `@reliaforge/plugin-sdk` `^1.1.0`
so shared React globals and UI components match the host console.

## Settings and restart

Plugin environment variables use the `RELIAFORGE_<PLUGIN_ID>_` prefix and `__` for nested fields.
Restarting a plugin re-reads its environment settings. Restart the backend process after changing
Python code, frontend bundles, `manifest.json`, or `enabled_plugins` / `disabled_plugins`.
