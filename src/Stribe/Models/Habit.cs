using SQLite;

namespace Stribe.Models;

public class Habit
{
    [PrimaryKey]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public string Name { get; set; } = string.Empty;

    public string Emoji { get; set; } = "⭐";

    public string Color { get; set; } = "#4CAF50";

    public string? ReminderTime { get; set; } // Format: "HH:mm"

    public int DailyTargetCount { get; set; } = 1; // 1-99 times per day

    public string ActiveDays { get; set; } = "1111111"; // Bitmask: Mon-Sun (1=active, 0=inactive)

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsArchived { get; set; } = false;

    public int SortOrder { get; set; } = 0;
}
