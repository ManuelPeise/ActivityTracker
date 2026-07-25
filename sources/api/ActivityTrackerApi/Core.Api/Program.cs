using Core.Api.Bundels;

var corsPoliyName = "AllowAllOrigins";

var builder = WebApplication.CreateBuilder(args);
ServiceConfiguration.ConfigureServices(builder, corsPoliyName);

var app = builder.Build();
await AppConfiguration.ConfigureApp(app, corsPoliyName);

app.Run();
