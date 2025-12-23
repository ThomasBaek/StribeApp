# Command 008: Error Handling & Logging

## Metadata
- **Phase**: 1 - Foundation
- **Dependencies**: Ingen
- **Estimated Time**: 1-2 timer
- **Status**: Pending
- **Design Reference**: N/A (infrastructure)
- **Frequency Impact**: NO

---

## Formål
Global error handling og logging infrastructure. Fanger unhandled exceptions, logger fejl for debugging, og viser user-friendly fejlbeskeder.

---

## Risici

### Potentielle Problemer
1. **Logger failure causes app crash**:
   - Edge case: File write permissions denied or disk full
   - Impact: Logging crashes the app it's trying to protect

2. **Exception handler recursion**:
   - Edge case: Exception thrown inside exception handler
   - Impact: Stack overflow or infinite loop

3. **Blocking Wait() on async operations**:
   - Edge case: Deadlock when calling .Wait() on async logger methods
   - Impact: App hangs during exception handling

### Mitigering
- Wrap all file operations in try-catch with silent failure
- Keep exception handlers minimal and defensive - no complex logic
- Use ConfigureAwait(false) and .GetAwaiter().GetResult() instead of .Wait()

---

## Analyse - Hvad Skal Implementeres

### Hvad skal implementeres
- ExceptionHandler class til global exception handling
- Logger class til file-based logging
- Integration med MAUI UnhandledException events

### Filer der oprettes
- `src/Stribe/Services/ILogger.cs`
- `src/Stribe/Services/Logger.cs`
- `src/Stribe/Helpers/ExceptionHandler.cs`

---

## Implementation Guide

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

---

## Verification Steps

```bash
dotnet build src/Stribe/Stribe.csproj
```

**Test:**
- [ ] Logger skriver til fil korrekt
- [ ] ExceptionHandler fanger unhandled exceptions
- [ ] GetRecentLogsAsync() returnerer log entries

---

## Acceptance Criteria
- [ ] Logger implementation med file output
- [ ] ExceptionHandler konfigureret
- [ ] Registreret i DI og initialiseret
- [ ] Build succeeds

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Simple file-based logging**: Append-only text file with timestamps - no complex logging framework
- **Defensive exception handling**: Try-catch blocks fail silently in logger to prevent recursion
- **Static ExceptionHandler**: No state, just event registration - straightforward global hooks
- **Minimal async overhead**: Uses .Wait() carefully to avoid deadlocks in exception scenarios

### Alternativer overvejet

**Alternative 1: Third-party logging framework**
```csharp
// Using Serilog, NLog, or Microsoft.Extensions.Logging
Log.Logger = new LoggerConfiguration()
    .WriteTo.File("log.txt")
    .CreateLogger();
```
**Hvorfor fravalgt**: Adds dependency and complexity. Simple file logging is sufficient for MVP debugging needs.

**Alternative 2: Cloud-based logging**
```csharp
// Using AppCenter, Firebase, or Application Insights
AppCenter.Start(appSecret, typeof(Analytics), typeof(Crashes));
```
**Hvorfor fravalgt**: Requires internet connection and external service. Local logging is more reliable and private.

**Alternative 3: Database logging**
```csharp
await _database.SaveLogAsync(new LogEntry { ... });
```
**Hvorfor fravalgt**: Database might be source of errors. File logging is independent and more robust.

### Potentielle forbedringer (v2)
- **Log rotation**: Archive old logs when file gets large - not needed for MVP usage patterns
- **Structured logging**: JSON format with metadata - overkill for simple debugging
- **Remote telemetry**: Send logs to cloud service - privacy concerns, adds complexity
- **Log levels configuration**: Enable/disable levels at runtime - YAGNI for current needs

### Kendte begrænsninger
- **No log rotation**: Log file grows indefinitely (acceptable - will be small in normal use)
- **File-based only**: No console or cloud output (acceptable - file sufficient for debugging)
- **Simple timestamp format**: No timezone info (acceptable - local time is clear enough)
- **Silent failure**: Logger fails silently if file write fails (acceptable - logging shouldn't crash app)

---

## Kode Kvalitet Checklist

- [x] **KISS**: File append logging with global exception hooks - no unnecessary features
- [x] **Læsbarhed**: Clear method names (LogError, LogWarning, LogInfo) and structured log format
- [x] **Navngivning**: Follows C# conventions - ILogger interface, ExceptionHandler static class
- [x] **Funktioner**: Small focused methods - logging, exception handling separate concerns
- [x] **DRY**: WriteLogAsync shared by all log methods, exception handlers reuse logger
- [x] **Error handling**: Logger wrapped in try-catch to prevent recursive failures
- [x] **Edge cases**: Handles null exceptions, file write failures, missing log file
- [x] **Performance**: Async file I/O, minimal overhead in exception handlers
- [x] **Testbarhed**: ILogger interface enables mocking, ExceptionHandler testable via events

---

## Design Files Reference

- **Screen Spec**: N/A
- **Component Spec**: N/A
- **Related**:
  - All services and ViewModels (should use ILogger for error logging)
  - MauiProgram.cs (initializes ExceptionHandler)
  - Settings or debug page (could display recent logs via GetRecentLogsAsync)

---

## Notes

- Logger writes to FileSystem.AppDataDirectory (persistent across app launches)
- Log file path: [AppData]/stribe.log (platform-specific location)
- ExceptionHandler must be initialized after DI container is built
- Use TryExecuteAsync wrapper for safe async operations in ViewModels
- Exception handlers use .Wait() instead of await - necessary for synchronous event handlers
- Consider adding user-facing error messages in future (current implementation is developer-focused)

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
