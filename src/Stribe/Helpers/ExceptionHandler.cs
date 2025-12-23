using Stribe.Services;

namespace Stribe.Helpers;

public static class ExceptionHandler
{
    private static IAppLogger? _logger;

    public static void Initialize(IAppLogger logger)
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
            _logger?.LogErrorAsync("Unhandled exception", ex)
                .ConfigureAwait(false)
                .GetAwaiter()
                .GetResult();
        }
    }

    private static void OnUnobservedTaskException(object? sender, UnobservedTaskExceptionEventArgs e)
    {
        _logger?.LogErrorAsync("Unobserved task exception", e.Exception)
            .ConfigureAwait(false)
            .GetAwaiter()
            .GetResult();
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

    public static async Task TryExecuteAsync(Func<Task> action, string context)
    {
        try
        {
            await action();
        }
        catch (Exception ex)
        {
            await (_logger?.LogErrorAsync($"Error in {context}", ex) ?? Task.CompletedTask);
        }
    }
}
