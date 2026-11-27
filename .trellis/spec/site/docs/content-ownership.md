# Content ownership

## Current contract

The repository map is defined in `docs/reference/repositories.md`:

- `docs/` owns project positioning, getting-started flow, cross-repository architecture, security
  overview, compatibility overview, and roadmap.
- `reliaforge-backend/docs/` owns detailed runtime, manifest, and authentication contracts.
- `reliaforge-frontend/docs/` owns console host and `@reliaforge/plugin-sdk` contracts.
- `reliaforge-plugins/` owns the official full-stack infrastructure plugins (`infra_overview`,
  `proxmox`, `kubernetes`, `gitops_argocd`, `observability`, `ops_audit`) and single-container
  deployment build.

Orientation pages such as `docs/guide/plugin-development.md` summarize the entry path and link to
the owning repository's canonical guide rather than duplicating it.

## Rules

- Position ReliaForge as a plugin-based operations platform where plugins can ship Python APIs,
  shared Python services, and optional runtime ESM React workspaces.
- Distinguish platform lifecycle controls, plugin HTTP/SSE/WebSocket routes, runtime ESM workspaces,
  and shared Python services. Explain both `RELIAFORGE_PLUGIN_PATHS` and Python `entry_points`
  discovery; do not imply an online upload marketplace, untrusted code sandboxing, or Python hot
  reload without process restart.
- Verify technical claims against current public code, tests, or repository-local docs.
- Write for an SRE trying to evaluate, deploy, or extend the current release. Lead with the answer
  or next action, use concrete operational terms, and explain ReliaForge-specific names on first use.
- Describe the product as it exists now. Omit extraction history, rejected alternatives, internal
  predecessors, and compatibility statements about formats that are not part of this project.
- State a limitation only when it prevents a likely mistake, unsafe deployment, false success, or
  unsupported operation.
- Prefer a stable public GitHub link over copied detailed prose.
- Keep the landing page focused on product value, architectural contract, official plugin coverage,
  and first actions; put deep reference material in guide or reference pages.
- Maintain English at the root and Simplified Chinese under `docs/zh/` as complete document trees.
- Add, move, or remove corresponding English and Chinese pages together. Keep routes, heading levels,
  code blocks, technical identifiers, and public destinations structurally equivalent.
- Translate prose as full documents. Keep commands, API paths, plugin IDs, schema keys, capability
  names, and code examples canonical.
- Treat roadmap items as evidence-gated future work unless code and release evidence already exist.
- Never imply that the hosted demo has a backend or that ReliaForge sandboxes untrusted plugins.

## Verification

- Run `npm run build` to catch internal dead links.
- Run `npm run check:i18n` to prove both locale trees have matching routes and technical structure.
- Check outbound source/demo links in `tests/site.spec.ts`.
- Run `npm run check:hygiene` for every content change.
