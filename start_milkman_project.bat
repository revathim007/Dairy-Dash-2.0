@echo off

echo Starting Dairy Dash 🥛...

start cmd /k run_backend.bat
timeout /t 5
start cmd /k run_frontend.bat

echo Backend and Frontend started successfully!
pause