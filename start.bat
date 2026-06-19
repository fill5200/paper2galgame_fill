@echo off
cd /d "%~dp0"
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo npm install failed.
    pause
    exit /b %errorlevel%
)
echo Starting dev server...
npm run dev
pause
