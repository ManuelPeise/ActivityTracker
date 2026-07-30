@echo off
echo ================================
echo   ActivityTracker Docker Logs
echo ================================
echo.
echo Zeige Logs (Strg+C zum Beenden)...
echo.

docker-compose logs -f
