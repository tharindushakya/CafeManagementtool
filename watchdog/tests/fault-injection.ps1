Param()

$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$LogFile = Join-Path $ScriptRoot '..\watchdog_restarts.log'

Write-Host "Looking for kiosk process (fake_kiosk)..."
$proc = Get-Process | Where-Object { $_.Path -like '*fake_kiosk*' -or $_.ProcessName -match 'node' } | Select-Object -First 1
if (-not $proc) {
  Write-Error "No kiosk process found. Start fake_kiosk.js first for a meaningful test."
  exit 2
}

Write-Host "Killing kiosk pid $($proc.Id)"
Stop-Process -Id $proc.Id -Force

Write-Host "Waiting up to 5s for watchdog to restart..."
$deadline = (Get-Date).AddSeconds(5)
while ((Get-Date) -lt $deadline) {
  if (Test-Path $LogFile) {
    $tail = Get-Content $LogFile -Tail 50
    if ($tail -match 'spawned') {
      Write-Host "Watchdog restarted kiosk (log contains spawn entry)."
      exit 0
    }
  }
  Start-Sleep -Seconds 1
}

Write-Error "Watchdog did not restart kiosk within 5s"
exit 1
