@echo off
echo Starting Dairy Dash 🥛 Backend...

cd backend

call venv\Scripts\activate.bat

python manage.py runserver

pause