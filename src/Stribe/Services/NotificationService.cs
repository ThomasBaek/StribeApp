namespace Stribe.Services;

public class NotificationService : INotificationService
{
    public Task<bool> RequestPermissionAsync()
    {
        // Stub - full implementation in command 037
        return Task.FromResult(true);
    }

    public Task ScheduleHabitReminderAsync(string habitId, string habitName, TimeSpan time)
    {
        // Stub - full implementation in command 037
        return Task.CompletedTask;
    }

    public Task CancelHabitReminderAsync(string habitId)
    {
        // Stub - full implementation in command 037
        return Task.CompletedTask;
    }

    public Task CancelAllRemindersAsync()
    {
        // Stub - full implementation in command 037
        return Task.CompletedTask;
    }

    public Task SendMilestoneNotificationAsync(string habitName, int streak)
    {
        // Stub - full implementation in command 037
        return Task.CompletedTask;
    }
}
