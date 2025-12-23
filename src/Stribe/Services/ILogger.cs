namespace Stribe.Services;

public interface IAppLogger
{
    Task LogInfoAsync(string message);
    Task LogWarningAsync(string message);
    Task LogErrorAsync(string message, Exception? exception = null);
    Task<List<string>> GetRecentLogsAsync(int count = 50);
}
