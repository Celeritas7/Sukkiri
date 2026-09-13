@echo off
title Sukkiri local server
REM Put this .bat next to Sukkiri.dc.html and support.js, then double-click.
REM Opens Sukkiri at http://localhost:8091/Sukkiri.dc.html
REM Tip: run the calendar's .bat too — both apps share localStorage only when
REM      served from the SAME origin. To share, copy Sukkiri.dc.html + support.js
REM      into the Calender_app folder and open it from the calendar's port instead.

set PORT=8091
cd /d "%~dp0"

where python >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:%PORT%/Sukkiri.dc.html
  python -m http.server %PORT%
  goto :eof
)

where py >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:%PORT%/Sukkiri.dc.html
  py -m http.server %PORT%
  goto :eof
)

where npx >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:%PORT%/Sukkiri.dc.html
  npx --yes serve -l %PORT% .
  goto :eof
)

echo Python or Node is needed to serve Sukkiri locally.
echo Install Python from https://www.python.org/downloads/ then run this again.
pause
