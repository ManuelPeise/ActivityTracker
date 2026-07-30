@echo off
echo ================================
echo   ActivityTracker Docker Starter
echo ================================
echo.

echo Starte Docker Container...
docker-compose up -d

if %ERRORLEVEL% NEQ 0 (
	echo.
	echo [FEHLER] Docker Container konnten nicht gestartet werden!
	echo Stellen Sie sicher, dass Docker Desktop lauft.
	pause
	exit /b 1
)

echo.
echo Warte auf MySQL Datenbank...
timeout /t 10 /nobreak >nul

echo.
echo ================================
echo   Services erfolgreich gestartet!
echo ================================
echo.
echo API erreichbar unter:
echo   Lokal: http://localhost:5000
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
	set IP=%%a
	goto :found
)
:found
set IP=%IP:~1%
if not "%IP%"=="" (
	echo   Netzwerk: http://%IP%:5000
	echo.
)

echo MySQL Datenbank:
echo   Host: localhost
echo   Port: 3306
echo   Database: ActivityTrackerDb
echo   User: DevUser
echo.
echo ================================
echo.
echo Verwenden Sie 'docker-compose logs -f api' um Logs anzuzeigen
echo Verwenden Sie 'docker-compose down' um Container zu stoppen
echo.
pause
