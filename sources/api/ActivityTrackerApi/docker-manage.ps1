# ActivityTracker Docker Management Script

param(
	[Parameter(Mandatory=$true)]
	[ValidateSet('start', 'stop', 'restart', 'logs', 'build', 'clean', 'status')]
	[string]$Action
)

function Show-Header {
	Write-Host "================================" -ForegroundColor Cyan
	Write-Host "  ActivityTracker Docker Manager" -ForegroundColor Cyan
	Write-Host "================================" -ForegroundColor Cyan
	Write-Host ""
}

function Get-LocalIP {
	$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254.*"} | Select-Object -First 1).IPAddress
	return $ip
}

Show-Header

switch ($Action) {
	'start' {
		Write-Host "Starte Docker Container..." -ForegroundColor Green
		docker-compose up -d

		Write-Host ""
		Write-Host "Warte auf MySQL Datenbank..." -ForegroundColor Yellow
		Start-Sleep -Seconds 10

		Write-Host ""
		Write-Host "Services gestartet!" -ForegroundColor Green
		Write-Host ""
		Write-Host "API erreichbar unter:" -ForegroundColor Cyan
		Write-Host "  Lokal: http://localhost:5000" -ForegroundColor White
		$ip = Get-LocalIP
		if ($ip) {
			Write-Host "  Netzwerk: http://$ip:5000" -ForegroundColor White
		}
		Write-Host ""
		Write-Host "Verwenden Sie 'docker-compose logs -f api' um Logs anzuzeigen" -ForegroundColor Gray
	}

	'stop' {
		Write-Host "Stoppe Docker Container..." -ForegroundColor Yellow
		docker-compose down
		Write-Host "Container gestoppt!" -ForegroundColor Green
	}

	'restart' {
		Write-Host "Starte Container neu..." -ForegroundColor Yellow
		docker-compose restart
		Write-Host "Container neugestartet!" -ForegroundColor Green
	}

	'logs' {
		Write-Host "Zeige Logs (Strg+C zum Beenden)..." -ForegroundColor Cyan
		docker-compose logs -f
	}

	'build' {
		Write-Host "Baue Docker Images neu..." -ForegroundColor Yellow
		docker-compose build --no-cache
		Write-Host ""
		Write-Host "Build abgeschlossen!" -ForegroundColor Green
		Write-Host "Verwenden Sie './docker-manage.ps1 start' um die Container zu starten" -ForegroundColor Gray
	}

	'clean' {
		Write-Host "Stoppe Container und lösche Volumes..." -ForegroundColor Red
		$confirm = Read-Host "Dies löscht alle Datenbankdaten! Fortfahren? (j/n)"
		if ($confirm -eq 'j') {
			docker-compose down -v
			Write-Host "Container und Volumes gelöscht!" -ForegroundColor Green
		} else {
			Write-Host "Abgebrochen." -ForegroundColor Yellow
		}
	}

	'status' {
		Write-Host "Container Status:" -ForegroundColor Cyan
		docker-compose ps
		Write-Host ""
		$ip = Get-LocalIP
		Write-Host "Netzwerk-Informationen:" -ForegroundColor Cyan
		Write-Host "  Lokale IP: $ip" -ForegroundColor White
		Write-Host "  API Port: 5000" -ForegroundColor White
		Write-Host "  MySQL Port: 3306" -ForegroundColor White
	}
}
