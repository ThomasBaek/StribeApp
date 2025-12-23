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

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsArchived { get; set; } = false;

    public int SortOrder { get; set; } = 0;
}
