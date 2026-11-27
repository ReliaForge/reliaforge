# Security model

ReliaForge allows unauthenticated status reads by default and requires operator authentication for
plugin routes, WebSocket sessions, and lifecycle operations.

## Read-only endpoints

Liveness, readiness, platform status, plugin lists, and plugin details read current in-memory state.
They do not mutate plugins or expose configuration values. Configuration schemas show field names
and types while omitting secret values and secret defaults.

## Protected operations and WebSockets

Plugin HTTP routes, SSE streams, WebSocket upgrades (such as container exec or LXC terminals), and
start, stop, and restart requests all pass through backend authentication. Browser-initiated
mutations and WebSocket handshakes also validate `Origin` and `Sec-Fetch-Site` headers against
same-origin rules or `RELIAFORGE_TRUSTED_ORIGINS`.

`available_actions` tells the console which controls fit the current state; the backend re-verifies
identity and state on every request.

## Local development

Anonymous management is available only in development or test mode while the backend binds to a
loopback address (`127.0.0.1` or `::1`). Configure exact CORS origins, including protocol, host, and
port. Use development mode only on a trusted workstation.

## Production proxy authentication

Production requires:

- a trusted proxy network with a bounded CIDR range;
- an operator identity header accepted only from that trusted proxy peer;
- a strong shared secret verified on every proxied HTTP and WebSocket request;
- network routing that preserves the proxy's direct TCP peer address.

The backend refuses to start when production proxy settings are incomplete. Interactive OpenAPI
documentation is disabled in production.

## Browser and plugin trust

The frontend bundle stores no management secret. Keep upstream API tokens (such as Proxmox,
Kubernetes, or Argo CD credentials) in backend environment variables or mounted files, never in
`VITE_*` variables.

Plugins run as trusted Python and JavaScript code inside your deployment. Review third-party plugins
before enabling them; ReliaForge does not sandbox untrusted code.

The [online demo](https://demo.reliaforge.dev/) has no backend and sends no management requests.
Report suspected vulnerabilities privately using the repository's `SECURITY.md`.
