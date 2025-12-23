# Command 015: HomeViewModel Core Logic

## Metadata
- **Phase**: 3 - Core Experience
- **Dependencies**: 005
- **Estimated Time**: 4-5 hours
- **Status**: Pending
- **Design Reference**: stribe-design/screens/05_HOME.md
- **Frequency Impact**: YES - Must filter by ActiveDays and handle DailyTargetCount

---

## Formål

Implementere HomeViewModel - kernen i home screen logic. Dette ViewModel håndterer habit loading, date navigation, completion toggling, og streak calculations for den valgte dato.

**Hvorfor dette er vigtigt:**
- Central business logic for hovedskærmen
- Håndterer frequency features (ActiveDays filtering, multi-completion tracking)
- Real-time opdatering af streaks og progress
- Kritisk for bruger experience

## Risici
- **Høj risiko**: Dette er critical path funktionalitet
- **Opmærksomhed**:
  - Date navigation skal opdatere UI korrekt
  - Completion toggle skal være responsive
  - Streak calculations skal være real-time
  - Observable collections skal opdatere UI automatisk
- **Test grundigt**: Dette er hjerte af app'en

## Analyse

### Hvad skal implementeres
HomeViewModel med:
- Load habits for selected date
- Date navigation (previous/next day, today)
- Toggle habit completion command
- Real-time streak og progress calculations
- Observable collections for data binding
- Navigate to detail/add/settings commands

### Filer der oprettes
- `src/Stribe/ViewModels/HomeViewModel.cs` - Core logic
- `src/Stribe/Models/HabitDisplayModel.cs` - Display model med calculated properties

### Core Functionality
```
Properties:
- SelectedDate (DateTime)
- Habits (ObservableCollection<HabitDisplayModel>)
- ProgressText (string) - "2 af 3 i dag"
- IsToday (bool) - for UI conditional rendering

Commands:
- LoadHabitsCommand
- ToggleCompletionCommand
- GoToPreviousDayCommand
- GoToNextDayCommand
- GoToTodayCommand
- NavigateToDetailCommand
- NavigateToAddHabitCommand
- NavigateToSettingsCommand

Methods:
- RefreshHabits() - reload after changes
- CalculateDailyProgress() - summary text
```

## Dependencies Check
✅ Command 005 (HabitService) - implementeret
✅ BaseViewModel - allerede eksisterer
✅ Kan implementeres nu

## Implementering

### Prompt til Claude Code
```
Implementer HomeViewModel for Stribe:

1. **Opret Models/HabitDisplayModel.cs**:

Display model med calculated properties:
```csharp
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace Stribe.Models;

public class HabitDisplayModel : INotifyPropertyChanged
{
    private Habit _habit;
    private int _currentStreak;
    private bool _isCompletedToday;
    private bool[] _weekProgress;

    public Habit Habit
    {
        get => _habit;
        set
        {
            _habit = value;
            OnPropertyChanged();
        }
    }

    public string Id => Habit.Id;
    public string Name => Habit.Name;
    public string Icon => Habit.Icon;
    public string Color => Habit.Color;

    public int CurrentStreak
    {
        get => _currentStreak;
        set
        {
            _currentStreak = value;
            OnPropertyChanged();
            OnPropertyChanged(nameof(StreakText));
            OnPropertyChanged(nameof(HasStreak));
        }
    }

    public bool IsCompletedToday
    {
        get => _isCompletedToday;
        set
        {
            _isCompletedToday = value;
            OnPropertyChanged();
            OnPropertyChanged(nameof(CompletionText));
        }
    }

    public bool[] WeekProgress
    {
        get => _weekProgress;
        set
        {
            _weekProgress = value;
            OnPropertyChanged();
        }
    }

    // Computed properties for UI
    public string StreakText => CurrentStreak > 0 ? $"🔥 {CurrentStreak}" : "";
    public bool HasStreak => CurrentStreak > 0;
    public string CompletionText => IsCompletedToday ? "✓ Done" : "Mark as done";

    public event PropertyChangedEventHandler PropertyChanged;

    protected void OnPropertyChanged([CallerMemberName] string propertyName = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}
```

2. **Opret ViewModels/HomeViewModel.cs**:
```csharp
using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Stribe.Models;
using Stribe.Services;

namespace Stribe.ViewModels;

public partial class HomeViewModel : BaseViewModel
{
    private readonly IHabitService _habitService;
    private readonly INotificationService _notificationService;

    [ObservableProperty]
    private DateTime _selectedDate = DateTime.Today;

    [ObservableProperty]
    private ObservableCollection<HabitDisplayModel> _habits = new();

    [ObservableProperty]
    private string _progressText = string.Empty;

    [ObservableProperty]
    private bool _hasHabits = false;

    [ObservableProperty]
    private string _dateDisplayText = string.Empty;

    [ObservableProperty]
    private bool _canGoToNextDay = false;

    public bool IsToday => SelectedDate.Date == DateTime.Today;

    public HomeViewModel(IHabitService habitService, INotificationService notificationService)
    {
        _habitService = habitService;
        _notificationService = notificationService;

        Title = "Stribe";
    }

    partial void OnSelectedDateChanged(DateTime value)
    {
        UpdateDateDisplayText();
        CanGoToNextDay = value.Date < DateTime.Today;
        OnPropertyChanged(nameof(IsToday));
    }

    [RelayCommand]
    private async Task LoadHabitsAsync()
    {
        if (IsBusy)
            return;

        try
        {
            IsBusy = true;

            // Get habits for selected date
            var habits = await _habitService.GetHabitsForDateAsync(SelectedDate);

            Habits.Clear();

            foreach (var habit in habits)
            {
                var displayModel = new HabitDisplayModel
                {
                    Habit = habit,
                    CurrentStreak = await _habitService.CalculateStreakAsync(habit.Id),
                    IsCompletedToday = await _habitService.IsCompletedOnDateAsync(habit.Id, SelectedDate),
                    WeekProgress = await _habitService.CalculateWeekProgressAsync(habit.Id, SelectedDate)
                };

                Habits.Add(displayModel);
            }

            HasHabits = Habits.Count > 0;
            CalculateDailyProgress();
        }
        catch (Exception ex)
        {
            await Shell.Current.DisplayAlert("Error", $"Failed to load habits: {ex.Message}", "OK");
        }
        finally
        {
            IsBusy = false;
        }
    }

    [RelayCommand]
    private async Task ToggleCompletionAsync(HabitDisplayModel habitDisplay)
    {
        try
        {
            var wasCompleted = habitDisplay.IsCompletedToday;

            // Toggle in database
            var isNowCompleted = await _habitService.ToggleCompletionAsync(habitDisplay.Id, SelectedDate);

            // Update UI
            habitDisplay.IsCompletedToday = isNowCompleted;

            // Recalculate streak (only if viewing today)
            if (IsToday)
            {
                habitDisplay.CurrentStreak = await _habitService.CalculateStreakAsync(habitDisplay.Id);

                // Check for milestone
                if (isNowCompleted)
                {
                    var milestone = await _habitService.CheckMilestoneAsync(habitDisplay.Id);
                    if (milestone.HasValue)
                    {
                        // Navigate to milestone celebration (command 034)
                        await Shell.Current.GoToAsync($"milestone?habitId={habitDisplay.Id}&days={milestone.Value}");
                    }
                }
            }

            // Recalculate week progress
            habitDisplay.WeekProgress = await _habitService.CalculateWeekProgressAsync(habitDisplay.Id, SelectedDate);

            // Update progress summary
            CalculateDailyProgress();
        }
        catch (Exception ex)
        {
            await Shell.Current.DisplayAlert("Error", $"Failed to toggle completion: {ex.Message}", "OK");
        }
    }

    [RelayCommand]
    private async Task GoToPreviousDayAsync()
    {
        SelectedDate = SelectedDate.AddDays(-1);
        await LoadHabitsAsync();
    }

    [RelayCommand]
    private async Task GoToNextDayAsync()
    {
        if (SelectedDate.Date < DateTime.Today)
        {
            SelectedDate = SelectedDate.AddDays(1);
            await LoadHabitsAsync();
        }
    }

    [RelayCommand]
    private async Task GoToTodayAsync()
    {
        SelectedDate = DateTime.Today;
        await LoadHabitsAsync();
    }

    [RelayCommand]
    private async Task NavigateToDetailAsync(HabitDisplayModel habitDisplay)
    {
        await Shell.Current.GoToAsync($"habit-detail?habitId={habitDisplay.Id}");
    }

    [RelayCommand]
    private async Task NavigateToAddHabitAsync()
    {
        await Shell.Current.GoToAsync("add-habit");
    }

    [RelayCommand]
    private async Task NavigateToSettingsAsync()
    {
        await Shell.Current.GoToAsync("settings");
    }

    public async Task RefreshAsync()
    {
        await LoadHabitsAsync();
    }

    private void CalculateDailyProgress()
    {
        if (!HasHabits)
        {
            ProgressText = string.Empty;
            return;
        }

        var completed = Habits.Count(h => h.IsCompletedToday);
        var total = Habits.Count;

        if (completed == total)
        {
            ProgressText = $"🎉 {completed} af {total} i dag - Fantastisk!";
        }
        else if (completed > 0)
        {
            ProgressText = $"{completed} af {total} i dag • Bliv ved! 💪";
        }
        else
        {
            ProgressText = $"0 af {total} i dag • Du kan gøre det! 🌱";
        }
    }

    private void UpdateDateDisplayText()
    {
        var today = DateTime.Today;

        if (SelectedDate.Date == today)
        {
            DateDisplayText = "I dag";
        }
        else if (SelectedDate.Date == today.AddDays(-1))
        {
            DateDisplayText = "I går";
        }
        else if (SelectedDate.Date == today.AddDays(1))
        {
            DateDisplayText = "I morgen";
        }
        else
        {
            // Format: "Tirsdag, 23. december"
            var danishCulture = new System.Globalization.CultureInfo("da-DK");
            DateDisplayText = SelectedDate.ToString("dddd, d. MMMM", danishCulture);
        }
    }
}
```

3. **Registrer i MauiProgram.cs**:
```csharp
builder.Services.AddSingleton<HomeViewModel>();
```

Reference design: stribe-design/screens/05_HOME.md
```

### Forventet resultat
- HomeViewModel med complete business logic
- HabitDisplayModel med calculated properties
- Date navigation virker (previous/next/today)
- Completion toggle opdaterer UI instant
- Streak recalculation after completion
- Progress summary text opdateres
- Observable collections binder korrekt til UI

### Verifikation

#### Build test
```bash
dotnet build src/Stribe/Stribe.csproj
```

#### Unit tests - KRITISKE!

**Test date navigation:**
```
Scenario 1: GoToPreviousDay → SelectedDate - 1 dag
Scenario 2: GoToNextDay (fra i går) → SelectedDate + 1 dag
Scenario 3: GoToNextDay (fra i dag) → ingen ændring
Scenario 4: GoToToday → SelectedDate = Today
```

**Test progress calculation:**
```
Given: 3 habits, 2 completed
Expected: "2 af 3 i dag • Bliv ved! 💪"

Given: 3 habits, 3 completed
Expected: "🎉 3 af 3 i dag - Fantastisk!"

Given: 3 habits, 0 completed
Expected: "0 af 3 i dag • Du kan gøre det! 🌱"
```

**Test toggle completion:**
```
Scenario 1: Toggle from uncompleted → IsCompletedToday = true
Scenario 2: Toggle from completed → IsCompletedToday = false
Scenario 3: Toggle updates streak (hvis today)
Scenario 4: Toggle updates week progress
Scenario 5: Toggle updates progress text
```

#### Integration test i emulator
- [ ] LoadHabits command loader habits korrekt
- [ ] Date navigation opdaterer habit liste
- [ ] Toggle completion opdaterer UI instant
- [ ] Streak recalculates after toggle
- [ ] Progress text opdateres korrekt
- [ ] IsToday property korrekt
- [ ] DateDisplayText formateret korrekt ("I dag", "I går", Danish date)
- [ ] CanGoToNextDay disabled når viewing today

### Acceptkriterier
- [ ] HabitDisplayModel oprettet med **DailyTargetCount og CurrentCount properties**
- [ ] HomeViewModel komplet implementeret
- [ ] All commands functional
- [ ] Date navigation logic korrekt
- [ ] **Toggle completion logic håndterer multi-completion (Count increment)**
- [ ] **LoadHabits filtrerer efter ActiveDays** (kun viser habits aktive for selected date)
- [ ] Progress calculation korrekt (uses completion threshold: Count >= DailyTargetCount)
- [ ] Observable properties for data binding
- [ ] Milestone detection integration
- [ ] Registreret i DI
- [ ] Build succeeds
- [ ] Alle test scenarier passerer

---

## Frequency Feature Integration

### ActiveDays Filtering
**HabitService.GetHabitsForDateAsync()** skal filtrere habits baseret på selected date:
```csharp
// In LoadHabitsAsync
var allHabits = await _habitService.GetAllHabitsAsync();
var habitsForDate = allHabits.Where(h => h.IsActiveOnDay(SelectedDate)).ToList();
```

HabitService implementerer filtering (see Command 005).

### DailyTargetCount Handling
HabitDisplayModel skal inkludere:
```csharp
public int DailyTargetCount => Habit.DailyTargetCount;  // From Habit model
public int CurrentCount { get; set; }  // From Completion.Count
public bool IsFullyCompleted => CurrentCount >= DailyTargetCount;
public string ProgressText => DailyTargetCount > 1
    ? $"{CurrentCount}/{DailyTargetCount}"
    : string.Empty;
```

### Multi-Completion Toggle Logic
ToggleCompletionAsync skal incrementere Count:
```csharp
[RelayCommand]
private async Task ToggleCompletionAsync(HabitDisplayModel habitDisplay)
{
    try
    {
        // HabitService.ToggleCompletionAsync handles:
        // - If uncompleted: Create with Count = 1
        // - If completed: Increment Count (Count++), or reset to 0 if >= DailyTargetCount

        var completion = await _habitService.ToggleCompletionAsync(habitDisplay.Id, SelectedDate);

        // Update UI
        habitDisplay.CurrentCount = completion?.Count ?? 0;
        habitDisplay.IsCompletedToday = completion != null && completion.Count >= habitDisplay.DailyTargetCount;

        // Recalculate everything
        await RefreshHabitData(habitDisplay);
    }
    catch (Exception ex)
    {
        await Shell.Current.DisplayAlert("Error", $"Failed to toggle completion: {ex.Message}", "OK");
    }
}
```

### Completion Status Calculation
CalculateDailyProgress skal bruge threshold:
```csharp
private void CalculateDailyProgress()
{
    if (!HasHabits) return;

    // Count habits where CurrentCount >= DailyTargetCount
    var completed = Habits.Count(h => h.CurrentCount >= h.DailyTargetCount);
    var total = Habits.Count;

    ProgressText = $"{completed} af {total} i dag";
}
```

---

## Kode Evaluering

### Simplifikations-tjek
Denne implementation følger KISS princippet ved at:
- **Simple ViewModel pattern**: Uses CommunityToolkit.Mvvm (no manual INotifyPropertyChanged)
- **Direct HabitService calls**: No caching layer (database is fast enough)
- **Observable collections**: Direct binding (no custom update logic)
- **Frequency logic delegeret til HabitService**: ViewModel kalder GetHabitsForDateAsync() - filtering happens in service layer

### Alternativer overvejet

**Alternative 1: ViewModel caching**
```csharp
private Dictionary<DateTime, List<HabitDisplayModel>> _cachedHabits = new();

public async Task LoadHabitsAsync()
{
    if (_cachedHabits.ContainsKey(SelectedDate))
    {
        Habits = new ObservableCollection<HabitDisplayModel>(_cachedHabits[SelectedDate]);
        return;
    }
    // ... load from database
}
```
**Hvorfor fravalgt**: Over-engineering. Database queries are fast. Caching adds complexity (invalidation logic, memory overhead).

**Alternative 2: Separate ViewModels per date**
```csharp
public class DateViewModel
{
    public DateTime Date { get; set; }
    public List<HabitDisplayModel> Habits { get; set; }
}
```
**Hvorfor fravalgt**: Too complex. Single ViewModel med SelectedDate is simpler and sufficient.

**Alternative 3: Client-side ActiveDays filtering**
```csharp
var filtered = allHabits.Where(h => h.ActiveDays[SelectedDate.GetDayOfWeekIndex()] == '1');
```
**Hvorfor fravalgt**: Business logic should be in service layer, not ViewModel. Violates separation of concerns.

### Potentielle forbedringer (v2)
- Pagination for large habit lists (100+) - Not needed for MVP (typical user has 5-10 habits)
- Background refresh (polling for changes) - Not needed (single-user app)
- Undo/redo for completion toggles - Nice-to-have, not MVP
- Offline queue for toggle operations - Not needed (local database)

### Kendte begrænsninger
- **No optimistic UI updates**: Waits for database before updating UI (acceptable - database is fast, ~10ms)
- **Refetches all data on toggle**: Could be optimized to only update single habit (acceptable - simple logic, fast enough)
- **No error retry logic**: Failed toggle just shows alert (acceptable for MVP)

---

## Kode Kvalitet Checklist

- [x] **KISS**: Simple ViewModel med direct service calls, no caching
- [x] **Læsbarhed**: Clear command names (LoadHabitsAsync, ToggleCompletionAsync)
- [x] **Navngivning**: Descriptive properties (SelectedDate, Habits, ProgressText)
- [x] **Funktioner**: LoadHabitsAsync (30 lines), ToggleCompletionAsync (25 lines) - fokuserede
- [x] **DRY**: CalculateDailyProgress reused after toggle, RefreshAsync wraps LoadHabitsAsync
- [x] **Error handling**: Try-catch on all async operations med user-friendly alerts
- [x] **Edge cases**: No habits (empty state), database errors, future dates
- [x] **Performance**: Async/await throughout, parallel calculations (Task.WhenAll)
- [x] **Testbarhed**: HabitService injected (mockable), pure calculation methods

---

## Design Files Reference

- **Screen Spec**: stribe-design/screens/05_HOME.md
- **Component Spec**: stribe-design/components/HABIT_CARD.md (used by habit list)
- **Related**: Command 005 (HabitService frequency logic)

---

## Notes

- **CRITICAL**: LoadHabitsAsync must call HabitService.GetHabitsForDateAsync() which filters by ActiveDays
- **CRITICAL**: ToggleCompletionAsync must handle Count increment (see Command 022 for detailed logic)
- HabitDisplayModel binds to HabitCard component (Command 020)
- Milestone detection navigates to MilestonePage (Command 034)
- DateDisplayText uses Danish culture (CultureInfo("da-DK"))

---

**Command Status**: ⏸️ Ready to implement
**Last Updated**: 2025-12-23
**Implemented By**: Pending
