# ActivityTracker Docker Setup

## Übersicht
Diese Docker-Konfiguration ermöglicht es, die ActivityTracker-API und die MySQL-Datenbank in Docker-Containern auszuführen und im lokalen Netzwerk verfügbar zu machen.

## Voraussetzungen
- Docker Desktop installiert und laufend
- Docker Compose (in Docker Desktop enthalten)

## Container starten

### Alle Services starten
```powershell
docker-compose up -d
```

### Logs anzeigen
```powershell
# Alle Logs
docker-compose logs -f

# Nur API-Logs
docker-compose logs -f api

# Nur MySQL-Logs
docker-compose logs -f mysql
```

### Container stoppen
```powershell
docker-compose down
```

### Container stoppen und Datenbank löschen
```powershell
docker-compose down -v
```

## Zugriff

### API
- **Lokal**: http://localhost:5000
- **Im Netzwerk**: http://<Ihre-IP>:5000
  - Ihre lokale IP finden Sie mit: `ipconfig` (Windows) oder `hostname -I` (Linux)
  - Beispiel: http://192.168.1.100:5000

### MySQL Datenbank
- **Host**: localhost (lokal) oder mysql (innerhalb Docker-Netzwerk)
- **Port**: 3306
- **Database**: ActivityTrackerDb
- **User**: DevUser
- **Password**: Pass@word
- **Root Password**: RootPass@word123

## Datenbank-Migrationen

Nach dem ersten Start müssen die Datenbank-Migrationen ausgeführt werden:

```powershell
# Migrations im API-Container ausführen
docker-compose exec api dotnet ef database update
```

Alternativ können Sie die Migrationen vor dem Container-Build ausführen, wenn die Datenbank bereits lokal läuft.

## Troubleshooting

### API startet nicht
1. Prüfen Sie, ob die MySQL-Datenbank bereit ist:
   ```powershell
   docker-compose logs mysql
   ```
2. Überprüfen Sie die API-Logs:
   ```powershell
   docker-compose logs api
   ```

### Verbindungsprobleme
- Stellen Sie sicher, dass Port 5000 nicht bereits verwendet wird
- Überprüfen Sie die Firewall-Einstellungen für Docker

### Images neu erstellen
```powershell
docker-compose build --no-cache
docker-compose up -d
```

## Entwicklung

### Änderungen testen
Nach Codeänderungen:
```powershell
docker-compose down
docker-compose build api
docker-compose up -d
```

### Debug-Informationen
```powershell
# Container-Status anzeigen
docker-compose ps

# In den API-Container einloggen
docker-compose exec api /bin/bash
```

## Netzwerk-Zugriff für Tests

Um die API von anderen Geräten im lokalen Netzwerk zu testen:

1. Stellen Sie sicher, dass Port 5000 in der Windows-Firewall geöffnet ist:
   ```powershell
   New-NetFirewallRule -DisplayName "ActivityTracker API" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
   ```

2. Finden Sie Ihre lokale IP-Adresse:
   ```powershell
   ipconfig
   ```
   Suchen Sie nach der IPv4-Adresse (z.B. 192.168.1.100)

3. Greifen Sie von einem anderen Gerät auf die API zu:
   ```
   http://192.168.1.100:5000
   ```

## Konfiguration

### Ports ändern
Bearbeiten Sie die `docker-compose.yml`:
```yaml
api:
  ports:
	- "8080:8080"  # <Externe-Port>:<Container-Port>
```

### Datenbank-Credentials ändern
Bearbeiten Sie die Umgebungsvariablen in `docker-compose.yml` im mysql-Service und im api-Service (ConnectionStrings__ActivityTrackerDb).
