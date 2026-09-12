@echo off
setlocal
title Sukkiri local server
REM ============================================================
REM  Put this .bat in the SAME FOLDER as Sukkiri.dc.html and
REM  support.js, then double-click it.
REM  It serves the folder at http://localhost:8091/
REM ============================================================

set "PORT=8091"
set "PAGE=Sukkiri.dc.html"
cd /d "%~dp0"

echo.
echo   Sukkiri local server
echo   folder: %cd%
echo.

if not exist "%PAGE%" (
  echo   [X] %PAGE% is NOT in this folder.
  echo.
  echo   This .bat must sit next to Sukkiri.dc.html and support.js.
  echo   Move all three files into one folder and run it again.
  echo.
  pause
  exit /b 1
)
if not exist "support.js" (
  echo   [X] support.js is missing from this folder.
  echo       The app will not run without it. Copy it in and retry.
  echo.
  pause
  exit /b 1
)

REM --- find a working Python (ignores the Microsoft Store stub) ---
set "PY="
python --version >nul 2>&1 && set "PY=python"
if not defined PY ( py --version >nul 2>&1 && set "PY=py" )
if not defined PY ( python3 --version >nul 2>&1 && set "PY=python3" )

if defined PY (
  echo   Serving with %PY% on port %PORT% ...
  echo   Opening http://localhost:%PORT%/%PAGE%
  echo.
  echo   KEEP THIS WINDOW OPEN while you use Sukkiri.
  echo   Close it to stop the server.
  echo.
  start "" "http://localhost:%PORT%/%PAGE%"
  %PY% -m http.server %PORT%
  echo.
  echo   Server stopped.
  pause
  exit /b 0
)

REM --- fall back to Node ---
where npx >nul 2>&1
if %errorlevel%==0 (
  echo   Python not found - using Node instead.
  echo   Opening http://localhost:%PORT%/%PAGE%
  echo.
  start "" "http://localhost:%PORT%/%PAGE%"
  npx --yes serve -l %PORT% .
  echo.
  echo   Server stopped.
  pause
  exit /b 0
)

echo   [X] Neither Python nor Node is installed.
echo.
echo   Install Python: https://www.python.org/downloads/
echo   IMPORTANT: on the first install screen, tick
echo   "Add python.exe to PATH" before clicking Install.
echo.
echo   Then close this window and run this file again.
echo.
pause
exit /b 1
