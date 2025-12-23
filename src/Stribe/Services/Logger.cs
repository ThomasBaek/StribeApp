namespace Stribe.Services;

public class AppLogger : IAppLogger
{
    private readonly string _logFilePath;

    public AppLogger()
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
