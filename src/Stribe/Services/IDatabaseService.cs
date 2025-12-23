using Stribe.Models;

namespace Stribe.Services;

public interface IDatabaseService
{
    // Habits
    Task<List<Habit>> GetHabitsAsync();
    Task<Habit?> GetHabitAsync(string id);
    Task<int> SaveHabitAsync(Habit habit);
    Task<int> DeleteHabitAsync(Habit habit);

    // Completions
    Task<List<Completion>> GetCompletionsAsync(string habitId);
    Task<Completion?> GetCompletionAsync(string habitId, string date);
    Task<int> SaveCompletionAsync(Completion completion);
    Task<int> DeleteCompletionAsync(Completion completion);

    // Settings
    Task<string?> GetSettingAsync(string key);
    Task SetSettingAsync(string key, string value);
}
