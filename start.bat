@echo off
title Udaan AI - Starting Servers...

echo Starting Udaan AI servers...
echo.

REM Start Backend Server in a new window using absolute paths
echo [1/2] Starting Backend Server on port 3001...
start "Udaan AI - Backend" cmd /c "cd /d "C:\Users\sanap\OneDrive\Desktop\PROJECT UDAAN AI\Udaan-Growth-System\Udaan-Growth-System\artifacts\api-server" && node --env-file="C:\Users\sanap\OneDrive\Desktop\PROJECT UDAAN AI\Udaan-Growth-System\Udaan-Growth-System\.env" dist/index.mjs"

REM Start Frontend Server in a new window using absolute paths
echo [2/2] Starting Frontend Server on port 5174...
start "Udaan AI - Frontend" cmd /c "cd /d "C:\Users\sanap\OneDrive\Desktop\PROJECT UDAAN AI\Udaan-Growth-System\Udaan-Growth-System\artifacts\udaan-ai" && npm run dev"

echo.
echo Both servers are starting in separate windows...
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5174
echo.
pause
