using SQLite;

namespace Stribe.Models;

public class Completion
{
    [PrimaryKey]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Indexed]
    public string HabitId { get; set; } = string.Empty;

    [Indexed]
    public string Date { get; set; } = string.Empty; // Format: "yyyy-MM-dd"

    public int Count { get; set; } = 1; // Number of completions for this date

    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
}
