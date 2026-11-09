$candidates = @(
    "C:\Users\gochh\AppData\Local\Programs\IntelliJ IDEA Ultimate 2026.1\jbr",
    "C:\Program Files\Java\latest\jdk-25",
    "C:\Program Files\Java\jdk-21"
)

$found = $null
foreach ($c in $candidates) {
    if (Test-Path "$c\bin\java.exe") {
        $found = $c
        break
    }
}

if ($found) {
    [Environment]::SetEnvironmentVariable("JAVA_HOME", $found, "User")
    $binPath = "$found\bin"
    $currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
    if ($currentPath -notlike "*$binPath*") {
        [Environment]::SetEnvironmentVariable("PATH", "$binPath;$currentPath", "User")
    }
    Write-Host "SUCCESS: JAVA_HOME set to: $found" -ForegroundColor Green
    Write-Host "Java added to User PATH. Please restart your terminal/IDE for changes to take effect."
} else {
    Write-Host "No Java JDK found automatically in candidate paths." -ForegroundColor Yellow
}
