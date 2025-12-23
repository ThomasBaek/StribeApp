using SQLite;
using Stribe.Models;

namespace Stribe.Services;

public class DatabaseService : IDatabaseService
{
    private SQLiteAsyncConnection? _database;

    private async Task<SQLiteAsyncConnection> GetDatabaseAsync()
    {
        if (_database != null)
            return _database;

        var dbPath = Path.Combine(
            FileSystem.AppDataDirectory,
            "stribe.db3"
        );

        _database = new SQLiteAsyncConnection(dbPath);

        await _database.CreateTableAsync<Habit>();
        await _database.CreateTableAsync<Completion>();
        await _database.CreateTableAsync<AppSettings>();

        return _database;
    }

    // Habits
    public async Task<List<Habit>> GetHabitsAsync()
    {
        var db = await GetDatabaseAsync();
        return await db.Table<Habit>()
            .Where(h => !h.IsArchived)
            .OrderBy(h => h.SortOrder)
            .ToListAsync();
    }

    public async Task<Habit?> GetHabitAsync(string id)
    {
        var db = await GetDatabaseAsync();
        return await db.Table<Habit>()
            .Where(h => h.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<int> SaveHabitAsync(Habit habit)
    {
        var db = await GetDatabaseAsync();
        var existing = await GetHabitAsync(habit.Id);

        if (existing != null)
            return await db.UpdateAsync(habit);
        else
            return await db.InsertAsync(habit);
    }

    public async Task<int> DeleteHabitAsync(Habit habit)
    {
        var db = await GetDatabaseAsync();
        // Also delete all completions
        await db.Table<Completion>()
            .Where(c => c.HabitId == habit.Id)
            .DeleteAsync();
        return await db.DeleteAsync(habit);
    }

    // Completions
    public async Task<List<Completion>> GetCompletionsAsync(string habitId)
    {
        var db = await GetDatabaseAsync();
        return await db.Table<Completion>()
            .Where(c => c.HabitId == habitId)
            .ToListAsync();
    }

    public async Task<Completion?> GetCompletionAsync(string habitId, string date)
    {
        var db = await GetDatabaseAsync();
        return await db.Table<Completion>()
            .Where(c => c.HabitId == habitId && c.Date == date)
            .FirstOrDefaultAsync();
    }

    public async Task<int> SaveCompletionAsync(Completion completion)
    {
        var db = await GetDatabaseAsync();
        return await db.InsertAsync(completion);
    }

    public async Task<int> DeleteCompletionAsync(Completion completion)
    {
        var db = await GetDatabaseAsync();
        return await db.DeleteAsync(completion);
    }

    // Settings
    public async Task<string?> GetSettingAsync(string key)
    {
        var db = await GetDatabaseAsync();
        var setting = await db.Table<AppSettings>()
            .Where(s => s.Key == key)
            .FirstOrDefaultAsync();
        return setting?.Value;
    }

    public async Task SetSettingAsync(string key, string value)
    {
        var db = await GetDatabaseAsync();
        var setting = new AppSettings { Key = key, Value = value };
        await db.InsertOrReplaceAsync(setting);
    }
}
