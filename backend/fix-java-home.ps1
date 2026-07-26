$java21bin = "C:\Users\gochh\.vscode\extensions\redhat.java-1.54.0-win32-x64\jre\21.0.10-win32-x86_64\bin"
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")

if ($currentPath -notlike "*redhat*") {
    $newPath = $java21bin + ";" + $currentPath
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
    Write-Host "Done: Java 21 added to front of User PATH"
} else {
    Write-Host "Java 21 already present in PATH"
}

[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Users\gochh\.vscode\extensions\redhat.java-1.54.0-win32-x64\jre\21.0.10-win32-x86_64", "User")
Write-Host "JAVA_HOME set to Java 21"
Write-Host ""
Write-Host "Please RESTART your terminal / IDE for changes to take effect."
