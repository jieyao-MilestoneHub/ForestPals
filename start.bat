@echo off
echo ====================================================
echo Installing Flask (if needed)...
echo ====================================================
pip install -r requirements.txt

echo.
echo ====================================================
echo Starting Flask Server...
echo ====================================================
python app.py
