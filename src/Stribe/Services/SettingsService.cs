using Stribe.Helpers;

namespace Stribe.Services;

public class SettingsService : ISettingsService
{
    private readonly IDatabaseService _database;

    public SettingsService(IDatabaseService database)
    {
        _database = database;
    }

    public async Task<TimeSpan> GetDayStartTimeAsync()
    {
        var setting = await _database.GetSettingAsync(Constants.DayStartTimeKey);
        if (!string.IsNullOrEmpty(setting) && TimeSpan.TryParse(setting, out var time))
            return time;

        return TimeSpan.Parse(Constants.DefaultDayStartTime);
    }

    public async Task SetDayStartTimeAsync(TimeSpan time)
    {
        await _database.SetSettingAsync(Constants.DayStartTimeKey, time.ToString(@"hh\:mm"));
    }

    public async Task<TimeSpan> GetDefaultReminderTimeAsync()
    {
        var setting = await _database.GetSettingAsync(Constants.DefaultReminderTimeKey);
        if (!string.IsNullOrEmpty(setting) && TimeSpan.TryParse(setting, out var time))
            return time;

        return TimeSpan.Parse(Constants.DefaultReminderTime);
    }

    public async Task SetDefaultReminderTimeAsync(TimeSpan time)
    {
        await _database.SetSettingAsync(Constants.DefaultReminderTimeKey, time.ToString(@"hh\:mm"));
    }

    public async Task<bool> IsOnboardingCompletedAsync()
    {
        var setting = await _database.GetSettingAsync(Constants.OnboardingCompletedKey);
        return !string.IsNullOrEmpty(setting) && setting == "true";
    }

    public async Task SetOnboardingCompletedAsync(bool completed)
    {
        await _database.SetSettingAsync(Constants.OnboardingCompletedKey, completed.ToString().ToLower());
    }
}
