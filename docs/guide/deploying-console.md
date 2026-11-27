# Deploy the console

The React console hosts platform status, plugin lifecycle controls, and runtime ESM plugin
workspaces. It follows the visitor's browser language (`en` or `zh`, overridable via `?lang=`) and
switches between light and dark themes automatically via `prefers-color-scheme`.

## Single-process container deployment

For production, build the static console once and serve it directly from `reliaforge-backend` on the
same origin:

```bash
npm ci && npm run build
RELIAFORGE_CONSOLE_DIR=/srv/reliaforge/console reliaforge
```

When `RELIAFORGE_CONSOLE_DIR` points to the compiled `dist/` folder, one backend container serves
the SPA routes, `/api/v1` endpoints, runtime plugin UI bundles, SSE log streams, and WebSocket
terminals together. See [`reliaforge-plugins`](https://github.com/SajoLuo/reliaforge-plugins)
(`deploy/Dockerfile`) for a multi-stage container build combining backend, console, and plugins.

## Separate static web server

If you host `dist/` on a separate Nginx or Caddy server instead, configure SPA fallback to
`index.html` and proxy `/api/v1` (including SSE buffering off and WebSocket `Upgrade` headers) to
the backend on the same origin.

Never place upstream tokens or proxy shared secrets in `VITE_*` variables; Vite embeds those values
into public browser JavaScript.

## Local development

Run the Vite dev server against a local backend:

```bash
cp .env.example .env
npm ci
npm run dev
```

Set `VITE_RELIAFORGE_API_URL` only when the frontend dev server and backend run on different origins
(the client appends `/api/v1` automatically), and add the frontend origin to the backend CORS list.

## Read-only demo build

```bash
npm run build:demo
```

`build:demo` uses hash routing and saved fixture data for `demo.reliaforge.dev`. It runs entirely in
the browser without a backend or write actions.

## Production authentication

In `proxy` authentication mode, the backend accepts operator identity headers only from configured
trusted proxy CIDRs that also present the shared proxy secret, and checks `Origin` headers on
browser mutations and WebSockets. Incomplete production settings prevent startup.

Review the [security model](../reference/security.md) before exposing a deployment. Full frontend
and SDK scripts live in [`reliaforge-frontend`](https://github.com/SajoLuo/reliaforge-frontend).
