@echo off
REM Restart Cloud Mountain Dev Server (Run from anywhere!)
REM Usage: copy this file to any location, double-click to run

set REPO_PATH=I:\3. Packaging\Website\WEBSITE UPDATE

echo ================================================
echo Restarting Cloud Mountain Dev Server
echo ================================================
echo.

REM Step 1: Kill any process using port 3000
echo [1/3] Terminating processes on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /PID %%a /F >nul 2>&1
)
echo Done.
echo.

REM Step 2: Remove out/ directory
echo [2/3] Removing out/ directory...
if exist "%REPO_PATH%\out" (
    rmdir /S /Q "%REPO_PATH%\out"
    echo Done.
) else (
    echo out/ directory not found, skipping.
)
echo.

REM Step 3: Start dev server
echo [3/3] Starting dev server...
echo Open http://localhost:3000 in your browser
echo Press Ctrl+C to stop the server
echo ================================================
echo.

cd /d "%REPO_PATH%"
start cmd /k "npm run dev"