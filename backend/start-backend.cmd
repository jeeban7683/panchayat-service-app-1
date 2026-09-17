@echo off
REM ============================================================
REM  Panchayat Backend Startup Script (Full Path Version)
REM  Sets JAVA_HOME to Java 21 to fix Lombok/Java 25 error
REM ============================================================

set JAVA_HOME=C:\Users\gochh\.vscode\extensions\redhat.java-1.55.0-win32-x64\jre\21.0.11-win32-x86_64
set PATH=%JAVA_HOME%\bin;%PATH%

echo.
echo  [INFO] JAVA_HOME = %JAVA_HOME%

REM Verify java is Java 21
"%JAVA_HOME%\bin\java.exe" -version

echo.
echo  [INFO] Starting Panchayat Spring Boot Backend...
echo.

cd /d "e:\Projects\panchayat-service-app\backend"

call mvnw.cmd spring-boot:run

pause
