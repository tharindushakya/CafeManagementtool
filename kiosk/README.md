# Kiosk (Windows 11) — Skeleton

This folder contains a minimal Electron-based kiosk skeleton for Windows. It is intentionally small and intended as a developer starting point.

To run locally:

```powershell
npm --prefix kiosk install
npm --prefix kiosk run start
```

E2E tests are under `kiosk/tests/e2e` and verify lockdown/shortcut behavior in a unit-test style harness.
