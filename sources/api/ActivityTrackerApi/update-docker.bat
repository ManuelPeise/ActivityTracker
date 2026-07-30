@echo off
echo ================================
echo   ActivityTracker Docker Update
echo ================================
echo.

echo Stoppe laufende Container...
docker-compose down

if %ERRORLEVEL% NEQ 0 (
	echo.
	echo [WARNUNG] Container konnten nicht gestoppt werden oder liefen nicht
	echo.
)

echo.
echo Baue Images neu (ohne Cache)...
docker-compose build --no-cache

if %ERRORLEVEL% NEQ 0 (
	echo.
	echo [FEHLER] Build fehlgeschlagen!
	pause
	exit /b 1
)

echo.
echo Starte aktualisierte Container...
docker-compose up -d

if %ERRORLEVEL% NEQ 0 (
	echo.
	echo [FEHLER] Container konnten nicht gestartet werden!
	pause
	exit /b 1
)

echo.
echo Warte auf MySQL Datenbank...
timeout /t 10 /nobreak >nul

echo.
echo ================================
echo   Update erfolgreich!
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

echo Verwenden Sie 'docker-compose logs -f api' um Logs zu prufen
echo.
pause
