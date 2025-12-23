namespace Stribe.Services;

public interface INotificationService
{
    Task<bool> RequestPermissionAsync();
    Task ScheduleHabitReminderAsync(string habitId, string habitName, TimeSpan time);
    Task CancelHabitReminderAsync(string habitId);
    Task CancelAllRemindersAsync();
    Task SendMilestoneNotificationAsync(string habitName, int streak);
}
