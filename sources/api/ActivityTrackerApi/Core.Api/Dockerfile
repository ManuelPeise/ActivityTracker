# Unter https://aka.ms/customizecontainer erfahren Sie, wie Sie Ihren Debugcontainer anpassen und wie Visual Studio dieses Dockerfile verwendet, um Ihre Images für ein schnelleres Debuggen zu erstellen.

# Diese Stufe wird verwendet, wenn sie von VS im Schnellmodus ausgeführt wird (Standardeinstellung für Debugkonfiguration).
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# Diese Stufe wird zum Erstellen des Dienstprojekts verwendet.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Core.Api/Core.Api.csproj", "Core.Api/"]
COPY ["Data.Db/Data.Db.csproj", "Data.Db/"]
COPY ["Logic.AuthenticationService/Logic.AuthenticationService.csproj", "Logic.AuthenticationService/"]
COPY ["Logic.Import/Logic.Import.csproj", "Logic.Import/"]
COPY ["Logic.Shared/Logic.Shared.csproj", "Logic.Shared/"]
COPY ["Shared.Interfaces/Shared.Interfaces.csproj", "Shared.Interfaces/"]
COPY ["Shared.Models/Shared.Models.csproj", "Shared.Models/"]
COPY ["Shared.Enums/Shared.Enums.csproj", "Shared.Enums/"]
RUN dotnet restore "./Core.Api/Core.Api.csproj"
COPY . .
WORKDIR "/src/Core.Api"
RUN dotnet build "./Core.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Diese Stufe wird verwendet, um das Dienstprojekt zu veröffentlichen, das in die letzte Phase kopiert werden soll.
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Core.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Diese Stufe wird in der Produktion oder bei Ausführung von VS im regulären Modus verwendet (Standard, wenn die Debugkonfiguration nicht verwendet wird).
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Core.Api.dll"]