using Stribe.Models;

namespace Stribe.Services;

public interface IHabitService
{
    // CRUD operations
    Task<List<Habit>> GetAllHabitsAsync();
    Task<Habit?> GetHabitByIdAsync(string id);
    Task<int> SaveHabitAsync(Habit habit);
    Task<int> DeleteHabitAsync(Habit habit);

    // Completion operations
    Task ToggleCompletionAsync(string habitId, DateTime date);
    Task<bool> IsCompletedOnDateAsync(string habitId, DateTime date);
    Task<List<Completion>> GetCompletionsForHabitAsync(string habitId);
    Task<int> GetCompletionCountAsync(string habitId, DateTime date);

    // Calculations
    Task<int> CalculateStreakAsync(string habitId);
    Task<bool[]> CalculateWeekProgressAsync(string habitId, DateTime weekStartDate);
    Task<List<Habit>> GetHabitsForDateAsync(DateTime date);

    // Milestones
    Task<int?> CheckMilestoneAsync(string habitId);
}
