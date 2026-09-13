@echo off
title Sukkiri local server
REM Put this .bat in the SAME FOLDER as Sukkiri.dc.html and support.js,
REM then double-click it. Leave this window open while using the app.
REM Same Python-finding logic as run-calendar-local.bat.
cd /d "%~dp0"

set "PAGE=Sukkiri.dc.html"
set "PORT=8091"

if not exist "%PAGE%" (
  echo Could not find %PAGE% here.
  echo Put this .bat in the same folder as Sukkiri.dc.html and support.js.
  echo Current folder: %CD%
  pause & goto :eof
)
if not exist "support.js" (
  echo support.js is missing from this folder - the app cannot run without it.
  echo Current folder: %CD%
  pause & goto :eof
)

REM --- Find a Python: PATH first, then common Anaconda/Miniconda locations ---
REM (double-clicking uses plain cmd, where conda's PATH is usually NOT active,
REM  so we look for python.exe directly.)
set "PY="
for %%P in (
  "python.exe"
  "%USERPROFILE%\anaconda3\python.exe"
  "%USERPROFILE%\miniconda3\python.exe"
  "%USERPROFILE%\AppData\Local\anaconda3\python.exe"
  "%USERPROFILE%\AppData\Local\miniconda3\python.exe"
  "%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
  "%LOCALAPPDATA%\Programs\Python\Python311\python.exe"
  "C:\ProgramData\anaconda3\python.exe"
  "C:\ProgramData\miniconda3\python.exe"
) do (
  if not defined PY (
    "%%~P" -c "import sys" >nul 2>nul && set "PY=%%~P"
  )
)

if not defined PY (
  echo.
  echo Could not find Python automatically.
  echo Open "Anaconda Prompt", cd to this folder, and run:
  echo     python -m http.server %PORT%
  echo Then open: http://localhost:%PORT%/%PAGE%
  echo.
  pause & goto :eof
)

echo.
echo   Sukkiri - local server
echo   Python:  %PY%
echo   Folder:  %CD%
echo   Open:    http://localhost:%PORT%/%PAGE%
echo   (Close this window to stop the server.)
echo.

start "" "http://localhost:%PORT%/%PAGE%"
"%PY%" -m http.server %PORT%

echo.
echo Server stopped.
pause
