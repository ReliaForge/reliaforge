# Design QA

## Target

- Visual direction: Architectural hairline system aligned with the v2 ReliaForge Console (cool stone
  light `#f8f9fb` / `#ffffff` / `#007e50` and graphite-neutral dark `#0b0c0e` / `#15181d` /
  `#34d399`).
- Product position: a plugin-based operations platform for Python APIs, shared services, and
  runtime ESM React workspaces (`@reliaforge/plugin-sdk`), paired with the six-plugin
  `reliaforge-plugins` infrastructure suite.
- Real console asset: `docs/public/console-preview.png` (2560 x 1600, lossless PNG).
- Social preview asset: `docs/public/og-preview.png` (1200 x 630, lossless PNG).

## v2 Full-Stack Redesign (2026-11-28)

- Replaced the cramped 36%/66% split hero, `<br>` headline break, and pre-heading `ALL CAPS`
  kickers with a centered monumental display `<h1>` rising directly above a full-width (`1232px`)
  high-DPI v2 console stage.
- Locked typography to two font families (CJK-capable sans + mono) and a strict 3-size body scale
  below the hero (`--rf-text-h2`, `--rf-text-body`, `--rf-text-sm`) with `tabular-nums` and zero
  `< 13px` text above the fold.
- Added below-the-fold architectural sections covering:
  1. the 4-column hairline capability band;
  2. the unified `manifest.json` contract from Python backend services to runtime ESM console
     workspaces;
  3. the 6-plugin `reliaforge-plugins` infrastructure matrix (`infra_overview`, `proxmox`,
     `kubernetes`, `gitops_argocd`, `observability`, `ops_audit`);
  4. a direct browser-demo and 4-command local quick-start closing split.
- Refreshed `console-preview.png` (`2560 x 1600`) and `og-preview.png` (`1200 x 630`) from the live
  v2 production console build running all six infrastructure plugins against sanitized public
  example data (`pve-prod-01`, `prod-us-east`, `198.51.100.*`, `*.example.com`).
- Updated Chinese demo links to `https://demo.reliaforge.dev/?lang=zh` to match v2 console query and
  browser-locale detection, and updated all bilingual guides, reference pages, and roadmap items to
  reflect shipped v2 capabilities.

## Verification gates

- TypeScript (`npm run typecheck`) and ESLint + Markdownlint (`npm run lint`): passed.
- Unit tests (`npm run test:unit`) and bilingual parity (`npm run check:i18n`): passed.
- VitePress production build (`npm run build`) and Playwright suite (`npm run test:e2e`): passed.
- Open-source hygiene and exact binary allowlist (`npm run check:hygiene`): passed.
- Visual browser captures verified at `1440 x 900` (light & dark, opening + scrolled sections),
  `390 x 844`, and `320 x 740` in both English and Simplified Chinese with zero horizontal overflow
  and zero console errors.

final result: passed
