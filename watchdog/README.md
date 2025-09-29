# Watchdog supervisor (dev)

This small Node-based supervisor is intended as a lightweight development harness that simulates the required watchdog behavior for the kiosk.

Files:
- `windows-service/supervisor.js` — Supervisor class that spawns a target process and restarts it if it exits.
- `windows-service/cli.js` — CLI wrapper to start the supervisor: `node cli.js <target-script>`.
- `windows-service/fake_kiosk.js` — Fake kiosk process that prints heartbeats and exits when signalled.
- `tests/watchdog.integration.spec.js` — Jest integration test that starts the supervisor, kills the kiosk, and asserts a restart within 5s.

Run tests:

```powershell
Set-Location -LiteralPath .\watchdog
npm install
npm test
```

Notes:
- This is a dev harness and not a production Windows Service. For production readiness consider using native Windows Service wrappers (nssm, win32-service, or a Go/CLR service) and proper service installation.
