# Command 025: Habit Detail ViewModel

## Metadata
- **ID:** 025
- **Fase:** 4 - Management
- **Estimeret tid:** 3 timer
- **Afhængigheder:** 005
- **Design reference:** stribe-design/screens/06_HABIT_DETAIL.md

## Formål
Implementere HabitDetailViewModel for detail screen med stats, calendar data, og edit/delete functionality.

## Risici
- **Medium risiko**: Complex data aggregation
- **Opmærksomhed**:
  - Calendar heatmap data calculation
  - Stats calculation (completion rate, best streak, etc.)
  - Query parameter parsing fra navigation

## Analyse

### Hvad skal implementeres
HabitDetailViewModel med:
- Load habit fra query parameter
- Calculate statistics (completion rate, best streak, total completions)
- Generate calendar heatmap data (3-4 months)
- Edit/Delete commands
- Share command (optional)

### Filer der oprettes
- `src/Stribe/ViewModels/HabitDetailViewModel.cs`
- `src/Stribe/Models/HabitStats.cs`
- `src/Stribe/Models/CalendarDayData.cs`

## Dependencies Check
✅ Command 005 (HabitService) - implementeret
✅ Kan implementeres nu

## Implementering

### Prompt til Claude Code
```
Implementer Habit Detail ViewModel:

**Opret Models/HabitStats.cs**:
```csharp
namespace Stribe.Models;

public class HabitStats
{
    public int CurrentStreak { get; set; }
    public int BestStreak { get; set; }
    public int TotalCompletions { get; set; }
    public double CompletionRate { get; set; } // Percentage
    public int DaysSinceCreated { get; set; }
}
```

**Opret Models/CalendarDayData.cs**:
```csharp
namespace Stribe.Models;

public class CalendarDayData
{
    public DateTime Date { get; set; }
    public bool IsCompleted { get; set; }
    public bool IsToday { get; set; }
    public bool IsFuture { get; set; }
}
```

**Opret ViewModels/HabitDetailViewModel.cs**:
```csharp
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Stribe.Models;
using Stribe.Services;

namespace Stribe.ViewModels;

[QueryProperty(nameof(HabitId), "habitId")]
public partial class HabitDetailViewModel : BaseViewModel
{
    private readonly IHabitService _habitService;

    [ObservableProperty]
    private string _habitId;

    [ObservableProperty]
    private Habit _habit;

    [ObservableProperty]
    private HabitStats _stats;

    [ObservableProperty]
    private List<CalendarDayData> _calendarData;

    public HabitDetailViewModel(IHabitService habitService)
    {
        _habitService = habitService;
    }

    partial void OnHabitIdChanged(string value)
    {
        if (!string.IsNullOrEmpty(value))
        {
            LoadDataCommand.Execute(null);
        }
    }

    [RelayCommand]
    private async Task LoadDataAsync()
    {
        if (IsBusy)
            return;

        try
        {
            IsBusy = true;

            // Load habit
            Habit = await _habitService.GetHabitAsync(HabitId);

            if (Habit == null)
            {
                await Shell.Current.GoToAsync("..");
                return;
            }

            Title = Habit.Name;

            // Calculate stats
            await CalculateStatsAsync();

            // Generate calendar data (last 90 days)
            await GenerateCalendarDataAsync();
        }
        catch (Exception ex)
        {
            await Shell.Current.DisplayAlert("Error", $"Failed to load habit: {ex.Message}", "OK");
        }
        finally
        {
            IsBusy = false;
        }
    }

    private async Task CalculateStatsAsync()
    {
        var completions = await _habitService.GetCompletionsForHabitAsync(HabitId);
        var currentStreak = await _habitService.CalculateStreakAsync(HabitId);

        // Calculate best streak
        var bestStreak = CalculateBestStreak(completions);

        // Calculate completion rate
        var daysSinceCreated = (DateTime.Today - Habit.CreatedAt.Date).Days + 1;
        var completionRate = daysSinceCreated > 0
            ? (double)completions.Count / daysSinceCreated * 100
            : 0;

        Stats = new HabitStats
        {
            CurrentStreak = currentStreak,
            BestStreak = bestStreak,
            TotalCompletions = completions.Count,
            CompletionRate = Math.Round(completionRate, 1),
            DaysSinceCreated = daysSinceCreated
        };
    }

    private int CalculateBestStreak(List<Completion> completions)
    {
        if (completions.Count == 0)
            return 0;

        var sortedDates = completions
            .Select(c => c.Date.Date)
            .OrderBy(d => d)
            .ToList();

        int bestStreak = 1;
        int currentStreak = 1;

        for (int i = 1; i < sortedDates.Count; i++)
        {
            if ((sortedDates[i] - sortedDates[i - 1]).Days == 1)
            {
                currentStreak++;
                bestStreak = Math.Max(bestStreak, currentStreak);
            }
            else
            {
                currentStreak = 1;
            }
        }

        return bestStreak;
    }

    private async Task GenerateCalendarDataAsync()
    {
        var completions = await _habitService.GetCompletionsForHabitAsync(HabitId);
        var completionDates = completions.Select(c => c.Date.Date).ToHashSet();

        var calendarData = new List<CalendarDayData>();

        // Last 90 days
        var startDate = DateTime.Today.AddDays(-89);

        for (int i = 0; i < 90; i++)
        {
            var date = startDate.AddDays(i);

            calendarData.Add(new CalendarDayData
            {
                Date = date,
                IsCompleted = completionDates.Contains(date),
                IsToday = date == DateTime.Today,
                IsFuture = date > DateTime.Today
            });
        }

        CalendarData = calendarData;
    }

    [RelayCommand]
    private async Task EditHabitAsync()
    {
        await Shell.Current.GoToAsync($"edit-habit?habitId={HabitId}");
    }

    [RelayCommand]
    private async Task DeleteHabitAsync()
    {
        var confirm = await Shell.Current.DisplayAlert(
            "Slet vane?",
            $"Er du sikker på at du vil slette '{Habit.Name}'? Dette kan ikke fortrydes.",
            "Slet",
            "Annuller");

        if (confirm)
        {
            try
            {
                await _habitService.DeleteHabitAsync(Habit);
                await Shell.Current.GoToAsync("..");
            }
            catch (Exception ex)
            {
                await Shell.Current.DisplayAlert("Fejl", $"Kunne ikke slette vane: {ex.Message}", "OK");
            }
        }
    }

    [RelayCommand]
    private async Task GoBackAsync()
    {
        await Shell.Current.GoToAsync("..");
    }
}
```

**Registrer i MauiProgram.cs**:
```csharp
builder.Services.AddTransient<HabitDetailViewModel>();
```

Reference design: stribe-design/screens/06_HABIT_DETAIL.md
```

### Forventet resultat
- HabitDetailViewModel med stats calculation
- Calendar data generation (90 days)
- Edit/Delete commands
- Query parameter parsing

### Verifikation
- [ ] Stats calculation korrekt
- [ ] Calendar data genereres
- [ ] Edit navigation virker
- [ ] Delete med confirmation

## Status
- [ ] Implementering gennemført
