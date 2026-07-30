@echo off
echo ================================
echo   ActivityTracker Docker Stopper
echo ================================
echo.

echo Stoppe Docker Container...
docker-compose down

if %ERRORLEVEL% NEQ 0 (
	echo.
	echo [FEHLER] Docker Container konnten nicht gestoppt werden!
	pause
	exit /b 1
)

echo.
echo ================================
echo   Container erfolgreich gestoppt!
echo ================================
echo.
pause
