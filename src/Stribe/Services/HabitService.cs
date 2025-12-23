using Stribe.Helpers;
using Stribe.Models;

namespace Stribe.Services;

public class HabitService : IHabitService
{
    private readonly IDatabaseService _database;

    public HabitService(IDatabaseService database)
    {
        _database = database;
    }

    // CRUD Operations
    public async Task<List<Habit>> GetAllHabitsAsync()
    {
        return await _database.GetHabitsAsync();
    }

    public async Task<Habit?> GetHabitByIdAsync(string id)
    {
        return await _database.GetHabitAsync(id);
    }

    public async Task<int> SaveHabitAsync(Habit habit)
    {
        return await _database.SaveHabitAsync(habit);
    }

    public async Task<int> DeleteHabitAsync(Habit habit)
    {
        // DeleteHabitAsync in DatabaseService already deletes completions
        return await _database.DeleteHabitAsync(habit);
    }

    // Completion Operations
    public async Task ToggleCompletionAsync(string habitId, DateTime date)
    {
        var dateString = date.ToString("yyyy-MM-dd");
        var habit = await GetHabitByIdAsync(habitId);
        if (habit == null) return;

        var existingCompletion = await _database.GetCompletionAsync(habitId, dateString);

        if (existingCompletion == null)
        {
            // Create new completion with count = 1
            await _database.SaveCompletionAsync(new Completion
            {
                Id = Guid.NewGuid().ToString(),
                HabitId = habitId,
                Date = dateString,
                Count = 1
            });
        }
        else
        {
            // Increment count or reset to 0
            if (existingCompletion.Count >= habit.DailyTargetCount)
            {
                // Reset to 0 (un-complete)
                await _database.DeleteCompletionAsync(existingCompletion);
            }
            else
            {
                // Increment - delete and re-insert (SQLite limitation)
                await _database.DeleteCompletionAsync(existingCompletion);
                existingCompletion.Count++;
                await _database.SaveCompletionAsync(existingCompletion);
            }
        }
    }

    public async Task<bool> IsCompletedOnDateAsync(string habitId, DateTime date)
    {
        var habit = await GetHabitByIdAsync(habitId);
        if (habit == null) return false;

        var dateString = date.ToString("yyyy-MM-dd");
        var completion = await _database.GetCompletionAsync(habitId, dateString);
        return completion != null && completion.Count >= habit.DailyTargetCount;
    }

    public async Task<List<Completion>> GetCompletionsForHabitAsync(string habitId)
    {
        return await _database.GetCompletionsAsync(habitId);
    }

    public async Task<int> GetCompletionCountAsync(string habitId, DateTime date)
    {
        var dateString = date.ToString("yyyy-MM-dd");
        var completion = await _database.GetCompletionAsync(habitId, dateString);
        return completion?.Count ?? 0;
    }

    // Calculations
    public async Task<int> CalculateStreakAsync(string habitId)
    {
        var habit = await GetHabitByIdAsync(habitId);
        if (habit == null) return 0;

        var completions = await GetCompletionsForHabitAsync(habitId);
        var completionDates = completions
            .Where(c => c.Count >= habit.DailyTargetCount)
            .Select(c => DateTime.Parse(c.Date))
            .ToHashSet();

        int streak = 0;
        var currentDate = DateTime.Today;

        // Walk backwards from today
        while (true)
        {
            // Skip inactive days based on ActiveDays bitmask
            if (!IsActiveDay(habit.ActiveDays, currentDate))
            {
                currentDate = currentDate.AddDays(-1);
                continue;
            }

            // Check if completed on this active day
            if (completionDates.Contains(currentDate))
            {
                streak++;
                currentDate = currentDate.AddDays(-1);
            }
            else
            {
                break; // Streak broken
            }
        }

        return streak;
    }

    public async Task<bool[]> CalculateWeekProgressAsync(string habitId, DateTime weekStartDate)
    {
        var habit = await GetHabitByIdAsync(habitId);
        if (habit == null) return new bool[7];

        var progress = new bool[7];
        var completions = await GetCompletionsForHabitAsync(habitId);
        var completionDates = completions
            .Where(c => c.Count >= habit.DailyTargetCount)
            .Select(c => DateTime.Parse(c.Date))
            .ToHashSet();

        for (int i = 0; i < 7; i++)
        {
            var date = weekStartDate.AddDays(i);
            progress[i] = completionDates.Contains(date);
        }

        return progress;
    }

    public async Task<List<Habit>> GetHabitsForDateAsync(DateTime date)
    {
        var allHabits = await GetAllHabitsAsync();

        // Filter by ActiveDays - only return habits active on this date
        return allHabits.Where(h => IsActiveDay(h.ActiveDays, date)).ToList();
    }

    // Milestones
    public async Task<int?> CheckMilestoneAsync(string habitId)
    {
        var currentStreak = await CalculateStreakAsync(habitId);

        // Check if current streak matches any milestone
        if (Constants.MilestoneDays.Contains(currentStreak))
        {
            return currentStreak;
        }

        return null;
    }

    // Helper: Check if habit is active on given date
    private bool IsActiveDay(string activeDays, DateTime date)
    {
        if (string.IsNullOrEmpty(activeDays) || activeDays.Length != 7)
            return true; // Default: active every day

        // activeDays format: "1111100" where index 0=Monday, 6=Sunday
        var dayOfWeek = (int)date.DayOfWeek;
        var index = dayOfWeek == 0 ? 6 : dayOfWeek - 1; // Convert Sunday=0 to index 6

        return activeDays[index] == '1';
    }
}
