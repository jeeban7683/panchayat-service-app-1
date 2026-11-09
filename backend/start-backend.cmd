@echo off
REM ============================================================
REM  Panchayat Backend Startup Script
REM  Auto-detects Java 21+ (IntelliJ JBR, JDK 21/25, or system JAVA_HOME)
REM ============================================================

setlocal enabledelayedexpansion

if exist "C:\Users\gochh\AppData\Local\Programs\IntelliJ IDEA Ultimate 2026.1\jbr\bin\java.exe" (
    set "JAVA_HOME=C:\Users\gochh\AppData\Local\Programs\IntelliJ IDEA Ultimate 2026.1\jbr"
) else if exist "C:\Program Files\Java\latest\jdk-25\bin\java.exe" (
    set "JAVA_HOME=C:\Program Files\Java\latest\jdk-25"
) else if exist "C:\Program Files\Java\jdk-21\bin\java.exe" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-21"
)

if not "%JAVA_HOME%"=="" (
    set "PATH=%JAVA_HOME%\bin;%PATH%"
    echo.
    echo  [INFO] Using JAVA_HOME = %JAVA_HOME%
)

echo.
echo  [INFO] Checking Java version:
java -version

echo.
echo  [INFO] Starting Panchayat Spring Boot Backend...
echo.

cd /d "%~dp0"
call .\mvnw.cmd spring-boot:run

pause
