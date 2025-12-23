# Command 008: Error Handling & Logging

## Metadata
- **ID:** 008
- **Fase:** 1 - Foundation
- **Estimeret tid:** 1-2 timer
- **Afhængigheder:** Ingen
- **Design reference:** N/A (infrastructure)

## Formål
Global error handling og logging infrastructure. Fanger unhandled exceptions, logger fejl for debugging, og viser user-friendly fejlbeskeder.

## Risici
- **Lav risiko**: Infrastructure code
- **Opmærksomhed**: Skal fange exceptions uden at crashe appen

## Analyse

### Hvad skal implementeres
- ExceptionHandler class til global exception handling
- Logger class til file-based logging
- Integration med MAUI UnhandledException events

### Filer der oprettes
- `src/Stribe/Services/ILogger.cs`
- `src/Stribe/Services/Logger.cs`
- `src/Stribe/Helpers/ExceptionHandler.cs`

## Implementering

### Prompt til Claude Code
```
Opret Error Handling & Logging:

**Services/ILogger.cs**:
```csharp
namespace Stribe.Services;

public interface ILogger
{
    Task LogInfoAsync(string message);
    Task LogWarningAsync(string message);
    Task LogErrorAsync(string message, Exception? exception = null);
    Task<List<string>> GetRecentLogsAsync(int count = 50);
}
```

**Services/Logger.cs**:
```csharp
using System.Text;

namespace Stribe.Services;

public class Logger : ILogger
{
    private readonly string _logFilePath;

    public Logger()
    {
        var appDataPath = FileSystem.AppDataDirectory;
        _logFilePath = Path.Combine(appDataPath, "stribe.log");
    }

    public async Task LogInfoAsync(string message)
    {
        await WriteLogAsync("INFO", message);
    }

    public async Task LogWarningAsync(string message)
    {
        await WriteLogAsync("WARN", message);
    }

    public async Task LogErrorAsync(string message, Exception? exception = null)
    {
        var fullMessage = exception != null
            ? $"{message}\n{exception.Message}\n{exception.StackTrace}"
            : message;

        await WriteLogAsync("ERROR", fullMessage);
    }

    public async Task<List<string>> GetRecentLogsAsync(int count = 50)
    {
        if (!File.Exists(_logFilePath))
            return new List<string>();

        var lines = await File.ReadAllLinesAsync(_logFilePath);
        return lines.TakeLast(count).ToList();
    }

    private async Task WriteLogAsync(string level, string message)
    {
        var timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        var logEntry = $"[{timestamp}] [{level}] {message}\n";

        try
        {
            await File.AppendAllTextAsync(_logFilePath, logEntry);
        }
        catch
        {
            // Fail silently if logging fails
        }
    }
}
```

**Helpers/ExceptionHandler.cs**:
```csharp
namespace Stribe.Helpers;

public static class ExceptionHandler
{
    private static ILogger? _logger;

    public static void Initialize(ILogger logger)
    {
        _logger = logger;

        // Global exception handlers
        AppDomain.CurrentDomain.UnhandledException += OnUnhandledException;
        TaskScheduler.UnobservedTaskException += OnUnobservedTaskException;
    }

    private static void OnUnhandledException(object sender, UnhandledExceptionEventArgs e)
    {
        if (e.ExceptionObject is Exception ex)
        {
            _logger?.LogErrorAsync("Unhandled exception", ex).Wait();
        }
    }

    private static void OnUnobservedTaskException(object? sender, UnobservedTaskExceptionEventArgs e)
    {
        _logger?.LogErrorAsync("Unobserved task exception", e.Exception).Wait();
        e.SetObserved();
    }

    public static async Task<T?> TryExecuteAsync<T>(Func<Task<T>> action, string context)
    {
        try
        {
            return await action();
        }
        catch (Exception ex)
        {
            await (_logger?.LogErrorAsync($"Error in {context}", ex) ?? Task.CompletedTask);
            return default;
        }
    }
}
```

**MauiProgram.cs**:
```csharp
builder.Services.AddSingleton<ILogger, Logger>();

// After building the app:
var logger = app.Services.GetRequiredService<ILogger>();
ExceptionHandler.Initialize(logger);
```
```

## Verifikation
```bash
dotnet build src/Stribe/Stribe.csproj
```

**Test:**
- [ ] Logger skriver til fil korrekt
- [ ] ExceptionHandler fanger unhandled exceptions
- [ ] GetRecentLogsAsync() returnerer log entries

## Acceptkriterier
- [ ] Logger implementation med file output
- [ ] ExceptionHandler konfigureret
- [ ] Registreret i DI og initialiseret
- [ ] Build succeeds

## Status
- [ ] Implementering gennemført
- [ ] Verifikation bestået
- [ ] Markeret færdig i _state.json
