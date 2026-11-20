@echo off
title Launching Bus Buddy App...
echo ===================================================
echo 🚌 Launching Bus Buddy Desktop Application...
echo ===================================================

:: Try launching in Chrome app mode first
start chrome --app="http://localhost:3000" 2>nul
if %ERRORLEVEL% EQU 0 goto done

:: Fallback to Microsoft Edge app mode
start msedge --app="http://localhost:3000" 2>nul
if %ERRORLEVEL% EQU 0 goto done

:: Fallback to default browser
start http://localhost:3000

:done
echo Bus Buddy is running!
exit
