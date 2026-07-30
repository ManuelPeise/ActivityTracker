@echo off
echo ================================
echo   Docker Reset (Clean Start)
echo ================================
echo.
echo WARNUNG: Dies loescht alle Datenbankdaten!
echo.
set /p confirm="Fortfahren? (j/n): "

if /i not "%confirm%"=="j" (
	echo.
	echo Abgebrochen.
	pause
	exit /b 0
)

echo.
echo Stoppe und entferne Container...
docker-compose down -v

if %ERRORLEVEL% NEQ 0 (
	echo.
	echo [WARNUNG] Fehler beim Stoppen
)

echo.
echo Entferne alte Images...
docker rmi activitytrackerapi-api 2>nul

echo.
echo Baue neue Images...
docker-compose build --no-cache

if %ERRORLEVEL% NEQ 0 (
	echo.
	echo [FEHLER] Build fehlgeschlagen!
	pause
	exit /b 1
)

echo.
echo Starte Container mit frischer Datenbank...
docker-compose up -d

if %ERRORLEVEL% NEQ 0 (
	echo.
	echo [FEHLER] Container konnten nicht gestartet werden!
	pause
	exit /b 1
)

echo.
echo Warte auf MySQL Datenbank...
timeout /t 15 /nobreak >nul

echo.
echo ================================
echo   Reset erfolgreich!
echo ================================
echo.
echo WICHTIG: Fuehren Sie jetzt die Datenbank-Migrationen aus!
echo   docker-compose exec api dotnet ef database update
echo.
echo API erreichbar unter:
echo   Lokal: http://localhost:5000
echo.
pause
