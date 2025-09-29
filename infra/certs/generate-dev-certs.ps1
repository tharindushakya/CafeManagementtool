param(
  [string] $OutDir = "./infra/certs/dev",
  [int] $Days = 365
)

Write-Output "Generating dev certificates into $OutDir"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

# Use npx selfsigned to generate a key+cert bundle
$cmd = "npx -y selfsigned -o $OutDir -n 'CN=dev-ca' --days $Days --alt 'localhost'"
Write-Output "Running: $cmd"
iex $cmd

Write-Output "Done. Check $OutDir for certificate files."
