namespace Stribe.Services;

public interface ISettingsService
{
    Task<TimeSpan> GetDayStartTimeAsync();
    Task SetDayStartTimeAsync(TimeSpan time);

    Task<TimeSpan> GetDefaultReminderTimeAsync();
    Task SetDefaultReminderTimeAsync(TimeSpan time);

    Task<bool> IsOnboardingCompletedAsync();
    Task SetOnboardingCompletedAsync(bool completed);
}
